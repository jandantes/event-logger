const express = require('express');
const jwt = require('jwt-simple');
const moment = require('moment');

const Event = require('../models/Event');

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

  if (payload) {
    req.user = { id: payload.sub };
  }

  next();
});

router.post('/', async (req, res) => {
  const pipeline = [{
    $group: {
      _id: {
        date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
      },
      count: { $sum: 1 },
    },
  }, {
    $sort: {
      '_id.date': 1,
    },
  }, {
    $project: {
      _id: 0,
      date: '$_id.date',
      count: 1,
    },
  }];

  const request = req.body;
  const filterTime = request.start && request.end;

  if (filterTime) {
    pipeline.unshift({
      $match: {
        timestamp: {
          $gte: moment(request.start).toDate(),
          $lte: moment(request.end).toDate(),
        },
      },
    });
  }

  if (request.key) {
    pipeline.unshift({
      $match: {
        key: request.key,
      },
    });
  }

  try {
    const events = await Event.aggregate(pipeline);
    res.json(events);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

router.post('/list', async (req, res) => {
  const query = {};
  const request = req.body;
  const filterTime = request.start && request.end;

  if (filterTime) {
    query.timestamp = {
      $gte: moment(request.start).toDate(),
      $lte: moment(request.end).toDate(),
    };
  }

  if (request.key) {
    query.key = request.key;
  }
  try {
    const events = await Event
      .find(query)
      .limit(10)
      .skip(parseInt(request.skip, 10) || 0)
      .sort({ timestamp: 1 });
    const count = await Event.find(query).count();
    res.json({ events, count });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
