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
import { Box, OrbitControls, Grid } from "@react-three/drei";

import { useDropzone } from "react-dropzone";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";

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
              tabs: [{ id: "tree", title: "tree", content: <TreeStory /> }],
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
