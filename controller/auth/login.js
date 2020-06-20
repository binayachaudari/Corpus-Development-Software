const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const generateToken = require('../../middleware/generateToken');

module.exports = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email }).select('+password');

    if (!user)
      return next({
        status: 400,
        message: 'Invalid credentials!'
      });

    //Password Authentication
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      return next({
        status: 400,
        message: 'Invalid credentials!'
      });

    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };

    //Return JWT Token
    const token = await generateToken(payload);

    res.json({ token });
  } catch (error) {
    next({
      status: 500,
      message: error.message
    });
  }
};
