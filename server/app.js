const express = require('express');
const session = require('express-session');
const compression = require('compression');
const mongoSessionStore = require('connect-mongo');
const next = require('next');
const mongoose = require('mongoose');
const helmet = require('helmet');

const auth = require('./google');
const api = require('./api');
const logger = require('./logs');
const checkNextBuild = require('./utils/checkNextBuild');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL;

mongoose.connect(MONGO_URL);

const port = process.env.PORT || 8000;
const ROOT_URL = dev ? `http://localhost:${port}` : 'https://altitude-events.now.sh';

const sessionSecret = process.env.SESSION_SECRET;

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(compression());
  server.use(express.json());

  // potential fix for Error: Can't set headers
  // try with Chrome Dev Tools open/close

  // pass all Nextjs's request to Nextjs server
  server.get('/_next/*', (req, res) => {
    if (!dev) {
      checkNextBuild(req, res);
    }
    handle(req, res);
  });

  server.get('/static/*', (req, res) => {
    handle(req, res);
  });

  // confuring MongoDB session store
  const MongoStore = mongoSessionStore(session);
  const sess = {
    name: 'altitude-events.sid',
    secret: sessionSecret,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 3 * 24 * 60 * 60, // save session 3 days
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    },
  };

  if (!dev) {
    server.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  server.use(session(sess));

  auth({ server, ROOT_URL });

  api(server);

  server.get('*', (req, res) => handle(req, res));

  // starting express server
  server.listen(port, (err) => {
    if (err) throw err;
    logger.info(`> Ready on ${ROOT_URL}`);
  });
});
