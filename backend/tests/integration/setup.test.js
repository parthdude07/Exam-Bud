const { createTestHierarchy, verifyDatabaseState } = require('../utils/integrationUtils');

describe('Integration Test Setup Verification', () => {
    test('should connect to test database', async () => {
        expect(global.prisma).toBeDefined();
        
        const result = await global.prisma.$queryRaw`SELECT 1 as test`;
        expect(result[0].test).toBe(1);
        
        console.log('Database connection working');
    });

    test('should create test hierarchy successfully', async () => {
        const hierarchy = await createTestHierarchy();
        
        expect(hierarchy.user).toBeDefined();
        expect(hierarchy.branch).toBeDefined();
        expect(hierarchy.semester).toBeDefined();
        expect(hierarchy.subject).toBeDefined();
        
        expect(hierarchy.user.name).toBe('Test User');
        expect(hierarchy.branch.name).toBe('Computer Science');
        expect(hierarchy.semester.branchId).toBe(hierarchy.branch.id);
        expect(hierarchy.subject.semesterId).toBe(hierarchy.semester.id);
        
        console.log('Test hierarchy creation working');
        console.log('Created:', {
            user: hierarchy.user.name,
            branch: hierarchy.branch.name,
            semester: `Semester ${hierarchy.semester.number}`,
            subject: hierarchy.subject.name
        });
    });

    test('should verify database state correctly', async () => {
        const state = await verifyDatabaseState();
        
        expect(typeof state.users).toBe('number');
        expect(typeof state.branches).toBe('number');
        expect(typeof state.semesters).toBe('number');
        expect(typeof state.subjects).toBe('number');
        expect(typeof state.uploads).toBe('number');
        expect(typeof state.labs).toBe('number');
        expect(typeof state.discussions).toBe('number');
        
        console.log('Database state verification working');
        console.log('Current state:', state);
    });

    test('should clean up test data properly', async () => {
        const hierarchy = await createTestHierarchy();
        
        let state = await verifyDatabaseState();
        expect(state.subjects).toBeGreaterThan(0);
        expect(state.users).toBeGreaterThan(0);
        
        console.log('Test data cleanup will be verified by afterEach hook');
    });
});