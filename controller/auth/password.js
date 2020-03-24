const crypto = require('crypto');
const User = require('../../models/Users');
const notify = require('../../utils/emailTemplate/passwordReset.mail');

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
      resetURL: `${req.protocol}://${req.host}/reset-password/${resetToken}`,
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
    })
  }
}

exports.resetPassword = async (req, res, next) => {

}