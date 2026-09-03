/**
 * StationRing — hero 3D scene.
 * Rotating orbital-station torus ring with:
 *   - Docking-port nubs at regular intervals
 *   - Wireframe icosahedron control hub at centre
 *   - Particles orbiting the ring
 *   - Cursor-parallax tilt on the whole assembly
 */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Torus, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../../store';

const CYAN  = new THREE.Color('#00D4FF');
const AMBER = new THREE.Color('#FFB547');
const DIM   = new THREE.Color('#1C2D44');

/* ── Particle data — plain objects, no hooks ─────────────────────────────── */
interface ParticleData {
  offset: number;
  color:  THREE.Color;
}

/* ── Ring orbiting particles ─────────────────────────────────────────────── */
function RingParticles({ count = 40, radius = 3.8, speed = 0.18 }: {
  count?: number; radius?: number; speed?: number;
}) {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const reduced  = useStore(s => s.reduced);

  // plain data — no hooks inside
  const particles = useMemo<ParticleData[]>(() =>
    Array.from({ length: count }, (_, i) => ({
      offset: (i / count) * Math.PI * 2 + Math.random() * 0.5,
      color:  i % 3 === 0 ? AMBER : CYAN,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    particles.forEach(({ offset }, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      const a = t * speed + offset;
      mesh.position.x = Math.cos(a) * radius;
      mesh.position.z = Math.sin(a) * radius;
      mesh.position.y = Math.sin(a * 1.3) * 0.35;
    });
  });

  return (
    <>
      {particles.map(({ color }, i) => (
        <mesh key={i} ref={el => { meshRefs.current[i] = el; }}>
          <sphereGeometry args={[0.03, 5, 5]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </>
  );
}

/* ── Docking-port nubs ───────────────────────────────────────────────────── */
function DockingPorts({ count = 8 }: { count?: number }) {
  const ports = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      return { x: Math.cos(a) * 3.8, z: Math.sin(a) * 3.8, even: i % 2 === 0 };
    }),
  [count]);

  return (
    <>
      {ports.map(({ x, z, even }, i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh>
            <boxGeometry args={[0.12, 0.08, 0.22]} />
            <meshStandardMaterial
              color="#0B1320"
              emissive={even ? CYAN : DIM}
              emissiveIntensity={0.35}
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

/* ── Control hub ─────────────────────────────────────────────────────────── */
function ControlHub() {
  const ref     = useRef<THREE.Group>(null!);
  const reduced = useStore(s => s.reduced);

  const spokes = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * 3.75, 0, Math.sin(a) * 3.75);
    }),
  []);

  useFrame(({ clock }) => {
    if (reduced || !ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.22;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.04;
  });

  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial
          color="#0B1320" emissive={CYAN} emissiveIntensity={0.45}
          roughness={0.2} metalness={0.8} wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.46, 1]} />
        <meshStandardMaterial
          color="#050A12" emissive={CYAN} emissiveIntensity={0.15}
          roughness={0.1} metalness={0.9}
        />
      </mesh>
      {spokes.map((end, i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(0, 0, 0), end]}
          color="#1C2D44"
          lineWidth={1}
          transparent
          opacity={0.6}
        />
      ))}
      <Html center distanceFactor={6} position={[0, 0.8, 0]}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, color: '#00D4FF',
          letterSpacing: '.14em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          background: 'rgba(5,10,18,.75)',
          padding: '2px 6px', borderRadius: 2,
          border: '1px solid rgba(0,212,255,.25)',
          pointerEvents: 'none',
        }}>
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
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.08;
    if (reduced) return;
    groupRef.current.rotation.y += 0.004;
    // cursor parallax — read from store without subscribing in render
    const { cursorX, cursorY } = useStore.getState();
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x, cursorY * -0.15, 0.03
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z, cursorX * 0.06, 0.03
    );
  });

  return (
    <group ref={groupRef} rotation={[0.3, 0, 0]}>
      {/* main torus */}
      <Torus args={[3.8, 0.14, 16, 80]}>
        <meshStandardMaterial
          color="#0B1828" emissive={CYAN} emissiveIntensity={0.28}
          roughness={0.3} metalness={0.85}
        />
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

/* ── Public component ────────────────────────────────────────────────────── */
export default function StationRing({ height = 440 }: { height?: number }) {
  const webGL = useStore(s => s.webGL);
  if (!webGL) return <FlatRingFallback height={height} />;

  return (
    <div
      style={{
        width: '100%', height,
        borderRadius: 8, overflow: 'hidden',
        border: '1px solid #1C2D44',
        background: 'rgba(5,8,16,.6)',
      }}
      onWheel={e => e.stopPropagation()}
    >
      <Canvas
        camera={{ position: [0, 1.5, 8.5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 4, 0]}   intensity={2.5} color={CYAN}  distance={20} />
        <pointLight position={[3, -2, 3]}  intensity={0.8} color={AMBER} distance={12} />
        <Assembly />
        <fog attach="fog" args={['#050A12', 16, 36]} />
      </Canvas>
    </div>
  );
}

function FlatRingFallback({ height = 440 }: { height?: number }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height,
      border: '1px solid #1C2D44', borderRadius: 8,
      background: '#080F1C',
      fontFamily: 'monospace', fontSize: 12, color: '#3A5A78',
    }}>
      [3D canvas — WebGL unavailable]
    </div>
  );
}
