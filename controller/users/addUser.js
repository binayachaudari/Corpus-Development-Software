const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const generateToken = require('../../middleware/generateToken');