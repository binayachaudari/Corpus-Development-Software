const user = require('../../models/Users');

let allUsers = async (req, res, next) => {
  try {
    const listOfUsers = await user.find();

    //Check if query string Exists
    if (Object.keys(req.query).length !== 0) {

      //Valid qusery role
      if (req.query.role && ['admin', 'developer', 'linguist', 'reviewer'].includes(req.query.role.toLowerCase()))
        return res.json(listOfUsers.filter(value => value.role.toLowerCase() === req.query.role.toLowerCase()));
      else
        return next({
          status: 400,
          message: "Invalid query: role, role includes [Admin, Developer, Linguist, Reviewer]"
        });
    }

    res.json(listOfUsers);
  } catch (error) {
    next({
      status: 500,
      message: error.message
    });
  }
}

module.exports = {
  allUsers
}