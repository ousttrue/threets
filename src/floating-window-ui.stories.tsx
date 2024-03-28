import React from "react";
import Window from "floating-window-ui";
import {
  useListBlade,
  usePaneFolder,
  usePaneInput,
  useSliderBlade,
  useTextBlade,
  useTweakpane,
} from 'react-tweakpane'

export function App() {

  const [config, setConfig] = React.useState({ title: 'Scene Settings', container: undefined });

  const ref = React.useRef();

  React.useEffect(() => {

    setConfig({
      title: config.title,
      container: ref.current,
    });

  }, []);

  const pane = useTweakpane(
    {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#ffa500',
    },
    config,
  )

  return (
    <Window
      id="react-window"
      height={800}
      width={400}
      resizable={true}
      titleBar={{
        icon: "⚛",
        title: "React App Window",
        buttons: { minimize: true, maximize: true },
      }}
    >
      <div>
        <div ref={ref}></div>
        <a href="https://www.npmjs.com/package/floating-window-ui">https://www.npmjs.com/package/floating-window-ui</a>
      </div>
    </Window>
  );
};
