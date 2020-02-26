const user = require('../../models/Users');

let allUsers = async (req, res, next) => {
  try {
    const listOfUsers = await user.find();
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