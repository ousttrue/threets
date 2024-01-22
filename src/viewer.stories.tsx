import React from "react";

import DockLayout, { type LayoutData } from "rc-dock";
import "rc-dock/dist/rc-dock.css";

import "react-complex-tree/lib/style-modern.css";
import { shortTree } from "./demodata";
import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  Tree,
} from "react-complex-tree";

import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";

const DreiBoxStory = () => (
  <Canvas>
    <Box />
  </Canvas>
);

const TreeStory = () => (
  <UncontrolledTreeEnvironment<string>
    canDragAndDrop
    canDropOnFolder
    canReorderItems
    dataProvider={
      new StaticTreeDataProvider(shortTree.items, (item, data) => ({
        ...item,
        data,
      }))
    }
    getItemTitle={(item) => item.data}
    viewState={{
      "tree-1": {},
    }}
  >
    <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
  </UncontrolledTreeEnvironment>
);

const defaultLayout: LayoutData = {
  dockbox: {
    mode: "horizontal",
    children: [
      {
        tabs: [{ id: "tree", title: "tree", content: <TreeStory /> }],
      },
      {
        tabs: [{ id: "scene", title: "scene", content: <DreiBoxStory /> }],
      },
    ],
  },
};

export const ViewerStory = () => (
  <DockLayout
    defaultLayout={defaultLayout}
    style={{
      width: "100%",
      height: "100%",
    }}
  />
);
