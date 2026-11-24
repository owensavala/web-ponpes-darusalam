import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folderInput = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada file yang diunggah.' },
        { status: 400 }
      );
    }

    // Validasi Ukuran File
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `Ukuran file melebihi batas maksimal 5MB (${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        },
        { status: 400 }
      );
    }

    // Validasi MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: `Format file (${file.type}) tidak didukung. Harap unggah file gambar (JPG, PNG, WebP) atau PDF.`,
        },
        { status: 400 }
      );
    }

    // Sanitasi nama folder
    const validFolders = ['psb', 'posts', 'units', 'gallery', 'documents', 'general'];
    const folder = validFolders.includes(folderInput) ? folderInput : 'general';

    // Buat nama file unik dan aman
    const originalExt = path.extname(file.name).toLowerCase() || '.bin';
    const baseName = path
      .basename(file.name, originalExt)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-');
    const uniqueFileName = `${Date.now()}-${baseName.slice(0, 30)}${originalExt}`;

    // 1. Jika terhubung dengan Vercel Blob Storage (Production Cloud)
    if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`uploads/${folder}/${uniqueFileName}`, file, {
          access: 'public',
        });
        return NextResponse.json({
          success: true,
          message: 'File berhasil diunggah ke Vercel Blob Storage.',
          url: blob.url,
          fileName: file.name,
          size: file.size,
          mimeType: file.type,
        });
      } catch (blobErr) {
        console.error('Error saat upload ke Vercel Blob, mencoba fallback disk:', blobErr);
      }
    }

    // 2. Fallback penyimpanan disk lokal / VPS / Docker
    const baseDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'uploads');
    let targetFilePath = '';

    try {
      const uploadDir = path.join(/*turbopackIgnore: true*/ baseDir, folder);
      await fs.mkdir(uploadDir, { recursive: true });
      targetFilePath = path.join(uploadDir, uniqueFileName);
      const bytes = await file.arrayBuffer();
      await fs.writeFile(targetFilePath, Buffer.from(bytes));
    } catch (diskErr) {
      // 3. Fallback jika filesystem induk read-only (misal Vercel tanpa token)
      console.warn('Filesystem read-only, menggunakan direktori sementara /tmp:', diskErr);
      const tmpDir = path.join('/tmp', 'uploads', folder);
      await fs.mkdir(tmpDir, { recursive: true });
      targetFilePath = path.join(tmpDir, uniqueFileName);
      const bytes = await file.arrayBuffer();
      await fs.writeFile(targetFilePath, Buffer.from(bytes));
    }

    // Gunakan Route Handler /api/files/ agar selalu disajikan dinamis secara instan tanpa perlu restart server
    const publicUrl = `/api/files/${folder}/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      message: 'File berhasil diunggah.',
      url: publicUrl,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Error saat upload file:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server saat menyimpan file.' },
      { status: 500 }
    );
  }
}
