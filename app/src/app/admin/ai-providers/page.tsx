import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AiProviderForm } from './AiProviderForm';
import { AiProviderPurpose } from '@prisma/client';

export default async function AiProvidersPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin/ai-providers');
  }

  const providers = await prisma.aiProvider.findMany({
    orderBy: { purpose: 'asc' },
  });

  const writeProvider = providers.find((p) => p.purpose === AiProviderPurpose.WRITE);
  const checkProvider = providers.find((p) => p.purpose === AiProviderPurpose.CHECK);

  return (
    <div>
      <h1 className="text-xl font-semibold">AI провайдеры</h1>
      <p className="mt-1 text-sm text-slate-600">
        Настройка провайдеров для написания и проверки статей. Укажите API ключ и URL точки соединения, сохраните и проверьте соединение.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-medium text-slate-800">
            Провайдер для написания статей
          </h2>
          <AiProviderForm
            purpose="WRITE"
            initialApiKey={writeProvider?.apiKey ?? ''}
            initialEndpointUrl={writeProvider?.endpointUrl ?? ''}
          />
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-medium text-slate-800">
            Провайдер для проверки статей
          </h2>
          <AiProviderForm
            purpose="CHECK"
            initialApiKey={checkProvider?.apiKey ?? ''}
            initialEndpointUrl={checkProvider?.endpointUrl ?? ''}
          />
        </section>
      </div>
    </div>
  );
}
