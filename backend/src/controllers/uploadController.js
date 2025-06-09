const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const fetchUploads = asyncHandler(async (req, res, next) => {
  const uploads = await prisma.upload.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(new ApiResponse(200, uploads, "fetched uploads successfully"));
});

const uploadMaterial = asyncHandler(async (req, res, next) => {
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
    res.status(201).json(new ApiResponse(201, upload, "material uploaded successfully"))
});

const deleteUpload = asyncHandler(async (req, res, next) => {
  const deleted = await prisma.upload.delete({
    where: { id: +req.params.id }
  });
  res.status(200).json(new ApiResponse(200, deleted, "upload deleted successfully"));
});

module.exports = { fetchUploads, uploadMaterial, deleteUpload };
