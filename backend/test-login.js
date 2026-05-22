const axios = require('axios');

async function testLogin() {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3000/api';
    const email = process.env.TEST_LOGIN_EMAIL;
    const password = process.env.TEST_LOGIN_PASSWORD;

    if (!email || !password) {
      throw new Error('TEST_LOGIN_EMAIL and TEST_LOGIN_PASSWORD are required');
    }

    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password,
    });

    console.log('Login successful');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('Login failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

setTimeout(() => {
  testLogin();
}, 5000);
