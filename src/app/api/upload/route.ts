'use server';

import { NextResponse } from 'next/server';
import { getStorage } from 'firebase-admin/storage';
import { getAdminApp } from '@/lib/firebase-admin';

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

    const bytes = Buffer.from(await file.arrayBuffer());
    const path = `issues/${crypto.randomUUID()}_${file.name}`;
    const bucket = getStorage(getAdminApp()).bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const obj = bucket.file(path);

    await obj.save(bytes, {
      contentType: file.type,
      metadata: { cacheControl: 'public,max-age=31536000,immutable' },
      public: true,
    });

    const url = obj.publicUrl();
    
    return NextResponse.json({ ok: true, url }, { status: 200 });
  } catch (e: any) {
    console.error('[api/upload] error:', e);
    return NextResponse.json({ error: e?.message || 'Upload failed.' }, { status: 500 });
  }
}
