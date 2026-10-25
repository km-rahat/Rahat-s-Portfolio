import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Exact Palette from CSS variables
const PALETTE = {
  bg: '#05060F',
  primary: '#7C3AED',   // Electric Violet
  secondary: '#22D3EE', // Neon Cyan
  accent: '#F472B6',    // Hot Pink
  text: '#F8FAFC',      // Crisp White
  muted: '#94A3B8',
};

// =========================================================================
// 1. DEEP SPACE STARFIELD (3-layer volumetric points with soft circular shader)
// =========================================================================
interface DeepSpaceStarsProps {
  reducedMotion: boolean;
  isMobile: boolean;
  isTabVisible: boolean;
}

const DeepSpaceStars: React.FC<DeepSpaceStarsProps> = ({
  reducedMotion,
  isMobile,
  isTabVisible,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const totalCount = isMobile ? 1200 : 2500;

  const { positions, colors, sizes, alphas, twinkleSpeeds, twinkleOffsets } = useMemo(() => {
    const pos = new Float32Array(totalCount * 3);
    const col = new Float32Array(totalCount * 3);
    const sz = new Float32Array(totalCount);
    const alp = new Float32Array(totalCount);
    const twSpd = new Float32Array(totalCount);
    const twOff = new Float32Array(totalCount);

    const cWhite = new THREE.Color('#F8FAFC');
    const cPaleBlue = new THREE.Color('#E0F2FE');
    const cSecondary = new THREE.Color(PALETTE.secondary);
    const cPrimary = new THREE.Color(PALETTE.primary);
    const cAccent = new THREE.Color(PALETTE.accent);

    const nearCount = isMobile ? 20 : 40;
    const midCount = Math.floor(totalCount * 0.28);
    const farCount = totalCount - nearCount - midCount;

    let idx = 0;

    // 1. Far layer: many tiny dim stars (1px), z from -40 to -15
    for (let i = 0; i < farCount; i++, idx++) {
      pos[idx * 3] = (Math.random() - 0.5) * 70;
      pos[idx * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[idx * 3 + 2] = -40 + Math.random() * 25; // -40 to -15

      // Mostly white / pale blue, 10% tinted in secondary / primary
      const randColor = Math.random();
      let color = randColor < 0.70 ? cWhite : randColor < 0.90 ? cPaleBlue : randColor < 0.95 ? cSecondary : cPrimary;
      col[idx * 3] = color.r;
      col[idx * 3 + 1] = color.g;
      col[idx * 3 + 2] = color.b;

      sz[idx] = 1.0;
      alp[idx] = 0.55 + Math.random() * 0.35; // Dim to moderate
      twSpd[idx] = 0.8 + Math.random() * 1.5;
      twOff[idx] = Math.random() * Math.PI * 2;
    }

    // 2. Mid layer: fewer, medium stars (1.5-2.5px), z from -15 to 0
    for (let i = 0; i < midCount; i++, idx++) {
      pos[idx * 3] = (Math.random() - 0.5) * 55;
      pos[idx * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[idx * 3 + 2] = -15 + Math.random() * 15; // -15 to 0

      const randColor = Math.random();
      let color = randColor < 0.65 ? cWhite : randColor < 0.88 ? cPaleBlue : randColor < 0.94 ? cSecondary : cPrimary;
      col[idx * 3] = color.r;
      col[idx * 3 + 1] = color.g;
      col[idx * 3 + 2] = color.b;

      sz[idx] = 1.5 + Math.random() * 1.0; // 1.5 to 2.5px
      alp[idx] = 0.75 + Math.random() * 0.25;
      twSpd[idx] = 0.6 + Math.random() * 1.2;
      twOff[idx] = Math.random() * Math.PI * 2;
    }

    // 3. Near layer: a few (about 40) larger soft glowing dots (4-8px, soft edge)
    // in secondary, primary, accent and white, z from 0 to 8
    const nearPalette = [cSecondary, cPrimary, cAccent, cWhite, cPaleBlue];
    for (let i = 0; i < nearCount; i++, idx++) {
      pos[idx * 3] = (Math.random() - 0.5) * 35;
      pos[idx * 3 + 1] = (Math.random() - 0.5) * 26;
      pos[idx * 3 + 2] = 0 + Math.random() * 8; // 0 to 8

      const color = nearPalette[i % nearPalette.length];
      col[idx * 3] = color.r;
      col[idx * 3 + 1] = color.g;
      col[idx * 3 + 2] = color.b;

      sz[idx] = 4.0 + Math.random() * 4.0; // 4 to 8px
      alp[idx] = 0.85 + Math.random() * 0.15;
      twSpd[idx] = 0.5 + Math.random() * 0.8;
      twOff[idx] = Math.random() * Math.PI * 2;
    }

    return {
      positions: pos,
      colors: col,
      sizes: sz,
      alphas: alp,
      twinkleSpeeds: twSpd,
      twinkleOffsets: twOff,
    };
  }, [totalCount, isMobile]);

  const starShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.5) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute vec3 color;
        attribute float aSize;
        attribute float aAlpha;
        attribute float aTwinkleSpeed;
        attribute float aTwinkleOffset;

        varying vec3 vColor;
        varying float vAlpha;
        varying float vTwinkle;

        void main() {
          vColor = color;
          vAlpha = aAlpha;

          // Gentle twinkle: sine wave with random offsets, min brightness 0.5, never black
          vTwinkle = 0.75 + 0.25 * sin(uTime * aTwinkleSpeed + aTwinkleOffset);

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Pixel size with pixel ratio
          gl_PointSize = aSize * uPixelRatio;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vTwinkle;

        void main() {
          // Circular point with soft falloff edge
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float edge = smoothstep(0.5, 0.15, dist);
          float finalAlpha = vAlpha * edge * vTwinkle;

          gl_FragColor = vec4(vColor, finalAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((_, delta) => {
    if (!isTabVisible) return;
    if (!reducedMotion) {
      starShader.uniforms.uTime.value += delta;
    }
  });

  return (
    <points ref={pointsRef} material={starShader}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
        <bufferAttribute attach="attributes-aTwinkleSpeed" args={[twinkleSpeeds, 1]} />
        <bufferAttribute attach="attributes-aTwinkleOffset" args={[twinkleOffsets, 1]} />
      </bufferGeometry>
    </points>
  );
};

// =========================================================================
// 2. SOFT NEBULA BLOBS (2 Faint, Soft Radial Drift Blobs Far in Background)
// =========================================================================
interface SoftNebulaProps {
  reducedMotion: boolean;
  isTabVisible: boolean;
}

const SoftNebula: React.FC<SoftNebulaProps> = ({ reducedMotion, isTabVisible }) => {
  const mesh1Ref = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);

  const nebulaShaderPrimary = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(PALETTE.primary) },
        uOpacity: { value: 0.085 }, // within 0.06 - 0.10
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  const nebulaShaderSecondary = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(PALETTE.secondary) },
        uOpacity: { value: 0.075 }, // within 0.06 - 0.10
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (!isTabVisible || reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (mesh1Ref.current) {
      mesh1Ref.current.position.x = -12 + Math.sin(t * 0.04) * 1.5;
      mesh1Ref.current.position.y = 8 + Math.cos(t * 0.05) * 1.2;
    }
    if (mesh2Ref.current) {
      mesh2Ref.current.position.x = 14 + Math.cos(t * 0.035) * 1.8;
      mesh2Ref.current.position.y = -7 + Math.sin(t * 0.045) * 1.4;
    }
  });

  return (
    <group>
      {/* Primary (Violet) Nebula Blob Far Back */}
      <mesh ref={mesh1Ref} position={[-12, 8, -35]} material={nebulaShaderPrimary}>
        <planeGeometry args={[42, 42]} />
      </mesh>

      {/* Secondary (Cyan) Nebula Blob Far Back */}
      <mesh ref={mesh2Ref} position={[14, -7, -33]} material={nebulaShaderSecondary}>
        <planeGeometry args={[46, 46]} />
      </mesh>
    </group>
  );
};

// =========================================================================
// 3. PARALLAX CAMERA CONTROLLER (Scroll parallax + Gentle mouse parallax)
// =========================================================================
interface CameraControllerProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  reducedMotion: boolean;
  isTabVisible: boolean;
}

const DeepSpaceCameraController: React.FC<CameraControllerProps> = ({
  scrollProgress,
  mousePos,
  reducedMotion,
  isTabVisible,
}) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!isTabVisible) return;

    // Scroll parallax: As user scrolls, camera advances slightly along Z and down Y
    // Camera base travels from z = 10 to z = 4, y drops from 0 to -3.0
    const targetZ = THREE.MathUtils.lerp(10.0, 4.0, scrollProgress);
    const targetY = THREE.MathUtils.lerp(0.0, -3.0, scrollProgress);

    // Mouse parallax: tilts camera slightly (max 0.3 units)
    const mouseOffsetX = reducedMotion ? 0 : mousePos.x * 0.3;
    const mouseOffsetY = reducedMotion ? 0 : mousePos.y * 0.3;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, mouseOffsetX, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY + mouseOffsetY, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.5, delta);
  });

  return null;
};

// =========================================================================
// 4. MAIN EXPORT: FIXED FULL-SCREEN 3D DEEP SPACE CANVAS
// =========================================================================
export const UnifiedBackground3D: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);

  useEffect(() => {
    // Accessibility: prefers-reduced-motion
    const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaMotion.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaMotion.addEventListener('change', motionListener);

    // Mobile viewport detection
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Scroll progress tracker
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Gentle mouse parallax tracker
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Tab visibility handling
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mediaMotion.removeEventListener('change', motionListener);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Background layer: var(--bg) with subtle dark navy radial gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundColor: 'var(--bg)',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(15, 23, 42, 0.45) 0%, rgba(5, 6, 15, 0.98) 100%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 10.0], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <DeepSpaceCameraController
          scrollProgress={scrollProgress}
          mousePos={mousePos}
          reducedMotion={reducedMotion}
          isTabVisible={isTabVisible}
        />
        <DeepSpaceStars
          reducedMotion={reducedMotion}
          isMobile={isMobile}
          isTabVisible={isTabVisible}
        />
        <SoftNebula
          reducedMotion={reducedMotion}
          isTabVisible={isTabVisible}
        />
      </Canvas>
    </div>
  );
};
