import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">Giliti</h1>
      <nav className="mt-4 flex gap-4">
        <Link href="/login" className="text-blue-600 underline">
          Вход
        </Link>
        <Link href="/admin" className="text-blue-600 underline">
          Админка
        </Link>
      </nav>
    </main>
  );
}
