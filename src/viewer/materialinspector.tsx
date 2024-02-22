import React from "react";
import { Pane } from "tweakpane";
import { useAtom } from "jotai";
import { viewerAtom } from "./vieweratom";
import { MToonMaterial } from "@pixiv/three-vrm";

class MaterialInspectorObj {
  pane: Pane;
  obj: THREE.Material | null = null;
  bindings: any[] = [];
  constructor(container: HTMLDivElement) {
    console.log("new Pane", container);
    this.pane = new Pane({
      title: "materialInspector",
      container,
    });
  }

  bind(obj: THREE.Material | null) {
    this.obj = obj;
    for (const binding of this.bindings) {
      this.pane.remove(binding);
    }
    this.bindings = [];
    if (obj) {
      this.pane.title = obj.name ?? "no name";
      if (obj instanceof MToonMaterial) {
        // console.log(typeof(obj.uniforms), obj.uniforms);
        this.bindings.push(
          this.pane.addBinding(obj, "color", {
            color: { type: "float" },
          })
        );
      }
    }
  }
}
let inspector: MaterialInspectorObj | null = null;

export default function MaterialInspector() {
  const ref = React.useRef(null);
  const [container, setContainer] = React.useState(null);
  React.useEffect(() => {
    setContainer(ref.current);
    inspector = new MaterialInspectorObj(ref.current!);
  }, []);

  const [viewer, _] = useAtom(viewerAtom);
  if (container && inspector) {
    if (inspector.obj != viewer.selectedMaterial) {
      inspector.bind(viewer.selectedMaterial ?? null);
    }
  }

  return <div ref={ref}></div>;
}
