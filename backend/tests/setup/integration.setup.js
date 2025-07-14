const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

beforeAll(async () => {
    try {
        console.log('Integration Test Environment DATABASE_URL:', process.env.DATABASE_URL);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        await prisma.$connect();
        console.log('Integration test database connected');
        
        const dbInfo = await prisma.$queryRaw`SELECT current_database() as db_name, current_user as user_name`;
        console.log('Connected to database:', dbInfo[0].db_name, 'as user:', dbInfo[0].user_name);
        
        await prisma.$queryRaw`SELECT 1`;
        console.log('Integration test database is responsive');
        
    } catch (error) {
        console.error('Failed to connect to integration test database:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        
        throw error;
    }
});

afterAll(async () => {
    try {
        await cleanAllTestData();
        await prisma.$disconnect();
        console.log('Integration test database disconnected');
    } catch (error) {
        console.error('Error disconnecting:', error.message);
    }
});

async function cleanAllTestData() {
    try {
        await prisma.upload.deleteMany();
        await prisma.discussion.deleteMany();
        await prisma.labMaterial.deleteMany();
        await prisma.subject.deleteMany();
        await prisma.semester.deleteMany();
        await prisma.branch.deleteMany();
        await prisma.user.deleteMany();
        
        console.log('All test data cleaned');
    } catch (error) {
        console.warn('Cleanup warning:', error.message);
    }
}

async function cleanContentData() {
    try {
        await prisma.upload.deleteMany();
        await prisma.discussion.deleteMany();
        await prisma.labMaterial.deleteMany();
        
        console.log('Content data cleaned (preserved users/subjects)');
    } catch (error) {
        console.warn('Content cleanup warning:', error.message);
    }
}

beforeEach(async () => {
    await cleanContentData();
});

afterEach(async () => {
    await cleanContentData();
});

global.prisma = prisma;