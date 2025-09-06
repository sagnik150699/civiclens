'use client';
import { useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/firebase-client';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle'|'running'|'done'|'error'>('idle');
  const [url, setUrl] = useState('');
  const [lastError, setLastError] = useState<string>('');
  const taskRef = useRef<ReturnType<typeof uploadBytesResumable> | null>(null);
  const lastBytes = useRef(0);
  const watchdog = useRef<number | null>(null);

  useEffect(() => () => {
    taskRef.current?.cancel();
    if (watchdog.current) clearInterval(watchdog.current);
  }, []);

  async function start(file: File) {
    if (!file.type.startsWith('image/')) throw new Error('Only images allowed');
    if (file.size > 10 * 1024 * 1024) throw new Error('Max 10MB');

    const path = `uploads/${crypto.randomUUID()}_${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000,immutable',
    });
    taskRef.current = task; setProgress(0); setUrl(''); setStatus('running'); setLastError('');

    // Watchdog: cancel if bytes don’t change for 15s (avoids infinite spinner)
    watchdog.current = window.setInterval(() => {
      const b = task.snapshot.bytesTransferred;
      if (b === lastBytes.current && task.snapshot.state === 'running') {
        console.warn('Upload stuck; canceling'); task.cancel();
      }
      lastBytes.current = b;
    }, 15000) as unknown as number;

    task.on('state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setProgress(pct);
      },
      (err: any) => {
        if (watchdog.current) clearInterval(watchdog.current);
        const msg = `${err?.code || 'storage/unknown'}: ${err?.message || 'Upload failed'}`;
        console.error('Storage error:', msg);
        setLastError(msg);
        setStatus('error');
      },
      async () => {
        if (watchdog.current) clearInterval(watchdog.current);
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        setUrl(downloadURL); setStatus('done');
      }
    );
  }

  return { start, progress, status, url, lastError };
}
