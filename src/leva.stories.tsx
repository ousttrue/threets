import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import { xyz, xyzScaleColorWire } from "./libs/ui";

export function PositionXYZStory() {
  const { positionX, positionY, positionZ } = xyz();
  return (
    <Canvas>
      <Box position={[positionX, positionY, positionZ]} />
    </Canvas>
  );
}

export function PositionXYZScaleCameraStory() {
  const { scale, positionX, positionY, positionZ, color, wireframe } =
    xyzScaleColorWire();
  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} />
      {/* <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="red" />
        </mesh> */}
      <Box
        args={[2, 2, 2]}
        scale={scale}
        position={[positionX, positionY, positionZ]}
      >
        <meshStandardMaterial color={color} wireframe={wireframe} />
      </Box>
      <OrbitControls />
    </Canvas>
  );
}
// PositionXYZScaleCameraStory.meta = { iframed: true };
