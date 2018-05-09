import express from 'express';
import session from 'express-session';
import mongoSessionStore from 'connect-mongo';
import next from 'next';
import mongoose from 'mongoose';
import getRootUrl from '../lib/api/getRootUrl';
import auth from './google';
import api from './api';
import logger from './logs';

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const MONGO_URL = process.env.MONGO_URL_TEST;

mongoose.connect(MONGO_URL);

const port = process.env.PORT || 8000;
const ROOT_URL = getRootUrl();

const sessionSecret = process.env.SESSION_SECRET;

const app = next({ dev });
const handle = app.getRequestHandler();

// Nextjs's server prepared
app.prepare().then(() => {
  const server = express();
  server.use(express.json());

  // potential fix for Error: Can't set headers
  // try with Chrome Dev Tools open/close

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
