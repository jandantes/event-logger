import express from 'express';
import jwt from 'jwt-simple';

import logger from '../logs';
import Event from '../models/Event';

require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

router.use((req, res, next) => {
  let payload = null;

  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    payload = jwt.decode(token, jwtSecret);
  }

  if (!payload) {
    if (!req.user || !req.user.isAdmin) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  next();
});

router.get('/', async (req, res) => {
  try {
    const events = await Event.list();
    res.json(events);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/add', async (req, res) => {
  try {
    const event = await Event.add(Object.assign({ metadata: { user: req.user.id } }, req.body));
    res.json(event);
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/detail/:key', async (req, res) => {
  try {
    const event = await Event.getByKey({ key: req.params.key });
    res.json(event);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

export default router;
