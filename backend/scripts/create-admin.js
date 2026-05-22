const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string - يمكن تعديلها حسب الحاجة
const MONGODB_URI =
  process.env.MONGODB_URI;

// User schema definition (مطابق للـ schema في النظام)
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

// User model
const User = mongoose.model('User', userSchema);

// Admin user data
const adminData = {
  name: process.env.SEED_ADMIN_NAME || 'Admin',
  email: process.env.SEED_ADMIN_EMAIL || 'admin@smartagency.com',
  password: process.env.SEED_ADMIN_PASSWORD || '',
  role: 'admin',
  isActive: true,
};

async function createAdmin() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }
    if (!adminData.password) {
      throw new Error('SEED_ADMIN_PASSWORD is required');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    console.log('🔍 Checking if admin user already exists...');
    const existingAdmin = await User.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return;
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = new User({
      ...adminData,
      password: hashedPassword,
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📋 Admin Details:');
    console.log(`   Name: ${adminData.name}`);
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Role: ${adminData.role}`);
    console.log('');
    console.log('🔑 Use these credentials to login to the admin panel:');
    console.log(`   URL: http://localhost:3001/admin/login`);
    console.log(`   Email: ${adminData.email}`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);

    if (error.code === 11000) {
      console.error('⚠️  A user with this email already exists');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Interactive mode
function interactiveMode() {
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('🛠️  Interactive Admin User Creation');
  console.log('=====================================');

  rl.question('Enter admin name (default: Admin): ', (name) => {
    adminData.name = name.trim() || 'Admin';

    rl.question(
      'Enter admin email (default: admin@smartagency.com): ',
      (email) => {
        adminData.email = email.trim() || 'admin@smartagency.com';

        rl.question(
          'Enter admin password: ',
          (password) => {
            adminData.password = password.trim();
            if (!adminData.password) {
              console.error('Password is required.');
              rl.close();
              return;
            }

            rl.question(
              'Enter role (admin/editor, default: admin): ',
              (role) => {
                adminData.role =
                  role.trim().toLowerCase() === 'editor' ? 'editor' : 'admin';

                rl.close();
                createAdmin();
              },
            );
          },
        );
      },
    );
  });
}

// Main execution
const args = process.argv.slice(2);

if (args.includes('--interactive') || args.includes('-i')) {
  interactiveMode();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log('🆘 Create Admin User Script');
  console.log('===========================');
  console.log('');
  console.log('Usage:');
  console.log('  SEED_ADMIN_PASSWORD=... node scripts/create-admin.js');
  console.log(
    '  node scripts/create-admin.js --interactive   # Interactive mode',
  );
  console.log(
    '  node scripts/create-admin.js --help          # Show this help',
  );
  console.log('');
  console.log('Environment Variables:');
  console.log(
    '  MONGODB_URI - MongoDB connection string',
  );
  console.log('  SEED_ADMIN_EMAIL - Admin email');
  console.log('  SEED_ADMIN_PASSWORD - Admin password');
  console.log('  SEED_ADMIN_NAME - Admin name');
} else {
  createAdmin();
}
