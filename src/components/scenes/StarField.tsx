/**
 * StarField — the fixed ambient background scene.
 * A sphere of 2000 star instances + slow nebula haze planes.
 * pointer-events: none, DPR=1, purely decorative.
 */
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

const STAR_COUNT = 1800;

function Stars() {
  const meshRef = useRef<THREE.Points>(null!);
  const reduced = useStore(s => s.reduced);

  const { geo } = useMemo(() => {
    const pos = new Float32Array(STAR_COUNT * 3);
    const col = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      // Spherical distribution
      const r     = 60 + Math.random() * 60;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi   = Math.random() * Math.PI * 2;
      pos[i*3]   = r * Math.sin(theta) * Math.cos(phi);
      pos[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i*3+2] = r * Math.cos(theta);
      // colour variation: mostly white-blue, some amber
      const warm = Math.random() < 0.12;
      col[i*3]   = warm ? 1.0  : 0.72 + Math.random() * 0.28;
      col[i*3+1] = warm ? 0.75 : 0.82 + Math.random() * 0.18;
      col[i*3+2] = warm ? 0.3  : 1.0;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color',    new THREE.BufferAttribute(col, 3));
    return { geo: g };
  }, []);

  useFrame(({ clock }) => {
    if (reduced || !meshRef.current) return;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.008;
    meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.004) * 0.05;
  });

  return (
    <points ref={meshRef} geometry={geo}>
      <pointsMaterial
        size={0.22}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.75}
      />
    </points>
  );
}

// Translucent nebula smear planes
function NebulaSlab({ position, color, rx = 0, ry = 0 }: {
  position: [number,number,number]; color: string; rx?: number; ry?: number;
}) {
  return (
    <mesh position={position} rotation={[rx, ry, 0]}>
      <planeGeometry args={[80, 40]} />
      <meshBasicMaterial color={color} transparent opacity={0.016} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <Stars />
      <NebulaSlab position={[0, -10, -30]} color="#00D4FF" rx={0.2}  ry={0.1} />
      <NebulaSlab position={[20,  5, -40]} color="#FFB547" rx={-0.1} ry={0.6} />
      <NebulaSlab position={[-15, 0, -35]} color="#0055AA" rx={0.3}  ry={-0.3}/>
    </>
  );
}

export default function StarField() {
  if (!useStore.getState().webGL) return null;
  return (
    <div className="bg-canvas">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 80 }}
        gl={{ antialias: false, alpha: true }}
        dpr={1}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
