import React from "react";
import { Pane } from "tweakpane";
import { useAtom } from "jotai";
import { viewerAtom } from "./vieweratom";

class InspectorObj {
  pane: Pane;
  obj: THREE.Object3D | null = null;
  bindings: any[] = [];
  constructor(container: HTMLDivElement) {
    console.log("new Pane", container);
    this.pane = new Pane({
      title: "nodeInspector",
      container,
    });
  }

  bind(obj: THREE.Object3D | null) {
    this.obj = obj;
    for (const binding of this.bindings) {
      this.pane.remove(binding);
    }
    this.bindings = [];
    if (obj) {
      this.pane.title = obj.name ?? "no name";
      this.bindings.push(this.pane.addBinding(obj, "position"));
    }
  }
}
let inspector: InspectorObj | null = null;

export default function Inspector() {
  const ref = React.useRef(null);
  const [container, setContainer] = React.useState(null);
  React.useEffect(() => {
    setContainer(ref.current);
    inspector = new InspectorObj(ref.current!);
  }, []);

  const [viewer, _] = useAtom(viewerAtom);
  if (container && inspector) {
    if (inspector.obj != viewer.selected) {
      inspector.bind(viewer.selected ?? null);
    }
  }

  return <div ref={ref}></div>;
}
