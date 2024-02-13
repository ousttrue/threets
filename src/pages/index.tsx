import React from "react";
import Layout from "@theme/Layout";
import { Canvas } from "@react-three/fiber";
import { Box, Grid, OrbitControls, TransformControls } from "@react-three/drei";
import { useDropzone } from "react-dropzone";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

let resizeObserver: ResizeObserver | null = null;

export default function GlCanvs() {
  const [gltf, setGltf] = React.useState<GLTF>();
  const ref = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState([300, 150]);
  React.useEffect(() => {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = entry.contentBoxSize[0];
          // console.log("box", contentBoxSize);
          setSize([
            Math.ceil(contentBoxSize.inlineSize),
            Math.ceil(contentBoxSize.blockSize),
          ]);
        } else {
          // console.log(entry.contentRect);
          setSize([
            Math.ceil(entry.contentRect.width),
            Math.ceil(entry.contentRect.height),
          ]);
        }
        break;
      }
    });
    resizeObserver.observe(ref.current);
  }, []);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }
    const buffer = await file.arrayBuffer();

    const loader = new GLTFLoader();
    // loader.register((parser) => {
    //   return new VRMLoaderPlugin(parser);
    // });

    const gltf = await loader.parseAsync(buffer, file.name);
    setGltf(gltf);
    console.log("loaded", gltf);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Layout>
      <div
        {...getRootProps({
          onClick: (event) => {
            event.stopPropagation();
          },
        })}
        ref={ref}
        style={{
          flexGrow: 1,
          alignSelf: "stretch",
          // background: "red",
        }}
      >
        <Canvas
          style={{
            width: `${size[0]}px`,
            height: `${size[1]}px`,
          }}
          camera={{
            fov: 60,
            near: 0.1,
            far: 1000,
            position: [0, 1.6, 3],
          }}
        >
          <color attach="background" args={[0, 0, 0]} />
          <ambientLight intensity={0.8} />
          <pointLight intensity={1} position={[0, 6, 0]} />
          <directionalLight position={[10, 10, 5]} />
          <OrbitControls makeDefault />
          <Grid cellColor="white" args={[10, 10]} />
          {gltf ? <primitive object={gltf.scene} /> : null}
        </Canvas>
      </div>
    </Layout>
  );
}
