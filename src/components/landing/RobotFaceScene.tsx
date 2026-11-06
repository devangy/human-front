"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import type { Group, Mesh } from "three";

const VIOLET = "#a855f7";
const VIOLET_SOFT = "#7c3aed";
const GOLD = "#f6b73c";

const HEAD_SIZE: [number, number, number] = [2, 1.75, 1.55];
const EYE_X = 0.52;
const EYE_Y = 0.16;
const EYE_Z = 0.74;
const EYE_SOCKET_R = 0.32;
const PUPIL_R = 0.13;
const PUPIL_ORBIT = 0.16;
const MAX_EYE_ANGLE = 0.5;

const FORWARD = new THREE.Vector3(0, 0, 1);

/** A single eyeball: a wireframe socket with a solid pupil that rotates
 * within it to track the cursor, the way a human eye tracks within its
 * socket rather than the whole eye sliding around. */
function Eye({ side }: { side: 1 | -1 }) {
  const pupilRef = useRef<Mesh>(null);

  useFrame((state) => {
    const pupil = pupilRef.current;
    const eyeGroup = pupil?.parent;
    if (!pupil || !eyeGroup) return;

    const targetWorld = new THREE.Vector3(
      state.pointer.x * 1.4,
      state.pointer.y * 1.0,
      2.4
    );
    const dir = eyeGroup.worldToLocal(targetWorld).normalize();

    const angle = FORWARD.angleTo(dir);
    const clamped =
      angle > MAX_EYE_ANGLE
        ? FORWARD.clone().lerp(dir, MAX_EYE_ANGLE / angle).normalize()
        : dir;

    pupil.position.lerp(clamped.multiplyScalar(PUPIL_ORBIT), 0.18);
  });

  return (
    <group position={[side * EYE_X, EYE_Y, EYE_Z]}>
      <mesh>
        <sphereGeometry args={[EYE_SOCKET_R, 16, 16]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.85} />
      </mesh>
      <mesh ref={pupilRef} position={[0, 0, PUPIL_ORBIT]}>
        <sphereGeometry args={[PUPIL_R, 12, 12]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
    </group>
  );
}

/** A small equalizer-style mouth, echoing the brand's logo mark, that
 * pulses gently like it's mid-sentence. */
function Mouth() {
  const barRefs = useRef<(Mesh | null)[]>([]);
  const xs = [-0.33, -0.11, 0.11, 0.33];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    xs.forEach((_, i) => {
      const bar = barRefs.current[i];
      if (!bar) return;
      bar.scale.y = 0.22 + Math.abs(Math.sin(t * 2.4 + i * 1.3)) * 0.22;
    });
  });

  return (
    <group position={[0, -0.42, 0.74]}>
      {xs.map((x, i) => (
        <mesh
          key={x}
          ref={(el) => {
            barRefs.current[i] = el;
          }}
          position={[x, 0, 0]}
        >
          <boxGeometry args={[0.09, 1, 0.09]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
      ))}
    </group>
  );
}

/** The head itself turns toward the cursor too, slower and with far less
 * range than the eyes — mirroring how a person glances with their eyes
 * first and only turns their head for something further off-centre. */
function RobotHead() {
  const headRef = useRef<Group>(null);

  useFrame((state) => {
    const head = headRef.current;
    if (!head) return;
    const targetY = THREE.MathUtils.clamp(state.pointer.x * 0.35, -0.22, 0.22);
    const targetX = THREE.MathUtils.clamp(-state.pointer.y * 0.25, -0.16, 0.16);
    head.rotation.y += (targetY - head.rotation.y) * 0.045;
    head.rotation.x += (targetX - head.rotation.x) * 0.045;
  });

  const innerSize: [number, number, number] = [
    HEAD_SIZE[0] * 0.985,
    HEAD_SIZE[1] * 0.985,
    HEAD_SIZE[2] * 0.985,
  ];

  return (
    <group ref={headRef}>
      <RoundedBox args={HEAD_SIZE} radius={0.4} smoothness={4}>
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.85} />
      </RoundedBox>
      <RoundedBox args={innerSize} radius={0.39} smoothness={2}>
        <meshBasicMaterial color={VIOLET_SOFT} transparent opacity={0.05} />
      </RoundedBox>

      <Eye side={1} />
      <Eye side={-1} />
      <Mouth />
    </group>
  );
}

export default function RobotFaceScene() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={60} color="#a855f7" />
      <pointLight position={[-4, -2, -2]} intensity={30} color="#f6b73c" />

      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.5}>
        <RobotHead />
      </Float>

      <Sparkles
        count={50}
        scale={[4.2, 4.2, 4.2]}
        size={2.2}
        speed={0.3}
        opacity={0.55}
        color="#c4b5fd"
      />
    </Canvas>
  );
}
