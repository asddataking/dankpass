import { redirect } from 'next/navigation';
import { APP_ROUTES } from '@/lib/app-config';

export default function StackAuthPage() {
  redirect(APP_ROUTES.SIGNIN);
}
