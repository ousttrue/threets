import React from "react";
import { atom, useAtom } from "jotai";
import { GUIController } from "./lilgui-controller";

import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls, Grid } from "@react-three/drei";

const gui = GUIController.instance;

type Param = {
  positionX: number;
  positionY: number;
  positionZ: number;
};
const param = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
} satisfies Param;

const paramAtom = atom(param);

function World({ container }: { container: HTMLDivElement | null }) {
  const [_, setParam] = useAtom(paramAtom);

  useFrame(() => {
    if (!container) {
      return;
    }
    // console.log(container, "Hey, I'm executing every frame!");
    gui.initialize(container, (gui: GUIController) => {
      console.log(gui);
      gui.add("box", param, "positionX", -10, 10);
      gui.add("box", param, "positionY", -10, 10);
      gui.add("box", param, "positionZ", -10, 10);
    });
    setParam({ ...param });
  });

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <directionalLight position={[10, 10, 5]} />
      <OrbitControls makeDefault />
      <Grid cellColor="white" args={[10, 10]} />
      <Box position={[param.positionX, param.positionY, param.positionZ]} />
    </>
  );
}

export function LilGuiStory() {
  const [param, _] = useAtom(paramAtom);

  const ref = React.useRef<HTMLDivElement>(null);
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  React.useEffect(() => {
    setContainer(ref.current);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ display: "flex" }}>
        <div ref={ref}></div>
        <div>
          <div>{param.positionX}</div>
          <div>{param.positionY}</div>
          <div>{param.positionZ}</div>
        </div>
      </div>
      <Canvas>
        <World container={container} />
      </Canvas>
    </div>
  );
}
