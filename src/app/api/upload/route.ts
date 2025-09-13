
import { NextResponse } from 'next/server';
import { getAdminApp } from '@/lib/firebase-admin';
import { getStorage } from 'firebase-admin/storage';

export const dynamic = 'force-dynamic';

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
    
    // Explicitly specify the correct bucket name.
    const bucket = getStorage(getAdminApp()).bucket('civiclens-bexm4.firebasestorage.app');
    const obj = bucket.file(path);
    
    await obj.save(bytes, {
      contentType: file.type,
      metadata: { cacheControl: 'public,max-age=31536000,immutable' },
    });
    
    // Although the file is public, using getSignedUrl is the most robust way
    // to get a stable, accessible URL. We set an expiration date far in the future.
    const [url] = await obj.getSignedUrl({
      action: 'read',
      expires: '01-01-2100',
    });

    return NextResponse.json({ ok: true, url }, { status: 200 });
  } catch (e: any) {
    console.error('[api/upload] error:', e);
    return NextResponse.json({ error: e?.response?.data?.error || e?.message || 'Server failed to upload file.' }, { status: 500 });
  }
}
