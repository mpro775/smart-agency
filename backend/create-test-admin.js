const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://smartagencyyem_db_user:P93OOGZBO9gSaXBL@cluster0.sma4e8a.mongodb.net/smart-agency?retryWrites=true&w=majority';

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
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if test admin already exists
    const existingTestAdmin = await User.findOne({ email: 'test@admin.com' });
    if (existingTestAdmin) {
      console.log('⚠️  Test admin already exists! Deleting...');
      await User.deleteOne({ email: 'test@admin.com' });
    }

    // Create test admin with known password
    const testPassword = 'test123456';
    console.log('🔐 Hashing test password...');
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    console.log('👤 Creating test admin user...');
    const testAdmin = new User({
      name: 'Test Admin',
      email: 'test@admin.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await testAdmin.save();

    console.log('✅ Test admin created successfully!');
    console.log('📋 Test Admin Details:');
    console.log(`   Name: ${testAdmin.name}`);
    console.log(`   Email: ${testAdmin.email}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   Role: ${testAdmin.role}`);
    console.log('');
    console.log('🔑 Test these credentials:');
    console.log(`   Email: ${testAdmin.email}`);
    console.log(`   Password: ${testPassword}`);

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


