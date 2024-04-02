import React from "react";
import { Pane } from "tweakpane";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { TransformControls } from 'three/addons/controls/TransformControls.js';

let pane: Pane | null = null;

export function World({ root, selected }: { root?: THREE.Object3D, selected?: THREE.Object3D }) {
  const { scene, camera, gl } = useThree();

  // scene.clear();
  console.log(root);
  if (root) {
    scene.add(root);
  }

  const orbitControlsRef = React.useRef(null);
  const [transControls, setTransControls] = React.useState(null);

  React.useEffect(() => {
    if (selected) {
      pane = new Pane({
        // container: container!,
        title: "BoxMan",
      });
      pane.addBinding(selected, "position")

      if (transControls) {
        transControls.attach(selected);
      }
      else {
        const t = new TransformControls(camera, gl.domElement);
        t.space = 'local';
        t.addEventListener('dragging-changed', event => {
          orbitControlsRef.current.enabled = !event.value;
        });
        scene.add(t);
        setTransControls(t);

        window.addEventListener('keydown', event => {
          switch (event.keyCode) {
            case 87: // W = translate
              t.setMode('translate');
              break;
            case 69: // E = rotate
              t.setMode('rotate');
              break;
            case 82: // R = scale
              t.setMode('scale');
              break;
          }
        });
      }
    }
  }, [selected]);


  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <directionalLight position={[10, 10, 5]} />
      <OrbitControls ref={orbitControlsRef} makeDefault />
      <Grid cellColor="white" args={[10, 10]} />
    </>
  );
}
