const nodemailer = require('nodemailer');
const config = require('config');

// ocyujubblmgnqkcp
module.exports = (payload) => {
  const { submitted_to_email, submitted_by_email, submitted_by, submitted_to, submitted_to_role, assignment_type, filename, filepath } = payload;
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
    to: `${submitted_to_email}`,
    bcc: `${submitted_by_email}`,
    subject: `Task Concluded—${assignment_type} (Notification)`,
    html: `<p>Greetings <b>${submitted_to}</b> (${submitted_to_role}),</p><p class="justify">A ${assignment_type.toLowerCase()} task assigned to <b>${submitted_by}</b> with filename <b>(${filename})</b> has been completed.</p><p>Further details of the task has been attached: <b>'Submission-Report.pdf'</b></p></body></html>`,
    attachments: [{
      filename: `Submission-Report.pdf`,
      path: `${filepath}`
    }]
  });
}

