import React from "react";
import { Canvas } from "@react-three/fiber";
import { HelloWorld, CameraWorld } from "./libs/world";

export const Empty = () => <Canvas></Canvas>;

export const Box = () => (
  <Canvas>
    <mesh>
      <boxGeometry />
    </mesh>
  </Canvas>
);

export const Camera = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
    <CameraWorld />
  </Canvas>
);
