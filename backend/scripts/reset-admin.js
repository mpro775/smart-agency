const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB connection string
const MONGODB_URI =
  process.env.MONGODB_URI;

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

async function resetAdmin() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }

    console.log('🔄 جاري الاتصال بقاعدة البيانات...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@smartagency.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error('SEED_ADMIN_PASSWORD is required');
    }

    // Find admin user
    let admin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!admin) {
      console.log('⚠️  المستخدم غير موجود. جاري إنشاء مستخدم جديد...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      await admin.save();
      console.log('✅ تم إنشاء المستخدم بنجاح!');
    } else {
      console.log('✅ المستخدم موجود. جاري إعادة تعيين كلمة المرور...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      admin.password = hashedPassword;
      admin.isActive = true;
      admin.role = 'admin';
      await admin.save();
      console.log('✅ تم إعادة تعيين كلمة المرور بنجاح!');
    }

    // Verify password
    const testPassword = await bcrypt.compare(adminPassword, admin.password);
    console.log('\n📋 معلومات تسجيل الدخول:');
    console.log('===========================================');
    console.log(`البريد الإلكتروني: ${adminEmail}`);
    console.log(
      `التحقق من كلمة المرور: ${testPassword ? '✅ صحيح' : '❌ خطأ'}`,
    );
    console.log(`الدور: ${admin.role}`);
    console.log(`نشط: ${admin.isActive}`);
    console.log('===========================================');

    if (!testPassword) {
      console.error('❌ خطأ: كلمة المرور غير صحيحة بعد الحفظ!');
    }
  } catch (error) {
    console.error('❌ حدث خطأ:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 تم إغلاق الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

// Run the script
resetAdmin();
