import { atom } from "jotai";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRM } from "@pixiv/three-vrm";

export type ViewerAtom = {
  gltf?: GLTF;
  vrm?: VRM;
  root?: THREE.Object3D;
  selected?: THREE.Object3D;
  selectedMaterial?: THREE.Material;
  selectedExpression?: any;
  // container?: HTMLDivElement;
};
export function fromGltf(gltf?: GLTF): ViewerAtom {
  if (!gltf) {
    return;
  }
  // console.log(gltf);
  return {
    gltf,
    vrm: gltf.userData.vrm,
    root: gltf.scene,
  };
}
export const viewerAtom = atom<ViewerAtom>({});
