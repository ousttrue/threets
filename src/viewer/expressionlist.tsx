import React from "react";
import { useAtom } from "jotai";
import { viewerAtom } from "./vieweratom";
import { VRM, VRMExpression } from "@pixiv/three-vrm";
import { VRMExpression } from "@pixiv/three-vrm";
import "react-complex-tree/lib/style-modern.css";
import * as THREE from "three";
import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  TreeDataProvider,
  Tree,
  Disposable,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";

class ExpressionProvider implements TreeDataProvider {
  map: Map<TreeItemIndex, TreeItem<VRMExpression>> = new Map();
  rootItem: TreeItem = {
    index: "root",
    data: {},
    children: [],
    isFolder: true,
  };
  constructor(public readonly vrm?: VRM) {
    // console.log(vrm);
    if (vrm && vrm.expressionManager) {
      for (const e of vrm.expressionManager.expressions) {
        this.push(e);
      }
    }
    // const traverse = (o: THREE.Object3D) => {
    //   if (o instanceof THREE.Mesh) {
    //     if (o.material) {
    //       if (Array.isArray(o.material)) {
    //         for (const material of o.material) {
    //           this.pushMaterial(material);
    //         }
    //       } else {
    //         this.pushMaterial(o.material);
    //       }
    //     }
    //   }
    //   for (const child of o.children) {
    //     traverse(child);
    //   }
    // };
    // if (root) {
    //   traverse(root);
    // }
  }

  push(e: VRMExpression) {
    if (!e.name) {
      e.name = `expression:${this.map.size}`;
    }
    const item = {
      index: e.id,
      data: e,
    } satisfies TreeItem<VRMExpression>;
    this.map.set(e.id, item);
    this.rootItem.children.push(e.id);
  }

  async getTreeItem(itemId: TreeItemIndex) {
    if (itemId == "empty") {
      // @ts-ignore
      return {
        index: "empty",
        data: { name: "empty" },
      };
    }

    if (itemId == "root") {
      return this.rootItem;
    }

    const item = this.map.get(itemId)!;
    return item;
  }
}

export default function ExpressionList() {
  const [viewer, setViewer] = useAtom(viewerAtom);

  const [provider, setProvider] = React.useState<ExpressionProvider | null>(
    null
  );

  if (!provider || provider.vrm != viewer.vrm) {
    setProvider(new ExpressionProvider(viewer.vrm));
  }

  return (
    <UncontrolledTreeEnvironment<THREE.Object3D>
      disableMultiselect
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      // @ts-ignore
      dataProvider={provider ?? new StaticTreeDataProvider([])}
      getItemTitle={(item) => {
        // console.log("getItemTitle", item);
        return item.data.name;
      }}
      viewState={{
        "tree-1": {},
      }}
      onSelectItems={(items: TreeItemIndex[], treeId: string) => {
        console.log("onSelectItems", treeId);
        setViewer({
          ...viewer,
          selectedExpression: provider?.map.get(items[0])?.data,
        });
      }}
    >
      <Tree
        treeId="tree-1"
        rootItem={viewer.root ? "root" : "empty"}
        treeLabel="Three.js scene"
      />
    </UncontrolledTreeEnvironment>
  );
}
