import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRMSpringBoneManager, VRMSpringBoneJoint, VRMSpringBoneJointHelper } from '@pixiv/three-vrm-springbone';
import { Canvas, useFrame, useGraph } from "@react-three/fiber";
import { Box, Grid, OrbitControls, TransformControls } from "@react-three/drei";


interface Model {
  root: THREE.Object3D;
  onFrame: (clock: THREE.Clock, delta: number) => void;
};


function SpringBoneScene({ model }: { model: Model }) {
  useFrame(({ clock }, delta) => {
    model.onFrame(clock, delta);
  });
  return <primitive object={model.root} />
}


// https://pixiv.github.io/three-vrm/packages/three-vrm-springbone/examples/single.html
export function SpringBone() {
  const [model, setModel] = React.useState<Model>(null);

  React.useEffect(() => {
    const root = new THREE.Group();

    // objects
    const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const material = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });

    const cubeA = new THREE.Mesh(geometry, material);
    cubeA.name = 'cubeA';
    cubeA.position.set(0.0, 0.5, 0.0);
    root.add(cubeA);

    const cubeB = new THREE.Mesh(geometry, material);
    cubeB.name = 'cubeB';
    cubeB.position.set(0.0, - 0.5, 0.0);
    cubeA.add(cubeB);

    const cubeC = new THREE.Mesh(geometry, material);
    cubeC.name = 'cubeC';
    cubeC.position.set(0.0, - 0.5, 0.0);
    cubeB.add(cubeC);

    // helpers
    // spring bones
    const springBoneManager = new VRMSpringBoneManager();

    const springBone = new VRMSpringBoneJoint(cubeB, cubeC, { hitRadius: 0.01 });
    springBoneManager.addJoint(springBone);

    // helper
    const springBoneHelper = new VRMSpringBoneJointHelper(springBone);
    root.add(springBoneHelper);

    // init spring bones
    springBoneManager.setInitState();

    // const clock = new THREE.Clock();
    let shouldReset = true;

    setModel({
      root,
      onFrame: (clock: THREE.Clock, delta: number) => {
        cubeA.position.x = Math.sin(Math.PI * clock.elapsedTime);

        if (shouldReset) {

          console.log("reset");
          shouldReset = false;
          springBoneManager.reset();

        }

        springBoneManager.update(delta);
      },
    });

  }, []);

  return (
    <Canvas>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <directionalLight position={[10, 10, 5]} />
      <OrbitControls makeDefault />
      <Grid cellColor="white" args={[10, 10]} />
      <axesHelper />
      <SpringBoneScene model={model} />
    </Canvas>
  );
}
