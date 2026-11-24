import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { createReadStream, existsSync } from 'fs';
import { Readable } from 'stream';

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
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

function getStorageBaseDir(): string {
  // Dukung direktori khusus jika di-deploy ke Docker/VPS dengan volume terpisah
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

    // Cegah path traversal secara ketat (normalize + prefix check)
    const safeSegments = pathSegments.map((s) => path.basename(s));
    const baseDir = getStorageBaseDir();
    const filePath = path.normalize(path.join(/*turbopackIgnore: true*/ baseDir, ...safeSegments));

    // Pastikan path tetap berada di dalam direktori uploads
    const resolvedPath = path.resolve(/*turbopackIgnore: true*/ filePath);
    const resolvedBase = path.resolve(/*turbopackIgnore: true*/ baseDir);
    if (!resolvedPath.startsWith(resolvedBase)) {
      return new NextResponse('Access Denied', { status: 403 });
    }

    // Periksa keberadaan file (coba direktori utama, lalu coba /tmp/uploads)
    let finalPath = resolvedPath;
    let found = false;
    let stats;

    try {
      stats = await fs.stat(resolvedPath);
      if (stats.isFile()) found = true;
    } catch {
      // Coba fallback di /tmp/uploads jika lingkungan serverless
      try {
        const tmpPath = path.normalize(path.join('/tmp', 'uploads', ...safeSegments));
        const tmpStats = await fs.stat(tmpPath);
        if (tmpStats.isFile()) {
          finalPath = tmpPath;
          stats = tmpStats;
          found = true;
        }
      } catch {
        found = false;
      }
    }

    if (!found || !stats) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const ext = path.extname(finalPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = await fs.readFile(finalPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'Accept-Ranges': 'bytes',
      },
    });
  } catch (error) {
    console.error('Error serving file in /api/files:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function HEAD(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const safeSegments = pathSegments.map((s) => path.basename(s));
    const baseDir = getStorageBaseDir();
    const filePath = path.join(/*turbopackIgnore: true*/ baseDir, ...safeSegments);

    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      return new NextResponse(null, { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stats.size.toString(),
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
