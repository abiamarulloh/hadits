module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      "macros",
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
        },
      ],
    ],
    presets: [
      "next/babel",
      [
        "@babel/preset-react",
        {
          targets: { node: "current" },
          runtime: "automatic",
        },
      ],
    ],
  };
};
