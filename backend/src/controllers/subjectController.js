const { PrismaClient } = require('@prisma/client');
const { ApiResponse } = require('../utils/ApiResponse');
const { asyncHandler } = require('../utils/asyncHandler');
const prisma = new PrismaClient();

const fetchSubject = asyncHandler(async(req,res) => {
    const subs = await prisma.subject.findMany({
        where: { semesterId: +req.params.sid }
    });
    res.json(new ApiResponse(200, subs, "subjects fetched successfully"));
})

module.exports = { fetchSubject };