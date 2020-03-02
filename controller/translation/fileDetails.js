const Translation = require('../../models/Translation');


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


module.exports = {
  getAllFiles
}