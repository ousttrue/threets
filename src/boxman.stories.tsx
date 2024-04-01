import React from "react";
import { Pane, TabApi } from "tweakpane";
import * as THREE from "three";

import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

import Split from 'react-split';
import './split.css';

import "react-complex-tree/lib/style-modern.css";
import { shortTree } from "./demodata";

import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  TreeDataProvider,
  Tree,
  Disposable,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";

class NodeItem {
  constructor(
    public readonly o: THREE.Object3D,
    public readonly index: number
  ) { }

  get name(): string {
    let prefix = this.o.children && this.o.children.length ? "📁" : "📄";
    if (this.o instanceof THREE.Mesh) {
      prefix = "📦";
    }
    if (this.o.name) {
      return `${prefix}${this.o.name}`;
    } else {
      return `${prefix}${this.index}`;
    }
  }
}


let pane: Pane | null = null;

const darkGreen = 0x009900;
const darkYellow = 0x999900;
const red = 0x990000;
const darkRed = 0x990000;
const fingerSize: [number, number] = [0.1, 0.1];

type Coords = [THREE.Vector3, THREE.Vector3];
class HumanBone {
  constructor(
    public name: string,
    public yz: Coords,
    public children: HumanBone[],
  ) { }

  rotation(): THREE.Matrix4 {
    const [y, z] = this.yz;
    const x = new THREE.Vector3();
    x.crossVectors(y, z);
    const m = new THREE.Matrix4();
    m.makeBasis(x, y, z);
    return m;
  }
}

//     [+Y]up
//       A
//       |
//right  |   left
//[-X]<--o-->[+X]
//      /
//     L
//   [+Z]forward

const LEFT = new THREE.Vector3(1, 0, 0);
const RIGHT = new THREE.Vector3(-1, 0, 0);
const UP = new THREE.Vector3(0, 1, 0);
const DOWN = new THREE.Vector3(0, -1, 0);
const FORWARD = new THREE.Vector3(0, 0, 1);
const BACK = new THREE.Vector3(0, 0, -1);

// Y is tail dir
// Z is bend dir
//
//   o child tail
// Z | Y
//  \|/
//   o--> X
//  /
// /
//o head
//
const BODY_AXIS = [UP, FORWARD] as Coords;
const LEG_AXIS = [DOWN, BACK] as Coords;
const LEFT_ARM_AXIS = [LEFT, FORWARD] as Coords;
const LEFT_HAND_AXIS = [LEFT, DOWN] as Coords;
const RIGHT_ARM_AXIS = [RIGHT, FORWARD] as Coords;
const RIGHT_HAND_AXIS = [RIGHT, DOWN] as Coords;

// connect first child.
//
// body(5): hips-spine-chest-neck-head
// legs(3x2): upper-lower-foot
// arms(3x2): upper-lower-hand
// fingers(3x5x2): shoulder-upper-lower-hand
const hierarchy = new HumanBone('hips', BODY_AXIS, [
  new HumanBone('spine', BODY_AXIS, [
    new HumanBone('chest', BODY_AXIS, [
      new HumanBone('neck', BODY_AXIS, [
        new HumanBone('head', BODY_AXIS, [
          new HumanBone('face', [FORWARD, DOWN], [])
        ])]),
      new HumanBone('leftShoulder', LEFT_HAND_AXIS, [
        new HumanBone('leftUpperArm', LEFT_ARM_AXIS, [
          new HumanBone('leftLowerArm', LEFT_ARM_AXIS, [
            new HumanBone('leftHand', LEFT_HAND_AXIS, [
              new HumanBone('leftMiddleProximal', LEFT_HAND_AXIS, [
                new HumanBone('leftMiddleIntermediate', LEFT_HAND_AXIS, [
                  new HumanBone('leftMiddleDistal', LEFT_HAND_AXIS, [])])]),
              new HumanBone('leftIndexProximal', LEFT_HAND_AXIS, [
                new HumanBone('leftIndexIntermediate', LEFT_HAND_AXIS, [
                  new HumanBone('leftIndexDistal', LEFT_HAND_AXIS, [])])]),
              new HumanBone('leftRingProximal', LEFT_HAND_AXIS, [
                new HumanBone('leftRingIntermediate', LEFT_HAND_AXIS, [
                  new HumanBone('leftRingDistal', LEFT_HAND_AXIS, [])])]),
              new HumanBone('leftLittleProximal', LEFT_HAND_AXIS, [
                new HumanBone('leftLittleIntermediate', LEFT_HAND_AXIS, [
                  new HumanBone('leftLittleDistal', LEFT_HAND_AXIS, [])])]),
              new HumanBone('leftThumbMetacarpal', LEFT_HAND_AXIS, [
                new HumanBone('leftThumbProximal', LEFT_HAND_AXIS, [
                  new HumanBone('leftThumbDistal', LEFT_HAND_AXIS, [])])])])])])]),
      new HumanBone('rightShoulder', RIGHT_ARM_AXIS, [
        new HumanBone('rightUpperArm', RIGHT_ARM_AXIS, [
          new HumanBone('rightLowerArm', RIGHT_ARM_AXIS, [
            new HumanBone('rightHand', RIGHT_HAND_AXIS, [
              new HumanBone('rightMiddleProximal', RIGHT_HAND_AXIS, [
                new HumanBone('rightMiddleIntermediate', RIGHT_HAND_AXIS, [
                  new HumanBone('rightMiddleDistal', RIGHT_HAND_AXIS, [])])]),
              new HumanBone('rightIndexProximal', RIGHT_HAND_AXIS, [
                new HumanBone('rightIndexIntermediate', RIGHT_HAND_AXIS, [
                  new HumanBone('rightIndexDistal', RIGHT_HAND_AXIS, [])])]),
              new HumanBone('rightRingProximal', RIGHT_HAND_AXIS, [
                new HumanBone('rightRingIntermediate', RIGHT_HAND_AXIS, [
                  new HumanBone('rightRingDistal', RIGHT_HAND_AXIS, [])])]),
              new HumanBone('rightLittleProximal', RIGHT_HAND_AXIS, [
                new HumanBone('rightLittleIntermediate', RIGHT_HAND_AXIS, [
                  new HumanBone('rightLittleDistal', RIGHT_HAND_AXIS, [])])]),
              new HumanBone('rightThumbMetacarpal', RIGHT_HAND_AXIS, [
                new HumanBone('rightThumbProximal', RIGHT_HAND_AXIS, [
                  new HumanBone('rightThumbDistal', RIGHT_HAND_AXIS, [])])])])])])])])]),
  new HumanBone('leftUpperLeg', LEG_AXIS, [
    new HumanBone('leftLowerLeg', LEG_AXIS, [
      new HumanBone('leftFoot', LEG_AXIS, [])])]),
  new HumanBone('rightUpperLeg', LEG_AXIS, [
    new HumanBone('rightLowerLeg', LEG_AXIS, [
      new HumanBone('rightFoot', LEG_AXIS, [])])]),
]);

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
//  1/2 1/4 8/1 8/1 = 1
//  +--+----
//  +  +----
// o+  +----
//  +--+----
//  +----
//

class BoneSize {
  constructor(
    // Y
    public readonly len: number,
    // XZ
    public readonly size: { x: number, z?: number },
    // for not connected bones(upperLeg, shoulder ... etc)
    public readonly offset?: THREE.Vector3,
  ) { }

  scale(): THREE.Matrix4 {
    let { x, z } = this.size;
    if (z == undefined) {
      z = x;
    }
    const m = new THREE.Matrix4();
    m.makeScale(x, this.len, z);
    return m;
  }

  multiply(s: number): BoneSize {
    const size = this.size;
    size.x *= s;
    if (size.z) {
      size.z *= s;
    }
    let offset = this.offset;
    if (offset) {
      offset.x *= s;
      offset.y *= s;
      offset.z *= s;
    }
    return new BoneSize(this.len * s, size, offset);
  }
};

const fs = { x: 0.08 };
const values = {
  hips: new BoneSize(2.0 / 3.0, { x: 1.0, z: 0.5 }),
  spine: new BoneSize(2.0 / 3.0, { x: 0.8, z: 0.5 }),
  chest: new BoneSize(2.0 / 3.0, { x: 0.9, z: 0.5 }),
  neck: new BoneSize(1.0 / 2.0, { x: 0.3 }),
  head: new BoneSize(1.0 / 2.0, { x: 0.7 }),
  face: new BoneSize(0.2, { x: 0.7, z: 0.8 }, new THREE.Vector3(0, 0.07, 0.2)),
  // [legs]
  UpperLeg: new BoneSize(1.5, { x: 0.2 }, new THREE.Vector3(0.5, 0, 0)),
  LowerLeg: new BoneSize(1.0, { x: 0.2 }),
  Foot: new BoneSize(0.5, { x: 0.2 }),
  // [arms]
  Shoulder: new BoneSize(0.2, { x: 0.2 }, new THREE.Vector3(0.5, 2.0 / 3.0, 0)),
  UpperArm: new BoneSize(1, { x: 0.2 }),
  LowerArm: new BoneSize(1, { x: 0.2 }),
  Hand: new BoneSize(1.0 / 2.0, { x: 0.3, z: 0.05 }),
  // [fingers]
  ThumbMetacarpal: new BoneSize(1.0 / 4.0, fs, new THREE.Vector3(1.0 / 2.0 - 0.1, -0.1, 0.2)),
  ThumbProximal: new BoneSize(1.0 / 8.0, fs),
  ThumbDistal: new BoneSize(1.0 / 8.0, fs),
  IndexProximal: new BoneSize(1.0 / 4.0, fs, new THREE.Vector3(1.0 / 2.0, 0, 0.1)),
  IndexIntermediate: new BoneSize(1.0 / 8.0, fs),
  IndexDistal: new BoneSize(1.0 / 8.0, fs),
  MiddleProximal: new BoneSize(1.0 / 4.0, fs),
  MiddleIntermediate: new BoneSize(1.0 / 8.0, fs),
  MiddleDistal: new BoneSize(1.0 / 8.0, fs),
  RingProximal: new BoneSize(1.0 / 4.0, fs, new THREE.Vector3(1.0 / 2.0, 0, -0.1)),
  RingIntermediate: new BoneSize(1.0 / 8.0, fs),
  RingDistal: new BoneSize(1.0 / 8.0, fs),
  LittleProximal: new BoneSize(1.0 / 4.0, fs, new THREE.Vector3(1.0 / 2.0, 0, -0.2)),
  LittleIntermediate: new BoneSize(1.0 / 8.0, fs),
  LittleDistal: new BoneSize(1.0 / 8.0, fs),
} as { [key: string]: BoneSize };

const tabs: string[][] = [
  ['face', 'head', 'neck', 'chest', 'spine', 'hips',],
  ['leftUpperLeg', 'leftLowerLeg', 'leftFoot', '_leftFoot', 'rightUpperLeg', 'rightLowerLeg', 'rightFoot', '_rightFoot',],
  ['leftShoulder', 'leftUpperArm', 'leftLowerArm', 'leftHand', '_leftHand', 'rightShoulder', 'rightUpperArm', 'rightLowerArm', 'rightHand', '_rightHand',],
  ['leftThumbMetacarpal', 'leftThumbProximal', 'leftThumbDistal', '_leftThumb', 'leftIndexProximal', 'leftIndexIntermediate', 'leftIndexDistal', '_leftIndex', 'leftMiddleProximal', 'leftMiddleIntermediate', 'leftMiddleDistal', '_leftMiddle', 'leftRingProximal', 'leftRingIntermediate', 'leftRingDistal', '_leftRing', 'leftLittleProximal', 'leftLittleIntermediate', 'leftLittleDistal', '_leftLittle',],
  ['rightThumbMetacarpal', 'rightThumbProximal', 'rightThumbDistal', '_rightThumb', 'rightIndexProximal', 'rightIndexIntermediate', 'rightIndexDistal', '_rightIndex', 'rightMiddleProximal', 'rightMiddleIntermediate', 'rightMiddleDistal', '_rightMiddle', 'rightRingProximal', 'rightRingIntermediate', 'rightRingDistal', '_rightRing', 'rightLittleProximal', 'rightLittleIntermediate', 'rightLittleDistal', '_rightLittle',],
];
function getTab(name: string) {
  for (let i = 0; i < tabs.length; ++i) {
    if (tabs[i].indexOf(name) != -1) {
      return i;
    }
  }
}

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

//     o
//o----|----o
//     |
//    | |
//    | |
//    | |
//

class MeshBuilder {
  hu: HeadUnit6;
  values: { [key: string]: BoneSize };

  indices: number[] = [];
  // per vertex
  positions: THREE.Vector3[] = [];
  // per quad
  normals: THREE.Vector3[] = [];
  // per cube
  skinIndices: number[] = [];

  prefix: string = '';

  constructor(
    height: number,
    values: { [key: string]: BoneSize }
  ) {

    this.values = {};
    this.hu = new HeadUnit6(height);
    for (const key in values) {
      const value = values[key];
      this.values[key] = value.multiply(this.hu.units(1));
    }
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
  addCube(m: THREE.Matrix4) {
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

  getSize(name: string): BoneSize {
    if (name.startsWith("left")) {
      return this.values[name.substring(4)];
    }
    else if (name.startsWith("right")) {
      return this.values[name.substring(5)];
    }
    else {
      return this.values[name];
    }
  }

  traverse(bone: HumanBone, parent?: THREE.Vector3): THREE.Object3D {
    const group = new THREE.Group();
    const value = this.getSize(bone.name);
    group.name = bone.name

    // head
    const head =
      (parent)
        ? new THREE.Vector3(parent.x, parent.y, parent.z)
        : new THREE.Vector3(0, this.hu.units(3), 0)
      ;
    if (value.offset) {
      if (bone.name.startsWith("right")) {
        head.add(new THREE.Vector3(-value.offset.x, value.offset.y, value.offset.z));
      }
      else {
        head.add(value.offset);
      }
    }
    // console.log(bone.name, head);

    // TRS
    const m = new THREE.Matrix4();
    const t = new THREE.Matrix4();
    t.makeTranslation(head);
    const r = bone.rotation()
    const s = value.scale();
    m.multiplyMatrices(t, r);

    group.applyMatrix4(m);

    m.multiply(s);
    this.addCube(m);

    // page
    // const page = getTab(bone.name);
    // this.tab.pages[page].addFolder({ title: bone.name });

    const tail = new THREE.Vector3(0, value.len, 0);
    tail.applyMatrix4(r);
    tail.add(head);
    for (let i = 0; i < bone.children.length; ++i) {
      const child = bone.children[i];
      if (this.getSize(child.name).offset) {
        const node = this.traverse(child, head);
        group.add(node);
      }
      else {
        const node = this.traverse(child, tail);
        group.add(node);
      }
    }

    return group;
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

function World({ root, selected }: { root?: THREE.Object3D, selected?: THREE.Object3D }) {
  const { scene } = useThree();

  // scene.clear();
  console.log(root);
  if (root) {
    scene.add(root);
  }

  const { invalidate } = useThree()

  React.useEffect(() => {
    if (selected) {
      pane = new Pane({
        // container: container!,
        title: "BoxMan",
      });
      pane.addBinding(selected, "position")
      // pane.on('change', (ev) => {
      //   console.log('changed: ' + JSON.stringify(ev.value));
      //   // setFrame(frame + 1);
      //   invalidate();
      // });
    }
  }, [selected]);


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

class Object3DProvider implements TreeDataProvider {
  map: Map<TreeItemIndex, TreeItem<NodeItem>> = new Map();
  constructor(public readonly root?: THREE.Object3D) {
    const traverse = (o: THREE.Object3D) => {
      const item = {
        index: o.id,
        data: new NodeItem(o, this.map.size),
        children: o.children.map((child) => child.id),
        isFolder: o.children.length > 0,
      } satisfies TreeItem<NodeItem>;
      this.map.set(o.id, item);
      // console.log("add", o);
      for (const child of o.children) {
        traverse(child);
      }
    };
    if (root) {
      traverse(root);
    }
  }

  async getTreeItem(itemId: TreeItemIndex) {
    if (itemId == "empty") {
      // @ts-ignore
      return {
        index: "empty",
        data: { name: "empty" },
      };
    }

    if (itemId == "root") {
      return {
        index: "root",
        data: { name: "root" },
        // @ts-ignore
        children: [this.root.id],
      };
    }

    const item = this.map.get(itemId)!;
    return item;
  }
}


export function SceneTree(props: { root: THREE.Object3D, setSelected: Function }) {
  // const [viewer, setViewer] = useAtom(viewerAtom);

  const [provider, setProvider] = React.useState<Object3DProvider | null>(null);

  if (!provider || provider.root != props.root) {
    setProvider(new Object3DProvider(props.root));
  }

  return (
    <UncontrolledTreeEnvironment<THREE.Object3D>
      disableMultiselect
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      // @ts-ignore
      dataProvider={provider ?? new StaticTreeDataProvider([])}
      getItemTitle={(item) => {
        // console.log("getItemTitle", item);
        return item.data.name;
      }}
      viewState={{
        "tree-1": {},
      }}
      onSelectItems={(items: TreeItemIndex[], treeId: string) => {
        console.log("onSelectItems", treeId, provider?.map.get(items[0])?.data.o);
        props.setSelected(provider?.map.get(items[0])?.data.o);
        // setViewer({
        //   ...viewer,
        //   selected: provider?.map.get(items[0])?.data.o,
        // });
      }}
    >
      <Tree
        treeId="tree-1"
        rootItem={props.root ? "root" : "empty"}
        treeLabel="Three.js scene"
      />
    </UncontrolledTreeEnvironment>
  );
}

export function BoxMan() {
  const ref = React.useRef(null);
  // const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  // React.useEffect(() => {
  //   setContainer(ref.current);
  // }, []);

  const [root, setRoot] = React.useState<THREE.Object3D>(null);
  const [selected, setSelected] = React.useState<THREE.Object3D>(null);
  // const [frame, setFrame] = React.useState(1);

  React.useEffect(() => {
    // console.log(container);
    // const tab = pane.addTab({
    //   pages: [
    //     { title: 'body' },
    //     { title: 'legs' },
    //     { title: 'arms' },
    //     { title: 'l-fingers' },
    //     { title: 'r-fingers' },
    //     { title: 'selected' },
    //   ],
    // });

    const root = new THREE.Group();
    root.name = '__root__';

    const builder = new MeshBuilder(1.6, values);
    const hips = builder.traverse(hierarchy);
    root.add(hips);

    const geometry = builder.build();
    const material = new THREE.MeshStandardMaterial({ color: darkGreen });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'mesh'
    root.add(mesh);

    setRoot(root);

  }, []);

  return (
    <Split
      className="split"
      style={{ height: '100%' }}
    >
      <div>
        <SceneTree root={root} setSelected={setSelected} />
      </div>

      <div>
        <div style={{ display: "flex" }}>
          <div ref={ref}></div>
        </div>
        <Canvas>
          <World root={root} selected={selected} />
        </Canvas>
      </div>
    </Split>
  );
}

