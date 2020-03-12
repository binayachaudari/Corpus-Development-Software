const fs = require('fs');
const path = require('path');
const Review = require('../../models/Review');
const Files = require('../../models/Files');
const Users = require('../../models/Users');


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