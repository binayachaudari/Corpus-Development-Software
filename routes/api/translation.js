const router = require('express').Router();

const { check } = require('express-validator');
const validation = require('../../middleware/validation');
const authenticateToken = require('../../middleware/validateToken');
const checkRole = require('../../middleware/checkRole');
const isValidAssignment = require('../../middleware/isValidAssignment');

const addTranslationTask = require('../../controller/translation/addTranslationTask');
const getFileDetails = require('../../controller/translation/fileDetails');

router.route('/assign-task')
  .post([
    check('source_filename', 'Source filename is required').not().isEmpty(),
    check('start_index', 'Specify Start index with respect to source file').isInt().toInt(),
    check('end_index', 'Specify Start index with respect to source file').isInt().toInt(),
    check('status', 'Specify status of the file').optional().isString(),
    check('assigned_to', 'assigned_to, specify user ID').not().isEmpty(),
    check('deadline', 'Please specify the deadline').toDate().isISO8601(),
  ], validation, authenticateToken, checkRole.restrictTo('Admin', 'Developer'), isValidAssignment, addTranslationTask);

router.route('/all-files')
  .get(authenticateToken, checkRole.restrictTo('Admin', 'Developer'), getFileDetails.getAllFiles);

router.route('/assignments')
  .get(authenticateToken, checkRole.restrictTo('Linguist'), getFileDetails.getMyFiles);

router.route('/assignments/:file_id')
  .get(authenticateToken, checkRole.restrictTo('Linguist'), getFileDetails.translationText)
  .post(authenticateToken, checkRole.restrictTo('Linguist'), getFileDetails.addTranslationText);

router.route('/assignments/:file_id/:index')
  .get(authenticateToken, checkRole.restrictTo('Linguist'), getFileDetails.getTextAtIndex);
module.exports = router;
