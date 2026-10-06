const request = require('supertest');
const app = require('../server');
const { connectDB, disconnectDB, clearDB } = require('./setup');
const User = require('../src/models/User');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'testsecret';
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

afterEach(async () => {
  await clearDB();
});

describe('Auth API', () => {
  describe('POST /api/auth/setup', () => {
    it('should create an initial admin user', async () => {
      const res = await request(app)
        .post('/api/auth/setup')
        .send({
          name: 'Admin User',
          email: 'admin@campusync.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('Admin');
    });

    it('should fail if admin already exists', async () => {
      // Create admin
      await User.create({
        name: 'Admin 1',
        email: 'admin1@campusync.com',
        password: 'Password123!',
        role: 'Admin'
      });

      const res = await request(app)
        .post('/api/auth/setup')
        .send({
          name: 'Admin 2',
          email: 'admin2@campusync.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Admin already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
      await User.create({
        name: 'Test Staff',
        email: 'staff@campusync.com',
        password: 'Password123!',
        role: 'Staff'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'staff@campusync.com',
          password: 'Password123!'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.role).toBe('Staff');
    });

    it('should not login with invalid credentials', async () => {
      await User.create({
        name: 'Test Staff',
        email: 'staff@campusync.com',
        password: 'Password123!',
        role: 'Staff'
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'staff@campusync.com',
          password: 'WrongPassword!'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toBe(false);
    });
  });
});
