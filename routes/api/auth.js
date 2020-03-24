const router = require('express').Router();
const { check } = require('express-validator');
const validation = require('../../middleware/validation');
const login = require('../../controller/auth/login');
const password = require('../../controller/auth/password');


router.route('/login')
  .post([
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password is required').exists()
  ], validation, login);

router.route('/forget-password')
  .post([
    check('email', 'Invalid Email').isEmail()
  ], validation, password.forgotPassword);

router.route('/reset-password/:token')
  .patch(password.resetPassword)

module.exports = router;