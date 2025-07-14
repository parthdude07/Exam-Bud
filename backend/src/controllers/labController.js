const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config()
const cloudinary = require('cloudinary').v2
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');



const fetchLab = async (req, res) => {
  const labMaterial = await prisma.labMaterial.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(new ApiResponse(200, labMaterial, "Fetched lab material successfully"));
};

const uploadLabMaterial = asyncHandler(async (req, res, next) => {
  const { title, url } = req.body;
  
  if(!title || !url) {
    return next(new ApiError(400, "Title and Cloudinary URL are required"))
  }
  
  const labMaterials = await prisma.labMaterial.create({
    data: {
      title,
      url,
      subjectId: +req.params.sid,
      userId: req.user.id
    }
  });
  res.json(new ApiResponse(201, labMaterials, "lab material uploaded successfully"));
});

const deleteLabMaterial = asyncHandler(async (req, res, next) => {
  try {
    const file = await prisma.labMaterial.findUnique({
      where: {id: +req.params.id}
    })
  
    if(!file){
      return next(new ApiError(404, "Lab material not found"))
    }
  
    const public_id = file.title
    try {
      const result = await cloudinary.uploader.destroy(public_id);

      if (result.result === "ok" || result.result === "not found") {
        console.log(`Cloudinary: ${result.result === "ok" ? "File deleted" : "File not found (may already be deleted)"}.`);
        try {
          const deleted = await prisma.labMaterial.delete({
            where: { id: +req.params.id }
          });
          return res.status(200).json(
            new ApiResponse(200, deleted, "Lab material deleted successfully")
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
    return next(new ApiError(500, "Failed to find lab material", error));
  }
});

module.exports = {fetchLab , uploadLabMaterial , deleteLabMaterial};