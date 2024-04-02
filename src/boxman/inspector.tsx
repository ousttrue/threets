import React from 'react';
import * as THREE from "three";
import { Pane } from "tweakpane";
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import './inspector.css';

let pane: Pane | null = null;
const binds = [];

export function Inspector({ selected, invalidate }: { selected: THREE.Object3D, invalidate: number }) {

  const ref = React.useRef();

  React.useEffect(() => {
    if (!pane) {
      pane = new Pane({
        container: ref.current,
        title: "BoxMan",
      });
      pane.registerPlugin(EssentialsPlugin);

      // const fpsGraph = pane.addBlade({
      //   view: 'fpsgraph',
      //   label: 'fpsgraph',
      //   rows: 2,
      // });
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


  return (
    <div
      ref={ref}>
    </div>
  );
}
