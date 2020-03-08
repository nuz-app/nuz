const path = require('path');

const devMode = process.env.mode === 'development';

const externals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

module.exports = ({
  mode: devMode ? 'development' : 'production',
  target: 'web',
  entry: "./src/index.jsx",
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'cssModuleWebpack',
    libraryTarget: "umd",
    filename: "index.js",
    umdNamedDefine: true,
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.css']
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          },
        ],
      },
    ],
  },
  optimization: {
    splitChunks: false,
  },
});
