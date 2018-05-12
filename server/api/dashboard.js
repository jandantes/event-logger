const express = require('express');
const jwt = require('jwt-simple');

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

router.get('/', async (req, res) => {
  try {
    const events = await Event.aggregate([{
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
        },
        count: { $sum: 1 },
      },
    }, {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
      },
    }, {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $substr: ['$_id.day', 0, 1] }, '-',
            { $substr: ['$_id.month', 0, 2] }, '-',
            { $substr: ['$_id.year', 0, 4] },
          ],
        },
        count: 1,
      },
    }]);
    res.json(events);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
});

module.exports = router;
