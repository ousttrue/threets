import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stats, Grid, OrbitControls } from "@react-three/drei";
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

function cube(size: number): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

class Model {
  _root = new THREE.Group();
  _transform: TransformControls;
  _joints: THREE.Object3D[] = [];
  _currentPositions: THREE.Vector3[] = [];
  _prevPositions: THREE.Vector3[] = [];

  constructor() {
    this.add(cube(0.1));
    this.add(cube(0.1));
    this.add(cube(0.1));
    this.add(cube(0.1));
    this.add(cube(0.1));

    for (const joint of this._joints) {
      {
        const v = new THREE.Vector3();
        joint.getWorldPosition(v);
        this._prevPositions.push(v);
      }
      {
        const v = new THREE.Vector3();
        joint.getWorldPosition(v);
        this._currentPositions.push(v);
      }
    }
    console.log(this._prevPositions);
  }

  add(joint: THREE.Object3D) {
    if (this._joints.length == 0) {
      this._root.add(joint);
    }
    else {
      joint.position.set(0, -0.2, 0);
      this._joints[this._joints.length - 1].add(joint);
    }
    this._joints.push(joint);
  }

  get root(): THREE.Object3D {
    return this._root;
  }

  onFrame(domElement: HTMLElement,
    clock: THREE.Clock,
    scene: THREE.Scene,
    camera: THREE.Camera,
    invalidate: Function,
    orbitControls?: any,
  ) {

    if (!this._transform) {
      // lazy initialization
      this._transform = new TransformControls(camera, domElement);
      // this._transform.space = 'local';
      // this._transform.addEventListener('change', tick);
      this._transform.attach(this._joints[0]);
      this._transform.addEventListener('dragging-changed', event => {
        if (orbitControls) {
          orbitControls.enabled = !event.value;
        }
      });
      this._transform.addEventListener('change', e => {
        // invalidate();
      });
      this._root.add(this._transform);
    }

    // update current & detach parent
    for (let i = 1; i < this._joints.length; ++i) {
      this._joints[i].getWorldPosition(this._currentPositions[i]);
      scene.attach(this._joints[i]);
    }

    // verlet
    for (let i = 1; i < this._joints.length; ++i) {
      const joint = this._joints[i];

      const current = this._currentPositions[i];
      const prev = this._prevPositions[i];

      const velocity = new THREE.Vector3();
      velocity.subVectors(current, prev);

      prev.copy(current);
      joint.position.addVectors(current, velocity);
    }

    // constraint

    // restore parent
    for (let i = 1; i < this._joints.length; ++i) {
      this._joints[i].getWorldPosition(this._currentPositions[i]);
      this._joints[i - 1].attach(this._joints[i]);
    }

    // for (let i = 0; i < this._joints.length; ++i) {
    //   this._joints[i].getWorldPosition(
    //     this._prevPositions[i]);
    // }

    invalidate();
  }
}


function Render({ model }: { model?: Model }) {
  const transformRef = React.useRef();
  const { invalidate } = useThree();
  useFrame(({ gl, camera, clock, scene }, delta) => {
    model?.onFrame(gl.domElement,
      clock,
      scene,
      camera,
      invalidate,
      transformRef.current);
  });

  return (<>
    <color attach="background" args={[0, 0, 0]} />
    <ambientLight intensity={0.8} />
    <pointLight intensity={1} position={[0, 6, 0]} />
    <directionalLight position={[10, 10, 5]} />
    <OrbitControls ref={transformRef} makeDefault />
    <Grid cellColor="white" args={[10, 10]} />
    <axesHelper />
    <Stats />
    {model ? <primitive object={model.root} /> : ""}
  </>
  );
}

export function DynamicParticle() {
  const [model, setModel] = React.useState<Model>(null);
  React.useEffect(() => {
    setModel(new Model());
  }, []);

  return (<Canvas shadows>
    <Render model={model} />
  </Canvas>);
}
