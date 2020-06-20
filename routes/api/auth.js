const router = require('express').Router();
const { check } = require('express-validator');
const validation = require('../../middleware/validation');
const login = require('../../controller/auth/login');
const password = require('../../controller/auth/password');
const rateLimit = require('express-rate-limit');
const authenticateToken = require('../../middleware/validateToken');


const authLimiter = rateLimit({
  skipSuccessfulRequests: true,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: "You are blocked from performing this request, try again later."
  },
});


const forgetLimiter = rateLimit({
  skipFailedRequests: true,
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: "You are blocked from performing this request, try again later."
  },
});

router.route('/')
  .get(require('../../middleware/validateToken'), require('../../controller/users/users').getUser);

router.route('/login')
  .post([
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password is required').notEmpty()
  ], validation, authLimiter, login);

router.route('/forget-password')
  .post([
    check('email', 'Invalid Email').isEmail()
  ], validation, forgetLimiter, password.forgotPassword);

router.route('/reset-default-password')
  .patch([
    check('new_password', 'Password must be at least 8 characters').isLength({ min: 8 })
  ], validation, authenticateToken, password.resetDefaultPassword);

router.route('/reset-password/:token')
  .patch([
    check('password', 'Password must be atleast 8 characters').isLength({ min: 8 })
  ], password.resetPassword);

router.route('/change-password')
  .post([
    check('current_password', 'Please enter your current password').notEmpty(),
    check('new_password', 'New password must be atleast 8 character').isLength({ min: 8 })
  ], validation, authenticateToken, password.changePassword);

module.exports = router;
