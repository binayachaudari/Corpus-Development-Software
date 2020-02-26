const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/Users');


module.exports = async (req, res, next) => {
  const jwtSecret = config.get('jwtSecret') || process.env.jwtSecret;

  let token;
  if (req.headers['authorization'])
    token = req.headers('authorization');

  if (req.headers['x-access-token'])
    token = req.headers['x-access-token'];

  if (req.headers['token'])
    token = req.headers['token'];

  if (req.query['token'])
    token = req.query['token'];

  if (!token) {
    return next({
      status: 401,
      message: "Unauthorized Access!"
    });
  }

  try {
    const decoded = await jwt.verify(token, jwtSecret);

    //Check if user exists
    const userID = await User.findById(req.user.id);
    if (!userID)
      return next({
        status: 401,
        message: "Unauthorized Access, user no longer exists."
      });

    //Check if password has changed
    if (userID.changedPasswordAfter(decoded.iat))
      return next({
        status: 401,
        message: "Credentials has been changed, login required!"
      })

    req.user = decoded.user;
    next();
  } catch (err) {
    next({
      status: 403,
      message: err.message
    })
  }
}