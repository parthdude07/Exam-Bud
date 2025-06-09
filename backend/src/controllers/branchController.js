const { PrismaClient } = require('@prisma/client');
const { ApiResponse } = require ('../utils/ApiResponse')
const { asyncHandler } = require ('../utils/asyncHandler')
const prisma = new PrismaClient();

const fetchBranch = asyncHandler(async (req, res) => {
    const branches = await prisma.branch.findMany();
    res.json(new ApiResponse(200, branches, "branches fetched successfully"));
});

module.exports = { fetchBranch };