const { PrismaClient } = require('@prisma/client');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const prisma = new PrismaClient();

const fetchSemester = asyncHandler(async (req, res) => {
    const sems = await prisma.semester.findMany({
        where: { branchId: +req.params.bid }
    });
    res.json(new ApiResponse(200, sems, "semesters fetched successfully"));
});

module.exports = { fetchSemester };