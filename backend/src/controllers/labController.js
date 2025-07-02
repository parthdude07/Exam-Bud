const { PrismaClient } = require('@prisma/client');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');

const fetchLab = async (req, res) => {
  const labMaterial = await prisma.labMaterial.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(new ApiResponse(200, labMaterial, "fetched lab material successfully"));
};

const uploadLabMaterial = asyncHandler(async (req, res, next) => {
  const { title } = req.body;
  const subjectId = +req.params.sid;
  if (!req.file) {
    return next(new ApiError(400, "File is required"));
    }
  const url = `/uploads/${req.file.filename}`;
  const labMaterials = await prisma.labMaterial.create({
    data: {
      title,
      url,
      subjectId,
      userId: req.user.id
    }
  });
  res.json(new ApiResponse(201, labMaterials, "lab material uploaded successfully"));
});

const deleteLabMaterial = async (req, res , next) => {
  try {
    const deleteLab = await prisma.labMaterial.findUnique({
      where: {id: +req.params.id } 
    });

    if (!deleteLab) {
      return next(new ApiError(404, "Lab material not found"));
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', path.basename(deleteLab.url));

    try {
      fs.unlinkSync(filePath);
    } catch (fileError) {
      return next(new ApiError(500,"Could not delete this file"));
    }

    await prisma.labMaterial.delete({ where: {id: +req.params.id } });

    res.json(new ApiResponse(201, deleteLab, "lab material deleted successfully"));
  } catch (error) {
    return next(new ApiError(500, "File is not deleted"));
  }
};

module.exports = {fetchLab , uploadLabMaterial , deleteLabMaterial};