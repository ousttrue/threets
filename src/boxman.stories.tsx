import React from "react";
import { Canvas } from "@react-three/fiber";
import Split from 'react-split';
import './split.css';
import "react-complex-tree/lib/style-modern.css";
import * as THREE from "three";
import { World } from './boxman/world';
import { SceneTree } from './boxman/tree';
import { MeshBuilder, values, hierarchy } from './boxman/meshbuilder';


const darkGreen = 0x009900;
const darkYellow = 0x999900;
const red = 0x990000;
const darkRed = 0x990000;
const fingerSize: [number, number] = [0.1, 0.1];


export function BoxMan() {
  const ref = React.useRef(null);

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

    const root = new THREE.Group();
    root.name = '__root__';

    const builder = new MeshBuilder(1.6, values);
    const hips = builder.traverse(hierarchy);
    root.add(hips);

    const geometry = builder.build();
    const material = new THREE.MeshStandardMaterial({ color: darkGreen });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'mesh'
    root.add(mesh);

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
          <div ref={ref}></div>
        </div>
        <Canvas>
          <World root={root} selected={selected} />
        </Canvas>
      </div>
    </Split>
  );
}
