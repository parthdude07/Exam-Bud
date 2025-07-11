require('dotenv').config({ path: '.env.test' });

const mockPrismaInstance = {
  upload: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  labMaterial: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  discussion: {
    findMany: jest.fn(),
    create: jest.fn()
  }
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaInstance)
}));

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

global.mockPrisma = mockPrismaInstance;

console.log('Route testing setup loaded');