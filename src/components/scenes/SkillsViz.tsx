/**
 * SkillsViz — floating skill module panels in 3D space.
 * Each category is a glowing slab with its name.
 * Cursor causes gentle group parallax.
 */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';
import { SKILLS } from '../../content';

const COLORS = ['#00D4FF', '#FFB547', '#00FF88', '#B47FFF', '#FF6B6B'];

function Module({ group, color, position, idx }: {
  group: typeof SKILLS[number];
  color: string;
  position: [number, number, number];
  idx: number;
}) {
  const ref     = useRef<THREE.Group>(null!);
  const reduced = useStore(s => s.reduced);
  const phase   = idx * 0.8;
  const c       = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    if (reduced || !ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * 0.45 + phase) * 0.12;
    const { cursorX, cursorY } = useStore.getState();
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, cursorX * 0.12, 0.04);
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, cursorY * -0.08, 0.04);
  });

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[2.8, 1.5, 0.08]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color="#0B1828" emissive={c} emissiveIntensity={0.06} roughness={0.4} metalness={0.7} transparent opacity={0.92} />
      </RoundedBox>
      {/* top glow strip */}
      <mesh position={[0, 0.76, 0.045]}>
        <planeGeometry args={[2.6, 0.018]} />
        <meshBasicMaterial color={c} transparent opacity={0.7} />
      </mesh>
      <Html center distanceFactor={5} position={[0, 0, 0.06]}>
        <div style={{ width: 220, pointerEvents: 'none' }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ display: 'inline-block', width: 14, height: 1, background: color }} />
            {group.category}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {group.chips.map((chip, ci) => (
              <span key={ci} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, padding: '2px 7px', border: `1px solid ${color}44`, borderRadius: 2, color: '#7A9BB5', background: 'rgba(5,10,18,.7)' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

function SkillScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const reduced  = useStore(s => s.reduced);

  // Layout: staggered grid
  const positions: [number, number, number][] = [
    [-3.2,  0.8, 0],
    [ 3.2,  0.8, -0.5],
    [-3.2, -0.8, -0.3],
    [ 3.2, -0.8, 0.2],
    [ 0.0,  0.0, 0.6],
  ];

  useFrame(({ clock }) => {
    if (reduced || !groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.08) * 0.06;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 5, 3]} intensity={1.8} color="#00D4FF" distance={18} />
      <pointLight position={[0, -3, 2]} intensity={0.6} color="#FFB547" distance={10} />
      {SKILLS.map((g, i) => (
        <Module
          key={i} group={g}
          color={COLORS[i % COLORS.length]}
          position={positions[i] || [0, 0, 0]}
          idx={i}
        />
      ))}
    </group>
  );
}

export default function SkillsViz({ height = 380 }: { height?: number }) {
  const webGL = useStore(s => s.webGL);
  if (!webGL) return null;

  return (
    <div style={{ width: '100%', height, margin: '32px 0', borderRadius: 8, overflow: 'hidden', border: '1px solid #1C2D44', background: 'rgba(5,8,16,.5)' }}
      onWheel={e => e.stopPropagation()}>
      <Canvas camera={{ position: [0, 0, 7.5], fov: 55 }} dpr={[1, 1.5]} gl={{ alpha: true }} style={{ background: 'transparent' }}>
        <SkillScene />
        <fog attach="fog" args={['#050A12', 12, 28]} />
      </Canvas>
    </div>
  );
}
