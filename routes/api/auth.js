const router = require('express').Router();
const { check } = require('express-validator');
const validation = require('../../middleware/validation');
const login = require('../../controller/auth/login');


router.route('/login')
  .post([
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password is required').exists()
  ], validation, login);

module.exports = router;