const bcrypt = require('bcrypt');

async function testPassword() {
  const plainPassword = 'admin123456';
  const hashedPassword = '$2b$10$BotlfXw1/UqpqJMi0EYGjuSxqMcdk2yPsOqnJEqggObTX5g9s4wbS';

  console.log('Testing password verification...');
  console.log('Plain password:', plainPassword);
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


