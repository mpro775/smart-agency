const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI =
  process.env.MONGODB_URI;

// User schema definition
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

async function createTestAdmin() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }
    const testEmail = process.env.TEST_ADMIN_EMAIL;
    const testPassword = process.env.TEST_ADMIN_PASSWORD;
    if (!testEmail || !testPassword) {
      throw new Error('TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD are required');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test admin already exists
    const existingTestAdmin = await User.findOne({ email: testEmail });
    if (existingTestAdmin) {
      console.log('⚠️  Test admin already exists! Deleting...');
      await User.deleteOne({ email: testEmail });
    }

    // Create test admin with known password
    console.log('🔐 Hashing test password...');
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    console.log('👤 Creating test admin user...');
    const testAdmin = new User({
      name: 'Test Admin',
      email: testEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await testAdmin.save();

    console.log('✅ Test admin created successfully!');
    console.log('📋 Test Admin Details:');
    console.log(`   Name: ${testAdmin.name}`);
    console.log(`   Email: ${testAdmin.email}`);
    console.log(`   Role: ${testAdmin.role}`);
    console.log('');
    console.log('🔑 Test these credentials:');
    console.log(`   Email: ${testAdmin.email}`);

    // Verify the password works
    console.log('\n🔐 Verifying password...');
    const isValid = await bcrypt.compare(testPassword, testAdmin.password);
    console.log('Password verification:', isValid ? '✅ SUCCESS' : '❌ FAILED');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

createTestAdmin();









