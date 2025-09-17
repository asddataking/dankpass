import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateQRCode(data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(data, {
        width: 200,
        margin: 2,
        color: {
          dark: '#ff0080',
          light: '#000000',
        },
      }, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });
  });
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function generatePassportId(): string {
  return `DP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
