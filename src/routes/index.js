const { Router } = require('express');
const users = require('./users');

/**
 * @description register all of your routes here and they will be
 * automatically imported in the app.js and mapped correctly
 */

const router = Router();
router.use('/users', users);

module.exports = router;
