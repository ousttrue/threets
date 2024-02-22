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
import { OrbitControls, Grid } from "@react-three/drei";

import { useDropzone } from "react-dropzone";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import * as THREE from "three";
import { useAtom } from "jotai";
import { viewerAtom } from "./viewer/vieweratom";
import Inspector from "./viewer/nodeinspector";

// const VRM_URL =
//   "https://github.com/vrm-c/vrm-specification/raw/master/samples/Seed-san/vrm/Seed-san.vrm";
const VRM_URL =
  "https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm";

function World() {
  const [viewer] = useAtom(viewerAtom);

  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.8} />
      <pointLight intensity={1} position={[0, 6, 0]} />
      <directionalLight position={[10, 10, 5]} />
      <Grid cellColor="white" args={[10, 10]} />
      {viewer.root ? <primitive object={viewer.root} /> : null}
    </>
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

function SceneTree() {
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
          selected: provider?.map.get(items[0])?.data,
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

function OpenButton() {
  const [_, setViewer] = useAtom(viewerAtom);

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
    setViewer({ root: gltf.scene });
    console.log("loaded", gltf);
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button type="button" onClick={open}>
        Open
      </button>
    </div>
  );
}

export const ViewerStory = () => {
  const defaultLayout: LayoutData = {
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
                  content: <Inspector />,
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
                  content: <SceneTree />,
                },
              ],
            },
            {
              tabs: [
                {
                  id: "maetrialInspector",
                  title: "materialInspector",
                  content: <Inspector />,
                },
              ],
            },
          ],
        },
      ],
    },
  };

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
      setViewer({ root: gltf.scene });
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
      <DockLayout defaultLayout={defaultLayout} style={{ flexGrow: 1 }} />
    </div>
  );
};
