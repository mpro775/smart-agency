import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

// Load .env
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config();
} catch (e) {
  // ignore
}

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Missing MONGODB_URI in environment.');
  process.exit(1);
}

const isDryRun = process.argv.includes('--dry-run');
const isApply = process.argv.includes('--apply');

if (!isDryRun && !isApply) {
  console.log('Please specify --dry-run or --apply');
  process.exit(1);
}

const mapPath = path.join(__dirname, 'image-map.json');
if (!fs.existsSync(mapPath)) {
  console.error(`image-map.json not found at ${mapPath}. Please run optimize-r2-images.ts first.`);
  process.exit(1);
}

const imageMap: Record<string, string> = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

// We create an array of entries for faster replacement
const replacements = Object.entries(imageMap);

function replaceUrlsInString(val: string): string {
  let newVal = val;
  for (const [oldKey, newKey] of replacements) {
    if (newVal.includes(oldKey)) {
      newVal = newVal.split(oldKey).join(newKey);
    }
  }
  return newVal;
}

// Recursively traverse document and replace strings in specific fields
function traverseAndReplace(obj: any, fields: string[], currentPath: string = ''): boolean {
  let modified = false;

  if (!obj || typeof obj !== 'object') {
    return modified;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const pathToCheck = currentPath ? `${currentPath}.${key}` : key;

    // Check if the current path is in the fields list, or if it's inside an array of a field
    // e.g. "images.gallery.0" matches "images.gallery"
    const isTargetField = fields.some(f => pathToCheck === f || pathToCheck.startsWith(`${f}.`) || pathToCheck.startsWith(`${f}[`));

    if (isTargetField && typeof value === 'string') {
      const newValue = replaceUrlsInString(value);
      if (newValue !== value) {
        obj[key] = newValue;
        modified = true;
      }
    } else if (Array.isArray(value)) {
      // Arrays
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] === 'string') {
          // Check if this array element path matches
          const itemPath = `${pathToCheck}.${i}`;
          const isItemTarget = fields.some(f => itemPath === f || itemPath.startsWith(`${f}.`));
          
          // Also if the array itself is targeted like "images.gallery"
          if (isTargetField || isItemTarget) {
            const newValue = replaceUrlsInString(value[i]);
            if (newValue !== value[i]) {
              value[i] = newValue;
              modified = true;
            }
          }
        } else if (typeof value[i] === 'object' && value[i] !== null) {
          if (traverseAndReplace(value[i], fields, `${pathToCheck}.${i}`)) {
            modified = true;
          }
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      // Nested objects
      if (traverseAndReplace(value, fields, pathToCheck)) {
        modified = true;
      }
    }
  }

  return modified;
}

async function run() {
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(mongoUri!);
  console.log(`Connected.`);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('Database connection failed');
  }

  // The collection names can vary based on mongoose pluralization
  // We will check for these common names:
  const collectionsConfig: Record<string, string[]> = {
    projects: ['images.cover', 'images.gallery', 'clientLogo'],
    blogs: ['coverImage', 'seo.ogImage', 'seo.twitterImage', 'content'],
    teams: ['photo'],
    testimonials: ['companyLogo', 'clientPhoto'],
    abouts: ['hero.image', 'teamNote.image', 'seo.ogImage'],
    services: ['icon'],
    categories: ['icon'],
    projectcategories: ['icon'],
    technologies: ['icon']
  };

  if (replacements.length === 0) {
    console.log('No images to process in image-map.json');
    process.exit(0);
  }

  let totalUpdated = 0;

  for (const [collectionName, fields] of Object.entries(collectionsConfig)) {
    try {
      const collections = await db.listCollections({ name: collectionName }).toArray();
      if (collections.length === 0) {
        // Collection doesn't exist, skip
        continue;
      }

      const collection = db.collection(collectionName);
      const docs = await collection.find({}).toArray();
      let collectionUpdatedCount = 0;

      for (const doc of docs) {
        // We will modify a deep clone of the document?
        // No, traverseAndReplace modifies in-place, which is fine since we just fetched it.
        const originalDoc = { ...doc };
        const modified = traverseAndReplace(doc, fields);

        if (modified) {
          collectionUpdatedCount++;
          totalUpdated++;
          if (isApply) {
            await collection.updateOne({ _id: doc._id }, { $set: doc });
            console.log(`[APPLY] Updated document in ${collectionName} (_id: ${doc._id})`);
          } else {
            console.log(`[DRY RUN] Would update document in ${collectionName} (_id: ${doc._id})`);
          }
        }
      }
      
      if (collectionUpdatedCount > 0) {
        console.log(`-> ${collectionName}: ${collectionUpdatedCount} documents ${isApply ? 'updated' : 'would be updated'}.`);
      }
    } catch (e) {
      console.error(`Error processing collection ${collectionName}:`, e);
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Total documents ${isApply ? 'updated' : 'that need updating'}: ${totalUpdated}`);

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
