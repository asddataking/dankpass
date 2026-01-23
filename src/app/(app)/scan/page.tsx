import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function ScanPage() {
  redirect(APP_ROUTES.UPLOAD);
}
