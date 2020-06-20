const User = require('../models/Users');

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.assigned_to }).select('name email role');
    req.body.assigned_by = req.user.id;

    if (!user)
      return next({
        status: 404,
        message: 'Such user does not exits.'
      });

    if (!['Linguist', 'Reviewer'].includes(user.role))
      return next({
        status: 400,
        message: `Cannot assign task to ${user.role}`
      });

    next();
  } catch (error) {
    next({
      status: 500,
      message: error.message
    });
  }
};
