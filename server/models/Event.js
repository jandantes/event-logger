import mongoose, { Schema } from 'mongoose';

const mongoSchema = new Schema({
  key: {
    type: Schema.Types.ObjectId,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Schema.Types.Mixed,
  },
});

class EventClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const events = await this.find({})
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit);
    return { events };
  }

  static async getByKey({ key }) {
    const eventDoc = await this.findOne({ key });
    if (!eventDoc) {
      throw new Error('Event not found');
    }

    const event = eventDoc.toObject();
    return event;
  }

  static async add() {
    return this.create();
  }
}

mongoSchema.loadClass(EventClass);

const Event = mongoose.model('Event', mongoSchema);

export default Event;
