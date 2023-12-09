const { Schema, model } = require('mongoose');
const { hashSync, compareSync } = require('bcryptjs');

/**
 * @description a base user model with some useful methods
 * to set password and hash settings
 */

// schema options
const opts = { toObject: { virtuals: true }, toJSON: { virtuals: true } };
const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    hash: {
      type: String,
    },
  },
  opts,
);

// Virtual for user's full name
UserSchema.virtual('fullName')
  // eslint-disable-next-line func-names
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

/* eslint-disable */
UserSchema.methods.setPassword = function (password) {
  try {
    const user = this;
    const hash = hashSync(password, 8, this.password);
    user.password = hash;
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
// eslint-disable-next-line func-names
UserSchema.methods.validPassword = function (password) {
  try {
    return compareSync(password, this.password);
  } catch (error) {
    throw new Error(error.message);
  }
};

/* eslint-disable */
UserSchema.methods.setHash = function (hash) {
  try {
    const user = this;
    user.hash = hash;
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

UserSchema.index({ email: 1 });

module.exports = model('user', UserSchema);
