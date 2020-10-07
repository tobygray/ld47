const path = require('path');

module.exports = (env) => {
  const mode = (env && env.NODE_ENV) || 'development';

  return {
    mode,
    entry: {
      main: './src/main.js',
      editor: './src/editor.js',
    },
    devtool: (mode === 'development') ? 'inline-source-map' : false,
    output: {
      path: path.resolve(__dirname, 'dist', 'js'),
      filename: '[name].bundle.js',
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  };
};
