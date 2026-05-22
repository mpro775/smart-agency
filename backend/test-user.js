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

async function checkUser() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@smartagency.com';
    const testPassword = process.env.SEED_ADMIN_PASSWORD;

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const user = await User.findOne({ email: adminEmail });
    console.log('👤 Admin user found:', user ? {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      passwordHash: user.password.substring(0, 20) + '...', // Show first 20 chars
      createdAt: user.createdAt
    } : 'NOT FOUND');

    if (user) {
      // Test password comparison
      if (!testPassword) {
        throw new Error('SEED_ADMIN_PASSWORD is required to verify a password');
      }
      console.log('\n🔐 Testing password comparison...');
      console.log('Stored hash:', user.password);

      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('Password match result:', isValid);

      if (!isValid) {
        console.log('❌ Password verification failed!');

        // Let's try hashing the password again to see if it matches
        console.log('\n🔄 Re-hashing the test password...');
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log('New hash:', newHash);

        const isNewHashValid = await bcrypt.compare(testPassword, newHash);
        console.log('New hash verification:', isNewHashValid);
      } else {
        console.log('✅ Password verification successful!');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

checkUser();









