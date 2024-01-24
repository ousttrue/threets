# three.js をはじめる

## React-three-fiber 

`three.js` と言っても react-three-fiber の方。

https://docs.pmnd.rs/react-three-fiber/getting-started/introduction

## box

```tsx
export const Box = () => (
  <Canvas>
    <mesh>
      <boxGeometry />
    </mesh>
  </Canvas>
);
```

`<Canvas>` の中が r3f の世界になる。

Canvas の子孫の小文字タグは、 
three.js の Object を示す規約のようだ。

https://threejs.org/docs/index.html?q=box#api/en/geometries/BoxGeometry

[box](?story=r3f--box)

### drei Box

```tsx
import { Box } from "@react-three/drei";

export const Box = () => (
  <Canvas>
    <Box />
  </Canvas>
);
```

## camera

`drei` の CameraControls

```tsx
import { CameraControls } from "@react-three/drei";

export const Camera = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
    <CameraControls />
  </Canvas>
)
```

[camera](?story=r3f--camera)

`Canvas` にはデフォルトの PersePective カメラが仕込まれている。

`CameraControls` にはデフォルトのマウスイベント操作(OrbitControls?が含まれている)

## todo

- orbit camera
- default light

### gltfLoader

https://github.com/pmndrs/gltf-react-three/

### wasd

FirstPersonControls

### FaceCapture

FaceControls

mesh もあった。
