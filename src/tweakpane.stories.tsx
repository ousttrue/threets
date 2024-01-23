import React from "react";
import { Pane } from "tweakpane";
import * as THREE from "three";

import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

let pane: Pane | null = null;

function World({ container }: { container: HTMLDivElement | null }) {
  const { scene } = useThree();

  React.useEffect(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    console.log(container);
    pane = new Pane({
      container: container!,
      title: "Parameters",
    });
    pane.addBinding(cube, "position");
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

export function TweakPaneStory() {
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
        <World container={ref.current} />
      </Canvas>
    </>
  );
}
