const router = require('express').Router();

const { check } = require('express-validator');
const validation = require('../../middleware/validation');
const authenticateToken = require('../../middleware/validateToken');
const checkRole = require('../../middleware/checkRole');
const isValidAssignment = require('../../middleware/isValidAssignment');

const getFileDetails = require('../../controller/review/fileDetails');
const reviewTask = require('../../controller/review/reviewTask');


router.route('/assign-task')
  .get(authenticateToken, checkRole.restrictTo('Admin', 'Developer'), getFileDetails.getTranslatedFiles)
  .post([
    check('file_id', 'fileID, specify file ID').not().isEmpty(),
    check('assigned_to', 'assigned_to, specify user ID').not().isEmpty(),
    check('deadline', 'Please specify the deadline').toDate().isISO8601()
  ], validation, authenticateToken, checkRole.restrictTo('Admin', 'Developer'), isValidAssignment, reviewTask.addReviewTask)

router.route('/all-files')
  .get(authenticateToken, checkRole.restrictTo('Admin', 'Developer'), getFileDetails.getAllFiles);

router.route('/assignments')
  .get(authenticateToken, checkRole.restrictTo('Reviewer'), getFileDetails.getMyFiles);

router.route('/assignments/file-details/:file_id')
  .get(authenticateToken, checkRole.restrictTo('Admin', 'Developer', 'Reviewer'), getFileDetails.detailsOfFileID)

router.route('/assignments/:file_id')
  .get(authenticateToken, checkRole.restrictTo('Reviewer'), getFileDetails.getTranslatedText)
  .post(authenticateToken, checkRole.restrictTo('Reviewer'), getFileDetails.updateTranslation);

router.route('/assignments/:file_id/:index')
  .get(authenticateToken, checkRole.restrictTo('Reviewer'));

module.exports = router;
