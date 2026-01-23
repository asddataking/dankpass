import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function ProfilePage() {
  redirect(APP_ROUTES.PROFILE);
}
