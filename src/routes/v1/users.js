const { Router } = require('express');
const passport = require('passport');
const {
  signup,
  login,
  findAll,
  findOne,
  confirm,
  updateOne,
} = require('../../controllers/user');
const { isUnique } = require('../../middleware/validator');

const router = Router();

/**
 * @description the basic user functions you can add or remove from them as
 * you wish
 */

router.post('/signup', isUnique, signup);
router.post('/login', login);
router.get('/', findAll);
router.get('/:id', findOne);
router.put('/:id', passport.authenticate('jwt', { session: false }), updateOne);
router.get('/confirm/:hash', confirm);

module.exports = router;
