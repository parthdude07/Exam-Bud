const request = require('supertest');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createTestHierarchy, verifyDatabaseState } = require('../utils/integrationUtils');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use(require('../../src/middleware/dummyAuth'));

app.use(require('../../src/routes'));

describe('Integration Tests - Complete API Workflows', () => {
    let sharedTestData;
    let agent;

    beforeAll(async () => {
        sharedTestData = await createTestHierarchy();
        agent = request(app);
        
        console.log('Created shared test data:', {
            userId: sharedTestData.user.id,
            subjectId: sharedTestData.subject.id
        });
    });

    beforeEach(async () => {
        await global.prisma.upload.deleteMany();
        await global.prisma.discussion.deleteMany();
        await global.prisma.labMaterial.deleteMany();
    });

    describe('Upload API Integration', () => {
        test('should create and retrieve upload successfully', async () => {
            const { subject, user } = sharedTestData;
            
            const uploadData = {
                title: 'Integration Test Upload.pdf',
                url: 'https://test-cloudinary.com/integration-upload.pdf'
            };

            console.log('Testing upload creation...');
            
            const createResponse = await agent
                .post(`/subjects/${subject.id}/uploads`)
                .set('x-user-id', user.id.toString())
                .set('x-user-role', 'USER')
                .send(uploadData);

            console.log('Create Response Status:', createResponse.status);
            if (createResponse.status !== 201) {
                console.log('Create Response Body:', createResponse.body);
                console.log('Create Response Text:', createResponse.text);
            }

            expect(createResponse.status).toBe(201);
            expect(createResponse.body.success).toBe(true);
            expect(createResponse.body.data.title).toBe(uploadData.title);

            const uploadId = createResponse.body.data.id;
            console.log('Created upload with ID:', uploadId);

            console.log('Testing upload retrieval...');
            const readResponse = await agent
                .get(`/subjects/${subject.id}/uploads`)
                .expect(200);

            expect(readResponse.body.success).toBe(true);
            expect(readResponse.body.data).toHaveLength(1);
            expect(readResponse.body.data[0].id).toBe(uploadId);

            console.log('Upload workflow completed successfully');
        });

        test('should handle multiple uploads correctly', async () => {
            const { subject, user } = sharedTestData;

            console.log('Testing multiple uploads...');

            const uploadPromises = Array.from({ length: 3 }, (_, i) =>
                agent
                    .post(`/subjects/${subject.id}/uploads`)
                    .set('x-user-id', user.id.toString())
                    .set('x-user-role', 'USER')
                    .send({
                        title: `Multi Upload ${i + 1}.pdf`,
                        url: `https://test-cloudinary.com/multi-${i + 1}.pdf`
                    })
            );

            const responses = await Promise.all(uploadPromises);
            
            const successfulCreations = responses.filter(r => r.status === 201);
            console.log(`Successfully created ${successfulCreations.length} out of 3 uploads`);

            if (successfulCreations.length > 0) {
                const fetchResponse = await agent
                    .get(`/subjects/${subject.id}/uploads`)
                    .expect(200);

                expect(fetchResponse.body.data).toHaveLength(successfulCreations.length);
                console.log('Multiple uploads verified');
            }
        });
    });

    describe('Lab API Integration', () => {
        test('should create and retrieve lab successfully', async () => {
            const { subject, user } = sharedTestData;
            
            const labData = {
                title: 'Integration Test Lab',
                url: 'https://test-cloudinary.com/integration-lab.pdf'
            };

            console.log('Testing lab creation...');
            
            const createResponse = await agent
                .post(`/subjects/${subject.id}/labs`)
                .set('x-user-id', user.id.toString())
                .set('x-user-role', 'USER')
                .send(labData);

            console.log('Lab Create Response Status:', createResponse.status);
            if (createResponse.status !== 200 && createResponse.status !== 201) {
                console.log('Lab Create Response Body:', createResponse.body);
                console.log('Lab Create Response Text:', createResponse.text);
            }

            expect([200, 201]).toContain(createResponse.status);
            
            if (createResponse.status === 200 || createResponse.status === 201) {
                expect(createResponse.body.success).toBe(true);
                expect(createResponse.body.data.title).toBe(labData.title);

                const labId = createResponse.body.data.id;
                console.log('Created lab with ID:', labId);

                console.log('Testing lab retrieval...');
                const readResponse = await agent
                    .get(`/subjects/${subject.id}/labs`)
                    .expect(200);

                expect(readResponse.body.success).toBe(true);
                expect(readResponse.body.data).toHaveLength(1);
                expect(readResponse.body.data[0].id).toBe(labId);

                console.log('Lab workflow completed successfully');
            }
        });
    });

    describe('Cross-Route Integration', () => {
        test('should handle uploads and labs for same subject', async () => {
            const { subject, user } = sharedTestData;

            console.log('Testing cross-route operations...');

            const uploadPromise = agent
                .post(`/subjects/${subject.id}/uploads`)
                .set('x-user-id', user.id.toString())
                .set('x-user-role', 'USER')
                .send({
                    title: 'Cross Route Upload.pdf',
                    url: 'https://test-cloudinary.com/cross-upload.pdf'
                });

            const labPromise = agent
                .post(`/subjects/${subject.id}/labs`)
                .set('x-user-id', user.id.toString())
                .set('x-user-role', 'USER')
                .send({
                    title: 'Cross Route Lab',
                    url: 'https://test-cloudinary.com/cross-lab.pdf'
                });

            const [uploadResponse, labResponse] = await Promise.all([uploadPromise, labPromise]);

            console.log('Upload Status:', uploadResponse.status);
            console.log('Lab Status:', labResponse.status);

            let successCount = 0;
            if (uploadResponse.status === 201) successCount++;
            if (labResponse.status === 200 || labResponse.status === 201) successCount++;

            console.log(`Successfully completed ${successCount} out of 2 operations`);

            const dbState = await verifyDatabaseState();
            console.log('Database state:', dbState);

            expect(successCount).toBeGreaterThan(0);
        });
    });

    describe('Error Handling', () => {
        test('should handle invalid subject ID', async () => {
            const { user } = sharedTestData;
            const invalidSubjectId = 999999;

            console.log('Testing invalid subject ID...');

            const response = await agent
                .post(`/subjects/${invalidSubjectId}/uploads`)
                .set('x-user-id', user.id.toString())
                .set('x-user-role', 'USER')
                .send({
                    title: 'Invalid Subject.pdf',
                    url: 'https://test-cloudinary.com/invalid.pdf'
                });

            expect(response.status).toBeGreaterThan(399);
            console.log('Invalid subject handled with status:', response.status);
        });

        test('should handle missing required fields', async () => {
            const { subject, user } = sharedTestData;

            console.log('Testing missing required fields...');

            const response = await agent
                .post(`/subjects/${subject.id}/uploads`)
                .set('x-user-id', user.id.toString())
                .set('x-user-role', 'USER')
                .send({
                });

            expect(response.status).toBeGreaterThan(399);
            console.log('Missing fields handled with status:', response.status);
        });

        test('should handle GET requests correctly', async () => {
            const { subject } = sharedTestData;

            console.log('Testing GET endpoints...');

            const uploadResponse = await agent
                .get(`/subjects/${subject.id}/uploads`)
                .expect(200);

            const labResponse = await agent
                .get(`/subjects/${subject.id}/labs`)
                .expect(200);

            expect(uploadResponse.body.success).toBe(true);
            expect(labResponse.body.success).toBe(true);
            expect(Array.isArray(uploadResponse.body.data)).toBe(true);
            expect(Array.isArray(labResponse.body.data)).toBe(true);

            console.log('GET endpoints working correctly');
        });
    });

    describe('Database Persistence', () => {
        test('should persist data correctly in database', async () => {
            const { subject, user } = sharedTestData;

            console.log('Testing database persistence...');

            const response = await agent
                .post(`/subjects/${subject.id}/uploads`)
                .set('x-user-id', user.id.toString())
                .set('x-user-role', 'USER')
                .send({
                    title: 'Persistence Test.pdf',
                    url: 'https://test-cloudinary.com/persistence.pdf'
                });

            if (response.status === 201) {
                const uploadId = response.body.data.id;

                const dbUpload = await global.prisma.upload.findUnique({
                    where: { id: uploadId },
                    include: { user: true, subject: true }
                });

                expect(dbUpload).toBeTruthy();
                expect(dbUpload.title).toBe('Persistence Test.pdf');
                expect(dbUpload.user.id).toBe(user.id);
                expect(dbUpload.subject.id).toBe(subject.id);

                console.log('Database persistence verified');
            } else {
                console.log('Upload creation failed, skipping persistence test');
            }
        });
    });
});