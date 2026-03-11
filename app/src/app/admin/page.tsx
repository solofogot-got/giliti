import Link from 'next/link';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Панель администратора</h1>
      <ul className="mt-4 list-inside list-disc space-y-1 text-slate-700">
        <li>
          <Link href="/admin/ai-providers" className="text-blue-600 underline">
            AI провайдеры
          </Link>
          — настройка провайдеров для написания и проверки статей
        </li>
      </ul>
    </div>
  );
}
