import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as fs from 'fs';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharpModule = require('sharp');
const sharp = (sharpModule.default ?? sharpModule) as any;
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
  console.log('Example: npx ts-node scripts/optimize-r2-images.ts --dry-run');
  process.exit(1);
}

async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function run() {
  console.log(`Starting ${isDryRun ? 'DRY RUN' : 'APPLY'}...`);

  let continuationToken: string | undefined = undefined;

  let totalFound = 0;
  let skippedSvg = 0;
  let skippedGif = 0;
  let alreadyWebp = 0;
  let convertible = 0;
  let errorCount = 0;

  let totalBeforeBytes = 0;
  let totalAfterBytes = 0;

  const imageMap: Record<string, string> = {};

  do {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: 'smart-agency/',
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);
    const objects = response.Contents || [];

    for (const obj of objects) {
      if (!obj.Key) continue;

      totalFound++;
      const key = obj.Key.toLowerCase();
      const originalSize = obj.Size || 0;

      if (key.endsWith('.svg')) {
        skippedSvg++;
        continue;
      }
      if (key.endsWith('.gif')) {
        skippedGif++;
        continue;
      }
      if (key.endsWith('.webp')) {
        alreadyWebp++;
        continue;
      }

      convertible++;
      totalBeforeBytes += originalSize;

      try {
        // Download the file
        const getCmd = new GetObjectCommand({
          Bucket: bucketName,
          Key: obj.Key,
        });
        const getRes = await s3Client.send(getCmd);
        const originalBuffer = await streamToBuffer(getRes.Body);

        // Compress
        const { data: optimizedBuffer } = await sharp(originalBuffer)
          .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer({ resolveWithObject: true });

        const optimizedSize = optimizedBuffer.length;
        totalAfterBytes += optimizedSize;

        if (isApply) {
          const newKey = obj.Key.replace(/\.[^/.]+$/, "") + ".webp";

          // Upload new file
          const upload = new Upload({
            client: s3Client,
            params: {
              Bucket: bucketName!,
              Key: newKey,
              Body: optimizedBuffer,
              ContentType: 'image/webp',
              CacheControl: 'public, max-age=31536000, immutable',
            },
          });
          await upload.done();

          // Do NOT delete the old file automatically.
          // Save mapping for the MongoDB update script.
          if (newKey !== obj.Key) {
            imageMap[obj.Key] = newKey;
          }
          console.log(`[APPLY] Converted: ${obj.Key} -> ${newKey} (${(originalSize / 1024).toFixed(1)}KB -> ${(optimizedSize / 1024).toFixed(1)}KB)`);
        } else {
          console.log(`[DRY RUN] Would convert: ${obj.Key} (${(originalSize / 1024).toFixed(1)}KB -> ${(optimizedSize / 1024).toFixed(1)}KB)`);
        }
      } catch (error) {
        console.error(`Error processing ${obj.Key}:`, error);
        errorCount++;
      }
    }

    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  console.log('\n--- Report ---');
  console.log(`Found images: ${totalFound}`);
  console.log(`Convertible images: ${convertible}`);
  console.log(`Skipped SVG: ${skippedSvg}`);
  console.log(`Skipped GIF: ${skippedGif}`);
  console.log(`Already WebP: ${alreadyWebp}`);

  if (errorCount > 0) {
    console.log(`Errors: ${errorCount}`);
  }

  const beforeMB = (totalBeforeBytes / (1024 * 1024)).toFixed(2);
  const afterMB = (totalAfterBytes / (1024 * 1024)).toFixed(2);
  const savingMB = ((totalBeforeBytes - totalAfterBytes) / (1024 * 1024)).toFixed(2);
  const savingPercent = totalBeforeBytes > 0 ? Math.round(((totalBeforeBytes - totalAfterBytes) / totalBeforeBytes) * 100) : 0;

  console.log(`\nEstimated before: ${beforeMB}MB`);
  console.log(`Estimated after: ${afterMB}MB`);
  console.log(`Estimated saving: ${savingMB}MB / ${savingPercent}%`);

  if (isApply) {
    const mapPath = path.join(__dirname, 'image-map.json');
    fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
    console.log(`\nImage map saved to ${mapPath}. You can now run the MongoDB update script.`);
  }
}

run().catch(console.error);
