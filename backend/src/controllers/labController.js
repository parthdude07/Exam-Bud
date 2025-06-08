const { PrismaClient } = require('@prisma/client');
const { ApiError } = require('../utils/ApiError.js');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const prisma = new PrismaClient();

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

const deleteLabMaterial = asyncHandler(async (req, res, next) => {
    const labMaterialToDelete = await prisma.labMaterial.delete({
      where: { id: +req.params.id }
    });
    res.status(200).json(new ApiResponse(200, labMaterialToDelete, "lab material deleted successfully"));
});

module.exports = {fetchLab , uploadLabMaterial , deleteLabMaterial};