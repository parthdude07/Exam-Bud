const express = require('express');
const routes = express.Router({ mergeParams: true });
const { fetchSubject } = require('../controllers/subjectController.js')

routes.get('/', fetchSubject);

module.exports = routes;