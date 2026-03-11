import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const bodySchema = z.object({
  purpose: z.enum(['WRITE', 'CHECK']),
  apiKey: z.string(),
  endpointUrl: z.string().url(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { endpointUrl, apiKey } = body;
  try {
    const res = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok || res.status === 401 || res.status === 403) {
      return NextResponse.json({
        success: true,
        message: 'Соединение успешно (эндпоинт доступен)',
      });
    }
    return NextResponse.json({
      success: false,
      message: `Эндпоинт вернул статус ${res.status}`,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Не удалось подключиться к эндпоинту';
    return NextResponse.json(
      { success: false, error: message },
      { status: 502 }
    );
  }
}
