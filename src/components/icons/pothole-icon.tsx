import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PotholeIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('lucide lucide-circle-dashed', className)}
    >
        <path d="M10.1 2.182a10 10 0 0 1 3.8 0" />
        <path d="M16.466 4.154a10 10 0 0 1 3.38 2.228" />
        <path d="M21.65 10.383a10 10 0 0 1 0 3.234" />
        <path d="M19.848 17.625a10 10 0 0 1-2.228 3.38" />
        <path d="M13.9 21.818a10 10 0 0 1-3.8 0" />
        <path d="M7.534 19.846a10 10 0 0 1-3.38-2.228" />
        <path d="M2.35 13.617a10 10 0 0 1 0-3.234" />
        <path d="M4.152 6.375a10 10 0 0 1 2.228-3.38" />
        <path d="M12 8l-1.45 3.5L7 12l3.5 1.45L12 17l1.45-3.5L17 12l-3.5-1.45z" />
    </svg>
  );
}
