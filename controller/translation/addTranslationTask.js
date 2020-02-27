const fs = require('fs'),
  path = require('path');
const File = require('../../models/Files');
const Translation = require('../../models/Translation');


module.exports = async (req, res, next) => {
  //is_translated, is_reviewed, status ignored
  try {
    const { source_filename, start_index, end_index, assigned_to, assigned_by, deadline } = req.body;

    if (start_index > end_index) {
      return next({
        status: 400,
        message: 'Start_index is greater than End_index'
      });
    }

    const newFile = new File({
      filename: `${source_filename}-${start_index}-${end_index}.txt`,
      source_filename,
      start_index,
      end_index,
    });

    await newFile.save();

    let readableStream = fs.createReadStream(path.join(__dirname, '../../Datastore/Sourcefiles', source_filename), { encoding: 'utf8' });
    let writableStream = fs.createWriteStream(path.join(__dirname, '../../Datastore/Nepali', newFile.filename), { flags: 'w' });

    let buffer = '';
    readableStream.on('data', (dataChunk) => {
      buffer += dataChunk;
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
      filename: newFile.filename,
      assigned_to,
      assigned_by,
      deadline
    });

    newTranslationTask.save();
    res.send('ACCEPTED!');
  } catch (error) {
    next({
      error: 400,
      message: error.message
    });
  }

}