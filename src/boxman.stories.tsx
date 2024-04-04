import React from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from '@react-three/drei'
import Split from 'react-split';
import './split.css';
import "react-complex-tree/lib/style-modern.css";
import * as THREE from "three";
import { World } from './boxman/world';
import { SceneTree } from './boxman/tree';
import { Inspector } from './boxman/inspector';
import { MeshBuilder, values, hierarchy } from './boxman/meshbuilder';
import * as VrmSpringBone from '@pixiv/three-vrm-springbone';


const darkGreen = 0x009900;
const darkYellow = 0x999900;
const red = 0x990000;
const darkRed = 0x990000;
const fingerSize: [number, number] = [0.1, 0.1];


interface Model {
  root: THREE.Object3D;
  onFrame: (clock: THREE.Clock, delta: number) => void;
};


export function BoxMan() {
  const [model, setModel] = React.useState<Model>(null);
  const [selected, setSelected] = React.useState<THREE.Object3D>(null);
  const [invalidate, setInvalidate] = React.useState(1);

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
    const springs: THREE.Object3D[][] = [];
    springs.push(...builder.appendSpring(builder.getBone('leftLowerArm'), 3));
    springs.push(...builder.appendSpring(builder.getBone('rightLowerArm'), 3));

    const root = builder.buildSkeleton(darkGreen);

    // spring bone
    const springBoneManager = new VrmSpringBone.VRMSpringBoneManager();

    for (let i = 0; i < springs.length; i++) {
      const joints = springs[i];
      for (let j = 0; j < joints.length - 1; ++j) {
        const springBone = new VrmSpringBone.VRMSpringBoneJoint(joints[j], joints[j + 1], { hitRadius: 0.01 });
        // springBone.colliderGroups = [{ colliders }];
        springBoneManager.addJoint(springBone);
      }
    }

    // helpers
    springBoneManager.joints.forEach((bone) => {
      const helper = new VrmSpringBone.VRMSpringBoneJointHelper(bone);
      helper.name = `springbone:${helper.id}`
      root.add(helper);
    });

    // init spring bones
    springBoneManager.setInitState();

    // animate
    let shouldReset = true; // reset in the very first frame

    setModel({
      root,
      onFrame: (clock, delta) => {
        if (shouldReset) {
          shouldReset = false;
          springBoneManager.reset();
        }
        springBoneManager.update(delta);
      },
    });

  }, []);

  return (
    <Split
      className="split"
      style={{
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div id="x" style={{ 'height': '50px' }}>
        </div>
        <div>
          <SceneTree {...model} setSelected={setSelected} />
        </div>
      </div>

      <div>
        <div style={{ display: "flex" }}>
          {/* nazo */}
        </div>
        <Canvas>
          <Stats />
          <World {...model} selected={selected} setInvalidate={setInvalidate} />
        </Canvas>
      </div>

      <div
        style={{ backgroundColor: 'hsl(230, 7%, 17%))' }}
      >
        <Inspector selected={selected} invalidate={invalidate} />
      </div>

    </Split>
  );
}

export default {
  meta: {
    hotkeys: false,
  },
};
