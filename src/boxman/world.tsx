import React from "react";
import { Pane } from "tweakpane";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

let pane: Pane | null = null;

export function World({ root, selected }: { root?: THREE.Object3D, selected?: THREE.Object3D }) {
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
