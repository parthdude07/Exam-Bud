const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestHierarchy() {
    const user = await prisma.user.create({
        data: {
            name: 'Test User',
            role: 'USER'
        }
    });

    const branch = await prisma.branch.create({
        data: {
            name: 'Computer Science'
        }
    });

    const semester = await prisma.semester.create({
        data: {
            number: 5,
            branchId: branch.id
        }
    });

    const subject = await prisma.subject.create({
        data: {
            name: 'Database Management Systems',
            semesterId: semester.id
        }
    });

    return { user, branch, semester, subject };
}

function createTestUploadData(userId) {
    return {
        title: 'Test Upload.pdf',
        url: 'https://test-cloudinary.com/test-upload.pdf',
        userId: userId
    };
}

function createTestLabData(userId) {
    return {
        title: 'Lab Assignment 1',
        url: 'https://test-cloudinary.com/lab-assignment-1.pdf',
        userId: userId
    };
}

function createTestDiscussionData(userId) {
    return {
        content: 'Can someone explain the difference between 2NF and 3NF?',
        userId: userId
    };
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyDatabaseState() {
    const counts = {
        users: await prisma.user.count(),
        branches: await prisma.branch.count(),
        semesters: await prisma.semester.count(),
        subjects: await prisma.subject.count(),
        uploads: await prisma.upload.count(),
        labs: await prisma.labMaterial.count(),
        discussions: await prisma.discussion.count()
    };
    
    return counts;
}

async function createMultipleTestUploads(subjectId, userId, count = 3) {
    const uploads = [];
    
    for (let i = 1; i <= count; i++) {
        const upload = await prisma.upload.create({
            data: {
                title: `Test Upload ${i}.pdf`,
                url: `https://test-cloudinary.com/test-upload-${i}.pdf`,
                subjectId: subjectId,
                userId: userId
            }
        });
        uploads.push(upload);
    }
    
    return uploads;
}

async function createMultipleTestLabs(subjectId, userId, count = 3) {
    const labs = [];
    
    for (let i = 1; i <= count; i++) {
        const lab = await prisma.labMaterial.create({
            data: {
                title: `Lab Assignment ${i}`,
                url: `https://test-cloudinary.com/lab-${i}.pdf`,
                subjectId: subjectId,
                userId: userId
            }
        });
        labs.push(lab);
    }
    
    return labs;
}

async function createMultipleTestDiscussions(subjectId, userId, count = 2) {
    const discussions = [];
    
    for (let i = 1; i <= count; i++) {
        const discussion = await prisma.discussion.create({
            data: {
                content: `Test discussion content ${i} - What are your thoughts on this topic?`,
                subjectId: subjectId,
                userId: userId
            }
        });
        discussions.push(discussion);
    }
    
    return discussions;
}

module.exports = {
    createTestHierarchy,
    createTestUploadData,
    createTestLabData,
    createTestDiscussionData,
    delay,
    verifyDatabaseState,
    createMultipleTestUploads,
    createMultipleTestLabs,
    createMultipleTestDiscussions
};