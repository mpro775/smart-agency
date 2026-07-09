import mongoose from 'mongoose';

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

const oldImageRegex = /\.(png|jpg|jpeg)(\?|#|$)/i;
const r2Regex = /smart-agency\//i;
const base64Regex = /data:image\//i;

function scanObject(obj: any, path = ''): Array<{ path: string; value: string; type: string }> {
    const results: Array<{ path: string; value: string; type: string }> = [];

    if (!obj || typeof obj !== 'object') return results;

    for (const key of Object.keys(obj)) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        if (typeof value === 'string') {
            if (oldImageRegex.test(value)) {
                results.push({ path: currentPath, value, type: 'OLD_EXTENSION' });
            }

            if (base64Regex.test(value)) {
                results.push({ path: currentPath, value: value.slice(0, 120) + '...', type: 'BASE64_IMAGE' });
            }

            if (r2Regex.test(value) && !value.includes('.webp') && !value.includes('.svg') && !value.includes('.gif')) {
                results.push({ path: currentPath, value, type: 'R2_NON_WEBP' });
            }
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                results.push(...scanObject(item, `${currentPath}.${index}`));
            });
        } else if (typeof value === 'object' && value !== null) {
            results.push(...scanObject(value, currentPath));
        }
    }

    return results;
}

async function run() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri!);
    console.log('Connected.');

    const db = mongoose.connection.db;
    if (!db) throw new Error('Database connection failed');

    const collections = await db.listCollections().toArray();

    let totalFindings = 0;

    for (const col of collections) {
        const collection = db.collection(col.name);
        const docs = await collection.find({}).toArray();

        let collectionFindings = 0;

        for (const doc of docs) {
            const findings = scanObject(doc);

            if (findings.length > 0) {
                collectionFindings += findings.length;
                totalFindings += findings.length;

                console.log(`\nCollection: ${col.name}`);
                console.log(`Document _id: ${doc._id}`);

                for (const finding of findings) {
                    console.log(`- [${finding.type}] ${finding.path}`);
                    console.log(`  ${finding.value}`);
                }
            }
        }

        if (collectionFindings > 0) {
            console.log(`\n-> ${col.name}: ${collectionFindings} remaining image references found.`);
        }
    }

    console.log('\n--- Audit Summary ---');
    console.log(`Total findings: ${totalFindings}`);

    await mongoose.disconnect();
}

run().catch((e) => {
    console.error(e);
    process.exit(1);
});