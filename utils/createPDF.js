var pdf = require('html-pdf');
var assignmentPDFTemplate = require('./PDFTemplate/assign.template');
var options = { format: 'A3', orientation: 'landscape' };
const sendMail = require('./emailTemplate/mail');

module.exports = async (payload) => {
  payload.filepath = await createPDF(assignmentPDFTemplate, options, payload)
  sendMail(payload);
}


function createPDF(template, options, payload) {
  let pdfPath = `./Reports/${payload.file_id}.pdf`;

  return new Promise((resolve, reject) => {
    pdf.create(template(payload), options).toFile(pdfPath, function (err, res) {
      if (err) return reject(err);

      return resolve(res.filename);
    });
  });
}