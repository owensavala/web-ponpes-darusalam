import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.zip': 'application/zip',
};

function getStorageBaseDir(): string {
  if (process.env.UPLOADS_DIR && existsSync(process.env.UPLOADS_DIR)) {
    return process.env.UPLOADS_DIR;
  }
  return path.join(process.cwd(), 'public', 'uploads');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    // Cegah path traversal
    const safeSegments = pathSegments.map((s) => path.basename(s));
    const baseDir = getStorageBaseDir();
    const filePath = path.join(/*turbopackIgnore: true*/ baseDir, ...safeSegments);

    const resolvedPath = path.resolve(/*turbopackIgnore: true*/ filePath);
    const resolvedBase = path.resolve(/*turbopackIgnore: true*/ baseDir);
    if (!resolvedPath.startsWith(resolvedBase)) {
      return new NextResponse('Access Denied', { status: 403 });
    }

    // Periksa apakah file ada
    try {
      const stats = await fs.stat(resolvedPath);
      if (!stats.isFile()) {
        return new NextResponse('File Not Found', { status: 404 });
      }

      const fileBuffer = await fs.readFile(resolvedPath);
      const ext = path.extname(resolvedPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          'Accept-Ranges': 'bytes',
        },
      });
    } catch {
      return new NextResponse('File Not Found', { status: 404 });
    }
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
