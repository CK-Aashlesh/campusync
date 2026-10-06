const request = require('supertest');
const app = require('../server');
const { connectDB, disconnectDB, clearDB } = require('./setup');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

let adminToken;
let staffToken;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'testsecret';
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

beforeEach(async () => {
  await clearDB();
  
  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@campusync.com',
    password: 'Password123!',
    role: 'Admin'
  });
  adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

  // Create staff
  const staff = await User.create({
    name: 'Staff User',
    email: 'staff@campusync.com',
    password: 'Password123!',
    role: 'Staff'
  });
  staffToken = jwt.sign({ id: staff._id }, process.env.JWT_SECRET);
});

describe('Role/Permission API Tests', () => {
  describe('POST /api/academic/courses', () => {
    it('Admin can create a course', async () => {
      const res = await request(app)
        .post('/api/academic/courses')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Computer Science',
          code: 'CS',
          durationInYears: 4
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
    });

    it('Staff cannot create a course (Forbidden)', async () => {
      const res = await request(app)
        .post('/api/academic/courses')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          name: 'Information Tech',
          code: 'IT',
          durationInYears: 4
        });

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/not authorized/i);
    });
  });

  describe('GET /api/academic/courses', () => {
    it('Staff can view courses', async () => {
      const res = await request(app)
        .get('/api/academic/courses')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
