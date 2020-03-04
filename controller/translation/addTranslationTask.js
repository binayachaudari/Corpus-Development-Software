const fs = require('fs'),
  path = require('path');
const File = require('../../models/Files');
const Translation = require('../../models/Translation');


module.exports = async (req, res, next) => {
  //is_translated, is_reviewed, status ignored
  try {
    const { source_filename, start_index, end_index, assigned_to, assigned_by, deadline } = req.body;

    const numOfSentences = end_index - start_index + 1;

    if (start_index > end_index) {
      return next({
        status: 400,
        message: 'Start_index is greater than End_index'
      });
    }

    const newFile = new File({
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

    newTranslationTask.save();
    res.json({ task_assigned: newTranslationTask });
  } catch (error) {
    next({
      error: 400,
      message: error.message
    });
  }

}