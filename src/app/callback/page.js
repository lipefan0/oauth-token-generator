"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    // Redireciona para a página principal com os parâmetros
    router.push(`/?code=${code}&state=${state}`);
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Autorizando...</h1>
        <p>Por favor, aguarde enquanto processamos sua autorização.</p>
      </div>
    </div>
  );
}