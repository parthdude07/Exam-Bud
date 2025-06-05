const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ApiError } = require('../utils/ApiError');

const fetchUploads = async (req, res, next) => {
  try {
    const uploads = await prisma.upload.findMany({
      where: { subjectId: +req.params.sid },
      include: { user: true }
    });
    res.json(uploads);
  } catch (err) {
    next(new ApiError(500, "Failed to fetch uploads", [err.message]));
  }
};

const uploadMaterial = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!req.file) {
      return next(new ApiError(400, "File is required"));
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const upload = await prisma.upload.create({
      data: {
        title,
        url: fileUrl,
        subjectId: +req.params.sid,
        userId: req.user.id
      }
    });

    res.status(201).json(upload);
  } catch (err) {
    next(new ApiError(500, "Failed to upload file", [err.message]));
  }
};

const deleteUpload = async (req, res, next) => {
  try {
    const deleted = await prisma.upload.delete({
      where: { id: +req.params.id }
    });
    res.status(200).json(deleted);
  } catch (err) {
    next(new ApiError(500, "Failed to delete upload", [err.message]));
  }
};

module.exports = { fetchUploads, uploadMaterial, deleteUpload };
