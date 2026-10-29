import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, X, Move, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { SkillItem } from '../../types/portfolio';
import { useSiteContent } from '../../context/SiteContentContext';

import { SITE_CONTENT } from '../../content';

interface SkillsSectionProps {
  skills?: SkillData[];
}

export interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number; // 0 - 100
  description: string;
  usedIn: string[];
}

export const SKILLS_LIST: SkillData[] = SITE_CONTENT.skills as SkillData[];

// Exact Category Color Definitions
export const CATEGORY_COLORS: Record<string, { hex: string; varName: string; label: string }> = {
  'Frontend': { hex: '#22D3EE', varName: 'var(--secondary)', label: 'Frontend' },
  '3D / Graphics': { hex: '#F472B6', varName: 'var(--accent)', label: '3D / Graphics' },
  '3D': { hex: '#F472B6', varName: 'var(--accent)', label: '3D / Graphics' },
  'Backend': { hex: '#34D399', varName: 'var(--skill-green)', label: 'Backend' },
  'Tools / DevOps': { hex: '#FB923C', varName: 'var(--skill-orange)', label: 'Tools / DevOps' },
  'Tools': { hex: '#FB923C', varName: 'var(--skill-orange)', label: 'Tools / DevOps' },
  'DevOps': { hex: '#FB923C', varName: 'var(--skill-orange)', label: 'Tools / DevOps' },
  'Core / Languages': { hex: '#7C3AED', varName: 'var(--primary)', label: 'Core / Languages' },
  'Core': { hex: '#7C3AED', varName: 'var(--primary)', label: 'Core / Languages' },
};

export const getCategoryColor = (category?: string) => {
  if (category && CATEGORY_COLORS[category]) {
    return CATEGORY_COLORS[category];
  }
  const lower = (category || '').toLowerCase();
  if (lower.includes('front') || lower.includes('web')) return CATEGORY_COLORS['Frontend'];
  if (lower.includes('3d') || lower.includes('graph')) return CATEGORY_COLORS['3D / Graphics'];
  if (lower.includes('back') || lower.includes('data') || lower.includes('sql') || lower.includes('server')) return CATEGORY_COLORS['Backend'];
  if (lower.includes('tool') || lower.includes('devop') || lower.includes('git') || lower.includes('word') || lower.includes('cloud')) return CATEGORY_COLORS['Tools / DevOps'];
  if (lower.includes('core') || lower.includes('lang') || lower.includes('prog')) return CATEGORY_COLORS['Core / Languages'];

  return { hex: '#22D3EE', varName: 'var(--secondary)', label: category || 'General' };
};

export const DISPLAY_CATEGORIES = [
  CATEGORY_COLORS['Frontend'],
  CATEGORY_COLORS['3D / Graphics'],
  CATEGORY_COLORS['Backend'],
  CATEGORY_COLORS['Tools / DevOps'],
  CATEGORY_COLORS['Core / Languages'],
];

// =========================================================================
// 2. FIBONACCI SPHERE DISTRIBUTION & 3D WIREFRAME MESH
// =========================================================================
const SPHERE_RADIUS = 2.0;

interface SkillNode {
  skill: SkillData;
  position: [number, number, number];
  color: string;
}

function computeFibonacciNodes(skills: SkillData[], radius: number): SkillNode[] {
  const n = skills.length;
  const nodes: SkillNode[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.39996 rad

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1 || 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    nodes.push({
      skill: skills[i],
      position: [x * radius, y * radius, z * radius],
      color: getCategoryColor(skills[i]?.category).hex,
    });
  }

  return nodes;
}

// Center spokes to each node
const SphereSpokes: React.FC<{ nodes: SkillNode[] }> = ({ nodes }) => {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    nodes.forEach((node) => {
      positions.push(0, 0, 0);
      positions.push(node.position[0], node.position[1], node.position[2]);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [nodes]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#22D3EE" transparent opacity={0.25} />
    </lineSegments>
  );
};

// 3D Sphere Rig: Handles rotation, inertia, drag controls, and projected DOM positioning
interface SphereRigProps {
  nodes: SkillNode[];
  reducedMotion: boolean;
  isMobile: boolean;
  groupRef: React.RefObject<THREE.Group | null>;
  velocityRef: React.MutableRefObject<{ x: number; y: number }>;
  isDraggingRef: React.MutableRefObject<boolean>;
  targetQuaternionRef: React.MutableRefObject<THREE.Quaternion | null>;
  isFocusingRef: React.MutableRefObject<boolean>;
  isInteractingRef: React.MutableRefObject<boolean>;
  lastInteractTimeRef: React.MutableRefObject<number>;
  pillRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  hoveredSkillIdRef: React.MutableRefObject<string | null>;
  selectedSkillIdRef: React.MutableRefObject<string | null>;
}

const SphereRig: React.FC<SphereRigProps> = ({
  nodes,
  reducedMotion,
  isMobile,
  groupRef,
  velocityRef,
  isDraggingRef,
  targetQuaternionRef,
  isFocusingRef,
  isInteractingRef,
  lastInteractTimeRef,
  pillRefs,
  hoveredSkillIdRef,
  selectedSkillIdRef,
}) => {
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  // Animation frame loop: auto-rotate, damping, focus slerp, and 2D overlay projection
  useFrame(({ camera, size }) => {
    if (!groupRef.current) return;

    const now = performance.now();
    const timeSinceLastInteract = (now - lastInteractTimeRef.current) / 1000;

    // 1. Smoothly focus on clicked skill
    if (isFocusingRef.current && targetQuaternionRef.current) {
      groupRef.current.quaternion.slerp(targetQuaternionRef.current, 0.08);
      if (groupRef.current.quaternion.angleTo(targetQuaternionRef.current) < 0.01) {
        isFocusingRef.current = false;
      }
    } else if (!isDraggingRef.current && !reducedMotion) {
      // 2. Momentum damping when not dragging
      if (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001) {
        const qDeltaY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          velocityRef.current.y
        );
        const qDeltaX = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          velocityRef.current.x
        );

        groupRef.current.quaternion.multiplyQuaternions(qDeltaY, groupRef.current.quaternion);
        groupRef.current.quaternion.multiplyQuaternions(qDeltaX, groupRef.current.quaternion);

        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.92;
      } else if (!isInteractingRef.current && timeSinceLastInteract > 2.0) {
        // 3. Gentle auto-rotation when idle for > 2 seconds
        const autoRotY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          0.0028
        );
        groupRef.current.quaternion.multiplyQuaternions(autoRotY, groupRef.current.quaternion);
      }
    }

    // 4. Project 3D nodes to 2D HTML overlay elements (Zero React sub-roots, 60fps GPU transforms)
    const { width, height } = size;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const el = pillRefs.current[node.skill.id];
      if (!el) continue;

      tempVec.set(node.position[0], node.position[1], node.position[2]);
      tempVec.applyQuaternion(groupRef.current.quaternion);

      // Depth from -SPHERE_RADIUS to +SPHERE_RADIUS
      const zNorm = THREE.MathUtils.clamp((tempVec.z + SPHERE_RADIUS) / (SPHERE_RADIUS * 2), 0, 1);

      // Project to camera Normalized Device Coordinates [-1, 1]
      tempVec.project(camera);

      // Convert to container pixel coordinates
      const px = (tempVec.x * 0.5 + 0.5) * width;
      const py = (-tempVec.y * 0.5 + 0.5) * height;

      const isHovered = hoveredSkillIdRef.current === node.skill.id;
      const isSelected = selectedSkillIdRef.current === node.skill.id;

      const depthOpacity = THREE.MathUtils.lerp(0.35, 1.0, zNorm);
      const depthScale = THREE.MathUtils.lerp(0.72, 1.0, zNorm);

      const finalOpacity = isSelected || isHovered ? 1.0 : depthOpacity;
      const finalScale = isHovered ? 1.15 : isSelected ? 1.08 : depthScale;
      const zIndex = Math.round(zNorm * 100);

      el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${finalScale.toFixed(2)})`;
      el.style.opacity = finalOpacity.toFixed(2);
      el.style.zIndex = zIndex.toString();
      el.style.pointerEvents = zNorm < 0.22 ? 'none' : 'auto';
    }
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe Icosahedron Geometry */}
      <mesh>
        <icosahedronGeometry args={[SPHERE_RADIUS, isMobile ? 1 : 2]} />
        <meshBasicMaterial
          wireframe
          color="#22D3EE"
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Faint Center Spokes to each node */}
      <SphereSpokes nodes={nodes} />

      {/* Small Glowing Surface Orbs at each node */}
      {nodes.map((node) => (
        <mesh key={node.skill.id} position={node.position}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color={node.color} />
        </mesh>
      ))}
    </group>
  );
};

// =========================================================================
// 3. MAIN EXPORT: SKILLS SECTION WITH 3D SPHERE & DETAIL CARD
// =========================================================================
export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills: propSkills }) => {
  const { content } = useSiteContent();
  const currentSkills: SkillData[] = (propSkills || content.skills || SKILLS_LIST) as SkillData[];

  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(currentSkills[0] || null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(true);

  // Sync selectedSkill when currentSkills change
  useEffect(() => {
    if (!selectedSkill && currentSkills.length > 0) {
      setSelectedSkill(currentSkills[0]);
    } else if (selectedSkill && !currentSkills.some((s) => s.id === selectedSkill.id)) {
      setSelectedSkill(currentSkills[0] || null);
    }
  }, [currentSkills, selectedSkill]);

  const sectionRef = useRef<HTMLElement>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isInteractingRef = useRef(false);
  const lastInteractTimeRef = useRef(performance.now());

  // Momentum drag & focus refs
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetQuaternionRef = useRef<THREE.Quaternion | null>(null);
  const isFocusingRef = useRef(false);

  // References to the projected pill DOM elements
  const pillRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Current states stored in refs for direct 60fps useFrame reading
  const hoveredSkillIdRef = useRef<string | null>(null);
  hoveredSkillIdRef.current = hoveredSkillId;

  const selectedSkillIdRef = useRef<string | null>(null);
  selectedSkillIdRef.current = selectedSkill?.id ?? null;

  // Compute Fibonacci nodes dynamically
  const nodes = useMemo(() => computeFibonacciNodes(currentSkills, SPHERE_RADIUS), [currentSkills]);

  // When a skill is selected, calculate target rotation to face camera (+Z)
  const focusOnSkill = useCallback((skill: SkillData) => {
    setSelectedSkill(skill);
    const targetNode = nodes.find((n) => n.skill.id === skill.id);
    if (!targetNode || !groupRef.current) return;

    const v = new THREE.Vector3(...targetNode.position).normalize();
    const qTarget = new THREE.Quaternion().setFromUnitVectors(v, new THREE.Vector3(0, 0, 1));
    targetQuaternionRef.current = qTarget;
    isFocusingRef.current = true;
  }, [nodes]);

  // Window pointer listeners for sphere drag rotation
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !groupRef.current) return;

      const deltaX = e.clientX - lastPointerRef.current.x;
      const deltaY = e.clientY - lastPointerRef.current.y;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
      lastInteractTimeRef.current = performance.now();

      const sensitivity = 0.005;
      const vY = deltaX * sensitivity;
      const vX = deltaY * sensitivity;

      velocityRef.current = { x: vX, y: vY };

      const qDeltaY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), vY);
      const qDeltaX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), vX);

      groupRef.current.quaternion.multiplyQuaternions(qDeltaY, groupRef.current.quaternion);
      groupRef.current.quaternion.multiplyQuaternions(qDeltaX, groupRef.current.quaternion);
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      lastInteractTimeRef.current = performance.now();
      isInteractingRef.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  // IntersectionObserver: Only render 3D canvas when Skills section is in or near viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { rootMargin: '200px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Mobile & reduced motion listeners
  useEffect(() => {
    const mediaMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaMotion.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaMotion.addEventListener('change', motionListener);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedSkill(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      mediaMotion.removeEventListener('change', motionListener);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleContainerPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    isFocusingRef.current = false;
    isInteractingRef.current = true;
    lastInteractTimeRef.current = performance.now();
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
  };

  const activeCategoryColor = selectedSkill
    ? getCategoryColor(selectedSkill.category).hex
    : '#22D3EE';

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-8 max-w-7xl mx-auto scroll-mt-24 min-h-[85vh] flex flex-col justify-center"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--primary)] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[var(--secondary)]" />
            02. Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[var(--text)] mt-2">
            Orbital Skills & Technical Mastery
          </h2>
        </div>

        {/* Category Legend Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {DISPLAY_CATEGORIES.map((info) => (
            <div
              key={info.label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-white/10 bg-[var(--card)]"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: info.hex }} />
              <span className="text-[var(--muted)] text-[11px] sm:text-xs">{info.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main 3D Sphere Interactive Container */}
      <div className="relative w-full rounded-3xl border border-white/10 bg-[var(--card)]/40 backdrop-blur-md overflow-hidden shadow-2xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-[540px] lg:min-h-[620px]">
          
          {/* Left/Center Column: 3D Interactive Sphere Canvas + Projected Overlay */}
          <div
            className={`relative w-full h-[480px] sm:h-[540px] lg:h-[620px] transition-all duration-500 cursor-grab active:cursor-grabbing ${
              selectedSkill ? 'lg:col-span-7' : 'lg:col-span-12'
            }`}
            style={{ touchAction: 'none' }}
            onPointerDown={handleContainerPointerDown}
          >
            {/* 3D Canvas */}
            <Canvas
              frameloop={isInView ? 'always' : 'never'}
              camera={{ position: [0, 0, 5.2], fov: 46 }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
              }}
            >
              <ambientLight intensity={0.6} />
              <SphereRig
                nodes={nodes}
                reducedMotion={reducedMotion}
                isMobile={isMobile}
                groupRef={groupRef}
                velocityRef={velocityRef}
                isDraggingRef={isDraggingRef}
                targetQuaternionRef={targetQuaternionRef}
                isFocusingRef={isFocusingRef}
                isInteractingRef={isInteractingRef}
                lastInteractTimeRef={lastInteractTimeRef}
                pillRefs={pillRefs}
                hoveredSkillIdRef={hoveredSkillIdRef}
                selectedSkillIdRef={selectedSkillIdRef}
              />
            </Canvas>

            {/* Projected HTML 2D Overlay: 0 React Roots, Zero-Conflict With React 19 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {nodes.map((node) => {
                const isSelected = selectedSkill?.id === node.skill.id;
                const isHovered = hoveredSkillId === node.skill.id;
                return (
                  <div
                    key={node.skill.id}
                    ref={(el) => {
                      pillRefs.current[node.skill.id] = el;
                    }}
                    onPointerDown={(e) => {
                      // Prevent starting container drag when clicking a specific pill
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playClick();
                      focusOnSkill(node.skill);
                    }}
                    onPointerEnter={() => {
                      setHoveredSkillId(node.skill.id);
                      isInteractingRef.current = true;
                      soundManager.playHover();
                    }}
                    onPointerLeave={() => {
                      setHoveredSkillId(null);
                      isInteractingRef.current = false;
                      lastInteractTimeRef.current = performance.now();
                    }}
                    className={`absolute left-0 top-0 cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors duration-200 shadow-lg pointer-events-auto ${
                      isSelected ? 'ring-2 ring-white/40' : ''
                    }`}
                    style={{
                      backgroundColor: 'rgba(5, 6, 15, 0.82)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      borderColor: isHovered || isSelected ? node.color : 'rgba(255, 255, 255, 0.14)',
                      boxShadow: isHovered || isSelected ? `0 0 16px ${node.color}55` : '0 4px 12px rgba(0,0,0,0.5)',
                      fontSize: '12px',
                      willChange: 'transform, opacity',
                      opacity: 0,
                      transform: 'translate3d(-9999px, -9999px, 0)',
                    }}
                  >
                    {/* Category Dot */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: node.color }}
                    />
                    {/* Skill Name */}
                    <span className="text-[var(--text)] tracking-wide font-sans">{node.skill.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Hint Pill Below the Sphere */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-[var(--muted)] bg-black/60 border border-white/10 backdrop-blur-md shadow-md whitespace-nowrap">
                <Move className="w-3.5 h-3.5 text-[var(--secondary)] animate-pulse" />
                <span>Drag to rotate 3D sphere · Click skill to view details</span>
              </div>
            </div>
          </div>

          {/* Right Column (Desktop) / Slide-In (Mobile): Sleek Glass Detail Card */}
          {selectedSkill && (
            <div className="lg:col-span-5 w-full">
              <div
                className="relative rounded-2xl border p-6 sm:p-7 shadow-2xl transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(5, 6, 15, 0.92)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderColor: activeCategoryColor,
                  boxShadow: `0 10px 30px -10px ${activeCategoryColor}40`,
                }}
              >
                {/* Close Button (X) */}
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close skill details"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Category Badge & Status */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${activeCategoryColor}22`,
                      color: activeCategoryColor,
                      border: `1px solid ${activeCategoryColor}55`,
                    }}
                  >
                    {selectedSkill.category}
                  </span>
                  <span className="text-xs font-mono text-[var(--muted)] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[var(--secondary)]" />
                    Verified Proficiency
                  </span>
                </div>

                {/* Skill Name */}
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--text)] mb-3">
                  {selectedSkill.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                  {selectedSkill.description}
                </p>

                {/* Animated Level Bar */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-6">
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-[var(--muted)]">Core Proficiency</span>
                    <span className="font-bold tabular-nums" style={{ color: activeCategoryColor }}>
                      {selectedSkill.level}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${selectedSkill.level}%`,
                        background: `linear-gradient(90deg, var(--primary), ${activeCategoryColor})`,
                      }}
                    />
                  </div>
                </div>

                {/* "Used In" Tags */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] mb-2.5">
                    Production Applications & Stack:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.usedIn.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-[var(--text)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden Accessible List for Screen Readers & Keyboard Navigation */}
      <div className="sr-only">
        <h3>Full Skills Directory</h3>
        <ul>
          {SKILLS_LIST.map((skill) => (
            <li key={skill.id}>
              <button
                type="button"
                onClick={() => focusOnSkill(skill)}
              >
                Inspect {skill.name} ({skill.category}) - Proficiency {skill.level}%: {skill.description}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
