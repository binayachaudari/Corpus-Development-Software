const fs = require('fs');
const path = require('path');
const Review = require('../../models/Review');
const Files = require('../../models/Files');
const Users = require('../../models/Users');
const notifyUser = require('../../utils/createPDF.assign');

exports.addReviewTask = async (req, res, next) => {
  try {
    const { file_id, assigned_to, assigned_by, deadline } = req.body;

    let userDetails = await Users.findById(assigned_to);
    if (userDetails.role !== 'Reviewer')
      return next({
        status: 400,
        message: `Must assign Review task to only Reviewer, invalid assignment to ${userDetails.role}`
      });

    const assignedFile = await Files.findById(file_id);

    const { start_index, end_index } = assignedFile;
    const numOfSentences = end_index - start_index + 1;

    const filenameStructure = `__${start_index}-to-${end_index}__${numOfSentences}-sentences`;

    const newReviewFile = new Review({
      tamang_filename: `taj-review${filenameStructure}.txt`,
      nepali_filename: `nep-review${filenameStructure}.txt`,
      file_details: file_id,
      assigned_to,
      assigned_by,
      deadline
    });
    await newReviewFile.save();

    let assignedByDetails = await Users.findById(assigned_by);
    const pdfPayload = {
      assignment_type: `Review`,
      assigned_to_email: userDetails.email,
      assigned_to: userDetails.name,
      assigned_to_role: userDetails.role,
      filename: `${newReviewFile.tamang_filename} & ${newReviewFile.nepali_filename}`,
      file_id: newReviewFile._id,
      num_of_sentences: numOfSentences,
      assigned_by_email: assignedByDetails.email,
      assigned_by: assignedByDetails.name,
      start_index,
      end_index,
      deadline,
    }

    await notifyUser(pdfPayload);

    await copyFileForReview(filenameStructure, 'Nepali');
    await copyFileForReview(filenameStructure, 'Tamang');

    res.json({ task_assigned: newReviewFile });
  } catch (error) {
    next({
      error: 400,
      message: error.message
    });
  }
}


async function copyFileForReview(filenameStructure, language) {
  const translatedFilePath = path.join(__dirname, `../../DataStore/Translated/${language}`, `${language.toUpperCase()}${filenameStructure}.txt`);

  let fileExt = language === 'Nepali' ? 'nep' : 'taj';

  const reviewFileDestination = path.join(__dirname, `../../DataStore/AssignedFiles/Review/${language}`, `${fileExt}-review${filenameStructure}.txt`)

  fs.copyFileSync(translatedFilePath, reviewFileDestination)

  console.log(`File copied for review: ${fileExt}-review${filenameStructure}.txt`);
}