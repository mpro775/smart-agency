const bcrypt = require('bcrypt');

async function testPassword() {
  const plainPassword = process.env.TEST_PASSWORD;
  const hashedPassword = process.env.TEST_PASSWORD_HASH;

  if (!plainPassword || !hashedPassword) {
    throw new Error('TEST_PASSWORD and TEST_PASSWORD_HASH are required');
  }

  console.log('Testing password verification...');
  console.log('Hashed password:', hashedPassword);

  try {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('Password match result:', isValid);

    if (isValid) {
      console.log('✅ Password verification successful!');
    } else {
      console.log('❌ Password verification failed!');
    }
  } catch (error) {
    console.error('Error during password verification:', error);
  }
}

testPassword();









