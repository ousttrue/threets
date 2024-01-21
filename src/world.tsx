import React, { useRef } from "react";
import { CameraControls } from "@react-three/drei";
import { Box, Ground } from "./geometry";

export function HelloWorld() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </>
  );
}

export function CameraWorld() {
  const cameraControlsRef = useRef<CameraControls>(null);
  return (
    <>
      <group position-y={-0.5}>
        <Ground />
        <CameraControls ref={cameraControlsRef} />
      </group>
    </>
  );
}
