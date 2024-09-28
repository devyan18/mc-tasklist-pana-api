// auth.routes.test.ts
import request from 'supertest';
import express from 'express';
import { authRouter } from '../src/routes/auth.routes';
import { AuthService } from '../src/services/auth.service';
import { authGuard } from '../src/guards/auth.guard';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

jest.mock('../src/guards/auth.guard');

describe('Auth Routes', () => {
  let signUpMock: jest.SpyInstance;
  let signInMock: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    signUpMock = jest.spyOn(AuthService, 'signUp');
    signInMock = jest.spyOn(AuthService, 'signIn');
  });

  describe('POST /auth/sign-up', () => {
    it('should sign up a user successfully', async () => {
      const mockResponse = { accessToken: 'token' };
      signUpMock.mockResolvedValue(mockResponse);

      const response = await request(app).post('/auth/sign-up').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return an error if sign up fails', async () => {
      signUpMock.mockRejectedValue(new Error('Sign up error'));

      const response = await request(app).post('/auth/sign-up').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Error signing up');
    });
  });

  describe('POST /auth/sign-in', () => {
    it('should sign in a user successfully', async () => {
      const mockResponse = { accessToken: 'token' };
      signInMock.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/auth/sign-in')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return an error if sign in fails', async () => {
      signInMock.mockRejectedValue(new Error('Sign in error'));

      const response = await request(app)
        .post('/auth/sign-in')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Error signing in');
    });
  });

  describe('POST /auth/sign-out', () => {
    it('should sign out a user successfully', async () => {
      const response = await request(app).post('/auth/sign-out');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Signed out');
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('GET /auth/me', () => {
    it('should get the current user successfully', async () => {
      (authGuard as jest.Mock).mockImplementation((req, res, next) => {
        req.user = { id: 1, username: 'testuser' };
        next();
      });

      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({ id: 1, username: 'testuser' });
    });
  });
});
