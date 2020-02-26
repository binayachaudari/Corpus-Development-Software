const router = require('express').Router();

/**
 * @route  /api/auth
 * @desc   Middleware for /api/auth
 * @access Public
 */
router.use('/auth', require('./auth'));


/**
 * @route  /api/profile
 * @desc   Middleware for /api/profile
 * @access Protected
 */
router.use('/profile', require('./profile'));


/**
 * @route  /api/users
 * @desc   Middleware for /api/users
 * @access Protected
 */
router.use('/users', require('./users'));


module.exports = router;
