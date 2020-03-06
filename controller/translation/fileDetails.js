const fs = require('fs');
const path = require('path');
const Translation = require('../../models/Translation');
const Files = require('../../models/Files');

/**
 * Get each line of Nepali Text
 * @param {String} filename - Filename of Assigned File
 */
let getNepaliText = (filename) => {
  let readableStream = fs.createReadStream(path.join(__dirname, '../../Datastore/AssignedFiles', filename), { encoding: 'utf8' });

  return new Promise((resolve, reject) => {

    let buffer = '';

    readableStream.on('data', dataChunk => {
      buffer += dataChunk;
      if (buffer.split('\n').length >= 2)
        readableStream.emit("end");
    });

    // Throw Error
    readableStream.on('error', error => reject(error));

    //Returns line
    readableStream.on('end', () => {
      let data = buffer.split('\n')[0];
      resolve(data);
    });

  });
}

/**
 * Appends translation text to respective files
 * @param {String} filename - Filename to translation text
 * @param {String} nepali_text - Nepali text
 * @param {String} tamang_text - Translated text
 */
let appendTranslation = (filename, nepali_text, tamang_text) => {
  fs.appendFileSync(path.join(__dirname, '../../Datastore/Translated/Nepali', `NEPALI${filename}`), nepali_text + '\n');
  fs.appendFileSync(path.join(__dirname, '../../Datastore/Translated/Tamang', `TAMANG${filename}`), tamang_text + '\n');
}


/**
 * Updates assigned file by removing translated text
 * @param {String} filename - Filename of assigned file to modify
 */
let editAssignedFiles = (filename) => {
  let readData = fs.readFileSync(path.join(__dirname, '../../Datastore/AssignedFiles', filename), 'utf-8');
  let arrayOfData = readData.split('\n');

  if (arrayOfData.length === 2) {
    fs.unlinkSync(path.join(__dirname, '../../Datastore/AssignedFiles', filename))
    return true;
  }
  else {
    let writeData = arrayOfData.slice(1).join('\n');
    fs.writeFileSync(path.join(__dirname, '../../Datastore/AssignedFiles', filename), writeData);
  }

  return false;
}


/**
 * Middleware
 * Get all Translation assigned files
 */
let getAllFiles = async (req, res, next) => {
  try {
    const allFiles = await Translation.find().populate('assigned_to assigned_by', ['name', 'email', 'role']).populate('file_details', ['filename', 'start_index', 'end_index', 'is_translated', 'is_reviewed']);
    res.json({
      allFiles
    });
  } catch (error) {
    next({
      status: 400,
      message: error.message
    });
  }
}


/**
 * Middleware
 * Get all the files assigned to current user
 */
let getMyFiles = async (req, res, next) => {
  try {
    let myFiles = await Translation.find({ assigned_to: req.user.id }).populate('assigned_to assigned_by', ['name', 'email', 'role']).populate('file_details', ['-source_filename']);

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


/**
 * Middleware
 * Gets sigle line text from respective assigned fileID
 */
let translationText = async (req, res, next) => {
  try {
    let translationFile = await Translation.findOne({ _id: req.params.file_id, assigned_to: req.user.id }).populate('assigned_to assigned_by', ['name', 'email', 'role']).populate('file_details', ['-source_filename']);

    if (!translationFile)
      return next({
        status: 404,
        message: 'Error!! Such file does not exists!'
      });

    if (translationFile.status == 'assigned') {
      translationFile.status = 'under_translation'
      await translationFile.save();
    }

    let nepali_text = await getNepaliText(translationFile.file_details.filename);

    res.json({
      file_details: translationFile,
      nepali_text
    });
  } catch (error) {
    next({
      status: 404,
      message: 'Error!! Such file does not exists!'
    });
  }
}


/**
 * Middleware
 * Adds translation text of assigned fileID to respective files 
 * and updates file status
 */
let addTranslationText = async (req, res, next) => {
  try {
    let { tamang_text } = req.body;

    let translationFile = await Translation.findOne({ _id: req.params.file_id, assigned_to: req.user.id }).populate('file_details', ['-source_filename']);

    if (!translationFile)
      return next({
        status: 404,
        message: 'Error!! Such file does not exists!'
      });

    const { filename, start_index, end_index } = translationFile.file_details;
    const numOfSentences = end_index - start_index + 1;

    let translated_filename = `__${start_index}-to-${end_index}__${numOfSentences}-sentences.txt`
    let nepali_text = await getNepaliText(filename);

    appendTranslation(translated_filename, nepali_text, tamang_text);

    if (translationFile.status == 'under_translation' && editAssignedFiles(filename)) {
      translationFile.status = 'translation_complete';
      let files = await Files.findByIdAndUpdate(translationFile.file_details._id, { $set: { is_translated: true } });
      await translationFile.save();
    }

    res.json({
      status: 'success',
      nepali_text,
      tamang_text
    });
  } catch (error) {
    next({
      status: 404,
      message: error.errno === -2 ? 'Translation Complete' : error.message
    });
  }
}

module.exports = {
  getAllFiles,
  getMyFiles,
  translationText,
  addTranslationText
}