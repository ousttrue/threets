import React from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from 'three';

// const gl = WebGL2RenderingContext;
function fmod(a: number, b: number) {
  return Number((a - (Math.floor(a / b) * b)).toPrecision(8));
};

const vs_constant = `
attribute vec3 a_position;
uniform mat4 u_wvp;

void main()
{
	gl_Position = u_wvp * vec4(a_position, 1.0);
}
`;

const fs_constant = `
/*precision mediump float;*/
precision highp float;

uniform vec4 u_color;

void main()
{
	gl_FragColor = u_color;
}
`;

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
