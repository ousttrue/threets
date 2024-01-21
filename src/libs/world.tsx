import React, { useRef } from "react";
import { CameraControls, Facemesh } from "@react-three/drei";
import { Box, Ground } from "./geometry";

export function HelloWorld() {
  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </>
  );
}

export function CameraWorld() {
  return (
    <>
      <group position-y={-0.5}>
        <Ground />
        <CameraControls />
      </group>
    </>
  );
}

export function FaceWorld() {
  return (
    <>
      <color args={["#303030"]} attach="background" />
      <axesHelper />
      <Facemesh
        debug
        faceBlendshapes={{
          categories: [
            {
              categoryName: "_neutral",
              displayName: "",
              index: 0,
              score: 0.000005187174338061595,
            },
            {
              categoryName: "browDownLeft",
              displayName: "",
              index: 1,
              score: 0.24521504342556,
            },
            {
              categoryName: "browDownRight",
              displayName: "",
              index: 2,
              score: 0.1987743377685547,
            },
            {
              categoryName: "browInnerUp",
              displayName: "",
              index: 3,
              score: 0.013400448486208916,
            },
            {
              categoryName: "browOuterUpLeft",
              displayName: "",
              index: 4,
              score: 0.012361560948193073,
            },
            {
              categoryName: "browOuterUpRight",
              displayName: "",
              index: 5,
              score: 0.019305096939206123,
            },
            {
              categoryName: "cheekPuff",
              displayName: "",
              index: 6,
              score: 0.000028426356948330067,
            },
            {
              categoryName: "cheekSquintLeft",
              displayName: "",
              index: 7,
              score: 3.4500112633395474e-7,
            },
            {
              categoryName: "cheekSquintRight",
              displayName: "",
              index: 8,
              score: 4.83789051486383e-7,
            },
            {
              categoryName: "eyeBlinkLeft",
              displayName: "",
              index: 9,
              score: 0.07650448381900787,
            },
            {
              categoryName: "eyeBlinkRight",
              displayName: "",
              index: 10,
              score: 0.05070012807846069,
            },
            {
              categoryName: "eyeLookDownLeft",
              displayName: "",
              index: 11,
              score: 0.13978900015354156,
            },
            {
              categoryName: "eyeLookDownRight",
              displayName: "",
              index: 12,
              score: 0.14198613166809082,
            },
            {
              categoryName: "eyeLookInLeft",
              displayName: "",
              index: 13,
              score: 0.2177766114473343,
            },
            {
              categoryName: "eyeLookInRight",
              displayName: "",
              index: 14,
              score: 0.014739357866346836,
            },
            {
              categoryName: "eyeLookOutLeft",
              displayName: "",
              index: 15,
              score: 0.02361512929201126,
            },
            {
              categoryName: "eyeLookOutRight",
              displayName: "",
              index: 16,
              score: 0.19679604470729828,
            },
            {
              categoryName: "eyeLookUpLeft",
              displayName: "",
              index: 17,
              score: 0.04874616861343384,
            },
            {
              categoryName: "eyeLookUpRight",
              displayName: "",
              index: 18,
              score: 0.049392376095056534,
            },
            {
              categoryName: "eyeSquintLeft",
              displayName: "",
              index: 19,
              score: 0.34944331645965576,
            },
            {
              categoryName: "eyeSquintRight",
              displayName: "",
              index: 20,
              score: 0.2939716875553131,
            },
            {
              categoryName: "eyeWideLeft",
              displayName: "",
              index: 21,
              score: 0.005955042317509651,
            },
            {
              categoryName: "eyeWideRight",
              displayName: "",
              index: 22,
              score: 0.006776117719709873,
            },
            {
              categoryName: "jawForward",
              displayName: "",
              index: 23,
              score: 0.000016942436559475027,
            },
            {
              categoryName: "jawLeft",
              displayName: "",
              index: 24,
              score: 0.0045165494084358215,
            },
            {
              categoryName: "jawOpen",
              displayName: "",
              index: 25,
              score: 0.07803940027952194,
            },
            {
              categoryName: "jawRight",
              displayName: "",
              index: 26,
              score: 0.00002090057751047425,
            },
            {
              categoryName: "mouthClose",
              displayName: "",
              index: 27,
              score: 0.06032035872340202,
            },
            {
              categoryName: "mouthDimpleLeft",
              displayName: "",
              index: 28,
              score: 0.00228882092051208,
            },
            {
              categoryName: "mouthDimpleRight",
              displayName: "",
              index: 29,
              score: 0.00781762320548296,
            },
            {
              categoryName: "mouthFrownLeft",
              displayName: "",
              index: 30,
              score: 0.0017093931091949344,
            },
            {
              categoryName: "mouthFrownRight",
              displayName: "",
              index: 31,
              score: 0.0019319106359034777,
            },
            {
              categoryName: "mouthFunnel",
              displayName: "",
              index: 32,
              score: 0.00008485237776767462,
            },
            {
              categoryName: "mouthLeft",
              displayName: "",
              index: 33,
              score: 0.0009051355300471187,
            },
            {
              categoryName: "mouthLowerDownLeft",
              displayName: "",
              index: 34,
              score: 0.0003630454302765429,
            },
            {
              categoryName: "mouthLowerDownRight",
              displayName: "",
              index: 35,
              score: 0.00017601238505449146,
            },
            {
              categoryName: "mouthPressLeft",
              displayName: "",
              index: 36,
              score: 0.12865161895751953,
            },
            {
              categoryName: "mouthPressRight",
              displayName: "",
              index: 37,
              score: 0.20137207210063934,
            },
            {
              categoryName: "mouthPucker",
              displayName: "",
              index: 38,
              score: 0.0022203284315764904,
            },
            {
              categoryName: "mouthRight",
              displayName: "",
              index: 39,
              score: 0.0009096377179957926,
            },
            {
              categoryName: "mouthRollLower",
              displayName: "",
              index: 40,
              score: 0.34189721941947937,
            },
            {
              categoryName: "mouthRollUpper",
              displayName: "",
              index: 41,
              score: 0.11409689486026764,
            },
            {
              categoryName: "mouthShrugLower",
              displayName: "",
              index: 42,
              score: 0.17172536253929138,
            },
            {
              categoryName: "mouthShrugUpper",
              displayName: "",
              index: 43,
              score: 0.004038424696773291,
            },
            {
              categoryName: "mouthSmileLeft",
              displayName: "",
              index: 44,
              score: 0.00023205230536404997,
            },
            {
              categoryName: "mouthSmileRight",
              displayName: "",
              index: 45,
              score: 0.00019313619122840464,
            },
            {
              categoryName: "mouthStretchLeft",
              displayName: "",
              index: 46,
              score: 0.0018571305554360151,
            },
            {
              categoryName: "mouthStretchRight",
              displayName: "",
              index: 47,
              score: 0.0023813238367438316,
            },
            {
              categoryName: "mouthUpperUpLeft",
              displayName: "",
              index: 48,
              score: 0.000024323100660694763,
            },
            {
              categoryName: "mouthUpperUpRight",
              displayName: "",
              index: 49,
              score: 0.00003161552012898028,
            },
            {
              categoryName: "noseSneerLeft",
              displayName: "",
              index: 50,
              score: 1.08198406678639e-7,
            },
            {
              categoryName: "noseSneerRight",
              displayName: "",
              index: 51,
              score: 0.0000012652527630052646,
            },
          ],
          headIndex: -1,
          headName: "",
        }}
        facialTransformationMatrix={{
          columns: 4,
          data: [
            0.9947517514228821, 0.10230544209480286, 0.0013679931871592999, 0,
            -0.10230997204780579, 0.9947447776794434, 0.003816320328041911, 0,
            -0.000970348424743861, -0.0039362297393381596, 0.9999914169311523,
            0, 2.8888821601867676, -7.808934211730957, -30.52109146118164, 1,
          ],
          rows: 4,
        }}
        rotation-z={3.141592653589793}
      >
        <meshStandardMaterial
          color="#cbcbcb"
          flatShading
          opacity={0.98}
          side={2}
          transparent
        />
      </Facemesh>
    </>
  );
}
