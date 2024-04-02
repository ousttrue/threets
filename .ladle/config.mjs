/** @type {import('@ladle/react').UserConfig} */
export default {
  base: "/threets/ladle/",
  stories: "src/**/*.stories.{js,jsx,ts,tsx,mdx}",
  appendToHead:
    "<style>:root{--ladle-main-padding: 0;--ladle-main-padding-mobile: 0;}</style>",
  meta: {
    hotkeys: false,
  },
};
