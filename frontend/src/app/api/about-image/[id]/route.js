import fs from 'fs';
import path from 'path';

const IMAGE_PATHS = {
  hero: 'C:/Users/shykh/.gemini/antigravity-ide/brain/d08246e0-f58a-4ee1-9007-8e8d6ca4b8d8/caribbean_luxury_resort_1791784710156.jpg',
  catamaran: 'C:/Users/shykh/.gemini/antigravity-ide/brain/d08246e0-f58a-4ee1-9007-8e8d6ca4b8d8/caribbean_catamaran_travel_1791784755512.jpg',
  colonial: 'C:/Users/shykh/.gemini/antigravity-ide/brain/d08246e0-f58a-4ee1-9007-8e8d6ca4b8d8/colonial_santo_domingo_1791784803992.jpg',
};

export async function GET(request, { params }) {
  const { id } = params;
  const sourcePath = IMAGE_PATHS[id];

  if (!sourcePath || !fs.existsSync(sourcePath)) {
    return new Response('Image Not Found', { status: 404 });
  }

  try {
    // Optionally mirror file to public/images/about for direct static serving
    const publicDir = path.join(process.cwd(), 'public', 'images', 'about');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const publicFile = path.join(publicDir, `${id}.jpg`);
    if (!fs.existsSync(publicFile)) {
      fs.copyFileSync(sourcePath, publicFile);
    }

    const imageBuffer = fs.readFileSync(sourcePath);
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('Error serving about image:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
