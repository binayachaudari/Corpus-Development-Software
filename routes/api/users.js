const router = require('express').Router();
const { check } = require('express-validator');

const validation = require('../../middleware/validation');
const checkUserExists = require('../../controller/users/checkUserExists');

const addUser = require('../../controller/users/addUser');

const { allUsers } = require('../../controller/users/users');

router.route('/add-user')
  .post([
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password must be atleast 8 characters').isLength({ min: 8 }),
    check('role', 'Please provide user-role').not().isEmpty()
  ], validation, checkUserExists, addUser);


router.route('/all-users')
  .get(allUsers);


module.exports = router;