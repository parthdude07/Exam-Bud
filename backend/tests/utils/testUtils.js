const express = require('express');
const { ApiResponse } = require('../../src/utils/ApiResponse');


const createTestApp = (routes, options = {}) => {
  const app = express();
  
  app.use(express.json());
  
  if (!options.noAuth) {
    app.use((req, res, next) => {
      req.user = options.user || { 
        id: 1, 
        name: 'Test User', 
        role: 'USER' 
      };
      next();
    });
  }
  
  app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function(obj) {
      if (obj instanceof ApiResponse) {
        return originalJson.call(this, {
          success: obj.success,
          statusCode: obj.statusCode,
          data: obj.data,
          message: obj.message
        });
      }
      return originalJson.call(this, obj);
    };
    next();
  });
  
  app.use('/', routes);
  
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  });
  
  return app;
};


const createMockData = {
  user: (overrides = {}) => ({
    id: 1,
    name: 'Test User',
    role: 'USER',
    ...overrides
  }),
  
  upload: (overrides = {}) => ({
    id: 1,
    title: 'Test Upload',
    url: 'https://example.com/file.pdf',
    subjectId: 1,
    userId: 1,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    user: createMockData.user(),
    ...overrides
  }),
  
  labMaterial: (overrides = {}) => ({
    id: 1,
    title: 'Lab Exercise 1',
    url: 'https://example.com/lab.pdf',
    subjectId: 1,
    userId: 1,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    user: createMockData.user(),
    ...overrides
  }),

  discussion: (overrides = {}) => ({
    id: 1,
    content: 'Test discussion content',
    subjectId: 1,
    userId: 1,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    user: createMockData.user(),
    ...overrides
  })
};
module.exports = {
  createTestApp,
  createMockData
};