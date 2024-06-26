import type { Story } from "@ladle/react";
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraWorld, FaceWorld } from "./libs/world";
import { Stats, Box, Grid, OrbitControls, TransformControls, useGLTF } from "@react-three/drei";

export const BoxStory = () => (
  <Canvas>
    <mesh>
      <boxGeometry />
    </mesh>
  </Canvas>
);

export const DreiBoxStory = () => (
  <Canvas>
    <Box />
  </Canvas>
);

export const CameraStory = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
    <CameraWorld />
  </Canvas>
);

export const FaceStory = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
    <FaceWorld />
  </Canvas>
);

export const GridCameraLightStory: Story = () => (
  <Canvas shadows>
    <color attach="background" args={[0, 0, 0]} />
    <ambientLight intensity={0.8} />
    <pointLight intensity={1} position={[0, 6, 0]} />
    <directionalLight position={[10, 10, 5]} />
    <OrbitControls makeDefault />
    <Grid cellColor="white" args={[10, 10]} />
    <Stats />
    <Box position={[0, 0.5, 0]}>
      <meshStandardMaterial />
    </Box>
  </Canvas>
);

export const TransformControlsStory = () => {
  const ref = React.useRef<TransformControls>(null);
  React.useEffect(() => {
    const cb = (e: KeyboardEvent) => e.key === "Escape" && ref.current.reset();
    document.addEventListener("keydown", cb);
    return () => document.removeEventListener("keydown", cb);
  });
  return (
    <Canvas>
      <TransformControls ref={ref}>
        <Box>
          <meshBasicMaterial wireframe />
        </Box>
      </TransformControls>
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export function UseGltf(props) {
  const { nodes, materials } = useGLTF('/suzanne.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        position={[0, 0.189, -0.043]}
      />
    </group>
  )
}
