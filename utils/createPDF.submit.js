var pdf = require('html-pdf');
var submitPDFTemplate = require('./PDFTemplate/complete.template');
var options = { format: 'A3', orientation: 'landscape', timeout: '100000' };
const sendMail = require('./emailTemplate/submit.mail');

module.exports = async (payload) => {
  payload.filepath = await createPDF(submitPDFTemplate, options, payload)
  sendMail(payload);
}


function createPDF(template, options, payload) {
  let pdfPath = `./Reports/Submit/${payload.file_id}.pdf`;

  return new Promise((resolve, reject) => {
    pdf.create(template(payload), options).toFile(pdfPath, function (err, res) {
      if (err) return reject(err);

      return resolve(res.filename);
    });
  });
}