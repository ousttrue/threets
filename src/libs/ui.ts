import { useControls } from "leva";

export function xyz() {
  return useControls({
    positionX: {
      value: 0,
      min: -3,
      max: 3,
      step: 0.1,
    },
    positionY: {
      value: 0,
      min: -3,
      max: 3,
      step: 0.1,
    },
    positionZ: {
      value: 0,
      min: -3,
      max: 3,
      step: 0.1,
    },
  });
}

export function xyzScaleColorWire() {
  return useControls("Box", {
    scale: {
      value: 1,
      min: 1,
      max: 3,
      step: 0.1,
    },
    positionX: {
      value: 0,
      min: -3,
      max: 3,
      step: 0.1,
    },
    positionY: {
      value: 0,
      min: -3,
      max: 3,
      step: 0.1,
    },
    positionZ: {
      value: 0,
      min: -3,
      max: 3,
      step: 0.1,
    },
    color: "#f00",
    wireframe: false,
  });
}
