const User = require('../../models/Users');

module.exports = async (req, res, next) => {
  const { email } = req.body;

  //Check if email exists
  await User.findOne({ email })
    .then((user) => {
      if (user) {
        return next({
          status: 400,
          message: 'User already Exists'
        });
      }

      next();
    })
    .catch((error) => {
      next({
        status: 500,
        message: error.message
      });
    });
};
