const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login with TEST admin credentials...');

    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'test@admin.com',
      password: 'test123456'
    });

    console.log('✅ Login successful!');
    console.log('Response:', response.data);

    // Also test the original admin credentials
    console.log('\n🔍 Testing login with ORIGINAL admin credentials...');
    try {
      const response2 = await axios.post('http://localhost:3000/api/auth/login', {
        email: 'admin@smartagency.com',
        password: 'admin123456'
      });

      console.log('✅ Original admin login successful!');
      console.log('Response:', response2.data);
    } catch (error2) {
      console.log('❌ Original admin login failed!');
      if (error2.response) {
        console.log('Status:', error2.response.status);
        console.log('Error:', error2.response.data);
      }
    }

  } catch (error) {
    console.log('❌ Test admin login failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Wait for server to start
setTimeout(() => {
  testLogin();
}, 5000);
