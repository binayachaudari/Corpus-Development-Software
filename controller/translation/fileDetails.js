const fs = require('fs');
const path = require('path');
const Translation = require('../../models/Translation');


let getNepaliText = (filename) => {
  let readableStream = fs.createReadStream(path.join(__dirname, '../../Datastore/AssignedFiles', filename), { encoding: 'utf8' });

  return new Promise((resolve, reject) => {

    let buffer = '';

    readableStream.on('data', dataChunk => {
      buffer += dataChunk;
      if (buffer.split('\n').length >= 2)
        readableStream.emit("end");
    });

    readableStream.on('error', error => reject(error));

    readableStream.on('end', () => {
      let data = buffer.split('\n')[0];
      resolve(data);
    });

  });
}

let appendTranslation = (filename, nepali_text, tamang_text) => {
  fs.appendFileSync(path.join(__dirname, '../../Datastore/Translated/Nepali', `NEPALI${filename}`), nepali_text + '\n');
  fs.appendFileSync(path.join(__dirname, '../../Datastore/Translated/Tamang', `TAMANG${filename}`), tamang_text + '\n');
}

let editAssignedFiles = (filename) => {
  let readData = fs.readFileSync(path.join(__dirname, '../../Datastore/AssignedFiles', filename), 'utf-8');

  let writeData = readData.split('\n').slice(1).join('\n');
  fs.writeFileSync(path.join(__dirname, '../../Datastore/AssignedFiles', filename), writeData);
}


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


let translationText = async (req, res, next) => {
  try {
    let translationFile = await Translation.findById(req.params.file_id).populate('assigned_to assigned_by', ['name', 'email', 'role']).populate('file_details', ['-source_filename']);

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


let addTranslationText = async (req, res, next) => {
  try {
    let { tamang_text } = req.body;

    let translationFile = await Translation.findById(req.params.file_id).populate('file_details', ['-source_filename']);

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
    editAssignedFiles(filename);

    res.json({
      status: 'success',
      nepali_text,
      tamang_text
    });
  } catch (error) {
    next({
      status: 404,
      message: error.message
    });
  }
}

module.exports = {
  getAllFiles,
  getMyFiles,
  translationText,
  addTranslationText
}