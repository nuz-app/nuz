const cors = require('cors');
const morgan = require('morgan');
const registry = require('@nuz/registry');

const isDev = process.env.NODE_ENV !== 'production';

(async function main() {
  const server = new registry.Server({
    key: process.env.SECRET_KEY,
    db: {
      type: 'mongodb',
      url: process.env.MONGO_URL,
    },
    serverless: {
      fetch: !isDev && {
        cacheTime: 300000,
        prepareTime: 60000,
      },
    },
  });

  await server.middlewares(async (app) => {
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
    app.use(cors());
  });

  await server.prepare();

  server.listen(4004);
})();
