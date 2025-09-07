'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/firebase-client';
import { ref, uploadBytesResumable, getDownloadURL, type UploadTask } from 'firebase/storage';

export type UploadStatus = 'idle' | 'running' | 'paused' | 'done' | 'error';

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [url, setUrl] = useState('');
  const [lastError, setLastError] = useState<string>('');
  const taskRef = useRef<UploadTask | null>(null);

  // Cleanup: do NOT auto-cancel; just detach listeners
  useEffect(() => {
    return () => {
      // no task.cancel() here — prevents spurious storage/canceled
      taskRef.current = null;
    };
  }, []);

  const start = useCallback(async (file: File) => {
    setLastError(''); setUrl(''); setProgress(0);
    if (!file?.type?.startsWith('image/')) throw new Error('Only images allowed');
    if (file.size > 10 * 1024 * 1024) throw new Error('Max 10MB');

    const path = `issues/${crypto.randomUUID()}_${file.name}`;
    const r = ref(storage, path);

    const task = uploadBytesResumable(r, file, {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000,immutable',
    });

    taskRef.current = task;
    setStatus('running');

    task.on('state_changed',
      (snap) => {
        setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        setStatus(snap.state === 'paused' ? 'paused' : 'running');
      },
      (err: any) => {
        setStatus('error');
        setLastError(`${err?.code || 'storage/unknown'}: ${err?.message || 'Upload failed'}`);
      },
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        setUrl(downloadURL);
        setStatus('done');
      }
    );
  }, []);

  const pause = useCallback(() => {
    taskRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    taskRef.current?.resume();
  }, []);

  const cancel = useCallback(() => {
    taskRef.current?.cancel(); // only on explicit user action
  }, []);

  return { start, pause, resume, cancel, progress, status, url, lastError };
}
