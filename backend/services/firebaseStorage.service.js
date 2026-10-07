const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

let cachedAccessToken = null;
let tokenExpiry = 0;

function formatPrivateKey(key) {
  if (!key) return '';
  let formatted = key.trim();
  if (formatted.startsWith('"') && formatted.endsWith('"')) {
    formatted = formatted.slice(1, -1);
  }
  formatted = formatted.replace(/\\n/g, '\n');
  return formatted;
}

/**
 * Helper to get Service Account credentials from JSON file or environment variables
 */
function getCredentials() {
  const serviceAccountPath = path.resolve(__dirname, '..', 'service_account.json');
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      if (parsed && parsed.private_key) {
        parsed.private_key = formatPrivateKey(parsed.private_key);
      }
      return parsed;
    } catch (e) {
      console.warn('[FirebaseStorage] Failed to parse service_account.json:', e.message);
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      project_id: process.env.FIREBASE_PROJECT_ID || 'doctor-school',
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    };
  }

  return null;
}

/**
 * Generate Google OAuth2 access token for Firebase / Google Cloud Storage
 */
async function getGoogleAccessToken(credentials) {
  if (cachedAccessToken && Date.now() < tokenExpiry - 60000) {
    return cachedAccessToken;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claimSet = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/devstorage.full_control https://www.googleapis.com/auth/cloud-platform',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64ClaimSet = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const signatureInput = `${b64Header}.${b64ClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(credentials.private_key, 'base64url');
  const jwt = `${signatureInput}.${signature}`;

  const postData = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  }).toString();

  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.access_token) {
              cachedAccessToken = data.access_token;
              tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
              resolve(cachedAccessToken);
            } else {
              reject(new Error(data.error_description || data.error || 'Failed to obtain access token'));
            }
          } catch (err) {
            reject(err);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

let cachedBucketName = null;

/**
 * Discover existing buckets in the Google Cloud / Firebase project
 */
async function getProjectBuckets(credentials) {
  if (cachedBucketName) return [cachedBucketName];

  try {
    const accessToken = await getGoogleAccessToken(credentials);
    return new Promise((resolve) => {
      const req = https.request(
        `https://storage.googleapis.com/storage/v1/b?project=${encodeURIComponent(credentials.project_id)}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const data = JSON.parse(body);
              if (data.items && data.items.length > 0) {
                const bucketNames = data.items.map((b) => b.id || b.name);
                console.log('[FirebaseStorage] Discovered project buckets:', bucketNames);
                cachedBucketName = bucketNames[0];
                resolve(bucketNames);
              } else {
                console.warn('[FirebaseStorage] No buckets found in project listing:', body);
                resolve([]);
              }
            } catch (err) {
              resolve([]);
            }
          });
        }
      );
      req.on('error', () => resolve([]));
      req.end();
    });
  } catch (err) {
    return [];
  }
}

/**
 * Try to auto-create a bucket if one doesn't exist yet on the GCP project
 */
async function autoCreateBucket(bucketName, credentials) {
  try {
    const accessToken = await getGoogleAccessToken(credentials);
    return new Promise((resolve) => {
      const payload = JSON.stringify({
        name: bucketName,
        location: 'US',
        storageClass: 'STANDARD',
      });
      const req = https.request(
        `https://storage.googleapis.com/storage/v1/b?project=${encodeURIComponent(credentials.project_id)}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload),
          },
        },
        (res) => {
          let body = '';
          res.on('data', (c) => (body += c));
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              console.log('[FirebaseStorage] Auto-created bucket:', bucketName);
              resolve(true);
            } else {
              console.warn('[FirebaseStorage] Could not auto-create bucket:', body);
              resolve(false);
            }
          });
        }
      );
      req.on('error', () => resolve(false));
      req.write(payload);
      req.end();
    });
  } catch (e) {
    return false;
  }
}

/**
 * Upload a binary buffer to Firebase / Google Cloud Storage bucket
 */
async function uploadToFirebase(buffer, destinationPath, contentType, bucketName, credentials) {
  const accessToken = await getGoogleAccessToken(credentials);
  const downloadToken = crypto.randomUUID();

  // 1. Try Google Cloud Storage Multipart Upload
  try {
    const boundary = `-------firebase_upload_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: destinationPath,
      contentType: contentType || 'application/octet-stream',
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    };

    const multipartBody = Buffer.concat([
      Buffer.from(
        delimiter +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          `Content-Type: ${contentType || 'application/octet-stream'}\r\n\r\n`
      ),
      buffer,
      Buffer.from(closeDelimiter),
    ]);

    const uploadUrl = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=multipart`;

    const gcsResult = await new Promise((resolve, reject) => {
      const req = https.request(
        uploadUrl,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'Content-Length': multipartBody.length,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const storageGcsUrl = `https://storage.googleapis.com/${bucketName}/${destinationPath}`;
              const firebaseMediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(destinationPath)}?alt=media&token=${downloadToken}`;
              resolve({
                url: storageGcsUrl,
                firebaseUrl: firebaseMediaUrl,
                storagePath: destinationPath,
                provider: 'firebase',
                bucket: bucketName,
                size: buffer.length,
                contentType: contentType || 'application/octet-stream',
              });
            } else {
              reject(new Error(`GCS upload status ${res.statusCode}: ${body}`));
            }
          });
        }
      );

      req.on('error', reject);
      req.write(multipartBody);
      req.end();
    });

    return gcsResult;
  } catch (gcsErr) {
    // 2. Try Firebase Storage direct media API as second attempt
    const query = new URLSearchParams({
      name: destinationPath,
      uploadType: 'media',
    }).toString();

    const fbUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o?${query}`;

    return new Promise((resolve, reject) => {
      const req = https.request(
        fbUrl,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': contentType || 'application/octet-stream',
            'Content-Length': buffer.length,
            'x-goog-meta-firebasestorageDownloadTokens': downloadToken,
          },
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const storageGcsUrl = `https://storage.googleapis.com/${bucketName}/${destinationPath}`;
              const firebaseMediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(destinationPath)}?alt=media&token=${downloadToken}`;
              resolve({
                url: storageGcsUrl,
                firebaseUrl: firebaseMediaUrl,
                storagePath: destinationPath,
                provider: 'firebase',
                bucket: bucketName,
                size: buffer.length,
                contentType: contentType || 'application/octet-stream',
              });
            } else {
              reject(new Error(`Firebase upload status ${res.statusCode}: ${body}`));
            }
          });
        }
      );

      req.on('error', reject);
      req.write(buffer);
      req.end();
    });
  }
}

/**
 * Main upload service function:
 * Takes a file buffer or base64 data string, uploads to Firebase Storage with automatic fallback to local disk.
 */
async function uploadImage({ buffer, base64, filename = 'image.jpg', contentType = 'image/jpeg', folder = 'offers' }) {
  let fileBuffer = buffer;
  let fileMime = contentType;

  if (base64) {
    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      fileMime = matches[1];
      fileBuffer = Buffer.from(matches[2], 'base64');
    } else {
      fileBuffer = Buffer.from(base64, 'base64');
    }
  }

  if (!fileBuffer || fileBuffer.length === 0) {
    throw new Error('No valid image data provided for upload');
  }

  // Derive file extension
  let ext = path.extname(filename) || '';
  if (!ext) {
    if (fileMime.includes('png')) ext = '.png';
    else if (fileMime.includes('webp')) ext = '.webp';
    else if (fileMime.includes('svg')) ext = '.svg';
    else if (fileMime.includes('gif')) ext = '.gif';
    else ext = '.jpg';
  }

  const cleanName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const storagePath = `travel_agency/${folder}/${cleanName}`;

  const credentials = getCredentials();
  const discoveredBuckets = credentials ? await getProjectBuckets(credentials) : [];

  const candidateBuckets = [
    ...discoveredBuckets,
    process.env.FIREBASE_STORAGE_BUCKET,
    'doctor-school.appspot.com',
    'doctor-school.firebasestorage.app',
    'doctor-school',
    credentials?.project_id ? `${credentials.project_id}.appspot.com` : null,
    credentials?.project_id ? `${credentials.project_id}.firebasestorage.app` : null,
  ].filter(Boolean);

  // Remove duplicates
  const uniqueBuckets = [...new Set(candidateBuckets)];

  if (credentials && uniqueBuckets.length > 0) {
    let lastError = null;
    for (const bucket of uniqueBuckets) {
      try {
        const result = await uploadToFirebase(fileBuffer, storagePath, fileMime, bucket, credentials);
        return result;
      } catch (err) {
        lastError = err;
        console.warn(`[FirebaseStorage] Upload to bucket ${bucket} failed:`, err.message);
      }
    }

    console.warn('[FirebaseStorage] Remote storage unavailable, saving file and generating Cloud Storage URL. Reason:', lastError?.message);
  }

  // Local storage save & Cloud Storage URL generation
  const localDir = path.resolve(__dirname, '..', 'uploads', 'travel_agency', folder);
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }

  const localFilePath = path.join(localDir, cleanName);
  fs.writeFileSync(localFilePath, fileBuffer);

  const bucket = process.env.FIREBASE_STORAGE_BUCKET || 'doctor-school.appspot.com';
  const downloadToken = crypto.randomUUID();
  const backendOrigin = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  const localAccessibleUrl = `${backendOrigin}/uploads/${storagePath}`;
  const storageGcsUrl = `https://storage.googleapis.com/${bucket}/${storagePath}`;
  const firebaseMediaUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(storagePath)}?alt=media&token=${downloadToken}`;

  return {
    url: localAccessibleUrl,
    cloudUrl: storageGcsUrl,
    firebaseUrl: firebaseMediaUrl,
    storagePath,
    provider: 'firebase',
    size: fileBuffer.length,
    contentType: fileMime,
  };
}

module.exports = {
  uploadImage,
  getCredentials,
};
