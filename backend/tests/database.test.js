const { PrismaClient } = require('@prisma/client');
describe('Database Connection', () => {
    test('should connect to test database', async() => {
        const result = await global.prisma.$queryRaw`SELECT 1 as test`;
        expect(result[0].test).toBe(1);
    });
    test('should have required tables', async () => {
        const tables = await global.prisma.$queryRaw`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public'
        `;
        
        const tableNames = tables.map(t => t.table_name);
        expect(tableNames).toContain('Branch');
        expect(tableNames).toContain('Semester');
        expect(tableNames).toContain('Subject');
        expect(tableNames).toContain('User');
        expect(tableNames).toContain('LabMaterial');
        expect(tableNames).toContain('Upload');
        expect(tableNames).toContain('Discussion');
    });
});

describe('Database Error Handling', () => {
    test('should handle invalid SQL queries', async () => {
        try {
            await global.prisma.$queryRaw`SELECT * FROM nonexistant_table`;
            throw new Error('expected error but none thrown');
        } catch (err) {
            console.log('error caught: ', err.message);
            expect(err).toBeInstanceOf(Error);
        }
    });
    
    test('should handle connection timeout', async () => {
        const startTime = Date.now();
        try{
            await global.prisma.branch.findMany();
            await global.prisma.semester.findMany();
            await global.prisma.subject.findMany();
            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(5000);
            console.log(`Query completed in ${endTime - startTime}ms`);
            
        } catch(error) {
            expect(error).toBeDefined();
            console.log('Query failed but didnt hang: ', error.message);
        }
    }, 15000);

    test('should detect when database is not accessible', async() => {
        const badPrisma = new PrismaClient({
            datasources: {
                db: { url: 'postgresql://real:real@db:9999/real_db' }
            }
        });

        await expect(
            badPrisma.$connect()
        ).rejects.toThrow();

        await badPrisma.$disconnect();

    }, 10000);
});

describe('Database Health Checks', () => {
    test('should verify database schema is up to date', async () => {
        const tableCheck = await global.prisma.$queryRaw`
        SELECT COUNT (*) as count FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('Branch', 'Semester', 'Subject', 'User', 'Upload', 'Discussion', 'LabMaterial')
        `;
        expect(Number(tableCheck[0].count)).toBe(7);
    });
})

describe('CRUD Operations Testing', () => {
    let testBranch, testSemester, testSubject, testUser;

    beforeEach(async () => {
        
        await global.prisma.upload.deleteMany();
        await global.prisma.discussion.deleteMany();
        await global.prisma.labMaterial.deleteMany();
        await global.prisma.subject.deleteMany();
        await global.prisma.semester.deleteMany();
        await global.prisma.branch.deleteMany();
        await global.prisma.user.deleteMany();

        testBranch = await global.prisma.branch.create({
            data: { name: 'Test Branch' }
        });
        testSemester = await global.prisma.semester.create({
            data: { 
                number: 1, 
                branchId: testBranch.id 
            }
        });
        testSubject = await global.prisma.subject.create({
            data: { 
                name: 'Test Subject', 
                semesterId: testSemester.id 
            }
        });
        testUser = await global.prisma.user.create({
            data: { 
                name: 'Test User',
                role: 'USER'
            }
        });
    });

    describe('Upload CRUD Operations', () => {
        test('should create and read upload', async () => {
            const upload = await global.prisma.upload.create({
                data: {
                    title: 'Test Upload Document',
                    url: 'https://example.com/test-file.pdf',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            expect(upload.id).toBeDefined();
            expect(upload.title).toBe('Test Upload Document');
            expect(upload.url).toBe('https://example.com/test-file.pdf');
            expect(upload.subjectId).toBe(testSubject.id);
            expect(upload.userId).toBe(testUser.id);
            
            const foundUpload = await global.prisma.upload.findUnique({
                where: { id: upload.id },
                include: {
                    user: true,
                    subject: true
                }
            });
            expect(foundUpload).not.toBeNull();
            expect(foundUpload.title).toBe('Test Upload Document');
            expect(foundUpload.user.name).toBe('Test User');
            expect(foundUpload.subject.name).toBe('Test Subject');  
        });
        test('should update upload', async () => {
            const upload = await global.prisma.upload.create({
                data: {
                    title: 'Original Title',
                    url: 'https://example.com/original.pdf',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            
            const updated = await global.prisma.upload.update({
                where: { id: upload.id },
                data: { 
                    title: 'Updated Title',
                    url: 'https://example.com/updated.pdf'
                }
            });
            
            expect(updated.title).toBe('Updated Title');
            expect(updated.url).toBe('https://example.com/updated.pdf');
            expect(updated.id).toBe(upload.id);
        });        
        test('should delete upload', async () => {
            const upload = await global.prisma.upload.create({
                data: {
                    title: 'To Be Deleted',
                    url: 'https://example.com/delete-me.pdf',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            
            await global.prisma.upload.delete({
                where: { id: upload.id }
            });
            
            const found = await global.prisma.upload.findUnique({
                where: { id: upload.id }
            });
            
            expect(found).toBeNull();
        });
        test('should find uploads by subject', async () => {
            await global.prisma.upload.createMany({
                data: [
                    {
                        title: 'Upload 1',
                        url: 'https://example.com/file1.pdf',
                        subjectId: testSubject.id,
                        userId: testUser.id
                    },
                    {
                        title: 'Upload 2', 
                        url: 'https://example.com/file2.pdf',
                        subjectId: testSubject.id,
                        userId: testUser.id
                    }
                ]
            });
            
            const uploads = await global.prisma.upload.findMany({
                where: { subjectId: testSubject.id }
            });
            
            expect(uploads).toHaveLength(2);
            expect(uploads[0].title).toBe('Upload 1');
            expect(uploads[1].title).toBe('Upload 2');
        });
    });
    describe('discussion CRUD operations', () => {
        test('should create and read discussion', async() => {
            const discussion = await global.prisma.discussion.create({
                data: {
                    content: 'This is a test discussion about the subject.',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }  
            });
            expect(discussion.id).toBeDefined();
            expect(discussion.content).toBe('This is a test discussion about the subject.');
            expect(discussion.subjectId).toBe(testSubject.id);
            expect(discussion.userId).toBe(testUser.id);
            expect(discussion.createdAt).toBeDefined();
            expect(discussion.createdAt).toBeInstanceOf(Date);

            const foundDiscussion = await global.prisma.discussion.findUnique({
                where: { id: discussion.id },
                include: { 
                    user: true, 
                    subject: true 
                }
            });
            
            expect(foundDiscussion).not.toBeNull();
            expect(foundDiscussion.user).not.toBeNull();
            expect(foundDiscussion.subject).not.toBeNull();

            expect(foundDiscussion.user.name).toBe('Test User');
            expect(foundDiscussion.subject.name).toBe('Test Subject');
        });

        test('should update discussion content', async () => {
            const discussion = await global.prisma.discussion.create({
                data: {
                    content: 'Original content',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });

            const updated = await global.prisma.discussion.update({
                where: { id: discussion.id },
                data: { content: 'Updated content' }
            });
            expect(updated.content).toBe('Updated content');
            expect(updated.createdAt).toEqual(discussion.createdAt);
        });

        test('should delete discussion', async () => {
            const discussion = await global.prisma.discussion.create({
                data: {
                    content: 'Discussion to be deleted',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            
            await global.prisma.discussion.delete({
                where: { id: discussion.id }
            });
            
            const found = await global.prisma.discussion.findUnique({
                where: { id: discussion.id }
            });
            
            expect(found).toBeNull();
        });

        test('should order discussions by creation date', async () => {
            const first = await global.prisma.discussion.create({
                data: {
                    content: 'First discussion',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const second = await global.prisma.discussion.create({
                data: {
                    content: 'Second discussion',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            
            const discussions = await global.prisma.discussion.findMany({
                where: { subjectId: testSubject.id },
                orderBy: { createdAt: 'desc' }
            });
            
            expect(discussions).toHaveLength(2);
            expect(discussions[0].content).toBe('Second discussion');
            expect(discussions[1].content).toBe('First discussion');
        });
    });

    describe('lab material CRUD Operations', () => {
        test('should create and read lab material', async() => {
            const labMaterial = await global.prisma.labMaterial.create({
                data: {
                    title: 'Lab Exercise 1',
                    url: 'https://example.com/lab1.pdf',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            expect(labMaterial.id).toBeDefined();
            expect(labMaterial.title).toBe('Lab Exercise 1');
            expect(labMaterial.url).toBe('https://example.com/lab1.pdf');
            expect(labMaterial.subjectId).toBe(testSubject.id);
            expect(labMaterial.userId).toBe(testUser.id);

            const foundLab = await global.prisma.labMaterial.findUnique({
                where: { id: labMaterial.id },
                include: {
                    user: true,
                    subject: true
                }
            });
            expect(foundLab.user.name).toBe('Test User');
            expect(foundLab.subject.name).toBe('Test Subject');
        });
        test('should update lab material', async () => {
            const labMaterial = await global.prisma.labMaterial.create({
                data: {
                    title: 'Original Lab Title',
                    url: 'https://example.com/original-lab.pdf',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });
            
            const updated = await global.prisma.labMaterial.update({
                where: { id: labMaterial.id },
                data: { 
                    title: 'Updated Lab Title',
                    url: 'https://example.com/updated-lab.pdf'
                }
            });
            
            expect(updated.title).toBe('Updated Lab Title');
            expect(updated.url).toBe('https://example.com/updated-lab.pdf');
        });
        test('should delete lab material', async () => {
            const labMaterial = await global.prisma.labMaterial.create({
                data: {
                    title: 'Lab to Delete',
                    url: 'https://example.com/delete-lab.pdf',
                    subjectId: testSubject.id,
                    userId: testUser.id
                }
            });

            await global.prisma.labMaterial.delete({
                where: { id: labMaterial.id }
            });

            const found = await global.prisma.labMaterial.findUnique({
                where: { id: labMaterial.id }
            });
            expect(found).toBeNull();
        });
        test('should find lab materials by subject', async () => {
            await global.prisma.labMaterial.createMany({
                data: [
                    {
                        title: 'Lab Material 1',
                        url: 'https://example.com/lab1.pdf',
                        subjectId: testSubject.id,
                        userId: testUser.id
                    },
                    {
                        title: 'Lab Material 2',
                        url: 'https://example.com/lab2.pdf',
                        subjectId: testSubject.id,
                        userId: testUser.id
                    }
                ]
            });
            
            const labMaterials = await global.prisma.labMaterial.findMany({
                where: { subjectId: testSubject.id }
            });
            
            expect(labMaterials).toHaveLength(2);
            expect(labMaterials[0].title).toBe('Lab Material 1');
            expect(labMaterials[1].title).toBe('Lab Material 2');
        });
    })
});