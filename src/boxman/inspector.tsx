import React from 'react';
import * as THREE from "three";
import { Pane } from "tweakpane";
let pane: Pane | null = null;
import './inspector.css';

const binds = [];

export function Inspector({ selected, invalidate }: { selected: THREE.Object3D, invalidate: number }) {

  const ref = React.useRef();

  React.useEffect(() => {
    if (!pane) {
      pane = new Pane({
        container: ref.current,
        title: "BoxMan",
      });
    }

    for (const b of binds) {
      pane.remove(b);
    }
    binds.splice(0);

    if (selected) {
      pane.title = selected.name;
      binds.push(pane.addBinding(selected, "position"));
      binds.push(pane.addBinding(selected, "rotation"));
      binds.push(pane.addBinding(selected, "scale"));
    }
  }, [selected]);

  React.useEffect(() => {
    // console.log('refresh', invalidate);
    if (pane) {
      pane.refresh();
    }
  }, [invalidate]);


  return (<div ref={ref}></div>);
}
