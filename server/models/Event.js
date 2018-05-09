import mongoose, { Schema } from 'mongoose';
import publicId from 'mongoose-public-id';

const mongoSchema = new Schema({
  key: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
});

class EventClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const count = await this.find().count();
    const events = await this.find({})
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

export default Event;
