/**
 * StationRing — hero 3D scene.
 * A rotating orbital-station torus ring with node clusters,
 * docking-port nubs, and particle streams circling the ring.
 * Lives in the hero section's inline Canvas.
 */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';

const CYAN  = new THREE.Color('#00D4FF');
const AMBER = new THREE.Color('#FFB547');
const DIM   = new THREE.Color('#1C2D44');

/* ── Ring orbiting particles ────────────────────────────────────────────── */
function RingParticles({ count = 40, radius = 3.8, speed = 0.18 }: {
  count?: number; radius?: number; speed?: number;
}) {
  const refs = useMemo(() =>
    Array.from({ length: count }, () => ({ ref: useRef<THREE.Mesh>(null!), offset: Math.random() * Math.PI * 2 })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [count]);
  const reduced = useStore(s => s.reduced);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    refs.forEach(({ ref, offset }) => {
      if (!ref.current) return;
      const a = t * speed + offset;
      ref.current.position.x = Math.cos(a) * radius;
      ref.current.position.z = Math.sin(a) * radius;
      ref.current.position.y = Math.sin(a * 1.3) * 0.35;
    });
  });

  return (
    <>
      {refs.map(({ ref }, i) => (
        <mesh key={i} ref={ref}>
          <sphereGeometry args={[0.03, 5, 5]} />
          <meshBasicMaterial color={i % 3 === 0 ? AMBER : CYAN} />
        </mesh>
      ))}
    </>
  );
}

/* ── Docking-port nubs around the ring ───────────────────────────────────── */
function DockingPorts({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const r = 3.8;
        return (
          <group key={i} position={[Math.cos(a) * r, 0, Math.sin(a) * r]}>
            <mesh>
              <boxGeometry args={[0.12, 0.08, 0.22]} />
              <meshStandardMaterial color="#0B1320" emissive={i % 2 === 0 ? CYAN : DIM} emissiveIntensity={0.35} roughness={0.3} metalness={0.9} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/* ── Control hub at centre ───────────────────────────────────────────────── */
function ControlHub() {
  const ref = useRef<THREE.Group>(null!);
  const reduced = useStore(s => s.reduced);

  useFrame(({ clock }) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 0.22;
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.04;
  });

  return (
    <group ref={ref}>
      {/* core sphere */}
      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color="#0B1320" emissive={CYAN} emissiveIntensity={0.45} roughness={0.2} metalness={0.8} wireframe />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.46, 1]} />
        <meshStandardMaterial color="#050A12" emissive={CYAN} emissiveIntensity={0.15} roughness={0.1} metalness={0.9} />
      </mesh>
      {/* radial spokes to ring */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        const end = new THREE.Vector3(Math.cos(a) * 3.75, 0, Math.sin(a) * 3.75);
        return (
          <Line
            key={i}
            points={[new THREE.Vector3(0, 0, 0), end]}
            color="#1C2D44"
            lineWidth={1}
            transparent
            opacity={0.6}
          />
        );
      })}
      {/* label */}
      <Html center distanceFactor={6} position={[0, 0.8, 0]}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#00D4FF', letterSpacing: '.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', background: 'rgba(5,10,18,.75)', padding: '2px 6px', borderRadius: 2, border: '1px solid rgba(0,212,255,.25)', pointerEvents: 'none' }}>
          k8s-control-plane
        </div>
      </Html>
    </group>
  );
}

/* ── Full ring assembly ──────────────────────────────────────────────────── */
function Assembly() {
  const groupRef = useRef<THREE.Group>(null!);
  const reduced  = useStore(s => s.reduced);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    if (!reduced) {
      groupRef.current.rotation.y += 0.004;
      const { cursorX: cx, cursorY: cy } = useStore.getState();
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, cy * -0.15, 0.03);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, cx *  0.06, 0.03);
    }
    // gentle bobbing
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.08;
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* main torus */}
      <Torus args={[3.8, 0.14, 16, 80]}>
        <meshStandardMaterial color="#0B1828" emissive={CYAN} emissiveIntensity={0.28} roughness={0.3} metalness={0.85} />
      </Torus>
      {/* outer glow ring */}
      <Torus args={[3.8, 0.055, 8, 80]}>
        <meshBasicMaterial color={CYAN} transparent opacity={0.18} />
      </Torus>
      <DockingPorts />
      <ControlHub />
      <RingParticles count={50} radius={3.8} speed={0.14} />
      <RingParticles count={20} radius={2.2} speed={-0.22} />
    </group>
  );
}

export default function StationRing({ height = 440 }: { height?: number }) {
  const webGL = useStore(s => s.webGL);
  if (!webGL) return <FlatRingFallback />;

  return (
    <div style={{ width: '100%', height, borderRadius: 8, overflow: 'hidden', border: '1px solid #1C2D44', background: 'rgba(5,8,16,.6)' }}
      onWheel={e => e.stopPropagation()}>
      <Canvas camera={{ position: [0, 1.5, 8.5], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 4, 0]} intensity={2.5} color={CYAN} distance={20} />
        <pointLight position={[3, -2, 3]} intensity={0.8} color={AMBER} distance={12} />
        <Assembly />
        <fog attach="fog" args={['#050A12', 16, 36]} />
      </Canvas>
    </div>
  );
}

function FlatRingFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320, border: '1px solid #1C2D44', borderRadius: 8, background: '#080F1C', fontFamily: 'monospace', fontSize: 12, color: '#3A5A78' }}>
      [3D canvas — WebGL unavailable]
    </div>
  );
}
