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


## wasd

FirstPersonControls


