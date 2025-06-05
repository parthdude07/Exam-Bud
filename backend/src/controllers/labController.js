const { PrismaClient } = require('@prisma/client');
const { ApiError } = require('../utils/ApiError.js');
const prisma = new PrismaClient();

const fetchLab = async (req, res) => {
  const labMaterial = await prisma.labMaterial.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(labMaterial);
};

const uploadLabMaterial = async (req, res) => {
  try {
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

    res.status(201).json(labMaterials);
  } catch (error) {
      next(new ApiError(500, "Something went wrong", [error.message]));
  }
};

const deleteLabMaterial = async (req, res) => {
  try {
    const labMaterialToDelete = await prisma.labMaterial.delete({
      where: { id: +req.params.id }
    });
    res.status(200).json(labMaterialToDelete);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete lab material" });
  }
};

module.exports = {fetchLab , uploadLabMaterial , deleteLabMaterial};