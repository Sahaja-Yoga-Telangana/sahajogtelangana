import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { User } from '@/models/User';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Set environment variable before importing route handler
  process.env.MONGO_URL = uri;

  // Clear existing mongoose connections if any
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  // Connect Mongoose to the in-memory database
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear the users collection before each test
  if (mongoose.connection.db) {
    await User.deleteMany({});
  }
});

describe('User Registration API Integration Tests', () => {
  it('should successfully register a new user and hash the password', async () => {
    // Dynamic import to ensure process.env.MONGO_URL is set before the route loads and connects
    const { POST } = await import('@/app/api/auth/register/route');

    const requestBody = {
      name: 'Sahaj Meditator',
      email: 'meditate@sahajayoga.org',
      password: 'password123',
      password_confirmation: 'password123',
    };

    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json.msg).toBe('User Created successfully!');

    // Check that user exists in database
    const createdUser = await User.findOne({ email: requestBody.email });
    expect(createdUser).toBeDefined();
    expect(createdUser.name).toBe(requestBody.name);
    // Password should be hashed (not equal to plain text)
    expect(createdUser.password).not.toBe(requestBody.password);
    expect(createdUser.role).toBe('User'); // Default role
  });

  it('should fail registration when email is already registered', async () => {
    const { POST } = await import('@/app/api/auth/register/route');

    // Create a pre-existing user in the database
    await User.create({
      name: 'Existing User',
      email: 'duplicate@example.com',
      password: 'hashedpasswordxyz',
      role: 'User',
    });

    const requestBody = {
      name: 'Another User',
      email: 'duplicate@example.com', // Duplicate email
      password: 'password123',
      password_confirmation: 'password123',
    };

    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    const response = await POST(req);
    const json = await response.json();

    // Since the API returns status 200 with error details in the JSON body
    expect(response.status).toBe(200);
    expect(json.status).toBe(400);
    expect(json.errors.email).toBe('Email is already used.');
  });
});
