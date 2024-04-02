import React from "react";
import { Canvas } from "@react-three/fiber";
import Split from 'react-split';
import './split.css';
import "react-complex-tree/lib/style-modern.css";
import * as THREE from "three";
import { World } from './boxman/world';
import { SceneTree } from './boxman/tree';
import { Inspector } from './boxman/inspector';
import { MeshBuilder, values, hierarchy } from './boxman/meshbuilder';


const darkGreen = 0x009900;
const darkYellow = 0x999900;
const red = 0x990000;
const darkRed = 0x990000;
const fingerSize: [number, number] = [0.1, 0.1];


export function BoxMan() {
  const [root, setRoot] = React.useState<THREE.Object3D>(null);
  const [selected, setSelected] = React.useState<THREE.Object3D>(null);

  React.useEffect(() => {
    // const tab = pane.addTab({
    //   pages: [
    //     { title: 'body' },
    //     { title: 'legs' },
    //     { title: 'arms' },
    //     { title: 'l-fingers' },
    //     { title: 'r-fingers' },
    //     { title: 'selected' },
    //   ],
    // });

    const builder = new MeshBuilder(1.6, values);
    /*const hips =*/ builder.traverse(hierarchy);

    const root = builder.buildSkeleton(darkGreen);

    setRoot(root);

  }, []);

  return (
    <Split
      className="split"
      style={{ height: '100%' }}
    >
      <div>
        <SceneTree root={root} setSelected={setSelected} />
      </div>

      <div>
        <div style={{ display: "flex" }}>
          {/* nazo */}
        </div>
        <Canvas>
          <World root={root} selected={selected} />
        </Canvas>
      </div>

      <div>
        <Inspector selected={selected} />
      </div>

    </Split>
  );
}
