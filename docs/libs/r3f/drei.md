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

https://qiita.com/watataku8911/items/ef35f1fd3fab57fa0c82

https://zenn.dev/solb/articles/ad4a6cc3fc2ff0

