"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (typeof window !== 'undefined') {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    router.push(`/?code=${code}&state=${state}`);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h1 className="text-xl font-semibold mb-2">Autorizando...</h1>
        <p>Por favor, aguarde enquanto processamos sua autorização.</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Carregando...</p>
          </div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}