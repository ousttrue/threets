## box

```tsx
import React from "react";
import { Canvas } from "@react-three/fiber";

export const BoxStory = () => (
  <Canvas>
    <mesh>
      <boxGeometry />
    </mesh>
  </Canvas>
);
```

`<Canvas>` の中が r3f の世界になる。
Canvas の chidren はもはや React のコンポーネントではなくて、
THREE.Scene を表現する感じになる。
Canvas の子孫の小文字タグは、 
three.js の Object を示す規約のようだ。

https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry

`r3f` によって `three.js` のプログラミングが必ずしも簡単になるわけではないけど、
React と組みあわせた HtmlCanvasElement の寿命管理や、
Resize, MouseEvent などのハンドリングなどは仕組みに乗るとよさそう。

:::warning Canvas の CSS は width, height: 100% 

なので parent のwidth, heightをauto 以外にする必要あり。

```tsx title="ResizeObserver で width, height 指定"
export default function GlCanvs() {
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

  return (
    <Layout>
      <div
        ref={ref}
        style={{
          flexGrow: 1,
          alignSelf: "stretch",
          // background: "red",
        }}
      >
        <Canvas
          style={{
            width: `${size[0]}px`, // 👈
            height: `${size[1]}px`,
          }}
```

:::

## 背景色 camera のマウス操作, light, grid 付きのシーン

```tsx
export const GridCameraLightStory: Story = () => (
  <Canvas shadows>
    <color attach="background" args={[0, 0, 0]} />
    <ambientLight intensity={0.8} />
    <pointLight intensity={1} position={[0, 6, 0]} />
    <directionalLight position={[10, 10, 5]} />
    <OrbitControls makeDefault />
    <Grid cellColor="white" args={[10, 10]} />
    <Box position={[0, 0.5, 0]}>
      <meshStandardMaterial />
    </Box>
  </Canvas>
);

```
