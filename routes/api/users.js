const router = require('express').Router();

const { check } = require('express-validator');

const validation = require('../../middleware/validation');
const authenticateToken = require('../../middleware/validateToken');
const checkRole = require('../../middleware/checkRole');
const checkUserExists = require('../../controller/users/checkUserExists');
const addUser = require('../../controller/users/addUser');
const password = require('../../controller/auth/password');

const { allUsers } = require('../../controller/users/users');


router.route('/add-user')
  .post([
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
    check('role', 'Please provide user-role').not().isEmpty(),
    check('password_changed_at', 'Specify password changed date').optional().toDate()
  ], validation, authenticateToken, checkRole.restrictTo('Admin', 'Developer'), checkUserExists, addUser);


router.route('/all-users')
  .get(authenticateToken, checkRole.restrictTo('Admin', 'Developer'), allUsers);

router.route('/change-password')
  .post(authenticateToken, password.changePassword);

module.exports = router;