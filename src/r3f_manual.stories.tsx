import React from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";

function Render() {
  useFrame(({ gl, clock }, delta) => {
    const GL = gl.getContext();

    const s = (Math.sin(clock.getElapsedTime()) + 1) / 2.0;
    GL.clearColor(0.0, 0.0, s, 1);
    GL.clear(GL.COLOR_BUFFER_BIT);

    GL.flush();
  }, 1)

  return <></>
}

export function ManualRenderer() {
  return (<Canvas>
    <Render />
  </Canvas>);
}
