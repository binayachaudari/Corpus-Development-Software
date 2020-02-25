const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const generateToken = require('../../middleware/generateToken');


let saveToDatabase = (user, res, next) => {

  user.save().then(() => {
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    }

    generateToken(payload)
      .then(token => res.json({ token }))
      .catch(err => next({ status: 400, message: err }));
  });

}


module.exports = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = new User({
    name,
    email,
    password,
    role
  });

  bcrypt.genSalt(10).then((salt) => {
    bcrypt.hash(password, salt).then((hash) => {
      user.password = hash;
      saveToDatabase(user, res, next);
    });
  }).catch((err) => {
    next({
      status: 400,
      message: err
    });
  });
}