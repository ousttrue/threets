import React from "react";
import { useAtom } from "jotai";
import { viewerAtom } from "./vieweratom";
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

class NodeItem {
  constructor(
    public readonly o: THREE.Object3D,
    public readonly index: number
  ) { }

  get name(): string {
    let prefix = this.o.children && this.o.children.length ? "📁" : "📄";
    if (this.o instanceof THREE.Mesh) {
      prefix = "📦";
    }
    if (this.o.name) {
      return `${prefix}${this.o.name}`;
    } else {
      return `${prefix}${this.index}`;
    }
  }
}

class Object3DProvider implements TreeDataProvider {
  map: Map<TreeItemIndex, TreeItem<NodeItem>> = new Map();
  constructor(public readonly root?: THREE.Object3D) {
    const traverse = (o: THREE.Object3D) => {
      const item = {
        index: o.id,
        data: new NodeItem(o, this.map.size),
        children: o.children.map((child) => child.id),
        isFolder: o.children.length > 0,
      } satisfies TreeItem<NodeItem>;
      this.map.set(o.id, item);
      // console.log("add", o);
      for (const child of o.children) {
        traverse(child);
      }
    };
    if (root) {
      traverse(root);
    }
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
      return {
        index: "root",
        data: { name: "root" },
        // @ts-ignore
        children: [this.root.id],
      };
    }

    const item = this.map.get(itemId)!;
    return item;
  }
}

export default function SceneTree() {
  const [viewer, setViewer] = useAtom(viewerAtom);

  const [provider, setProvider] = React.useState<Object3DProvider | null>(null);

  if (!provider || provider.root != viewer.root) {
    setProvider(new Object3DProvider(viewer.root));
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
          selected: provider?.map.get(items[0])?.data.o,
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
