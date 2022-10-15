module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              /* ... */
            },
          },
          {
            loader: "vue-svg-inline-loader",
            options: {
              /* ... */
            },
          },
        ],
      },
    ],
  },
};
