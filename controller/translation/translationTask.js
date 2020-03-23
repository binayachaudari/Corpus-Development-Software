const fs = require('fs'),
  path = require('path');
const Files = require('../../models/Files');
const Translation = require('../../models/Translation');
const Users = require('../../models/Users');
const notifyUser = require('../../utils/createPDF.assign');


exports.addTranslationTask = async (req, res, next) => {
  //is_translated, is_reviewed, status ignored
  try {
    const { source_filename, start_index, end_index, assigned_to, assigned_by, deadline } = req.body;

    let userDetails = await Users.findById(assigned_to);
    if (userDetails.role !== 'Linguist')
      return next({
        status: 400,
        message: `Must assign Translation task to only Linguist, invalid assignment to ${userDetails.role}`
      });

    const numOfSentences = end_index - start_index + 1;

    if (start_index > end_index) {
      return next({
        status: 400,
        message: 'Start_index is greater than End_index'
      });
    }

    const newFile = new Files({
      filename: `${source_filename}-Nep__${start_index}-to-${end_index}__${numOfSentences}sentences.txt`,
      source_filename: source_filename,
      start_index,
      end_index,
    });

    await newFile.save();

    let readableStream = fs.createReadStream(path.join(__dirname, '../../Datastore/Sourcefiles', source_filename), { encoding: 'utf8' });
    let writableStream = fs.createWriteStream(path.join(__dirname, '../../Datastore/AssignedFiles', newFile.filename), { flags: 'w' });

    let buffer = '';
    readableStream.on('data', (dataChunk) => {
      buffer += dataChunk;

      if (buffer.split('\n').length >= numOfSentences)
        readableStream.emit("end");
    });

    readableStream.on('end', () => {
      let data = ''
      let arrayOfBuffer = buffer.split('\n');

      for (let currIndex = start_index; currIndex <= end_index; currIndex++) {
        data += (arrayOfBuffer[currIndex] + '\n');
      }
      writableStream.write(data);
    });

    const newTranslationTask = new Translation({
      file_details: newFile._id,
      assigned_to,
      assigned_by,
      deadline
    });

    await newTranslationTask.save();

    let assignedByDetails = await Users.findById(assigned_by);
    const pdfPayload = {
      assignment_type: `Translate`,
      assigned_to_email: userDetails.email,
      assigned_to: userDetails.name,
      assigned_to_role: userDetails.role,
      filename: newFile.filename,
      file_id: newTranslationTask._id,
      num_of_sentences: numOfSentences,
      assigned_by_email: assignedByDetails.email,
      assigned_by: assignedByDetails.name,
      start_index,
      end_index,
      deadline
    }

    await notifyUser(pdfPayload);

    res.json({ task_assigned: newTranslationTask });
  } catch (error) {
    next({
      error: 400,
      message: error.message
    });
  }

}

exports.getLastTranslationIndex = async (req, res, next) => {
  try {
    let fileDetails = await Files.find().sort({ _id: -1 }).limit(1);
    res.json({ fileDetails });
  } catch (error) {
    next({
      error: 400,
      message: error.message
    });
  }
}