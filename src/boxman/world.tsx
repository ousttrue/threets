import React from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { TransformControls } from 'three/addons/controls/TransformControls.js';

const roots: THREE.Object3D[] = [];

export function World({
  root,
  onFrame,
  selected,
  setInvalidate,
}: {
  root?: THREE.Object3D,
  onFrame: Function,
  selected?: THREE.Object3D,
  setInvalidate: Function,
}) {
  useFrame(({ clock }, delta) => {
    onFrame(clock, delta);
  });

  const { scene, camera, gl } = useThree();

  const orbitControlsRef = React.useRef(null);
  const [transControls, setTransControls] = React.useState(null);

  React.useEffect(() => {
    if (selected) {
      if (transControls) {
        transControls.attach(selected);
      }
      else {
        const t = new TransformControls(camera, gl.domElement);
        t.space = 'local';
        t.addEventListener('dragging-changed', event => {
          orbitControlsRef.current.enabled = !event.value;
        });

        let frame = [1];
        t.addEventListener('change', e => {
          ;
          setInvalidate(++frame[0]);
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
      <axesHelper />
      {root ? <primitive object={root} /> : ""}
    </>
  );
}
