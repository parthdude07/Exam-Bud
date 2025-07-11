const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.test' });

const prisma = new PrismaClient();

beforeAll(async () => {
    try {
        console.log('Environment DATABASE_URL:', process.env.DATABASE_URL);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        
        await prisma.$connect();
        console.log('Test database connected');
        
        const dbInfo = await prisma.$queryRaw`SELECT current_database() as db_name, current_user as user_name`;
        console.log('Connected to database:', dbInfo[0].db_name, 'as user:', dbInfo[0].user_name);
        
        await prisma.$queryRaw`SELECT 1`;
        console.log('Test database is responsive');
        
    } catch (error) {
        console.error('Failed to connect to test database:', error.message);
        console.error('Error code:', error.code);
        process.exit(1);
    }
});

afterAll(async () => {
    try {
        await prisma.$disconnect();
        console.log('Test database disconnected');
    } catch (error) {
        console.error('Error disconnecting:', error.message);
    }
});

afterEach(async () => {
    try {
        await prisma.upload.deleteMany();
        await prisma.discussion.deleteMany();
        await prisma.labMaterial.deleteMany();
        await prisma.subject.deleteMany();
        await prisma.semester.deleteMany();
        await prisma.branch.deleteMany();
        await prisma.user.deleteMany();
    } catch (error) {
        console.warn('Cleanup warning:', error.message);
    }
});

global.prisma = prisma;