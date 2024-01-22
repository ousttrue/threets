import React from "react";
import "rc-dock/dist/rc-dock.css";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMLoaderPlugin } from "@pixiv/three-vrm";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Grid } from "@react-three/drei";

const style = {
  width: 200,
  height: 150,
  border: "1px dotted #888",
};

// function getTypeName(src: any): string {
//   if (src) {
//     return src.constructor.name;
//   } else {
//     return typeof src;
//   }
// }

export function DropZoneStroy() {
  const [gltf, setGltf] = React.useState<GLTF>();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div {...getRootProps()} style={style}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      <Canvas>
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.8} />
        <pointLight intensity={1} position={[0, 6, 0]} />
        <directionalLight position={[10, 10, 5]} />
        <OrbitControls makeDefault />
        <Grid cellColor="white" args={[10, 10]} />
        {gltf ? <primitive object={gltf.scene} /> : null}
      </Canvas>
    </div>
  );
}
