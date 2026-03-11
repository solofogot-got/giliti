import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin');
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex gap-4">
            <Link href="/admin" className="font-medium text-slate-800">
              Админка
            </Link>
            <Link
              href="/admin/ai-providers"
              className="text-slate-600 hover:text-slate-900"
            >
              AI провайдеры
            </Link>
          </div>
          <span className="text-sm text-slate-500">{session.user?.email}</span>
        </nav>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
