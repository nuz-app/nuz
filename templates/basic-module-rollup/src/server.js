const express = require('express');
const cors = require('cors')

const app = express();

const packageJson = require('../package.json');

app.use(cors());
app.use(express.static('dist'))

const port = process.env.PORT || 3000;

app.listen(port, function () {
  const address = `http://localhost:${port}`;

  console.log();
  console.log(`${packageJson.name} module listening at ${address}!`)
  console.log();
  console.log(`Use module with below config:`);
  console.log({
    name: packageJson.name,
    // library: config.output.library,
    // host: `${address}/${config.output.filename}`,
  });
  console.log();
});
