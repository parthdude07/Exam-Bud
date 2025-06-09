const { PrismaClient } = require('@prisma/client');
const { ApiResponse } = require('../utils/ApiResponse.js');
const { asyncHandler } = require('../utils/asyncHandler.js');
const prisma = new PrismaClient();

const fetchDiscussion = asyncHandler(async (req, res) => {
    const ds = await prisma.discussion.findMany({
        where: {subjectId: +req.params.sid },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(new ApiResponse(200, ds, "discussion fetched successfully"));
});

const uploadDiscussion = asyncHandler(async(req, res) => {
    const { content } = req.body;
    const d = await prisma.discussion.create({
        data: {
            content,
            subjectId: +req.params.sid,
            userId: req.user.id
        }
    });
    res.json(new ApiResponse(201, d, "discussion uploaded successfully"));
});
module.exports = {fetchDiscussion, uploadDiscussion};