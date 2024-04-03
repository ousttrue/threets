//
// https://pixiv.github.io/three-vrm/packages/three-vrm-springbone/examples/
//
import React from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Canvas, useFrame, useGraph } from "@react-three/fiber";
import { Box, Grid, OrbitControls, TransformControls } from "@react-three/drei";
import {
  VRMSpringBoneColliderShapeCapsule,
  VRMSpringBoneCollider,
  VRMSpringBoneColliderHelper,
  VRMSpringBoneManager,
  VRMSpringBoneJoint,
  VRMSpringBoneJointHelper,
  VRMSpringBoneLoaderPlugin,
} from '@pixiv/three-vrm-springbone';


interface Model {
  root: THREE.Object3D;
  onFrame: (clock: THREE.Clock, delta: number) => void;
};


function SpringBoneScene({ model }: { model?: Model }) {
  useFrame(({ clock }, delta) => {
    model?.onFrame(clock, delta);
  });
  return (<>
    {model ? <primitive object={model.root} /> : ""}
    <color attach="background" args={[0, 0, 0]} />
    <ambientLight intensity={0.8} />
    <pointLight intensity={1} position={[0, 6, 0]} />
    <directionalLight position={[10, 10, 5]} />
    <OrbitControls makeDefault />
    <Grid cellColor="white" args={[10, 10]} />
    <axesHelper />
  </>
  );
}

export function LoaderPlugin() {
  const [model, setModel] = React.useState<Model>(null);

  React.useEffect(() => {
    const scene = new THREE.Group();

    // gltf and vrm
    let currentGltf: any = null;
    let currentSpringBoneManager = null;

    const loader = new GLTFLoader();

    const loaderPluginOptions = {
      jointHelperRoot: scene,
      colliderHelperRoot: scene,
    };

    loader.register((parser: any) => {
      return new VRMSpringBoneLoaderPlugin(parser, loaderPluginOptions);
    });

    function load(url: string) {
      loader.crossOrigin = 'anonymous';
      loader.load(url, (gltf: any) => {
        scene.add(gltf.scene);
        console.log(gltf);
        currentGltf = gltf;
        const springBoneManager = gltf.vrmSpringBoneManager;
      },
        (progress: any) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),
        (error: any) => console.error(error)
      );
    }

    load('/cubes.gltf');

    // helpers
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // dnd handler
    window.addEventListener('dragover', function(event) {
      event.preventDefault();
    });

    window.addEventListener('drop', function(event) {
      event.preventDefault();
      // read given file then convert it to blob url
      const files = event.dataTransfer.files;
      if (!files) {
        return;
      }
      const file = files[0];
      if (!file) {
        return;
      }
      const blob = new Blob([file], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      load(url);
    });

    // animate
    let shouldReset = true; // reset in the very first frame

    setModel({
      root: scene,
      onFrame: (clock, delta) => {
        if (currentGltf) {
          const manager = currentGltf.userData.vrmSpringBoneManager;
          currentGltf.scene.position.x = Math.sin(Math.PI * clock.elapsedTime);
          if (shouldReset) {
            shouldReset = false;
            manager.reset();
          }
          manager.update(delta);
        }
      },
    });
  }, []);

  return (
    <Canvas>
      <SpringBoneScene model={model} />
    </Canvas>
  );
}

export function Collider() {
  const [model, setModel] = React.useState<Model>(null);

  React.useEffect(() => {
    const scene = new THREE.Group();

    // light
    const light = new THREE.DirectionalLight(0xffffff, Math.PI);
    light.position.set(1.0, 2.0, 3.0).normalize();
    scene.add(light);

    // objects
    const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const material = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });

    const cubes: THREE.Object3D[] = [];

    for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.name = `cube[${i}]`;
      cube.position.set(0.0, i === 0 ? 0.5 : - 0.25, 0.0);
      cubes.push(cube);

      const parent = i === 0 ? scene : cubes[i - 1];
      parent.add(cube);
    }

    // important
    scene.updateMatrixWorld(true);

    // collider
    const colliders: VRMSpringBoneCollider[] = [];

    const colliderShape = new VRMSpringBoneColliderShapeCapsule({
      radius: 0.2,
      offset: new THREE.Vector3(- 0.5, - 0.5, 1.0),
      tail: new THREE.Vector3(0.5, 0.5, - 1.0),
    });

    const collider = new VRMSpringBoneCollider(colliderShape);
    scene.add(collider);

    colliders.push(collider);

    // collider helper
    const colliderHelper = new VRMSpringBoneColliderHelper(collider);
    scene.add(colliderHelper);

    // spring bone
    const springBoneManager = new VRMSpringBoneManager();

    for (let i = 1; i < 4; i++) {
      const springBone = new VRMSpringBoneJoint(cubes[i], cubes[i + 1], { hitRadius: 0.01 });
      springBone.colliderGroups = [{ colliders }];
      springBoneManager.addJoint(springBone);
    }

    // helpers
    springBoneManager.joints.forEach((bone) => {
      const helper = new VRMSpringBoneJointHelper(bone);
      scene.add(helper);
    });

    // init spring bones
    springBoneManager.setInitState();

    let shouldReset = true;

    setModel({
      root: scene, onFrame: (clock, deltaTime) => {
        cubes[0].position.x = Math.sin(Math.PI * clock.elapsedTime);
        collider.position.x = Math.sin(clock.elapsedTime);
        if (shouldReset) {
          shouldReset = false;
          springBoneManager.reset();
        }
        springBoneManager.update(deltaTime);
      }
    });
  }, []);

  return (
    <Canvas>
      <SpringBoneScene model={model} />
    </Canvas>
  );
}

export function Multiple() {
  const [model, setModel] = React.useState<Model>(null);

  React.useEffect(() => {
    const root = new THREE.Group();

    // objects
    const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    const material = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });

    const cubes: THREE.Object3D[] = [];

    for (let i = 0; i < 5; i++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.name = `cube[${i}]`;
      cube.position.set(0.0, i === 0 ? 0.5 : - 0.25, 0.0);
      cubes.push(cube);
      const parent = i === 0 ? root : cubes[i - 1];
      parent.add(cube);
    }

    // spring bones
    const springBoneManager = new VRMSpringBoneManager();

    for (let i = 1; i < 4; i++) {

      const springBone = new VRMSpringBoneJoint(cubes[i], cubes[i + 1], { hitRadius: 0.01 });
      springBoneManager.addJoint(springBone);
    }

    // helpers
    springBoneManager.joints.forEach((bone) => {
      const helper = new VRMSpringBoneJointHelper(bone);
      root.add(helper);
    });

    // init spring bones
    springBoneManager.setInitState();

    // animate
    let shouldReset = true;

    setModel({
      root, onFrame: (clock, delta) => {
        cubes[0].position.x = Math.sin(Math.PI * clock.elapsedTime);
        if (shouldReset) {
          shouldReset = false;
          springBoneManager.reset();
        }
        springBoneManager.update(delta);
      }
    });
  }, []);

  return (
    <Canvas>
      <SpringBoneScene model={model} />
    </Canvas>
  );
}

export function Single() {
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
      <SpringBoneScene model={model} />
    </Canvas>
  );
}
