/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/threets/",
  stories: "src/**/*.stories.{js,jsx,ts,tsx,mdx}",
  defaultStory: "docs--index",
  storyOrder: ["docs--index", "docs--init", "r3f--index", "*"],
  appendToHead:
    "<style>:root{--ladle-main-padding: 0;--ladle-main-padding-mobile: 0;}</style>",
};
