const fs = require('fs');
const path = require('path');
const Review = require('../../models/Review');
const Files = require('../../models/Files');
const Users = require('../../models/Users');
const notifyUser = require('../../utils/createPDF.submit');


exports.getAllFiles = async (req, res, next) => {
  try {
    const allFiles = await Review.find()
      .populate('assigned_to assigned_by', ['name', 'email', 'role'])
      .populate('file_details', ['filename', 'start_index', 'end_index', 'is_translated', 'is_reviewed']);

    res.json({
      allFiles
    })
  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
}

exports.getMyFiles = async (req, res, next) => {
  try {
    let myFiles = await Review.find({ assigned_to: req.user.id })
      .populate('assigned_to assigned_by', ['name', 'email', 'role'])
      .populate('file_details', ['-source_filename']);

    if (!myFiles.length > 0) {
      return next({
        status: 200,
        message: 'No any files assigned!'
      });
    }

    res.json({ myFiles });

  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
}

exports.getTranslatedFiles = async (req, res, next) => {
  try {
    const assignedReviewFiles = await Review.find().select('file_details');
    let arrOfAssignedReviewFiles = [];
    assignedReviewFiles.map(item => {
      arrOfAssignedReviewFiles.push(item.file_details);
    });

    const translatedFiles = await Files.find({ is_translated: true, _id: { $nin: arrOfAssignedReviewFiles } });

    if (!translatedFiles.length > 0) {
      return next({
        status: 200,
        message: '0 Files Translated!'
      });
    }

    res.json({ translatedFiles });

  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
}

exports.getTranslatedText = async (req, res, next) => {
  try {
    let reviewFile = await Review.findOne({ _id: req.params.file_id, assigned_to: req.user.id })
      .populate('assigned_to assigned_by', ['name', 'email', 'role'])
      .populate('file_details', ['-source_filename']);

    if (!reviewFile)
      return next({
        status: 404,
        message: 'Error!! Such file does not exists!'
      });

    if (reviewFile.status == 'assigned') {
      reviewFile.status = 'under_review';
      await reviewFile.save();
    }

    const { nepali_filename, tamang_filename } = reviewFile;

    let nepali_text = await readLineZero(nepali_filename, 'Nepali');
    let tamang_text = await readLineZero(tamang_filename, 'Tamang');

    res.json({
      status: 200,
      translated_texts: {
        nepali_text,
        tamang_text
      }
    });

  } catch (error) {
    next({
      status: error.status || 404,
      message: error.message
    });
  }
}

function readLineZero(filename, language) {
  let readableStream = fs.createReadStream(path.join(__dirname, `../../Datastore/AssignedFiles/Review/${language}`, filename), { encoding: 'utf8' });

  return new Promise((resolve, reject) => {
    let buffer = '';

    readableStream.on('data', DataChunk => {
      buffer += DataChunk;
      if (buffer.split('\n').length >= 2)
        readableStream.emit('end');
    });

    //Throw Error
    readableStream.on('error', error => error.errno === -2 ? reject({ status: 200, message: 'Translation Complete' }) : reject(error));


    //Return line
    readableStream.on('end', () => {
      let data = buffer.split('\n')[0];
      resolve(data);
    })
  });
}

exports.updateTranslation = async (req, res, next) => {
  try {
    let { tamang_text } = req.body;

    let reviewFile = await Review.findOne({ _id: req.params.file_id, assigned_to: req.user.id })
      .populate('file_details', ['-source_filename']);

    if (!reviewFile)
      return next({
        status: 404,
        message: 'Error!! Such file does not exists!'
      });

    const { nepali_filename, tamang_filename, assigned_by } = reviewFile;
    const { start_index, end_index } = reviewFile.file_details;
    const numOfSentences = end_index - start_index + 1;

    let reviewed_filename = `Reviewed__${start_index}-to-${end_index}__${numOfSentences}-sentences`;

    const nepali_text = await readLineZero(nepali_filename, 'Nepali');
    appendLine(reviewed_filename, nepali_text, tamang_text);

    updateAssignedFiles(nepali_filename, 'Nepali');

    if (reviewFile.status == 'under_review' &&
      updateAssignedFiles(tamang_filename, 'Tamang')) {
      reviewFile.status = 'review_complete';

      if (Date.now() > Date.parse(reviewFile.deadline))
        reviewFile.is_overdue = true;

      reviewFile.submitted_on = Date.now();
      reviewFile.nepali_filename = `${reviewed_filename}.nep`;
      reviewFile.tamang_filename = `${reviewed_filename}.taj`;
      await Files.findByIdAndUpdate(reviewFile.file_details._id, { $set: { is_reviewed: true } });
      await reviewFile.save();

      let submittingUserDetails = await Users.findById(req.user.id);
      let assignedByDetails = await Users.findById(assigned_by);

      const pdfPayload = {
        assignment_type: `Review`,
        submitted_by_email: submittingUserDetails.email,
        submitted_by: submittingUserDetails.name,
        filename: `${reviewFile.tamang_filename} & ${reviewFile.nepali_filename}`,
        file_id: reviewFile._id,
        num_of_sentences: numOfSentences,
        submitted_to_email: assignedByDetails.email,
        submitted_to: assignedByDetails.name,
        submitted_to_role: assignedByDetails.role,
        start_index,
        end_index,
        deadline: reviewFile.deadline,
        is_overdue: reviewFile.is_overdue
      }

      await notifyUser(pdfPayload);
    }

    res.json({
      status: 'success',
      nepali_text,
      tamang_text
    });

  } catch (error) {
    next({
      status: error.status || 404,
      message: error.message
    });
  }
}

function appendLine(filename, nepali_text, tamang_text) {
  fs.appendFileSync(path.join(__dirname, '../../Datastore/Reviewed/Nepali', `${filename}.nep`), nepali_text + '\n');

  fs.appendFileSync(path.join(__dirname, '../../Datastore/Reviewed/Tamang', `${filename}.taj`), tamang_text + '\n')
}


function updateAssignedFiles(filename, language) {
  filePath = path.join(__dirname, `../../Datastore/AssignedFiles/Review/${language}`, filename);
  let readData = fs.readFileSync(filePath, { encoding: 'utf8' });

  let arrayOfData = readData.split('\n');

  if (arrayOfData.length === 2) {
    fs.unlinkSync(filePath);
    return true;
  } else {
    let writeData = arrayOfData.slice(1).join('\n');
    fs.writeFileSync(filePath, writeData);
  }

  return false;
}

exports.detailsOfFileID = async (req, res, next) => {
  try {
    const { file_id } = req.params;
    const file_details = await Review.findById(file_id)
      .populate('assigned_to assigned_by', ['name', 'email', 'role'])
      .populate('file_details', ['filename', 'start_index', 'end_index', 'is_translated', 'is_reviewed']);

    res.json({
      file_details
    });
  } catch (error) {
    next({
      status: 404,
      message: 'Such file does not exist!'
    });
  }
}