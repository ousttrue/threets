//     [+Y]up
//       A
//       |
//right  |   left
//[-X]<--o-->[+X]
//      /
//     L
//   [+Z]front

import React from "react";
import { Pane, TabApi } from "tweakpane";
import * as THREE from "three";

import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

let pane: Pane | null = null;

class Joint {
  constructor(public readonly position: THREE.Vector3,) {
  }
};

const darkGreen = 0x009900;
const darkYellow = 0x999900;
const red = 0x990000;
const darkRed = 0x990000;
const fingerSize: [number, number] = [0.1, 0.1];

class HumanBone {
  constructor(
    public name: string,
    public color: number,
    public widthDepth?: [number, number],
    public children?: (HumanBone | string)[],
  ) { }
}

//
// connect first child.
//
// body(5): hips-spine-chest-neck-head
// legs(3x2): upper-lower-foot
// arms(3x2): upper-lower-hand
// fingers(3x5x2): shoulder-upper-lower-hand
const hierarchy = new HumanBone('hips', darkGreen, [1.0, 0.4], [
  new HumanBone('spine', darkYellow, [0.9, 0.4], [
    new HumanBone('chest', darkGreen, [1.0, 0.4], [
      new HumanBone('neck', darkYellow, [0.5, 0.4], [
        new HumanBone('head', darkRed, [1, 1], ['_head'])]),
      new HumanBone('leftUpperArm', darkGreen, [0.2, 0.2], [
        new HumanBone('leftLowerArm', darkYellow, [0.2, 0.2], [
          new HumanBone('leftHand', darkRed, [0.1, 0.1], [
            new HumanBone('leftMiddleProximal', darkGreen, fingerSize, [
              new HumanBone('leftMiddleIntermediate', darkYellow, fingerSize, [
                new HumanBone('leftMiddleDistal', darkRed, fingerSize, ['_leftMiddleDistal'])])]),
            new HumanBone('leftIndexProximal', darkGreen, fingerSize, [
              new HumanBone('leftIndexIntermediate', darkGreen, fingerSize, [
                new HumanBone('leftIndexDistal', darkGreen, fingerSize, ['_leftIndexDistal'])])]),
            new HumanBone('leftRingProximal', darkGreen, fingerSize, [
              new HumanBone('leftRingIntermediate', darkGreen, fingerSize, [
                new HumanBone('leftRingDistal', darkGreen, fingerSize, ['_leftRingDistal'])])]),
            new HumanBone('leftLittleProximal', darkGreen, fingerSize, [
              new HumanBone('leftLittleIntermediate', darkGreen, fingerSize, [
                new HumanBone('leftLittleDistal', darkGreen, fingerSize, ['_leftLittleDistal'])])]),
            new HumanBone('leftThumbMetacarpal', darkGreen, fingerSize, [
              new HumanBone('leftThumbProximal', darkGreen, fingerSize, [
                new HumanBone('leftThumbDistal', darkGreen, fingerSize, ['_leftThumbDistal'])])])])])]),
      new HumanBone('rightUpperArm', darkGreen, [0.2, 0.2], [
        new HumanBone('rightLowerArm', darkYellow, [0.2, 0.2], [
          new HumanBone('rightHand', darkRed, [0.1, 0.1], [
            new HumanBone('rightMiddleProximal', darkGreen, fingerSize, [
              new HumanBone('rightMiddleIntermediate', darkGreen, fingerSize, [
                new HumanBone('rightMiddleDistal', darkGreen, fingerSize, ['_rightMiddleDistal'])])]),
            new HumanBone('rightIndexProximal', darkGreen, fingerSize, [
              new HumanBone('rightIndexIntermediate', darkGreen, fingerSize, [
                new HumanBone('rightIndexDistal', darkGreen, fingerSize, ['_rightIndexDistal'])])]),
            new HumanBone('rightRingProximal', darkGreen, fingerSize, [
              new HumanBone('rightRingIntermediate', darkGreen, fingerSize, [
                new HumanBone('rightRingDistal', darkGreen, fingerSize, ['_rightRingDistal'])])]),
            new HumanBone('rightLittleProximal', darkGreen, fingerSize, [
              new HumanBone('rightLittleIntermediate', darkGreen, fingerSize, [
                new HumanBone('rightLittleDistal', darkGreen, fingerSize, ['_rightLittleDistal'])])]),
            new HumanBone('rightThumbMetacarpal', darkGreen, fingerSize, [
              new HumanBone('rightThumbProximal', darkGreen, fingerSize, [
                new HumanBone('rightThumbDistal', darkGreen, fingerSize, ['_rightThumbDistal'])])])])])])])]),
  new HumanBone('leftUpperLeg', darkYellow, [0.2, 0.2], [
    new HumanBone('leftLowerLeg', darkGreen, [0.2, 0.2], [
      new HumanBone('leftFoot', darkRed, [0.2, 0.2], ['_leftFoot'])])]),
  new HumanBone('rightUpperLeg', darkYellow, [0.2, 0.2], [
    new HumanBone('rightLowerLeg', darkGreen, [0.2, 0.2], [
      new HumanBone('rightFoot', darkRed, [0.2, 0.2], ['_rightFoot'])])]),
]);

// 6 _head
// 5
// 4
// 3 hips
// 2
// 1 
// 0 
class HeadUnit6 {
  unit: number;
  constructor(public readonly height: number) {
    this.unit = this.height / 6.0;
  }
  units(unit: number) {
    return this.unit * unit;
  }
};

// 6頭身
//
//  +-+     _head
//  +-+0.5: head
//   | 
//  +-+0.5: neck
//  +-+2/3: chest
//  +-+2/3: spine
//  +-+2/3: hips
//    |1.5: upper
//    o
//    |1.0: lower
//    |0.5: foot
//    _   : _foot
//

interface MatrixMakerOption {
  isHand?: boolean;
  mod?: (pos: THREE.Vector3) => THREE.Vector3;
  offset?: THREE.Vector3;
}

class MatrixMaker {
  constructor(public readonly option: MatrixMakerOption) {
    if (this.option.mod && this.option.offset) {
      this.option.offset = this.option.mod(this.option.offset);
    }
  }

  makeMatrix(head: THREE.Vector3, tail: THREE.Vector3, width: number, depth: number) {
    const m = new THREE.Matrix4();

    if (this.option.mod) {
      head = this.option.mod(head);
      tail = this.option.mod(tail);
    }

    const y = new THREE.Vector3();
    y.set(tail.x, tail.y, tail.z).sub(head);
    const height = y.length();
    y.normalize();
    const z = this.option.isHand ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
    const x = new THREE.Vector3(); x.crossVectors(y, z).normalize();
    m.makeBasis(x, y, z);
    m.scale(new THREE.Vector3(width, height, depth));
    const pos = new THREE.Vector3(head.x, head.y, head.z);
    if (this.option.offset) {
      pos.add(this.option.offset);
    }
    m.setPosition(pos);
    // console.log(head, tail, width, height, depth);
    return m;
  }
}

function makeGroup(color: number) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(cube);
  cube.position.set(0, 0.5, 0);
  return group;
}

//     o
//o----|----o
//     |
//    | |
//    | |
//    | |
//
//  +--+----
//  +  +----
// o+  +----
//  +--+----
//  +----

class Humanoid {
  position: { [key: string]: THREE.Vector3 };
  tab: { [key: string]: number };

  constructor(public readonly height: number) {
    const hu = new HeadUnit6(height);

    const shoulderOffset = 0.5;
    const fo = 0.02;
    const lo = hu.units(0.5);
    this.position = {
      _head: new THREE.Vector3(0, hu.units(3.0 + 3.0), 0),
      head: new THREE.Vector3(0, hu.units(3.0 + 2.5), 0),
      neck: new THREE.Vector3(0, hu.units(3.0 + 2.0), 0),
      chest: new THREE.Vector3(0, hu.units(3.0 + 4.0 / 3.0), 0),
      spine: new THREE.Vector3(0, hu.units(3.0 + 2.0 / 3.0), 0),
      hips: new THREE.Vector3(0, hu.units(3.0 + 0.0), 0),
      // [legs]
      leftUpperLeg: new THREE.Vector3(lo, hu.units(3.0 + 0.0), 0),
      leftLowerLeg: new THREE.Vector3(lo, hu.units(3.0 + -1.5), 0),
      leftFoot: new THREE.Vector3(lo, hu.units(3.0 + -2.5), 0),
      _leftFoot: new THREE.Vector3(lo, hu.units(3.0 + -3.0), 0),
      rightUpperLeg: new THREE.Vector3(-lo, hu.units(3.0 + 0.0), 0),
      rightLowerLeg: new THREE.Vector3(-lo, hu.units(3.0 + -1.5), 0),
      rightFoot: new THREE.Vector3(-lo, hu.units(3.0 + -2.5), 0),
      _rightFoot: new THREE.Vector3(-lo, hu.units(3.0 + -3.0), 0),
      // [arms]
      leftUpperArm: new THREE.Vector3(hu.units(shoulderOffset + 0.0), hu.units(5.0), 0),
      leftLowerArm: new THREE.Vector3(hu.units(shoulderOffset + 1.0), hu.units(5.0), 0),
      leftHand: new THREE.Vector3(hu.units(shoulderOffset + 2.0), hu.units(5.0), 0),
      _leftHand: new THREE.Vector3(hu.units(shoulderOffset + 2.3), hu.units(5.0), 0),
      rightUpperArm: new THREE.Vector3(-hu.units(shoulderOffset + 0.0), hu.units(5.0), 0),
      rightLowerArm: new THREE.Vector3(-hu.units(shoulderOffset + 1.0), hu.units(5.0), 0),
      rightHand: new THREE.Vector3(-hu.units(shoulderOffset + 2.0), hu.units(5.0), 0),
      _rightHand: new THREE.Vector3(-hu.units(shoulderOffset + 2.3), hu.units(5.0), 0),
      // [left fingers]
      leftThumbMetacarpal: new THREE.Vector3(hu.units(-5 * fo + 0), -fo, 2.5 * fo),
      leftThumbProximal: new THREE.Vector3(hu.units(-5 * fo + 0.2), -fo, 2.5 * fo),
      leftThumbDistal: new THREE.Vector3(hu.units(-5 * fo + 0.3), -fo, 2.5 * fo),
      _leftThumbDistal: new THREE.Vector3(hu.units(-5 * fo + 0.4), -fo, 2.5 * fo),
      leftIndexProximal: new THREE.Vector3(hu.units(0), 0, 1.5 * fo),
      leftIndexIntermediate: new THREE.Vector3(hu.units(0.2), 0, 1.5 * fo),
      leftIndexDistal: new THREE.Vector3(hu.units(0.3), 0, 1.5 * fo),
      _leftIndexDistal: new THREE.Vector3(hu.units(0.4), 0, 1.5 * fo),
      leftMiddleProximal: new THREE.Vector3(hu.units(0), 0, 0.5 * fo),
      leftMiddleIntermediate: new THREE.Vector3(hu.units(0.2), 0, 0.5 * fo),
      leftMiddleDistal: new THREE.Vector3(hu.units(0.3), 0, 0.5 * fo),
      _leftMiddleDistal: new THREE.Vector3(hu.units(0.4), 0, 0.5 * fo),
      leftRingProximal: new THREE.Vector3(hu.units(0), 0, -0.5 * fo),
      leftRingIntermediate: new THREE.Vector3(hu.units(0.2), 0, -0.5 * fo),
      leftRingDistal: new THREE.Vector3(hu.units(0.3), 0, -0.5 * fo),
      _leftRingDistal: new THREE.Vector3(hu.units(0.4), 0, -0.5 * fo),
      leftLittleProximal: new THREE.Vector3(hu.units(0), 0, -1.5 * fo),
      leftLittleIntermediate: new THREE.Vector3(hu.units(0.2), 0, -1.5 * fo),
      leftLittleDistal: new THREE.Vector3(hu.units(0.3), 0, -1.5 * fo),
      _leftLittleDistal: new THREE.Vector3(hu.units(0.4), 0, -1.5 * fo),
      // [right fingers]
      rightThumbMetacarpal: new THREE.Vector3(-hu.units(-5 * fo + 0), -fo, 2.5 * fo),
      rightThumbProximal: new THREE.Vector3(-hu.units(-5 * fo + 0.2), -fo, 2.5 * fo),
      rightThumbDistal: new THREE.Vector3(-hu.units(-5 * fo + 0.3), -fo, 2.5 * fo),
      _rightThumbDistal: new THREE.Vector3(-hu.units(-5 * fo + 0.4), -fo, 2.5 * fo),
      rightIndexProximal: new THREE.Vector3(-hu.units(0), 0, 1.5 * fo),
      rightIndexIntermediate: new THREE.Vector3(-hu.units(0.2), 0, 1.5 * fo),
      rightIndexDistal: new THREE.Vector3(-hu.units(0.3), 0, 1.5 * fo),
      _rightIndexDistal: new THREE.Vector3(-hu.units(0.4), 0, 1.5 * fo),
      rightMiddleProximal: new THREE.Vector3(-hu.units(0), 0, 0.5 * fo),
      rightMiddleIntermediate: new THREE.Vector3(-hu.units(0.2), 0, 0.5 * fo),
      rightMiddleDistal: new THREE.Vector3(-hu.units(0.3), 0, 0.5 * fo),
      _rightMiddleDistal: new THREE.Vector3(-hu.units(0.4), 0, 0.5 * fo),
      rightRingProximal: new THREE.Vector3(-hu.units(0), 0, -0.5 * fo),
      rightRingIntermediate: new THREE.Vector3(-hu.units(0.2), 0, -0.5 * fo),
      rightRingDistal: new THREE.Vector3(-hu.units(0.3), 0, -0.5 * fo),
      _rightRingDistal: new THREE.Vector3(-hu.units(0.4), 0, -0.5 * fo),
      rightLittleProximal: new THREE.Vector3(-hu.units(0), 0, -1.5 * fo),
      rightLittleIntermediate: new THREE.Vector3(-hu.units(0.2), 0, -1.5 * fo),
      rightLittleDistal: new THREE.Vector3(-hu.units(0.3), 0, -1.5 * fo),
      _rightLittleDistal: new THREE.Vector3(-hu.units(0.4), 0, -1.5 * fo),
    };

    this.tab = {
      _head: 0,
      head: 0,
      neck: 0,
      chest: 0,
      spine: 0,
      hips: 0,
      // [legs]
      leftUpperLeg: 1,
      leftLowerLeg: 1,
      leftFoot: 1,
      _leftFoot: 1,
      rightUpperLeg: 1,
      rightLowerLeg: 1,
      rightFoot: 1,
      _rightFoot: 1,
      // [arms]
      leftUpperArm: 2,
      leftLowerArm: 2,
      leftHand: 2,
      _leftHand: 2,
      rightUpperArm: 2,
      rightLowerArm: 2,
      rightHand: 2,
      _rightHand: 2,
      // [left fingers]
      leftThumbMetacarpal: 3,
      leftThumbProximal: 3,
      leftThumbDistal: 3,
      _leftThumb: 3,
      leftIndexProximal: 3,
      leftIndexIntermediate: 3,
      leftIndexDistal: 3,
      _leftIndex: 3,
      leftMiddleProximal: 3,
      leftMiddleIntermediate: 3,
      leftMiddleDistal: 3,
      _leftMiddle: 3,
      leftRingProximal: 3,
      leftRingIntermediate: 3,
      leftRingDistal: 3,
      _leftRing: 3,
      leftLittleProximal: 3,
      leftLittleIntermediate: 3,
      leftLittleDistal: 3,
      _leftLittle: 3,
      // [right fingers]
      rightThumbMetacarpal: 4,
      rightThumbProximal: 4,
      rightThumbDistal: 4,
      _rightThumb: 4,
      rightIndexProximal: 4,
      rightIndexIntermediate: 4,
      rightIndexDistal: 4,
      _rightIndex: 4,
      rightMiddleProximal: 4,
      rightMiddleIntermediate: 4,
      rightMiddleDistal: 4,
      _rightMiddle: 4,
      rightRingProximal: 4,
      rightRingIntermediate: 4,
      rightRingDistal: 4,
      _rightRing: 4,
      rightLittleProximal: 4,
      rightLittleIntermediate: 4,
      rightLittleDistal: 4,
      _rightLittle: 4,
    }
  }

  widthDepth(name: string): [number, number] {
    return [0.1, 0.1]
  }
}

class MeshBuilder {
  indices: number[] = [];
  // per vertex
  positions: THREE.Vector3[] = [];
  // per quad
  normals: THREE.Vector3[] = [];
  // per cube
  skinIndices: number[] = [];

  prefix: string = '';

  constructor(
    public readonly humanoid: Humanoid,
    public readonly tab: TabApi) {
  }

  addQuad(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3) {
    const i = this.positions.length;
    this.positions.push(p0, p1, p2, p3);
    this.indices.push(i + 0, i + 1, i + 2);
    this.indices.push(i + 2, i + 3, i + 0);

    const v01 = new THREE.Vector3(p1.x, p1.y, p1.z).sub(p0);
    const v02 = new THREE.Vector3(p2.x, p2.y, p2.z).sub(p0);
    const n = new THREE.Vector3();
    n.crossVectors(v01, v02);
    this.normals.push(n);
  }

  //  7+-+6
  //  / /|
  //3+-+2+5
  // | |/
  //0+-+1
  //
  // add 24 vertices(vertex normal)
  // add 12 triangles
  addCube(name: string, m: THREE.Matrix4) {
    const positions = [
      // +z
      new THREE.Vector3(-0.5, 0.0, 0.5).applyMatrix4(m),
      new THREE.Vector3(0.5, 0.0, 0.5).applyMatrix4(m),
      new THREE.Vector3(0.5, 1.0, 0.5).applyMatrix4(m),
      new THREE.Vector3(-0.5, 1.0, 0.5).applyMatrix4(m),
      // -z
      new THREE.Vector3(-0.5, 0.0, -0.5).applyMatrix4(m),
      new THREE.Vector3(0.5, 0.0, -0.5).applyMatrix4(m),
      new THREE.Vector3(0.5, 1.0, -0.5).applyMatrix4(m),
      new THREE.Vector3(-0.5, 1.0, -0.5).applyMatrix4(m),
    ];
    const quads = [
      [0, 1, 2, 3],
      [1, 5, 6, 2],
      [5, 4, 7, 6],
      [4, 0, 3, 7],
      [3, 2, 6, 7],
      [1, 0, 4, 5],
    ];
    for (const [i0, i1, i2, i3] of quads) {
      this.addQuad(positions[i0], positions[i1], positions[i2], positions[i3]);
    }
  }

  position(name: string): THREE.Vector3 {
    const pos = this.humanoid.position[name];
    if (!pos) {
      throw `"${name}" not found`;
    }
    return pos;
  }

  getMatrix(head: HumanBone, tail: string): THREE.Matrix4 {
    const mm = new MatrixMaker({});
    const m = mm.makeMatrix(
      this.position(head.name),
      this.position(tail),
      ...head.widthDepth);
    return m;
  }

  traverse(bone: HumanBone) {
    if (bone.children) {
      for (let i = 0; i < bone.children.length; ++i) {
        const child = bone.children[i];
        const childName = child instanceof HumanBone ? child.name : child;
        if (i == 0) {
          const m = this.getMatrix(bone, childName);
          this.addCube(bone.name, m);

          const page = this.humanoid.tab[bone.name]

          // console.log(parent.name, '=>', page);
          this.tab.pages[page].addFolder({ title: bone.name });
        }

        if (child instanceof HumanBone) {
          this.traverse(child);
        }
      }
    }
  }

  build(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setIndex(this.indices);

    const position = new Float32Array(this.positions.map(v => v.toArray()).flat());
    g.setAttribute('position', new THREE.BufferAttribute(position, 3));

    const normal = new Float32Array(this.normals.map(v => [v.toArray(), v.toArray(), v.toArray(), v.toArray()].flat()).flat());
    g.setAttribute('normal', new THREE.BufferAttribute(normal, 3));

    return g;
  }
}

function World() {
  const { scene } = useThree();

  React.useEffect(() => {
    // console.log(container);
    pane = new Pane({
      // container: container!,
      title: "BoxMan",
    });
    const tab = pane.addTab({
      pages: [
        { title: 'body' },
        { title: 'legs' },
        { title: 'arms' },
        { title: 'l-fingers' },
        { title: 'r-fingers' },
      ],
    });

    const builder = new MeshBuilder(new Humanoid(1.6), tab);

    builder.traverse(hierarchy);

    const geometry = builder.build();
    const material = new THREE.MeshStandardMaterial({ color: darkGreen });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

  }, []);

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <directionalLight position={[10, 10, 5]} />
      <OrbitControls makeDefault />
      <Grid cellColor="white" args={[10, 10]} />
    </>
  );
}

export function BoxMan() {
  const ref = React.useRef(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => {
    setContainer(ref.current);
  }, []);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div ref={ref}></div>
      </div>
      <Canvas>
        <World />
      </Canvas>
    </>
  );
}
