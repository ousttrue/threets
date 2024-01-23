import React from "react";
import { Pane } from "tweakpane";
import { atom, useAtom } from "jotai";

import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls, Grid } from "@react-three/drei";

const params = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
};
const paramsAtom = atom(params);
let pane: Pane | null = null;

function World({ container }: { container: HTMLDivElement | null }) {
  const [_, setParams] = useAtom(paramsAtom);

  useFrame(() => {
    if (!pane) {
      if (container) {
        pane = new Pane({
          container,
          title: "Parameters",
        });
        pane.addBinding(params, "positionX");
        pane.addBinding(params, "positionY");
        pane.addBinding(params, "positionZ");
      }
    }
    setParams({ ...params });
  });

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <directionalLight position={[10, 10, 5]} />
      <OrbitControls makeDefault />
      <Grid cellColor="white" args={[10, 10]} />

      <Box position={[params.positionX, params.positionY, params.positionZ]} />
    </>
  );
}

export function TweakPaneStory() {
  const ref = React.useRef(null);
  const [params, _] = useAtom(paramsAtom);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => {
    setContainer(ref.current);
  }, []);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div ref={ref}></div>
        <div>
          <div> {params.positionX} </div>
          <div> {params.positionY} </div>
          <div> {params.positionZ} </div>
        </div>
      </div>
      <Canvas>
        <World container={ref.current} />
      </Canvas>
    </>
  );
}
