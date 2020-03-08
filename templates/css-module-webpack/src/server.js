const express = require('express');
const cors = require('cors')
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('../webpack.config.js');
const compiler = webpack(config);

const packageJson = require('../package.json');

app.use(cors());

app.use(webpackDevMiddleware(compiler, {
  writeToDisk: true,
  publicPath: config.output.publicPath,
}));

const port = process.env.PORT || 3000;

app.listen(port, function () {
  const address = `http://localhost:${port}`;

  console.log();
  console.log(`${packageJson.name} module listening at ${address}!`)
  console.log();
  console.log(`Use module with below config:`);
  console.log({
    name: packageJson.name,
    library: config.output.library,
    host: `${address}/${config.output.filename}`,
  });
  console.log();
});
