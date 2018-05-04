import express from 'express';
import logger from '../logs';
import Event from '../models/Event';

const router = express.Router();

router.use((req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
});

router.get('/events', async (req, res) => {
  try {
    const events = await Event.list();
    res.json(events);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/events/add', async (req, res) => {
  try {
    const event = await Event.add(Object.assign({ metadata: { user: req.user.id } }, req.body));
    res.json(event);
  } catch (err) {
    logger.error(err);
    res.json({ error: err.message || err.toString() });
  }
});

router.get('/events/detail/:key', async (req, res) => {
  try {
    const event = await Event.getByKey({ key: req.params.key });
    res.json(event);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

export default router;
