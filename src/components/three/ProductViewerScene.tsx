"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Lightformer, OrbitControls } from "@react-three/drei";
import { OilBottle, PowderJar } from "./ProductModels";

export default function ProductViewerScene({ kind }: { kind: "powder" | "oil" | "bundle" }) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      shadows="percentage"
      camera={{ position: [0, 0.4, kind === "bundle" ? 9.2 : 7.4], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", touchAction: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} castShadow shadow-mapSize={[1024, 1024]} />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 4, -4]} scale={[8, 3, 1]} color="#fff8ea" />
        <Lightformer intensity={1} position={[-5, 1, 2]} scale={[2, 4, 1]} color="#dfe9d0" />
        <Lightformer intensity={0.8} position={[5, 0, 2]} scale={[2, 4, 1]} color="#f3d9c6" />
      </Environment>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>
        {kind === "powder" ? <PowderJar position={[0, -0.2, 0]} /> : null}
        {kind === "oil" ? <OilBottle position={[0, -0.1, 0]} scale={1.15} /> : null}
        {kind === "bundle" ? (
          <>
            <PowderJar position={[-1.2, -0.25, 0]} rotation={[0, -0.4, 0]} scale={0.95} />
            <OilBottle position={[1.2, -0.1, 0.2]} rotation={[0, 0.4, 0]} scale={1.05} />
          </>
        ) : null}
      </Float>
      <ContactShadows position={[0, -1.45, 0]} opacity={0.45} scale={8} blur={2.4} far={3} color="#1F3D2B" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.2} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} />
    </Canvas>
  );
}
