const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const fs = require('fs');
const path = require('path');

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

const deleteUpload = async (req, res , next) => {
  try {
    const deletedMaterial = await prisma.upload.findUnique({
      where: {id: +req.params.id } 
    });

    if (!deletedMaterial) {
      return next(new ApiError(404, "Lab material not found"));
    }

    const filePath = path.join(__dirname,'..','..','uploads',path.basename(deletedMaterial.url));

    try {
      fs.unlinkSync(filePath);
    } catch (fileError) {
      return next(new ApiError(500,"Could not delete this file"));
    }

    await prisma.upload.delete({ where: {id: +req.params.id } });

    res.json(new ApiResponse(201, deletedMaterial, "lab material deleted successfully"));
  } catch (error) {
    return next(new ApiError(500, "File is not deleted"));
  }
};

module.exports = { fetchUploads, uploadMaterial, deleteUpload };
