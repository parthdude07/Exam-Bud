const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();
const cloudinary = require('cloudinary').v2
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');

const fetchUploads = asyncHandler(async (req, res, next) => {
  const uploads = await prisma.upload.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(new ApiResponse(200, uploads, "Fetched uploads successfully"));
});

const uploadMaterial = asyncHandler(async (req, res, next) => {
    const { title, url } = req.body;

    if (!title || !url) {
      return next(new ApiError(400, "Title and Cloudinary URL are required"));
    }

    const upload = await prisma.upload.create({
      data: {
        title,
        url, 
        subjectId: +req.params.sid,
        userId: req.user.id
      }
    });
    res.status(201).json(new ApiResponse(201, upload, "Material uploaded successfully"))
});

const deleteUpload = asyncHandler(async (req, res, next) => {
  try {
    const file = await prisma.upload.findUnique({
      where: {id: +req.params.id}
    })
  
    if(!file){
      return next(new ApiError(404, "Material not found"))
    }
  
    const public_id = file.title
    try {
      const result = await cloudinary.uploader.destroy(public_id);

      if (result.result === "ok" || result.result === "not found") {
        console.log(`Cloudinary: ${result.result === "ok" ? "File deleted" : "File not found (may already be deleted)"}.`);
        try {
          const deleted = await prisma.upload.delete({
            where: { id: +req.params.id }
          });
          return res.status(200).json(
            new ApiResponse(200, " ", deleted, "Material deleted successfully")
          );
        } catch (error) {
          return next(new ApiError(500, "File not deleted from database", error));
        }
      } else {
        return next(new ApiError(500, "Unexpected result from Cloudinary", result));
      }

    } catch (error) {
      return next(new ApiError(500, "Cloudinary deletion failed", error));
    }

  } catch (error) {
    return next(new ApiError(500, "Failed to find material", error));
  }
});

module.exports = { fetchUploads, uploadMaterial, deleteUpload };
