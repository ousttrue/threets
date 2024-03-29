import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  sidebar: [
    {
      type: "category",
      label: "libs",
      link: { type: "doc", id: "libs/index" },
      items: [
        {
          type: "category",
          label: "property",
          link: { type: "doc", id: "libs/property/index" },
          items: [
            "libs/property/leva",
            "libs/property/lilgui",
            "libs/property/tweakpane",
          ],
        },
        {
          type: "category",
          label: "r3f",
          link: { type: "doc", id: "libs/r3f/index" },
          items: [, "libs/r3f/drei"],
        },
        {
          type: "category",
          label: "gui",
          link: { type: "doc", id: "libs/gui/index" },
          items: [
            "libs/gui/tree",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "three.js",
      link: {
        type: "doc",
        id: "threejs/index",
      },
      items: [
        "threejs/camera",
        "threejs/scene",
        "threejs/gizmo",
        "threejs/animation",
      ],
    },
    {
      type: "category",
      label: "vrm",
      link: {
        type: "doc",
        id: "vrm/index",
      },
      items: ["vrm/bone", "vrm/bvh"],
    },
    {
      type: "category",
      label: "xr",
      link: {
        type: "doc",
        id: "xr/index",
      },
      items: [],
    },
  ],
};

export default sidebars;
