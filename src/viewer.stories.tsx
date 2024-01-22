import React from "react";

import DockLayout, { type LayoutData } from "rc-dock";
import "rc-dock/dist/rc-dock.css";

import "react-complex-tree/lib/style-modern.css";
import {
  UncontrolledTreeEnvironment,
  StaticTreeDataProvider,
  TreeDataProvider,
  Tree,
  Disposable,
  TreeItem,
  TreeItemIndex,
} from "react-complex-tree";

import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, Grid } from "@react-three/drei";

import { useDropzone } from "react-dropzone";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import * as THREE from "three";

import { atom, useAtom } from "jotai";

const gltfAtom = atom<GLTF | null>(null);

function GltfCanvas() {
  const [gltf] = useAtom(gltfAtom);

  return (
    <Canvas>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <directionalLight position={[10, 10, 5]} />
      <OrbitControls makeDefault />
      <Grid cellColor="white" args={[10, 10]} />
      {gltf ? <primitive object={gltf.scene} /> : null}
    </Canvas>
  );
}

class Object3DProvider implements TreeDataProvider {
  map: Map<TreeItemIndex, TreeItem<THREE.Object3D>> = new Map();
  constructor(public readonly root?: THREE.Object3D) {
    const traverse = (o: THREE.Object3D) => {
      if (!o.name) {
        o.name = `node:${this.map.size}`;
      }
      const item = {
        index: o.id,
        data: o,
        children: o.children.map((child) => child.id),
        isFolder: o.children.length > 0,
      } satisfies TreeItem<THREE.Object3D>;
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
    console.log("getTreeItem", itemId);

    if (itemId == "empty") {
      // @ts-ignore
      return {
        index: "empty",
        data: { name: "empty" },
      };
    }

    console.log("getTreeItem", itemId);
    if (itemId == "root") {
      return {
        index: "root",
        data: { name: "root" },
        children: [this.root.id],
      };
    }

    const item = this.map.get(itemId)!;
    return item;
  }
}

function SceneTree() {
  const [gltf] = useAtom(gltfAtom);

  const [provider, setProvider] = React.useState<Object3DProvider | null>(null);

  if (!provider || provider.root != gltf?.scene) {
    setProvider(new Object3DProvider(gltf?.scene));
  }

  return (
    <UncontrolledTreeEnvironment<THREE.Object3D>
      canDragAndDrop
      canDropOnFolder
      canReorderItems
      dataProvider={provider ?? new StaticTreeDataProvider([])}
      getItemTitle={(item) => {
        console.log("getItemTitle", item);
        return item.data.name;
      }}
      viewState={{
        "tree-1": {},
      }}
    >
      <Tree
        treeId="tree-1"
        rootItem={gltf ? "root" : "empty"}
        treeLabel="Three.js scene"
      />
    </UncontrolledTreeEnvironment>
  );
}

export const ViewerStory = () => {
  // const [gltf, setGltf] = React.useState<GLTF>();
  const [_, setGltf] = useAtom(gltfAtom);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }
    const buffer = await file.arrayBuffer();

    const loader = new GLTFLoader();
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });

    const gltf = await loader.parseAsync(buffer, file.name);
    setGltf(gltf);
    console.log("loaded", gltf);
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  const defaultLayout: LayoutData = {
    dockbox: {
      mode: "horizontal",
      children: [
        {
          mode: "vertical",
          children: [
            {
              tabs: [{ id: "tree", title: "tree", content: <SceneTree /> }],
            },
            {
              tabs: [
                {
                  id: "tree",
                  title: "drop",
                  content: (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <button type="button" onClick={open}>
                        Open
                      </button>
                    </div>
                  ),
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
              content: <GltfCanvas />,
            },
          ],
        },
      ],
    },
  };

  return (
    <DockLayout
      defaultLayout={defaultLayout}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};
