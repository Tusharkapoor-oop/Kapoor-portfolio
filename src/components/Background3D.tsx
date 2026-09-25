import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Image as Image3D } from '@react-three/drei';
import * as THREE from 'three';

// Warm jewel palette — matches the site, never neon-default
const GOLD = '#E8A33D';
const EMBER = '#E85D2A';
const TEAL = '#2DD4BF';
const ROSE = '#FB7185';

const FloatingArt = () => {
  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
      <Image3D
        url={`${import.meta.env.BASE_URL}scholar_art_3d_wide.jpg`}
        position={[0, 0, -8]}
        scale={[24, 13.5]}
        rotation={[0, 0, 0.02]}
        transparent
        opacity={0.95}
      />
    </Float>
  );
};

const FloatingShapes = () => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.6}>
        <mesh position={[3.4, 1.4, -3]} scale={1.3}>
          <torusKnotGeometry args={[1, 0.3, 96, 24]} />
          <MeshDistortMaterial color={GOLD} roughness={0.25} metalness={0.7} distort={0.35} speed={1.6} />
        </mesh>
      </Float>

      <Float speed={1.6} rotationIntensity={1.4} floatIntensity={1.2}>
        <mesh position={[-3.8, -1.2, -2]} scale={1}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={EMBER} roughness={0.3} metalness={0.7} emissive={EMBER} emissiveIntensity={0.25} />
        </mesh>
      </Float>

      <Float speed={1.3} rotationIntensity={0.8} floatIntensity={2}>
        <mesh position={[-2.6, 2.4, -4]} scale={1.5}>
          <sphereGeometry args={[1, 48, 48]} />
          <MeshDistortMaterial color={TEAL} roughness={0.35} metalness={0.5} distort={0.5} speed={2} />
        </mesh>
      </Float>

      <Float speed={2.4} rotationIntensity={1.8} floatIntensity={0.9}>
        <mesh position={[2.8, -2.2, -2.5]} scale={0.65}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={ROSE} roughness={0.25} metalness={0.7} emissive={ROSE} emissiveIntensity={0.2} />
        </mesh>
      </Float>
    </group>
  );
};

const Background3D = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.4} color="#fff2df" />
        <directionalLight position={[-10, -10, -5]} intensity={0.8} color={EMBER} />
        <pointLight position={[0, 0, 0]} intensity={1.2} color={GOLD} />

        <FloatingArt />
        <FloatingShapes />

        <Sparkles count={120} scale={14} size={2.5} speed={0.3} opacity={0.5} color={GOLD} />
      </Canvas>
      {/* Scrim — site background wins, shapes stay ambient */}
      <div className="absolute inset-0 bg-background/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/95" />
    </div>
  );
};

export default Background3D;
