import { atom, useAtom } from "jotai";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export type ViewerAtom = {
  gltf?: GLTF;
  root?: THREE.Object3D;
  selected?: THREE.Object3D;
  selectedMaterial?: THREE.Material;
  // container?: HTMLDivElement;
};
export const viewerAtom = atom<ViewerAtom>({});
