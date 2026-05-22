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

async function resetAdminPassword() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@smartagency.com';
    const newPassword = process.env.SEED_ADMIN_PASSWORD;
    if (!newPassword) {
      throw new Error('SEED_ADMIN_PASSWORD is required');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('👤 Found admin user:', {
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });

    // Reset password to default
    console.log('🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user
    adminUser.password = hashedPassword;
    await adminUser.save();

    console.log('✅ Admin password reset successfully!');
    console.log('📋 New Admin Credentials:');
    console.log(`   Email: ${adminUser.email}`);
    console.log('');

    // Verify the new password works
    console.log('🔐 Verifying new password...');
    const isValid = await bcrypt.compare(newPassword, adminUser.password);
    console.log('Password verification:', isValid ? '✅ SUCCESS' : '❌ FAILED');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

resetAdminPassword();









