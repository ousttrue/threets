import React from "react";
import { atom, useAtom } from "jotai";
import { GUIController } from "./lilgui-controller";

import { Canvas, useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";

const gui = GUIController.instance;

type Params = {
  value: number;
};
const paramObj = { value: 0 } satisfies Params;

const paramAtom = atom(paramObj);

function World({ container }: { container: HTMLDivElement | null }) {
  const [_, setParam] = useAtom(paramAtom);

  useFrame(() => {
    if (!container) {
      return;
    }
    // console.log(container, "Hey, I'm executing every frame!");
    gui.initialize(container, (gui: GUIController) => {
      console.log(gui);
      gui.add("folder", paramObj, "value");
    });
    setParam({ ...paramObj });
  });

  return <Box />;
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
      <div ref={ref}></div>
      <div>{param.value}</div>
      <Canvas>
        <World container={container} />
      </Canvas>
    </div>
  );
}
