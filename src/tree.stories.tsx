import React from "react";
import "react-complex-tree/lib/style-modern.css";
import { shortTree } from "./demodata";

import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  Tree,
} from "react-complex-tree";

export const TreeStory = () => (
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
