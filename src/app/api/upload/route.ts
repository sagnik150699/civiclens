
import { NextResponse } from 'next/server';
import { adminBucket } from '@/lib/firebase-admin';

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
    
    const bucket = adminBucket();
    const obj = bucket.file(path);
    
    await obj.save(bytes, {
      contentType: file.type,
      metadata: { cacheControl: 'public,max-age=31536000,immutable' },
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
