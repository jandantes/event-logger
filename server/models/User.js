import _ from 'lodash';
import mongoose, { Schema } from 'mongoose';
import jwt from 'jwt-simple';

import generateSlug from '../utils/slugify';

require('dotenv').config();

const mongoSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  googleToken: {
    type: Schema.Types.Mixed,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  displayName: String,
  avatarUrl: String,
  token: String,
});

class UserClass {
  static publicFields() {
    return [
      'id',
      'displayName',
      'email',
      'avatarUrl',
      'slug',
      'isAdmin',
      'token',
    ];
  }

  static search(query) {
    return this.find(
      {
        $or: [
          { displayName: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
        ],
      },
      UserClass.publicFields().join(' '),
    );
  }

  static async signInOrSignUp({
    googleId, email, googleToken, displayName, avatarUrl,
  }) {
    const user = await this.findOne({ googleId }).select(UserClass.publicFields().join(' '));

    if (user) {
      const modifier = {};
      if (googleToken.accessToken) {
        modifier.access_token = googleToken.accessToken;
      }

      if (googleToken.refreshToken) {
        modifier.refresh_token = googleToken.refreshToken;
      }

      if (_.isEmpty(modifier)) {
        return user;
      }

      await this.updateOne({ googleId }, { $set: modifier });

      return user;
    }

    const slug = await generateSlug(this, displayName);
    const userCount = await this.find().count();

    const newUser = await this.create({
      createdAt: new Date(),
      googleId,
      email,
      googleToken,
      displayName,
      avatarUrl,
      slug,
      isAdmin: userCount === 0,
    });

    // THIS IS A TEMP SOLUTION FOR THIS TEST ONLY AND SHOULD NOT BE USED IN PRODUCTION
    // Generate token upon creation of new user for api consumption.
    // TODO: Access token exchange endpoint
    const payload = {
      sub: newUser._id,
      iat: Date.now,
    };
    const jwtSecret = process.env.JWT_SECRET;
    const token = await jwt.encode(payload, jwtSecret);

    const modifier = {
      token,
    };

    const updatedUser = await this.findByIdAndUpdate(newUser._id, modifier);

    return _.pick(updatedUser, UserClass.publicFields());
  }
}

mongoSchema.loadClass(UserClass);

const User = mongoose.model('User', mongoSchema);

export default User;
