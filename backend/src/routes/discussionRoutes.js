const express = require('express');
const router = express.Router();
const { fetchDiscussion, uploadDiscussion } = require('../controllers/discussionController.js');

router.get('/subjects/:sid/discussions', fetchDiscussion);
router.post('/subjects/:sid/discussions', uploadDiscussion);

module.exports = router;