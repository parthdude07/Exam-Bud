const express = require('express');
const router = express.Router();
const { fetchBranch } = require('../controllers/branchController');

router.get('/', fetchBranch);

module.exports = router;