const crypto = require('crypto');
const User = require('../../models/Users');
const bcrypt = require('bcryptjs');
const notify = require('../../utils/emailTemplate/passwordReset.mail');
const generateToken = require('../../middleware/generateToken');

exports.forgotPassword = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.body.email });

    if (!userDetails) {
      return next({
        status: 404,
        message: `${req.body.email} does not exist.`
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    userDetails.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    userDetails.password_reset_expires = Date.now() + 10 * 60 * 1000;
    let today = new Date;

    let emailPayload = {
      name: userDetails.name,
      email: userDetails.email,
      role: userDetails.role,
      resetURL: `${req.protocol}://${req.hostname}:${req.port}/reset-password/${resetToken}`,
      year: today.getFullYear()
    }
    await userDetails.save();
    notify(emailPayload);

    res.json({ status: 200, message: `Password resend link has been sent to ${emailPayload.email}, valid for only 10 minutes` });
  } catch (error) {
    userDetails.password_reset_token = undefined;
    userDetails.password_reset_expires = undefined;
    await userDetails.save();

    next({
      status: 500,
      message: 'There was an error sending the email. Try again later!'
    });
  }
}

exports.resetDefaultPassword = async (req, res, next) => {
  try {
    const { new_password } = req.body
    const user = await User.findById(req.user.id);

    user.password = await encryptPassword(new_password);
    user.activated = true

    await user.save();
    res.json({ status: 200, message: 'Password has been changed' });
  } catch (error) {
    next({
      status: 500,
      message: error.message
    });
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const userDetails = await User.findOne({
      password_reset_token: hashedToken,
      password_reset_expires: {
        $gt: Date.now()
      }
    });

    if (!userDetails) {
      return next({
        status: 500,
        message: `Invalid token or has expired!`
      })
    }

    userDetails.password = await encryptPassword(req.body.password);

    userDetails.password_reset_token = undefined;
    userDetails.password_reset_expires = undefined;
    await userDetails.save();

    const payload = {
      user: {
        id: userDetails.id,
        name: userDetails.name,
        role: userDetails.role
      }
    };
    //Return JWT Token
    const token = await generateToken(payload);
    res.json({ token })
  } catch (error) {
    next({
      status: 500,
      message: 'Invalid token or has expired!'
    });
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findById(req.user.id).select('password');

    const isMatched = await bcrypt.compare(current_password, user.password);
    if (!isMatched) {
      return next({
        status: 400,
        message: 'Invalid password!'
      });
    }

    user.password = await encryptPassword(new_password);

    await user.save();

    res.json({ status: 200, message: 'Password has been changed' });
  } catch (error) {
    next({
      status: 500,
      message: error.message
    });
  }
}

async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}