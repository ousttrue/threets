import React from "react";
import { Canvas } from "@react-three/fiber";
import { CameraWorld } from "./libs/world";
import { Box } from "@react-three/drei";

export const SceneBox = () => (
  <Canvas>
    <mesh>
      <boxGeometry />
    </mesh>
  </Canvas>
);

export const SceneDreiBox = () => (
  <Canvas>
    <Box />
  </Canvas>
);

export const SceneCamera = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
    <CameraWorld />
  </Canvas>
);
