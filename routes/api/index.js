const router = require('express').Router();

/**
 * @route  /api/auth
 * @desc   Middleware for /api/auth
 * @access Public
 */
router.use('/auth', require('./auth'));

/**
 * @route  /api/translation
 * @desc   Middleware for /api/translation
 * @access Protected
 */
router.use('/translation', require('./translation'));

/**
 * @route  /api/review
 * @desc   Middleware for /api/review
 * @access Protected
 */
router.use('/review', require('./review'));

/**
 * @route  /api/users
 * @desc   Middleware for /api/users
 * @access Protected
 */
router.use('/users', require('./users'));

module.exports = router;
