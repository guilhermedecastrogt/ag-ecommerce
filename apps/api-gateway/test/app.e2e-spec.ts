import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ZodValidationPipe } from 'nestjs-zod';
import request from 'supertest';
import type { Response } from 'supertest';
import { of } from 'rxjs';
import { AppModule } from '../src/app.module';

const mockAuthClient = {
  send: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn(),
};

const mockUsersClient = {
  send: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn(),
};

const mockOrdersClient = {
  send: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn(),
};

const mockProductsClient = {
  send: jest.fn(),
  connect: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  emit: jest.fn(),
};

describe('API Gateway (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('AUTH_SERVICE')
      .useValue(mockAuthClient)
      .overrideProvider('USERS_SERVICE')
      .useValue(mockUsersClient)
      .overrideProvider('ORDERS_SERVICE')
      .useValue(mockOrdersClient)
      .overrideProvider('PRODUCT_SERVICE')
      .useValue(mockProductsClient)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ZodValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /health → 200 { status: "ok" }', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect((res: Response) => {
        expect(res.body).toMatchObject({ status: 'ok' });
      });
  });

  it('POST /auth/register → 201 with accessToken and refreshToken', () => {
    mockAuthClient.send.mockReturnValue(
      of({ accessToken: 'access_token', refreshToken: 'refresh_token' }),
    );

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', password: 'password123' })
      .expect(201)
      .expect((res: Response) => {
        expect(res.body).toMatchObject({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
  });

  it('POST /auth/login → 201 with accessToken and refreshToken', () => {
    mockAuthClient.send.mockReturnValue(
      of({ accessToken: 'access_token', refreshToken: 'refresh_token' }),
    );

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@test.com', password: 'password123' })
      .expect(201)
      .expect((res: Response) => {
        expect(res.body).toMatchObject({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
  });

  it('GET /products → 200 with array of products', () => {
    mockProductsClient.send.mockReturnValue(
      of([{ id: 1, name: 'Product A', price: 99.9, slug: 'product-a' }]),
    );

    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res: Response) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toMatchObject({ name: 'Product A' });
      });
  });

  it('POST /orders/checkout with valid JWT → 201 with PENDING order', () => {
    mockAuthClient.send.mockReturnValue(of({ sub: 1, email: 'test@test.com' }));
    mockOrdersClient.send.mockReturnValue(
      of({ id: 1, status: 'PENDING', total: 100 }),
    );

    return request(app.getHttpServer())
      .post('/orders/checkout')
      .set('Authorization', 'Bearer valid_token')
      .send({
        items: [
          { productId: 'prod-1', name: 'Product A', price: 100, quantity: 1 },
        ],
      })
      .expect(201)
      .expect((res: Response) => {
        expect(res.body).toMatchObject({ status: 'PENDING' });
      });
  });

  it('POST /auth/login with invalid payload (no email) → 400 Bad Request', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ password: 'password123' })
      .expect(400);
  });

  it('POST /orders/checkout without JWT → 401 Unauthorized', () => {
    return request(app.getHttpServer())
      .post('/orders/checkout')
      .send({
        items: [
          { productId: 'prod-1', name: 'Product A', price: 100, quantity: 1 },
        ],
      })
      .expect(401);
  });
});
