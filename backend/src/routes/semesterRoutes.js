const express = require('express');
const router = express.Router({ mergeParams: true });
const { fetchSemester } = require('../controllers/semesterController.js');

router.get('/', fetchSemester);

module.exports = router;