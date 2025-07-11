module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    projects: [
        {
            displayName: 'Database Tests',
            testMatch: ['<rootDir>/tests/database.test.js'],
            setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
        },
        {
            displayName: 'Route Tests', 
            testMatch: ['<rootDir>/tests/routes/**/*.test.js'],
            setupFilesAfterEnv: ['<rootDir>/tests/setup/routes.setup.js']
        },
        {
            displayName: 'Integration Tests',
            testMatch: ['<rootDir>/tests/integration/**/*.test.js'],
            setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.setup.js']
        }
    ]
};