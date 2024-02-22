import React from "react";
import { useAtom } from "jotai";
import { viewerAtom } from "./vieweratom";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
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

class MaterialProvider implements TreeDataProvider {
  map: Map<TreeItemIndex, TreeItem<THREE.Material>> = new Map();
  rootItem: TreeItem = {
    index: "root",
    data: {},
    children: [],
    isFolder: true,
  };
  constructor(public readonly root?: THREE.Object3D) {
    const traverse = (o: THREE.Object3D) => {
      if (o instanceof THREE.Mesh) {
        if (o.material) {
          if (Array.isArray(o.material)) {
            for (const material of o.material) {
              this.pushMaterial(material);
            }
          } else {
            this.pushMaterial(o.material);
          }
        }
      }
      for (const child of o.children) {
        traverse(child);
      }
    };
    if (root) {
      traverse(root);
    }
  }

  pushMaterial(material: THREE.Material) {
    if (!material.name) {
      material.name = `material:${this.map.size}`;
    }
    const item = {
      index: material.id,
      data: material,
    } satisfies TreeItem<THREE.Material>;
    this.map.set(material.id, item);
    this.rootItem.children.push(material.id);
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

export default function MaterialList() {
  const [viewer, setViewer] = useAtom(viewerAtom);

  const [provider, setProvider] = React.useState<MaterialProvider | null>(null);

  if (!provider || provider.root != viewer.root) {
    setProvider(new MaterialProvider(viewer.root));
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
          selectedMaterial: provider?.map.get(items[0])?.data,
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
