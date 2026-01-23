import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function PremiumPage() {
  redirect(APP_ROUTES.PREMIUM);
}
