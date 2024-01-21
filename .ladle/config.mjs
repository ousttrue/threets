/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/threets/",
  stories: "src/**/*.stories.{js,jsx,ts,tsx,mdx}",
  defaultStory: "docs--index",
  storyOrder: [
    "docs--index", 
    "r3f--index", 
    "*",
  ],
};
