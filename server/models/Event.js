const mongoose = require('mongoose');
const moment = require('moment');

const publicId = require('mongoose-public-id');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  key: String,
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  metadata: {
    type: Schema.Types.Mixed,
    validate: {
      validator: function valueExists(value) {
        return Object.keys(value).length !== 0;
      },
      message: 'metadata has no properties',
    },
    required: [true, 'metadata is required'],
  },
}, {
  timestamps: {
    createdAt: 'timestamp',
  },
});

class EventClass {
  static async list({
    offset = 0,
    limit = 10,
    start,
    end,
    key,
  } = {}) {
    const format = 'YYYY-MM-DD HH:mm:ss';
    let query = {};
    if (start && end) {
      const startString = moment(start, format);
      const endString = moment(end, format);
      query = {
        timestamp: {
          $gte: startString,
          $lt: endString,
        },
      };
    }

    // Optional query by key, this will return an array
    // /events/detail/key should be used for querying by key

    if (key) {
      query.key = key;
    }

    const count = await this.find(query).count();
    const events = await this.find(query)
      .sort({ timestamp: -1 })
      .skip(parseInt(offset, 10))
      .limit(parseInt(limit, 10));
    return {
      events,
      count,
    };
  }

  static async getByKey({ key }) {
    const eventDoc = await this.findOne({ key });
    if (!eventDoc) {
      throw new Error('Event not found');
    }

    const event = eventDoc.toObject();
    return event;
  }

  static async removeByKey({ key }) {
    const eventDoc = await this.findOneAndRemove({ key });
    if (!eventDoc) {
      throw new Error('Event not found');
    }

    return true;
  }

  static async add({
    createdBy,
    metadata,
  }) {
    return this.create({
      createdBy,
      metadata,
    });
  }
}

mongoSchema.plugin(publicId, {
  namespace: 'ae',
  index: true,
  fieldName: 'key',
});

mongoSchema.loadClass(EventClass);

const Event = mongoose.model('Event', mongoSchema);

module.exports = Event;
