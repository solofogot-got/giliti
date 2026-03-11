'use client';

import { useState } from 'react';

type Purpose = 'WRITE' | 'CHECK';

type Props = {
  purpose: Purpose;
  initialApiKey: string;
  initialEndpointUrl: string;
};

export function AiProviderForm({
  purpose,
  initialApiKey,
  initialEndpointUrl,
}: Props) {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [endpointUrl, setEndpointUrl] = useState(initialEndpointUrl);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function handleSave() {
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/ai-providers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, apiKey, endpointUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: 'err', text: data.error ?? 'Ошибка сохранения' });
        return;
      }
      setMessage({ type: 'ok', text: 'Сохранено' });
    } finally {
      setSaving(false);
    }
  }

  async function handleTest() {
    setMessage(null);
    setTesting(true);
    try {
      const res = await fetch('/api/admin/ai-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose, apiKey, endpointUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          type: 'err',
          text: data.error ?? 'Ошибка проверки соединения',
        });
        return;
      }
      setMessage({
        type: 'ok',
        text: data.success === true ? 'Соединение успешно' : (data.message ?? 'Проверка выполнена'),
      });
    } catch (e) {
      setMessage({ type: 'err', text: 'Сетевая ошибка' });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm text-slate-600">API ключ</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Введите API ключ"
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-slate-600">URL точки соединения</label>
        <input
          type="url"
          value={endpointUrl}
          onChange={(e) => setEndpointUrl(e.target.value)}
          placeholder="https://api.example.com/v1/..."
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      {message && (
        <p
          className={`text-sm ${
            message.type === 'ok' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Сохранение…' : 'Сохранить'}
        </button>
        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          {testing ? 'Проверка…' : 'Проверить соединение'}
        </button>
      </div>
    </div>
  );
}
