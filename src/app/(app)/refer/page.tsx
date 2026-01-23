import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function ReferPage() {
  redirect(APP_ROUTES.DASHBOARD);
}
