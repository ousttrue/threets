# drei

## drei Box

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

👇

```tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Box } from "@react-three/drei";

export const Box = () => (
  <Canvas>
    <Box />
  </Canvas>
);
```
