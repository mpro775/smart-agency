import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

// Try to load dotenv if not already loaded
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config();
} catch (e) {
  // ignore
}

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
  console.error('Missing R2 environment variables. Please check your .env file.');
  process.exit(1);
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const isDryRun = process.argv.includes('--dry-run');
const isApply = process.argv.includes('--apply');

if (!isDryRun && !isApply) {
  console.log('Please specify --dry-run or --apply');
  console.log('Example: npx ts-node scripts/delete-old-r2-images.ts --dry-run');
  process.exit(1);
}

const mapPath = path.join(__dirname, 'image-map.json');
if (!fs.existsSync(mapPath)) {
  console.error(`image-map.json not found at ${mapPath}. Please run optimize-r2-images.ts first.`);
  process.exit(1);
}

const imageMap: Record<string, string> = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const oldKeys = Object.keys(imageMap);

async function run() {
  console.log(`Starting ${isDryRun ? 'DRY RUN' : 'APPLY'} deletion of old images...`);
  
  if (oldKeys.length === 0) {
    console.log('No images to delete in image-map.json');
    process.exit(0);
  }

  let deletedCount = 0;
  let errorCount = 0;

  for (const oldKey of oldKeys) {
    try {
      if (isApply) {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: oldKey,
        }));
        console.log(`[APPLY] Deleted old file: ${oldKey}`);
      } else {
        console.log(`[DRY RUN] Would delete: ${oldKey}`);
      }
      deletedCount++;
    } catch (e) {
      console.error(`Failed to delete ${oldKey}:`, e);
      errorCount++;
    }
  }

  console.log(`\n--- Deletion Report ---`);
  console.log(`Total processed: ${deletedCount + errorCount}`);
  console.log(`Successfully ${isApply ? 'deleted' : 'would be deleted'}: ${deletedCount}`);
  if (errorCount > 0) {
    console.log(`Errors: ${errorCount}`);
  }
}

run().catch(console.error);
