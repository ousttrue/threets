import { atom, useAtom } from "jotai";

export type ViewerAtom = {
  root?: THREE.Object3D;
  selected?: THREE.Object3D;
  // container?: HTMLDivElement;
};
export const viewerAtom = atom<ViewerAtom>({});
