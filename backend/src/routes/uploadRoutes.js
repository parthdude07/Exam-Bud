const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware.js');
const { fetchUploads, uploadMaterial, deleteUpload } = require('../controllers/uploadController.js')

router.get('/subjects/:sid/uploads' , fetchUploads)
router.post('/subjects/:sid/uploads', upload.single('file'), uploadMaterial);
router.delete('/uploads/:id' , deleteUpload)

module.exports = router;