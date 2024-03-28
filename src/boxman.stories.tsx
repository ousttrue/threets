import React from "react";
import { Pane, TabPageApi } from "tweakpane";
import * as THREE from "three";

import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

let pane: Pane | null = null;

class Joint {
  constructor(public readonly position: THREE.Vector3,) {
  }
};

interface Bone {
  head: string;
  tail: string;
  widthDepth: [number, number];
  color: number,
};

interface Fingers {
  thumb: Bone[];
  index: Bone[];
  middle: Bone[];
  ring: Bone[];
  little: Bone[];
};

interface Skeleton {
  joints: { [name: string]: Joint };
  body: Bone[];
  arms: Bone[];
  legs: Bone[];
  fingers: Fingers;
};

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
  value(unit: number) {
    return this.unit * unit;
  }
};

const darkGreen = 0x009900;
const darkYellow = 0x999900;
const red = 0x990000;
const darkRed = 0x990000;

class HumanBone {
  constructor(
    public name: string,
    public children?: HumanBone[]) { }
}

//
// connect first child.
//
// body(5): hips-spine-chest-neck-head
// legs(3x2): upper-lower-foot
// arms(3x2): upper-lower-hand
// fingers(3x5x2): shoulder-upper-lower-hand
const hierarchy = new HumanBone('hips', [
  new HumanBone('spine', [
    new HumanBone('chest', [
      new HumanBone('neck', [
        new HumanBone('head')]),
      new HumanBone('leftUpperArm', [
        new HumanBone('leftLowerArm', [
          new HumanBone('leftHand', [
            new HumanBone('leftMiddleProximal', [
              new HumanBone('leftMiddleIntermediate', [
                new HumanBone('leftMiddleDistal')]),]),
            new HumanBone('leftIndexProximal', [
              new HumanBone('leftIndexIntermediate', [
                new HumanBone('leftIndexDistal')]),]),
            new HumanBone('leftRingProximal', [
              new HumanBone('leftRingIntermediate', [
                new HumanBone('leftRingDistal')]),]),
            new HumanBone('leftLittleProximal', [
              new HumanBone('leftLittleIntermediate', [
                new HumanBone('leftLittleDistal')]),]),
            new HumanBone('leftThumbMetacarpal', [
              new HumanBone('leftThumbProximal', [
                new HumanBone('leftThumbDistal')])])])])]),
      new HumanBone('rightUpperArm', [
        new HumanBone('rightLowerArm', [
          new HumanBone('rightHand', [
            new HumanBone('rightMiddleProximal', [
              new HumanBone('rightMiddleIntermediate', [
                new HumanBone('rightMiddleDistal')]),]),
            new HumanBone('rightIndexProximal', [
              new HumanBone('rightIndexIntermediate', [
                new HumanBone('rightIndexDistal')]),]),
            new HumanBone('rightRingProximal', [
              new HumanBone('rightRingIntermediate', [
                new HumanBone('rightRingDistal')]),]),
            new HumanBone('rightLittleProximal', [
              new HumanBone('rightLittleIntermediate', [
                new HumanBone('rightLittleDistal')]),]),
            new HumanBone('rightThumbMetacarpal', [
              new HumanBone('rightThumbProximal', [
                new HumanBone('rightThumbDistal')])])])])])])]),
  new HumanBone('leftUpperLeg', [
    new HumanBone('leftLowerLeg', [
      new HumanBone('leftFoot')])]),
  new HumanBone('rightUpperLeg', [
    new HumanBone('rightLowerLeg', [
      new HumanBone('rightFoot')])]),
]);

//     [+Y]up
//       A
//       |
//right  |   left
//[-X]<--o-->[+X]
//      /
//     L
//   [+Z]front

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
function makeSkeleton(height = 1.6): Skeleton {

  const hu = new HeadUnit6(height);

  const shoulderOffset = 0.5;
  const fo = 0.02;
  const joints: { [name: string]: Joint } = {
    _head: new Joint(new THREE.Vector3(0, hu.value(3.0 + 3.0), 0)),
    head: new Joint(new THREE.Vector3(0, hu.value(3.0 + 2.5), 0)),
    neck: new Joint(new THREE.Vector3(0, hu.value(3.0 + 2.0), 0)),
    chest: new Joint(new THREE.Vector3(0, hu.value(3.0 + 4.0 / 3.0), 0)),
    spine: new Joint(new THREE.Vector3(0, hu.value(3.0 + 2.0 / 3.0), 0)),
    hips: new Joint(new THREE.Vector3(0, hu.value(3.0 + 0.0), 0)),
    //
    upperLeg: new Joint(new THREE.Vector3(0, hu.value(3.0 + 0.0), 0)),
    lowerLeg: new Joint(new THREE.Vector3(0, hu.value(3.0 + -1.5), 0)),
    foot: new Joint(new THREE.Vector3(0, hu.value(3.0 + -2.5), 0)),
    _foot: new Joint(new THREE.Vector3(0, hu.value(3.0 + -3.0), 0)),
    //
    upperArm: new Joint(new THREE.Vector3(hu.value(shoulderOffset + 0.0), hu.value(5.0), 0)),
    lowerArm: new Joint(new THREE.Vector3(hu.value(shoulderOffset + 1.0), hu.value(5.0), 0)),
    hand: new Joint(new THREE.Vector3(hu.value(shoulderOffset + 2.0), hu.value(5.0), 0)),
    _hand: new Joint(new THREE.Vector3(hu.value(shoulderOffset + 2.3), hu.value(5.0), 0)),
    //
    thumbProximal: new Joint(new THREE.Vector3(hu.value(-5 * fo + 0), -fo, 2.5 * fo)),
    thumbIntermediate: new Joint(new THREE.Vector3(hu.value(-5 * fo + 0.2), -fo, 2.5 * fo)),
    thumbDistal: new Joint(new THREE.Vector3(hu.value(-5 * fo + 0.3), -fo, 2.5 * fo)),
    _thumb: new Joint(new THREE.Vector3(hu.value(-5 * fo + 0.4), -fo, 2.5 * fo)),

    indexProximal: new Joint(new THREE.Vector3(hu.value(0), 0, 1.5 * fo)),
    indexIntermediate: new Joint(new THREE.Vector3(hu.value(0.2), 0, 1.5 * fo)),
    indexDistal: new Joint(new THREE.Vector3(hu.value(0.3), 0, 1.5 * fo)),
    _index: new Joint(new THREE.Vector3(hu.value(0.4), 0, 1.5 * fo)),

    middleProximal: new Joint(new THREE.Vector3(hu.value(0), 0, 0.5 * fo)),
    middleIntermediate: new Joint(new THREE.Vector3(hu.value(0.2), 0, 0.5 * fo)),
    middleDistal: new Joint(new THREE.Vector3(hu.value(0.3), 0, 0.5 * fo)),
    _middle: new Joint(new THREE.Vector3(hu.value(0.4), 0, 0.5 * fo)),

    ringProximal: new Joint(new THREE.Vector3(hu.value(0), 0, -0.5 * fo)),
    ringIntermediate: new Joint(new THREE.Vector3(hu.value(0.2), 0, -0.5 * fo)),
    ringDistal: new Joint(new THREE.Vector3(hu.value(0.3), 0, -0.5 * fo)),
    _ring: new Joint(new THREE.Vector3(hu.value(0.4), 0, -0.5 * fo)),

    littleProximal: new Joint(new THREE.Vector3(hu.value(0), 0, -1.5 * fo)),
    littleIntermediate: new Joint(new THREE.Vector3(hu.value(0.2), 0, -1.5 * fo)),
    littleDistal: new Joint(new THREE.Vector3(hu.value(0.3), 0, -1.5 * fo)),
    _little: new Joint(new THREE.Vector3(hu.value(0.4), 0, -1.5 * fo)),
  };

  const body: Bone[] = [
    { head: "head", tail: "_head", widthDepth: [0.2, 0.2], color: darkGreen },
    { head: "neck", tail: "head", widthDepth: [0.1, 0.1], color: darkYellow },
    { head: "chest", tail: "neck", widthDepth: [0.1, 0.1], color: darkGreen },
    { head: "spine", tail: "chest", widthDepth: [0.1, 0.1], color: darkYellow },
    { head: "hips", tail: "spine", widthDepth: [0.1, 0.1], color: darkGreen },
  ];

  const arms: Bone[] = [
    { head: "upperArm", tail: "lowerArm", widthDepth: [0.05, 0.05], color: darkGreen },
    { head: "lowerArm", tail: "hand", widthDepth: [0.05, 0.05], color: darkYellow },
    { head: "hand", tail: "_hand", widthDepth: [0.05, 0.02], color: darkGreen },
  ];

  const legs: Bone[] = [
    { head: "upperLeg", tail: "lowerLeg", widthDepth: [0.1, 0.1], color: darkGreen },
    { head: "lowerLeg", tail: "foot", widthDepth: [0.1, 0.1], color: darkYellow },
    { head: "foot", tail: "_foot", widthDepth: [0.1, 0.1], color: darkGreen },
  ];

  const fingers: Fingers = {
    thumb: [
      { head: "thumbProximal", tail: "thumbIntermediate", widthDepth: [0.01, 0.01], color: darkRed },
      { head: "thumbIntermediate", tail: "thumbDistal", widthDepth: [0.01, 0.01], color: darkYellow },
      { head: "thumbDistal", tail: "_thumb", widthDepth: [0.01, 0.01], color: darkRed },
    ],
    index: [
      { head: "indexProximal", tail: "indexIntermediate", widthDepth: [0.01, 0.01], color: darkRed },
      { head: "indexIntermediate", tail: "indexDistal", widthDepth: [0.01, 0.01], color: darkYellow },
      { head: "indexDistal", tail: "_index", widthDepth: [0.01, 0.01], color: darkRed },
    ],
    middle: [
      { head: "middleProximal", tail: "middleIntermediate", widthDepth: [0.01, 0.01], color: darkRed },
      { head: "middleIntermediate", tail: "middleDistal", widthDepth: [0.01, 0.01], color: darkYellow },
      { head: "middleDistal", tail: "_middle", widthDepth: [0.01, 0.01], color: darkRed },
    ],
    ring: [
      { head: "ringProximal", tail: "ringIntermediate", widthDepth: [0.01, 0.01], color: darkRed },
      { head: "ringIntermediate", tail: "ringDistal", widthDepth: [0.01, 0.01], color: darkYellow },
      { head: "ringDistal", tail: "_ring", widthDepth: [0.01, 0.01], color: darkRed },
    ],
    little: [
      { head: "littleProximal", tail: "littleIntermediate", widthDepth: [0.01, 0.01], color: darkRed },
      { head: "littleIntermediate", tail: "littleDistal", widthDepth: [0.01, 0.01], color: darkYellow },
      { head: "littleDistal", tail: "_little", widthDepth: [0.01, 0.01], color: darkRed },
    ],
  };

  return { joints, body, arms, legs, fingers };
}

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

function makeFinger(builder: MeshBuilder, mod, joints: { [key: string]: Joint }, fingers: Fingers) {
  for (const bone of fingers.thumb) {
    const mm = new MatrixMaker({ isHand: true, offset: joints["_hand"].position, mod });
    builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
  }
  for (const bone of fingers.index) {
    const mm = new MatrixMaker({ isHand: true, offset: joints["_hand"].position, mod });
    builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
  }
  for (const bone of fingers.middle) {
    const mm = new MatrixMaker({ isHand: true, offset: joints["_hand"].position, mod });
    builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
  }
  for (const bone of fingers.ring) {
    const mm = new MatrixMaker({ isHand: true, offset: joints["_hand"].position, mod });
    builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
  }
  for (const bone of fingers.little) {
    const mm = new MatrixMaker({ isHand: true, offset: joints["_hand"].position, mod });
    builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
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

  tab: TabPageApi | null = null;
  prefix: string = '';

  constructor() {
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
    this.tab.addFolder({ title: `${this.prefix}${name}` });

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

    const { joints, body, legs, arms, fingers } = makeSkeleton();
    console.log(joints);

    // function addGroup(group: THREE.Object3D, bone) {
    //   scene.add(group);
    //   // pane.addFolder({ title: bone.head });
    //   // pane.addBinding(group, "position");
    // }

    const builder = new MeshBuilder(pane);

    builder.tab = tab.pages[0];
    for (const bone of body) {
      const mm = new MatrixMaker({});
      builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
    }

    // leg
    builder.tab = tab.pages[1];
    const legOffset = 0.1;
    // left[+X]
    for (const bone of legs) {
      builder.prefix = '[L]';
      const mm = new MatrixMaker({ mod: p => new THREE.Vector3(p.x + legOffset, p.y, p.z) });
      builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
    }
    // right[-X]
    for (const bone of legs) {
      builder.prefix = '[R]';
      const mm = new MatrixMaker({ mod: p => new THREE.Vector3(p.x - legOffset, p.y, p.z) });
      builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
    }

    // arm
    builder.tab = tab.pages[2];
    // left[+X]
    for (const bone of arms) {
      builder.prefix = '[L]';
      const mm = new MatrixMaker({ isHand: true });
      builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
    }
    // right[-X]
    for (const bone of arms) {
      builder.prefix = '[R]';
      const mm = new MatrixMaker({ isHand: true, mod: p => new THREE.Vector3(-p.x, p.y, p.z) });
      builder.addCube(bone.head, mm.makeMatrix(joints[bone.head].position, joints[bone.tail].position, ...bone.widthDepth));
    }
    builder.tab = tab.pages[3];
    builder.prefix = '[L]';
    makeFinger(builder, undefined, joints, fingers);

    builder.tab = tab.pages[4];
    builder.prefix = '[R]';
    makeFinger(builder, p => new THREE.Vector3(-p.x, p.y, p.z), joints, fingers);

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
