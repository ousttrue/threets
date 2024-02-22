import React from "react";
import { Grid } from "@react-three/drei";
import * as THREE from "three";
import { useAtom } from "jotai";
import { viewerAtom } from "./vieweratom";

export default function World() {
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
