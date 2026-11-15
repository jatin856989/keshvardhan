"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer } from "@react-three/drei";
import { Leaf, OilBottle, PointerParallax, PowderJar } from "./ProductModels";

/**
 * Hero 3D scene: the jar and bottle floating over a soft shadow with pointer
 * parallax. Lighting is fully procedural (Lightformers), so nothing is
 * fetched from a CDN at runtime.
 */
export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      shadows="percentage"
      camera={{ position: [0, 0.3, 8.4], fov: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-5, 2, -2]} intensity={0.5} color="#f6f1e7" />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 4, -4]} scale={[8, 3, 1]} color="#fff8ea" />
        <Lightformer intensity={1.2} position={[-5, 1, 2]} scale={[2, 4, 1]} color="#dfe9d0" />
        <Lightformer intensity={0.8} position={[5, 0, 2]} scale={[2, 4, 1]} color="#f3d9c6" />
      </Environment>

      <PointerParallax strength={0.4}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.9}>
          <PowderJar position={[-1.15, -0.25, 0]} rotation={[0.05, -0.5, 0]} scale={0.95} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.1}>
          <OilBottle position={[1.25, -0.1, 0.2]} rotation={[0, 0.5, 0.04]} scale={1.05} />
        </Float>
        <Float speed={2.2} rotationIntensity={1.2} floatIntensity={2}>
          <Leaf position={[-2.4, 1.3, -0.6]} rotation={[0.4, 0.3, -0.6]} scale={0.8} />
        </Float>
        <Float speed={2.6} rotationIntensity={1.4} floatIntensity={2}>
          <Leaf position={[2.5, 1.6, -0.8]} rotation={[-0.3, 0.6, 0.5]} scale={0.6} color="#5f8a3a" />
        </Float>
        <Float speed={1.9} rotationIntensity={1} floatIntensity={1.6}>
          <Leaf position={[0.2, -1.7, 0.9]} rotation={[1.2, 0.2, 0.2]} scale={0.5} color="#9cc06a" />
        </Float>
      </PointerParallax>

      <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={9} blur={2.6} far={3} color="#1F3D2B" />
    </Canvas>
  );
}
