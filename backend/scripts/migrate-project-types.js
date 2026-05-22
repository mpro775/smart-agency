const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI;

const projectSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    category: String,
    categoryId: mongoose.Schema.Types.ObjectId,
    projectTypes: [String],
    categoryIds: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true },
);

const Project = mongoose.model('Project', projectSchema);

async function migrateProjectTypes() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }

    console.log('🔄 جاري الاتصال بقاعدة البيانات...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح\n');

    const projects = await Project.find({}).exec();
    let updatedCount = 0;

    for (const project of projects) {
      let needsUpdate = false;
      const updatePayload = {};

      if (
        (!project.projectTypes || project.projectTypes.length === 0) &&
        project.category
      ) {
        updatePayload.projectTypes = [project.category];
        needsUpdate = true;
      }

      if (
        (!project.categoryIds || project.categoryIds.length === 0) &&
        project.categoryId
      ) {
        updatePayload.categoryIds = [project.categoryId];
        needsUpdate = true;
      }

      if (needsUpdate) {
        await Project.findByIdAndUpdate(project._id, updatePayload);
        console.log(
          `✅ تم تحديث المشروع: ${project.title} (${project.slug})`,
        );
        updatedCount++;
      }
    }

    console.log(`\n✅ تم تحديث ${updatedCount} مشروع من أصل ${projects.length}`);
  } catch (error) {
    console.error('❌ حدث خطأ أثناء الترحيل:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 تم إغلاق الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

if (require.main === module) {
  migrateProjectTypes();
}

module.exports = { migrateProjectTypes };
