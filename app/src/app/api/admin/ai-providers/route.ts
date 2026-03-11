import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AiProviderPurpose } from '@prisma/client';
import { z } from 'zod';

const bodySchema = z.object({
  purpose: z.enum(['WRITE', 'CHECK']),
  apiKey: z.string(),
  endpointUrl: z.string().url(),
});

export async function PATCH(req: Request) {
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

  const purpose = body.purpose as AiProviderPurpose;
  await prisma.aiProvider.upsert({
    where: { purpose },
    update: { apiKey: body.apiKey, endpointUrl: body.endpointUrl },
    create: {
      purpose,
      apiKey: body.apiKey,
      endpointUrl: body.endpointUrl,
    },
  });

  return NextResponse.json({ ok: true });
}
