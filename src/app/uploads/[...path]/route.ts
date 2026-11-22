import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    
    // Cegah path traversal
    const safeSegments = pathSegments.map((s) => path.basename(s));
    const filePath = path.join(process.cwd(), 'public', 'uploads', ...safeSegments);

    // Periksa apakah file ada
    try {
      const stats = await fs.stat(filePath);
      if (!stats.isFile()) {
        return new NextResponse('File Not Found', { status: 404 });
      }
    } catch {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
