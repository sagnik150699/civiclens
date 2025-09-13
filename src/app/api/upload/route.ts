
import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Ensure Node.js runtime, as Admin SDK is not compatible with Edge.

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed.' }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size cannot exceed 10MB.' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const path = `issues/${crypto.randomUUID()}_${file.name}`;
    
    // Get storage from the correctly initialized admin app
    const storage = getStorage(getAdminApp());
    // Call bucket() without arguments to use the default bucket specified in initializeApp
    const bucket = storage.bucket();
    const obj = bucket.file(path);
    
    await obj.save(bytes, {
      contentType: file.type,
      metadata: { cacheControl: 'public,max-age=31536000,immutable' },
      resumable: false, // Recommended for small files to avoid multi-part upload complexities
    });
    
    // Get a long-lived signed URL to access the file
    const [url] = await obj.getSignedUrl({
      action: 'read',
      expires: '01-01-2100', // Far-future expiration date
    });

    return NextResponse.json({ ok: true, url }, { status: 200 });
  } catch (e: any) {
    console.error('[api/upload] error:', e);
    const errorMessage = e.response?.data?.error?.message || e.message || 'Server failed to upload file.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
