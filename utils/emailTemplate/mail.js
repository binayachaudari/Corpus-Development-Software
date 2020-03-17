const nodemailer = require('nodemailer');
const config = require('config');

// ocyujubblmgnqkcp
module.exports = (payload) => {
  const { assigned_to_email, assigned_by_email, assigned_to, assigned_to_role, assignment_type, filename, filepath } = payload;
  const smtpTransport = nodemailer.createTransport({
    host: config.get('email_host'),
    port: 587,
    auth: {
      user: config.get('email_user'),
      pass: config.get('email_pass')
    }
  });


  smtpTransport.sendMail({
    from: `"Corpus Development Software" thedevgroup@gmail.com`,
    to: `${assigned_to_email}`,
    bcc: `${assigned_by_email}`,
    subject: `New file assigned (Notification)`,
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Corpus Developement Software</title><style>*{box-sizing:border-box;font-family:'Helvetica Neue','Helvetica','Lucida Grande','tahoma',verdana,arial,sans-serif;font-size:16px;text-align:left}</style></head><body><p>Greetings <b>${assigned_to}</b> (${assigned_to_role}),</p><p>You’ve been assigned to ${assignment_type.toLowerCase()} a file <b>(${filename})</b></p><p>Further details of the assignment has been attached: <b>"Assignment-Report.pdf"</b></p></body></html>`,
    attachments: [{
      filename: `Assignment-Report.pdf`,
      path: `${filepath}`
    }]
  });
}