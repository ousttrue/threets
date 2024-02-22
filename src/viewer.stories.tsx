import React from "react";
import { useAtom } from "jotai";
import { viewerAtom, fromGltf } from "./viewer/vieweratom";

import DockLayout, { type LayoutData } from "rc-dock";
import "rc-dock/dist/rc-dock.css";

import OpenButton from "./viewer/openbutton";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";

// const VRM_URL =
//   "https://github.com/vrm-c/vrm-specification/raw/master/samples/Seed-san/vrm/Seed-san.vrm";
const VRM_URL =
  "https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm";

import dockLayout from "./viewer/docklayout";

export const ViewerStory = () => {
  const [_, setViewer] = useAtom(viewerAtom);

  React.useEffect(() => {
    (async () => {
      const res = await fetch(VRM_URL, {
        mode: "cors",
      });
      const buffer = await res.arrayBuffer();

      const loader = new GLTFLoader();
      loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
      });

      const gltf = await loader.parseAsync(buffer, VRM_URL);
      setViewer(fromGltf(gltf));
      console.log("loaded", gltf);
    })();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav style={{ height: "2em" }}>
        <OpenButton />
      </nav>
      <DockLayout defaultLayout={dockLayout} style={{ flexGrow: 1 }} />
    </div>
  );
};
