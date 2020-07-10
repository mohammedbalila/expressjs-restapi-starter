const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');
const { User } = require('../models');

/**
 * @description authentication config with passportjs
 */

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_KEY || 'key_for_test_env';

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
      },
      (email, password, done) => {
        User.findOne({ email }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: 'Incorrect email.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      },
    ),
  );

  passport.use(
    new JwtStrategy(opts, (jwtPayload, done) => {
      // eslint-disable-next-line consistent-return
      User.findById(jwtPayload.id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    }),
  );
};
