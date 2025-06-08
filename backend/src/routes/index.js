const express = require('express');
const router = express.Router();

router.use('/branches', require('./branchRoutes'));
router.use('/branches/:bid/semesters', require('./semesterRoutes'));
router.use('/semesters/:sid/subjects', require('./subjectRoutes'));
router.use(require('./uploadRoutes'));
router.use(require('./discussionRoutes'));
router.use(require('./labRoutes'));

module.exports = router;
