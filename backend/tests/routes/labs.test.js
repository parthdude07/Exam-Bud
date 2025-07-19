const request = require('supertest');
const { createTestApp, createMockData } = require('../utils/testUtils');
const labRoutes = require('../../src/routes/labRoutes');

require('../setup/routes.setup');

describe('Lab Materials Routes', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp(labRoutes);
  });

  describe('GET /subjects/:sid/labs', () => {
    it('should fetch lab materials for a subject', async () => {
      const mockLabs = [
        createMockData.labMaterial({ id: 1, title: 'Lab Exercise 1' }),
        createMockData.labMaterial({ id: 2, title: 'Lab Exercise 2' })
      ];
      
      global.mockPrisma.labMaterial.findMany.mockResolvedValue(mockLabs);
      
      const response = await request(app)
        .get('/subjects/1/labs')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Fetched lab material successfully');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Lab Exercise 1');
      
      expect(global.mockPrisma.labMaterial.findMany).toHaveBeenCalledWith({
        where: { subjectId: 1 },
        include: { user: true }
      });
    });

    it('should return empty array when no lab materials exist', async () => {
      global.mockPrisma.labMaterial.findMany.mockResolvedValue([]);
      
      const response = await request(app)
        .get('/subjects/1/labs')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      global.mockPrisma.labMaterial.findMany.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .get('/subjects/1/labs')
        .expect(500);
      
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /subjects/:sid/labs', () => {
    it('should create a new lab material', async () => {
      const mockLabMaterial = createMockData.labMaterial({
        id: 1,
        title: 'New Lab Exercise',
        url: 'https://example.com/newlab.pdf'
      });
      
      global.mockPrisma.labMaterial.create.mockResolvedValue(mockLabMaterial);
      
      const response = await request(app)
        .post('/subjects/1/labs')
        .send({
          title: 'New Lab Exercise',
          url: 'https://example.com/newlab.pdf'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('lab material uploaded successfully');
      expect(response.body.data.title).toBe('New Lab Exercise');
      
      expect(global.mockPrisma.labMaterial.create).toHaveBeenCalledWith({
        data: {
          title: 'New Lab Exercise',
          url: 'https://example.com/newlab.pdf',
          subjectId: 1,
          userId: 1
        }
      });
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/subjects/1/labs')
        .send({
          url: 'https://example.com/lab.pdf'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and Cloudinary URL are required');
    });

    it('should return 400 when url is missing', async () => {
      const response = await request(app)
        .post('/subjects/1/labs')
        .send({
          title: 'Test Lab'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and Cloudinary URL are required');
    });
  });

  describe('DELETE /labs/:id', () => {
    it('should delete a lab material successfully', async () => {
      const mockLabMaterial = createMockData.labMaterial({
        id: 1,
        title: 'lab-exercise'
      });
      
      global.mockPrisma.labMaterial.findUnique.mockResolvedValue(mockLabMaterial);
      global.mockPrisma.labMaterial.delete.mockResolvedValue(mockLabMaterial);
      
      const cloudinary = require('cloudinary').v2;
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
      
      const response = await request(app)
        .delete('/labs/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Lab material deleted successfully');
      
      expect(global.mockPrisma.labMaterial.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('lab-exercise');
      expect(global.mockPrisma.labMaterial.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 404 when lab material not found', async () => {
      global.mockPrisma.labMaterial.findUnique.mockResolvedValue(null);
      
      const response = await request(app)
        .delete('/labs/999')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Lab material not found');
    });
  });
});