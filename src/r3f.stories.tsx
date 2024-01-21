import React from "react";
import { Canvas } from "@react-three/fiber";
import { HelloWorld, CameraWorld } from "./world";

export const Hello = () => (
  <Canvas>
    <HelloWorld />
  </Canvas>
);

export const Camera = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
    <CameraWorld />
  </Canvas>
);
