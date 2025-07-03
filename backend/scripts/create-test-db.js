const { PrismaClient } = require('@prisma/client');

async function createTestDatabase() {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: 'postgresql://prisma:prisma@db:5432/postgres' }
        }
    });
    try {
        await prisma.$executeRaw`CREATE DATABASE exam_bud_test`;
        console.log('test database created');
    } catch (error) {
        if (error.message.includes('already exists')) {
            console.log('test database already exists');
        } else {
            console.log('could not create test database: ', error.message);
        }
    }
    await prisma.$disconnect();
}
createTestDatabase();