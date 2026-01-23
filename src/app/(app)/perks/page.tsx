import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function PerksPage() {
  redirect(APP_ROUTES.PERKS);
}
