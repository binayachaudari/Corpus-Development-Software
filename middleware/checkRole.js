module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //Roles ['admin',...]

    if (!roles.includes(req.user.role))
      return ({
        status: 403,
        message: 'You do not have permission to perform this action.'
      });

    next();
  }
}