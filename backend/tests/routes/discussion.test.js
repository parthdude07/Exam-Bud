const request = require('supertest');
const { createTestApp, createMockData } = require('../utils/testUtils');
const discussionRoutes = require('../../src/routes/discussionRoutes');

require('../setup/routes.setup');

describe('Discussion Routes', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp(discussionRoutes);
  });

  describe('GET /subjects/:sid/discussions', () => {
    it('should fetch discussions for a subject', async () => {
      const mockDiscussions = [
        createMockData.discussion({ 
          id: 1, 
          content: 'This is a test discussion about the subject.',
          createdAt: new Date('2024-01-02T10:00:00Z')
        }),
        createMockData.discussion({ 
          id: 2, 
          content: 'Another discussion about the same subject.',
          createdAt: new Date('2024-01-01T10:00:00Z')
        })
      ];
      
      global.mockPrisma.discussion.findMany.mockResolvedValue(mockDiscussions);
      
      const response = await request(app)
        .get('/subjects/1/discussions')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('discussion fetched successfully');
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].content).toBe('This is a test discussion about the subject.');
      
      expect(global.mockPrisma.discussion.findMany).toHaveBeenCalledWith({
        where: { subjectId: 1 },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
    });

    it('should return empty array when no discussions exist', async () => {
      global.mockPrisma.discussion.findMany.mockResolvedValue([]);
      
      const response = await request(app)
        .get('/subjects/1/discussions')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should handle database errors', async () => {
      global.mockPrisma.discussion.findMany.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app)
        .get('/subjects/1/discussions')
        .expect(500);
      
      expect(response.body.success).toBe(false);
    });

    it('should convert string subject ID to number', async () => {
      global.mockPrisma.discussion.findMany.mockResolvedValue([]);
      
      await request(app)
        .get('/subjects/123/discussions')
        .expect(200);
      
      expect(global.mockPrisma.discussion.findMany).toHaveBeenCalledWith({
        where: { subjectId: 123 },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
    });
  });

  describe('POST /subjects/:sid/discussions', () => {
    it('should create a new discussion', async () => {
      const mockDiscussion = createMockData.discussion({
        id: 1,
        content: 'This is a new discussion about the subject.'
      });
      
      global.mockPrisma.discussion.create.mockResolvedValue(mockDiscussion);
      
      const response = await request(app)
        .post('/subjects/1/discussions')
        .send({
          content: 'This is a new discussion about the subject.'
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('discussion uploaded successfully');
      expect(response.body.data.content).toBe('This is a new discussion about the subject.');
      
      expect(global.mockPrisma.discussion.create).toHaveBeenCalledWith({
        data: {
          content: 'This is a new discussion about the subject.',
          subjectId: 1,
          userId: 1
        }
      });
    });

    it('should handle missing content', async () => {
      const mockDiscussion = createMockData.discussion({ content: '' });
      global.mockPrisma.discussion.create.mockResolvedValue(mockDiscussion);
      
      const response = await request(app)
        .post('/subjects/1/discussions')
        .send({})
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('discussion uploaded successfully');
    });

    it('should handle empty string content', async () => {
      const mockDiscussion = createMockData.discussion({ content: '' });
      global.mockPrisma.discussion.create.mockResolvedValue(mockDiscussion);
      
      const response = await request(app)
        .post('/subjects/1/discussions')
        .send({ content: '' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('discussion uploaded successfully');
    });

    it('should handle content with whitespace', async () => {
      const mockDiscussion = createMockData.discussion({
        content: '  Discussion with trimmed content  '
      });
      
      global.mockPrisma.discussion.create.mockResolvedValue(mockDiscussion);
      
      await request(app)
        .post('/subjects/1/discussions')
        .send({
          content: '  Discussion with trimmed content  '
        })
        .expect(200);
      
      expect(global.mockPrisma.discussion.create).toHaveBeenCalledWith({
        data: {
          content: '  Discussion with trimmed content  ',
          subjectId: 1,
          userId: 1
        }
      });
    });

    it('should handle very long content', async () => {
      const longContent = 'A'.repeat(1000);
      const mockDiscussion = createMockData.discussion({
        content: longContent
      });
      
      global.mockPrisma.discussion.create.mockResolvedValue(mockDiscussion);
      
      const response = await request(app)
        .post('/subjects/1/discussions')
        .send({
          content: longContent
        })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe(longContent);
    });

    it('should handle special characters in content', async () => {
      const specialContent = 'Discussion with special chars: <>&"\'';
      const mockDiscussion = createMockData.discussion({
        content: specialContent
      });
      
      global.mockPrisma.discussion.create.mockResolvedValue(mockDiscussion);
      
      const response = await request(app)
        .post('/subjects/1/discussions')
        .send({
          content: specialContent
        })
        .expect(200);
      
      expect(response.body.data.content).toBe(specialContent);
    });
  });
});