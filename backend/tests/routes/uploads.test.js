const request = require('supertest');
const { createTestApp, createMockData } = require('../utils/testUtils');
const uploadRoutes = require('../../src/routes/uploadRoutes');

require('../setup/routes.setup');

describe('Upload Routes', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp(uploadRoutes);
  });

  describe('GET /subjects/:sid/uploads', () => {
    it('should fetch uploads for a subject', async () => {
      const mockUploads = [
        createMockData.upload({ id: 1, title: 'Test Upload 1' }),
        createMockData.upload({ id: 2, title: 'Test Upload 2' })
      ];
      
      global.mockPrisma.upload.findMany.mockResolvedValue(mockUploads);
      
      const response = await request(app)
        .get('/subjects/1/uploads')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Fetched uploads successfully');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Test Upload 1');
      
      expect(global.mockPrisma.upload.findMany).toHaveBeenCalledWith({
        where: { subjectId: 1 },
        include: { user: true }
      });
    });

    it('should return empty array when no uploads exist', async () => {
      global.mockPrisma.upload.findMany.mockResolvedValue([]);
      
      const response = await request(app)
        .get('/subjects/1/uploads')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      global.mockPrisma.upload.findMany.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .get('/subjects/1/uploads')
        .expect(500);
      
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /subjects/:sid/uploads', () => {
    it('should create a new upload', async () => {
      const mockUpload = createMockData.upload({
        id: 1,
        title: 'New Upload',
        url: 'https://example.com/newfile.pdf'
      });
      
      global.mockPrisma.upload.create.mockResolvedValue(mockUpload);
      
      const response = await request(app)
        .post('/subjects/1/uploads')
        .send({
          title: 'New Upload',
          url: 'https://example.com/newfile.pdf'
        })
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Material uploaded successfully');
      expect(response.body.data.title).toBe('New Upload');
      
      expect(global.mockPrisma.upload.create).toHaveBeenCalledWith({
        data: {
          title: 'New Upload',
          url: 'https://example.com/newfile.pdf',
          subjectId: 1,
          userId: 1
        }
      });
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/subjects/1/uploads')
        .send({
          url: 'https://example.com/file.pdf'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and Cloudinary URL are required');
    });

    it('should return 400 when url is missing', async () => {
      const response = await request(app)
        .post('/subjects/1/uploads')
        .send({
          title: 'Test Upload'
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and Cloudinary URL are required');
    });

    it('should return 400 when both title and url are missing', async () => {
      const response = await request(app)
        .post('/subjects/1/uploads')
        .send({})
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and Cloudinary URL are required');
    });
  });

  describe('DELETE /uploads/:id', () => {
    it('should delete an upload successfully', async () => {
      const mockUpload = createMockData.upload({
        id: 1,
        title: 'test-file'
      });
      
      global.mockPrisma.upload.findUnique.mockResolvedValue(mockUpload);
      global.mockPrisma.upload.delete.mockResolvedValue(mockUpload);
      
      const cloudinary = require('cloudinary').v2;
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
      
      const response = await request(app)
        .delete('/uploads/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Material deleted successfully');
      
      expect(global.mockPrisma.upload.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test-file');
      expect(global.mockPrisma.upload.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should return 404 when upload not found', async () => {
      global.mockPrisma.upload.findUnique.mockResolvedValue(null);
      
      const response = await request(app)
        .delete('/uploads/999')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Material not found');
    });

    it('should handle cloudinary deletion failure', async () => {
      const mockUpload = createMockData.upload();
      global.mockPrisma.upload.findUnique.mockResolvedValue(mockUpload);
      
      const cloudinary = require('cloudinary').v2;
      cloudinary.uploader.destroy.mockResolvedValue({ result: 'error' });
      
      const response = await request(app)
        .delete('/uploads/1')
        .expect(500);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unexpected result from Cloudinary');
    });
  });
});