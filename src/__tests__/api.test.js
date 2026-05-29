const request = require('supertest');
const app = require('../index');

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should return ready status', async () => {
    const response = await request(app).get('/ready');
    expect(response.status).toBe(200);
    expect(response.body.ready).toBe(true);
  });
});

describe('Transactions', () => {
  const validApiKey = 'sk_test_123456789';

  it('should create a transaction', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .set('Authorization', `Bearer ${validApiKey}`)
      .send({
        amount: 1000,
        currency: 'USD',
        payment_method: {
          type: 'card'
        }
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toMatch(/^txn_/);
  });

  it('should fail without API key', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        amount: 1000,
        currency: 'USD',
        payment_method: {
          type: 'card'
        }
      });

    expect(response.status).toBe(401);
  });
});

describe('Customers', () => {
  const validApiKey = 'sk_test_123456789';

  it('should create a customer', async () => {
    const response = await request(app)
      .post('/api/v1/customers')
      .set('Authorization', `Bearer ${validApiKey}`)
      .send({
        email: 'customer@example.com',
        name: 'John Doe'
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe('customer@example.com');
  });
});
