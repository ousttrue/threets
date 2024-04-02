import React from 'react';
import * as THREE from "three";
import { Pane } from "tweakpane";
let pane: Pane | null = null;

let b = null;

export function Inspector({ selected }: { selected: THREE.Object3D }) {

  const ref = React.useRef();

  React.useEffect(() => {
    if (!pane) {
      pane = new Pane({
        container: ref.current,
        title: "BoxMan",
      });
    }

    if (b) {
      pane.remove(b);
      b = null;
    }

    if (selected) {
      pane.title = selected.name;
      b = pane.addBinding(selected, "position")
    }
  }, [selected]);


  return (<div ref={ref}></div>);
}
