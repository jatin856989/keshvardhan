"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";

/**
 * Procedural 3D models of the two products. Built from primitives so the
 * page ships no heavy GLTF; swap for scanned models later by replacing these
 * components and keeping the same props.
 */

export function PowderJar(props: ThreeElements["group"]) {
  const labelGeo = useMemo(
    () => new THREE.CylinderGeometry(0.905, 0.905, 0.9, 64, 1, true, Math.PI * 0.62, Math.PI * 0.76),
    [],
  );
  return (
    <group {...props}>
      {/* body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.86, 1.7, 64]} />
        <meshPhysicalMaterial color="#efe9db" roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      {/* rounded bottom edge */}
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[0.84, 0.05, 16, 64]} />
        <meshPhysicalMaterial color="#e4dccb" roughness={0.4} />
      </mesh>
      {/* label */}
      <mesh geometry={labelGeo} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#f6f1e7" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* label accent stripe */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.91, 0.91, 0.03, 64, 1, true, Math.PI * 0.72, Math.PI * 0.56]} />
        <meshStandardMaterial color="#C4653A" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* powder line */}
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.912, 0.912, 0.25, 64, 1, true, Math.PI * 0.62, Math.PI * 0.76]} />
        <meshStandardMaterial color="#7FA650" roughness={0.9} transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* lid */}
      <mesh castShadow position={[0, 1.02, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.34, 64]} />
        <meshPhysicalMaterial color="#1F3D2B" roughness={0.35} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.6, 0.92, 0.04, 64]} />
        <meshPhysicalMaterial color="#2b5a3f" roughness={0.3} />
      </mesh>
    </group>
  );
}

export function OilBottle(props: ThreeElements["group"]) {
  const bodyGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const profile: Array<[number, number]> = [
      [0, -1.1],
      [0.38, -1.1],
      [0.45, -1.02],
      [0.47, -0.4],
      [0.47, 0.55],
      [0.42, 0.78],
      [0.26, 0.95],
      [0.16, 1.02],
      [0.16, 1.3],
      [0, 1.3],
    ];
    for (const [x, y] of profile) pts.push(new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 72);
  }, []);
  return (
    <group {...props}>
      <mesh geometry={bodyGeo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#8a4f1d"
          roughness={0.12}
          metalness={0}
          transmission={0.55}
          thickness={0.6}
          ior={1.45}
          clearcoat={1}
          attenuationColor="#c58f4e"
          attenuationDistance={0.8}
        />
      </mesh>
      {/* oil inside */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.4, 0.36, 1.5, 48]} />
        <meshPhysicalMaterial color="#c9862e" roughness={0.3} transparent opacity={0.85} />
      </mesh>
      {/* label */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.7, 64, 1, true, Math.PI * 0.68, Math.PI * 0.64]} />
        <meshStandardMaterial color="#f6f1e7" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.485, 0.485, 0.025, 64, 1, true, Math.PI * 0.78, Math.PI * 0.44]} />
        <meshStandardMaterial color="#C4653A" roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
      {/* cap */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.34, 48]} />
        <meshPhysicalMaterial color="#111111" roughness={0.45} />
      </mesh>
      {/* dropper bulb */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.18, 8, 24]} />
        <meshPhysicalMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
    </group>
  );
}

/** Gently rotates a group toward the pointer position for a parallax feel. */
export function PointerParallax({
  children,
  strength = 0.35,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const targetY = state.pointer.x * strength;
    const targetX = -state.pointer.y * strength * 0.6;
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetY, 3, delta);
    ref.current.rotation.x = THREE.MathUtils.damp(ref.current.rotation.x, targetX, 3, delta);
  });
  return <group ref={ref}>{children}</group>;
}

export function Leaf({ color = "#7FA650", ...props }: ThreeElements["mesh"] & { color?: string }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, -0.5);
    s.bezierCurveTo(0.35, -0.25, 0.35, 0.25, 0, 0.5);
    s.bezierCurveTo(-0.35, 0.25, -0.35, -0.25, 0, -0.5);
    return s;
  }, []);
  return (
    <mesh {...props} castShadow>
      <extrudeGeometry args={[shape, { depth: 0.02, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01 }]} />
      <meshStandardMaterial color={color} roughness={0.7} side={THREE.DoubleSide} />
    </mesh>
  );
}
