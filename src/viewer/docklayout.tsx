import React from "react";
import { type LayoutData } from "rc-dock";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import NodeInspector from "./nodeinspector";
import World from "./world";
import SceneTree from "./nodehierarchy";
import MaterialList from "./materiallist";
import MaterialInspector from "./materialinspector";

export default {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        mode: "vertical",
        children: [
          {
            tabs: [
              {
                id: "nodeHierarchy",
                title: "nodeHierarchy",
                content: <SceneTree />,
              },
            ],
          },
          {
            tabs: [
              {
                id: "nodeInspector",
                title: "nodeInspector",
                content: <NodeInspector />,
              },
            ],
          },
        ],
      },
      {
        tabs: [
          {
            id: "scene",
            title: "scene",
            // not propagate ?
            content: (
              <Canvas
                camera={{
                  fov: 60,
                  near: 0.1,
                  far: 1000,
                  position: [0, 1.6, 4],
                }}
              >
                <OrbitControls makeDefault />
                <World />
              </Canvas>
            ),
          },
        ],
      },
      {
        mode: "vertical",
        children: [
          {
            tabs: [
              {
                id: "materialList",
                title: "materialList",
                content: <MaterialList />,
              },
            ],
          },
          {
            tabs: [
              {
                id: "maetrialInspector",
                title: "materialInspector",
                content: <MaterialInspector />,
              },
            ],
          },
        ],
      },
    ],
  },
} satisfies LayoutData;
