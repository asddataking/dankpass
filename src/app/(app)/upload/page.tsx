import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function UploadPage() {
  redirect(APP_ROUTES.UPLOAD);
}
