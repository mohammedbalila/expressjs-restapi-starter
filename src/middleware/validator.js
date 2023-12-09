const { User } = require('../models');

/**
 * @description validators file to validate and sanitize user's
 * input before sending it to the handlers
 */

module.exports = {
  /**
   * @description it makes sure that users can't use
   * the same email twice
   */
  isUnique: async (req, res, next) => {
    const { email } = req.body;
    const notUniqueEmail = await User.findOne({ email });
    if (notUniqueEmail) {
      return res.json({ message: 'This email was used' });
    }
    return next();
  },
};
