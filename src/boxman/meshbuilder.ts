import * as THREE from "three";

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
export const hierarchy = new HumanBone('hips', BODY_AXIS, [
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
export const values = {
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

//
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

export class MeshBuilder {
  hu: HeadUnit6;
  values: { [key: string]: BoneSize };

  indices: number[] = [];
  // per vertex
  positions: THREE.Vector3[] = [];
  // per quad
  normals: THREE.Vector3[] = [];
  // per cube
  skinIndices: number[] = [];
  bones: THREE.Bone[] = [];

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
  addCube(name: string, m: THREE.Matrix4) {
    const boneIndex = this.bones.map(o => o.name).indexOf(name);
    console.assert(boneIndex != -1, 'boneIndex', name);
    this.skinIndices.push(boneIndex);

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
    const t_bone = new THREE.Bone();
    const value = this.getSize(bone.name);
    t_bone.name = bone.name
    this.bones.push(t_bone);

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
    t_bone.applyMatrix4(m);

    m.multiply(s);
    this.addCube(bone.name, m);

    // page
    // const page = getTab(bone.name);
    // this.tab.pages[page].addFolder({ title: bone.name });

    const tail = new THREE.Vector3(0, value.len, 0);
    tail.applyMatrix4(r);
    tail.add(head);

    const inverse = t_bone.matrix.clone();
    inverse.invert();

    for (let i = 0; i < bone.children.length; ++i) {
      const child = bone.children[i];

      let node: THREE.Object3D;
      if (this.getSize(child.name).offset) {
        node = this.traverse(child, head);
      }
      else {
        node = this.traverse(child, tail);
      }

      const d = new THREE.Vector3();
      d.subVectors(node.position, t_bone.position);
      node.position.set(d.x, d.y, d.z);
      node.rotation.set(0, 0, 0);

      // const local = new THREE.Matrix4();
      // local.multiplyMatrices(inverse, node.matrix);
      // node.applyMatrix4(local);

      t_bone.add(node);

      node.updateMatrixWorld();
    }

    return t_bone;
  }

  buildMesh(): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setIndex(this.indices);

    const position = new Float32Array(this.positions.map(v => v.toArray()).flat());
    g.setAttribute('position', new THREE.BufferAttribute(position, 3));

    const normal = new Float32Array(this.normals.map(v => [v.toArray(), v.toArray(), v.toArray(), v.toArray()].flat()).flat());
    g.setAttribute('normal', new THREE.BufferAttribute(normal, 3));

    // skinning
    const skinIndices = new Uint16Array(this.positions.map((_, i) => [i / 24, 0, 0, 0]).flat());
    const skinWeights = new Float32Array(this.positions.map(_ => [1, 0, 0, 0]).flat());
    g.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    return g;
  }

  buildSkeleton(color: number): THREE.Object3D {
    // mesh
    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.SkinnedMesh(this.buildMesh(), material);
    mesh.name = 'mesh'

    mesh.add(this.bones[0]);
    const boneInverses: THREE.Matrix4[] = [];
    for (const bone of this.bones) {
      // mesh.add(bone);
      const i = bone.matrixWorld.clone();
      i.invert();
      // const i = new THREE.Matrix4();
      // i.identity();
      boneInverses.push(i);
    }

    const skeleton = new THREE.Skeleton(this.bones, boneInverses);
    mesh.bind(skeleton);

    return mesh;
  }
}
