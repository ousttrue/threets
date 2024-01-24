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
        "libs/gui",
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
        "threejs/r3f",
        "threejs/drei",
        "threejs/camera",
        "threejs/scene",
      ],
    },
  ],
};

export default sidebars;
