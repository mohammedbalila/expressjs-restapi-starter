const passport = require('passport');
const jwt = require('jsonwebtoken');
const { uuid } = require('uuidv4');
const _ = require('lodash');
const { User } = require('../models');
const { confirm: confirmEmail } = require('../config/mail');

// eslint-disable-next-line import/prefer-default-export
module.exports = {
  signup: async (req, res) => {
    try {
      const fields = _.pick(req.body, [
        'email',
        'password',
        'firstName',
        'lastName',
      ]);

      const user = new User(fields);

      const hash = uuid();
      user.setPassword(fields.password);
      user.setHash(hash);

      await user.save();
      await confirmEmail(fields.email, hash);

      return res.json({ message: 'Account was created', error: false });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  login: async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.json({ info });
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_KEY);

      return res.json({ user, token });
    })(req, res, next);
  },

  findAll: async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;

    try {
      const users = await User.find({}, { password: 0, hash: 0 })
        .limit(+limit)
        .skip(+offset);

      return res.json({ users });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  findOne: async (req, res) => {
    const { id: _id } = req.params;

    try {
      const user = await User.findOne({ _id }, { password: 0, hash: 0 });

      if (!user) {
        return res.status(404).json({ message: 'User was not found' });
      }

      return res.json({ user });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  updateOne: async (req, res) => {
    const fields = _.pick(req.body, ['firstName', 'lastName', 'email']);

    const { id: _id } = req.user;

    try {
      const user = await User.updateOne({ _id }, fields, {
        runValidators: true,
      });

      return res.json({ message: 'updated successfully', user });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  confirm: async (req, res, next) => {
    try {
      const { hash } = req.params;
      const user = await User.findOne({ hash });

      if (!user) {
        return res.status(403).json('invalid link');
      }

      if (hash !== user.hash) {
        return res.status(401).send('invalid link');
      }

      user.isConfirmed = true;
      user.hash = '';
      await user.save();

      return res.json({ message: 'email has been activated successfully' });
    } catch (error) {
      return next(error);
    }
  },
};
