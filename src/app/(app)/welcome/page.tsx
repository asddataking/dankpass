import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function WelcomePage() {
  redirect(APP_ROUTES.DASHBOARD);
}
