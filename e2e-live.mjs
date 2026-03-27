import http from 'http';

const BASE_URL = 'http://localhost:3010';
let token = '';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(method, path, body = null, headers = {}) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    console.log(`[${method}] ${path} -> Status: ${res.status}`);
    return { status: res.status, data };
  } catch (error) {
    console.error(`[${method}] ${path} -> Error:`, error.message);
    return { status: 500, data: error.message };
  }
}

async function runTests() {
  console.log('--- Starting Live E2E Tests ---');
  
  // 1. Health
  await request('GET', '/health');
  // Or GET /
  await request('GET', '/');

  // 2. Auth - Register
  const userPayload = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  };
  const regRes = await request('POST', '/auth/register', userPayload);
  console.log('Register Response:', regRes.data);

  // 3. Auth - Login
  const loginRes = await request('POST', '/auth/login', { email: userPayload.email, password: 'password123' });
  if (loginRes.data && loginRes.data.accessToken) {
    token = loginRes.data.accessToken;
    console.log('Login successful, got token.');
  } else {
    console.log('Login failed:', loginRes.data);
  }

  // 4. Test Users Service via Gateway (if exposed)
  // Usually POST /users and GET /users
  const getUsers = await request('GET', '/users');
  console.log('Get Users Response size:', Array.isArray(getUsers.data) ? getUsers.data.length : getUsers.data);

  // 5. Test Product Service
  console.log('\nTesting Product Service...');
  const productsRes = await request('GET', '/products');
  console.log('Products:', productsRes.data);

  const categoriesRes = await request('GET', '/categories');
  console.log('Categories:', categoriesRes.data);

  // 6. Test Orders Service (Protected)
  console.log('\nTesting Orders Service...');
  const authHeaders = { Authorization: `Bearer ${token}` };
  const orderRes = await request('POST', '/orders', { userId: 1, total: 100 }, authHeaders);
  console.log('Create Order:', orderRes.data);

  const getOrdersRes = await request('GET', '/orders', null, authHeaders);
  console.log('Get Orders:', getOrdersRes.data);
  
  console.log('--- Finished Live E2E Tests ---');
}

runTests().catch(console.error);
