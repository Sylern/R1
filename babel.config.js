module.exports = {
  // presets: ["@vue/app"]
  presets: [
    [
      "@vue/app",
      {
        "useBuiltIns": "entry",
        polyfills: [
          'es6.promise',
          'es6.symbol'
        ]
      }
    ]
  ]
};
