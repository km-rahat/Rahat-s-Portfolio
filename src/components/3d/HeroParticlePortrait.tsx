import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MY_PHOTO_URL } from '../../constants/assets';

// Strict palette from CSS variables & user specifications
const PALETTE = {
  primary: '#7C3AED',   // Electric Violet
  secondary: '#22D3EE', // Neon Cyan
  baseSilverWhite: { r: 0.9098, g: 0.9333, b: 0.9725 }, // #E8EEF8
};

interface ParticlePortraitSceneProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isMobile: boolean;
  reducedMotion: boolean;
  containerHeight: number;
  photoUrl?: string;
}

const ParticlePortraitScene: React.FC<ParticlePortraitSceneProps> = ({
  containerRef,
  isMobile,
  reducedMotion,
  containerHeight,
  photoUrl,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const { camera, viewport } = useThree();

  const currentMouseWorld = useRef(new THREE.Vector2(-9999, -9999));
  const targetMouseNdc = useRef(new THREE.Vector2(-9999, -9999));

  const [particleData, setParticleData] = useState<{
    targetPositions: Float32Array;
    randomPositions: Float32Array;
    staggers: Float32Array;
    colors: Float32Array;
    brightnesses: Float32Array;
    sampleHeight: number;
    count: number;
  } | null>(null);

  // Global window pointer listener: converts cursor to portrait canvas NDC coordinates
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let cx = 0;
      let cy = 0;
      if ('touches' in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ('clientX' in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      } else {
        return;
      }

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Normalized Device Coordinates (-1 to 1) for this canvas
      const ndcX = ((cx - rect.left) / rect.width) * 2 - 1;
      const ndcY = -(((cy - rect.top) / rect.height) * 2 - 1);

      if (ndcX >= -2.2 && ndcX <= 2.2 && ndcY >= -2.2 && ndcY <= 2.2) {
        targetMouseNdc.current.set(ndcX, ndcY);
      } else {
        targetMouseNdc.current.set(-9999, -9999);
      }
    };

    const handlePointerLeave = () => {
      targetMouseNdc.current.set(-9999, -9999);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('mouseleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [containerRef]);

  // Load and sample the user photo at 260px (desktop) / 160px (mobile)
  useEffect(() => {
    let isCancelled = false;
    const targetUrl = photoUrl || MY_PHOTO_URL;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = targetUrl;

    img.onload = () => {
      if (isCancelled) return;
      try {
        const offscreen = document.createElement('canvas');
        const ctx = offscreen.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Sample photo at ~260px on desktop (~22,000 to 28,000 particles) and ~160px on mobile (~8,000 particles)
        const sampleW = isMobile ? 160 : 260;
        const sampleH = sampleW;
        offscreen.width = sampleW;
        offscreen.height = sampleH;

        ctx.drawImage(img, 0, 0, sampleW, sampleH);
        const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
        const data = imgData.data;

        interface RawPixel {
          x: number;
          y: number;
          rawLum: number;
        }

        const validPixels: RawPixel[] = [];
        let minLum = 1.0;
        let maxLum = 0.0;
        let minX = sampleW;
        let maxX = 0;
        let minY = sampleH;
        let maxY = 0;

        for (let y = 0; y < sampleH; y++) {
          for (let x = 0; x < sampleW; x++) {
            const idx = (y * sampleW + x) * 4;
            const a = data[idx + 3];
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Ignore transparent pixels (alpha < 20) and pure white background if any
            if (a < 20 || (r > 248 && g > 248 && b > 248)) {
              continue;
            }

            // Rec. 709 perceived luminance
            const rawLum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;

            if (rawLum < minLum) minLum = rawLum;
            if (rawLum > maxLum) maxLum = rawLum;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;

            validPixels.push({ x, y, rawLum });
          }
        }

        if (validPixels.length === 0) {
          console.error('[ParticlePortrait] No valid foreground pixels found in image:', MY_PHOTO_URL);
          return;
        }

        const lumRange = maxLum - minLum || 1.0;
        const subjectH = maxY - minY || 1;
        const subjectW = maxX - minX || 1;
        const centerX = (minX + maxX) / 2;

        interface ProcessedParticle {
          x: number;
          y: number;
          finalLum: number;
          r: number;
          g: number;
          b: number;
        }

        const processed: ProcessedParticle[] = [];

        for (let i = 0; i < validPixels.length; i++) {
          const p = validPixels[i];

          // 1. Auto-levels: stretch min/max brightness to [0, 1]
          let normLum = (p.rawLum - minLum) / lumRange;
          normLum = THREE.MathUtils.clamp(normLum, 0.0, 1.0);

          // 2. Lift midtones with gamma 0.7
          let lifted = Math.pow(normLum, 0.7);

          // 3. Luminance floor of 0.15 so dark areas (suit, hair, tie) stay visible
          let finalLum = 0.15 + 0.85 * lifted;

          // 4. Face boost: brighten face area by about 25% for crisp eyes, eyebrows, nose and beard
          const relFromTop = (p.y - minY) / subjectH;
          const relFromCenter = Math.abs(p.x - centerX) / (subjectW / 2 || 1);
          if (relFromTop >= 0.18 && relFromTop <= 0.72 && relFromCenter <= 0.65) {
            finalLum = Math.min(1.0, finalLum * 1.25);
          }

          // 5. Colors: silver-white (#E8EEF8 scaled by luminance), with ~8% in var(--secondary)/var(--primary)
          const rand = Math.random();
          let cR: number, cG: number, cB: number;

          if (rand < 0.04) {
            // var(--secondary) #22D3EE
            cR = 0.133 * Math.max(0.65, finalLum);
            cG = 0.827 * Math.max(0.65, finalLum);
            cB = 0.933 * Math.max(0.65, finalLum);
          } else if (rand < 0.08) {
            // var(--primary) #7C3AED
            cR = 0.486 * Math.max(0.65, finalLum);
            cG = 0.227 * Math.max(0.65, finalLum);
            cB = 0.929 * Math.max(0.65, finalLum);
          } else {
            // Silver-white #E8EEF8 scaled by luminance
            cR = PALETTE.baseSilverWhite.r * finalLum;
            cG = PALETTE.baseSilverWhite.g * finalLum;
            cB = PALETTE.baseSilverWhite.b * finalLum;
          }

          processed.push({
            x: p.x,
            y: p.y,
            finalLum,
            r: cR,
            g: cG,
            b: cB,
          });
        }

        // Particle target: 22,000 to 28,000 on desktop, ~8,000 on mobile
        const targetCount = isMobile ? 8000 : Math.min(27000, Math.max(22000, processed.length));
        const step = Math.max(1, processed.length / targetCount);
        const selected: ProcessedParticle[] = [];

        if (step <= 1.05) {
          // One particle per sampled pixel (no skipping)
          for (let i = 0; i < processed.length; i++) {
            selected.push(processed[i]);
            if (selected.length >= 28000) break;
          }
        } else {
          for (let i = 0; i < processed.length; i += step) {
            selected.push(processed[Math.floor(i)]);
            if (selected.length >= targetCount) break;
          }
        }

        const count = selected.length;
        const targetPositions = new Float32Array(count * 3);
        const randomPositions = new Float32Array(count * 3);
        const staggers = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        const brightnesses = new Float32Array(count);

        // Perspective camera at z = 4.0, fov = 45
        const fovRad = (45 * Math.PI) / 180;
        const frustumHeight = 2.0 * Math.tan(fovRad / 2) * 4.0; // ~3.3137

        // Scale to fill ~95% of vertical canvas height
        const scale = (frustumHeight * 0.95) / subjectH;

        // Bottom of frustum is at -frustumHeight / 2.
        // Shoulders (p.y = maxY) touch bottom edge of canvas:
        const bottomFrustumY = -(frustumHeight / 2);

        // Grid spacing in world units for jitter calculation (15% of spacing)
        const jitterMagnitude = 0.15 * scale;

        for (let i = 0; i < count; i++) {
          const p = selected[i];

          // 15% random jitter to home position so dots do NOT form a rigid pixel grid
          const jitterX = (Math.random() - 0.5) * 2.0 * jitterMagnitude;
          const jitterY = (Math.random() - 0.5) * 2.0 * jitterMagnitude;

          // Target X: centered horizontally
          const posX = (p.x - centerX) * scale + jitterX;
          // Target Y: shoulders touch bottom edge, head is inside canvas
          const posY = bottomFrustumY + (maxY - p.y) * scale + jitterY;
          // Flat front-facing with tiny jitter (max 0.01)
          const posZ = (Math.random() - 0.5) * 0.01;

          targetPositions[i * 3] = posX;
          targetPositions[i * 3 + 1] = posY;
          targetPositions[i * 3 + 2] = posZ;

          // Scattered initial positions for formation flight
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 3.5 + Math.random() * 5.0;

          randomPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          randomPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          randomPositions[i * 3 + 2] = r * Math.cos(phi);

          staggers[i] = Math.random();
          brightnesses[i] = p.finalLum;

          colors[i * 3] = p.r;
          colors[i * 3 + 1] = p.g;
          colors[i * 3 + 2] = p.b;
        }

        setParticleData({
          targetPositions,
          randomPositions,
          staggers,
          colors,
          brightnesses,
          sampleHeight: sampleH,
          count,
        });
      } catch (err) {
        console.error('[ParticlePortrait] Error processing pixels:', err);
      }
    };

    img.onerror = (err) => {
      console.error('[ParticlePortrait] Failed to load image from:', targetUrl, err);
    };

    return () => {
      isCancelled = true;
    };
  }, [photoUrl, isMobile]);

  // Compute particle size tied to spacing (55-65% of spacing for visible gap, like a fine halftone):
  // particleSize = spacingInPx * 0.6 * devicePixelRatio (min 1.4 device px, max 2.6 device px)
  const baseParticleSize = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
    const sampleH = particleData ? particleData.sampleHeight : isMobile ? 160 : 260;
    const spacingInPx = containerHeight / sampleH;
    const calc = spacingInPx * 0.6 * dpr;
    return THREE.MathUtils.clamp(calc, 1.4 * dpr, 2.6 * dpr);
  }, [containerHeight, particleData, isMobile]);

  // Shader Material: Normal blending, round dots, opacity 0.70 to 0.95
  const shaderMaterial = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMouse: { value: new THREE.Vector2(-9999, -9999) },
        uRadius: { value: 0.38 },
        uStrength: { value: 0.42 },
        uBaseSize: { value: baseParticleSize },
        uPixelRatio: { value: dpr },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec2 uMouse;
        uniform float uRadius;
        uniform float uStrength;
        uniform float uBaseSize;
        uniform float uPixelRatio;

        attribute vec3 aTargetPosition;
        attribute vec3 aRandomPosition;
        attribute float aStagger;
        attribute vec3 aColor;
        attribute float aBrightness;

        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = aColor;

          // Formation animation on load (ease-out cubic)
          float t = clamp((uProgress - aStagger * 0.28) / 0.72, 0.0, 1.0);
          float ease = 1.0 - pow(1.0 - t, 3.0);
          vec3 pos = mix(aRandomPosition, aTargetPosition, ease);

          // Subtle idle breathing motion
          pos.x += sin(uTime * 0.9 + aTargetPosition.y * 2.0) * 0.0035;
          pos.y += cos(uTime * 0.7 + aTargetPosition.x * 2.0) * 0.0035;

          // Mouse interaction: push away particles near cursor, smooth spring back
          vec2 diff = pos.xy - uMouse;
          float dist = length(diff);
          if (dist < uRadius && dist > 0.0001) {
            float falloff = 1.0 - (dist / uRadius);
            float force = falloff * falloff * uStrength;
            pos.xy += (diff / dist) * force;
            pos.z += force * 0.25;
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Halftone sizing: brighter pixels produce slightly larger dots
          float sizeFactor = mix(0.85, 1.15, aBrightness);
          gl_PointSize = clamp(
            uBaseSize * (4.0 / -mvPosition.z) * sizeFactor,
            1.4 * uPixelRatio,
            2.6 * uPixelRatio
          );

          // Opacity 0.70 to 0.95 driven by brightness
          vAlpha = mix(0.70, 0.95, aBrightness);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Soft round circle discard (never squares)
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float edge = smoothstep(0.5, 0.38, dist);
          gl_FragColor = vec4(vColor, vAlpha * edge);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    materialRef.current = mat;
    return mat;
  }, [baseParticleSize]);

  // Keep uBaseSize in sync
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uBaseSize.value = baseParticleSize;
    }
  }, [baseParticleSize]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;

    if (!reducedMotion) {
      materialRef.current.uniforms.uTime.value += delta;
    }

    if (materialRef.current.uniforms.uProgress.value < 1.0) {
      materialRef.current.uniforms.uProgress.value = Math.min(
        1.0,
        materialRef.current.uniforms.uProgress.value + delta * 0.55
      );
    }

    const fovRad = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
    const halfHeight = Math.tan(fovRad / 2) * camera.position.z;
    const halfWidth = halfHeight * (viewport.width / viewport.height);

    let targetX = -9999;
    let targetY = -9999;
    if (targetMouseNdc.current.x > -5.0 && targetMouseNdc.current.x < 5.0) {
      targetX = targetMouseNdc.current.x * halfWidth;
      targetY = targetMouseNdc.current.y * halfHeight;
    }

    currentMouseWorld.current.x = THREE.MathUtils.damp(
      currentMouseWorld.current.x,
      targetX,
      14.0,
      delta
    );
    currentMouseWorld.current.y = THREE.MathUtils.damp(
      currentMouseWorld.current.y,
      targetY,
      14.0,
      delta
    );

    materialRef.current.uniforms.uMouse.value.set(
      currentMouseWorld.current.x,
      currentMouseWorld.current.y
    );
  });

  if (!particleData) return null;

  return (
    <points material={shaderMaterial}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[particleData.randomPositions, 3]} />
        <bufferAttribute attach="attributes-aTargetPosition" args={[particleData.targetPositions, 3]} />
        <bufferAttribute attach="attributes-aRandomPosition" args={[particleData.randomPositions, 3]} />
        <bufferAttribute attach="attributes-aStagger" args={[particleData.staggers, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[particleData.colors, 3]} />
        <bufferAttribute attach="attributes-aBrightness" args={[particleData.brightnesses, 1]} />
      </bufferGeometry>
    </points>
  );
};

export const HeroParticlePortrait: React.FC<{ photoUrl?: string }> = ({ photoUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const checkReducedMotion = () => {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(media.matches);
    };
    checkReducedMotion();

    const updateDimensions = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute pointer-events-none transition-opacity duration-300 z-0 ${
        isMobile ? 'opacity-60' : 'opacity-100'
      }`}
      style={{
        position: 'absolute',
        // Anchored to bottom of Hero first screen (height ~70-74% of first screen, ~600px on 1080p)
        bottom: 0,
        ...(isMobile
          ? {
              height: 'clamp(360px, 58svh, 480px)',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(82vw, clamp(360px, 58svh, 480px))',
            }
          : {
              height: 'clamp(560px, 73svh, 720px)',
              right: 'clamp(16px, 4vw, 72px)',
              width: 'clamp(560px, 73svh, 720px)',
              maxWidth: '46vw',
            }),
        aspectRatio: '1 / 1',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.0], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <ParticlePortraitScene
          containerRef={containerRef}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          containerHeight={containerHeight}
          photoUrl={photoUrl}
        />
      </Canvas>
    </div>
  );
};
