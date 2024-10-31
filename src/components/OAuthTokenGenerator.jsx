"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const OAuthTokenGenerator = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const AUTH_URL = "https://www.bling.com.br/Api/v3/oauth/authorize";
  const REDIRECT_URI = `${API_URL}/callback`;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const savedState = localStorage.getItem('oauth_state');
    const savedClientId = localStorage.getItem('temp_client_id');
    const savedClientSecret = localStorage.getItem('temp_client_secret');

    if (code && state && savedState === state && savedClientId && savedClientSecret) {
      setClientId(savedClientId);
      setClientSecret(savedClientSecret);
      getToken(code, savedClientId, savedClientSecret);
    }
  }, []);

  const generateRandomState = () => {
    const array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => dec.toString(16).padStart(2, '0')).join('');
  };

  const startOAuthFlow = () => {
    if (!clientId || !clientSecret) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError(null);
    
    const state = generateRandomState();
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      state: state
    });

    localStorage.setItem('oauth_state', state);
    localStorage.setItem('temp_client_id', clientId);
    localStorage.setItem('temp_client_secret', clientSecret);

    window.location.href = `${AUTH_URL}?${params.toString()}`;
  };

  const getToken = async (code, savedClientId, savedClientSecret) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/exchange-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          clientId: savedClientId || clientId,
          clientSecret: savedClientSecret || clientSecret
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || data.error || 'Erro ao obter o token');
      }

      setToken(data);

      // Limpar dados temporários
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('temp_client_id');
      localStorage.removeItem('temp_client_secret');

      // Limpar a URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setError(typeof err === 'string' ? err : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Token OAuth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client ID</label>
              <Input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value.trim())}
                placeholder="Digite seu Client ID"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Client Secret</label>
              <Input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value.trim())}
                placeholder="Digite seu Client Secret"
              />
            </div>

            <Button 
              onClick={startOAuthFlow} 
              disabled={loading || !clientId || !clientSecret}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando Token...
                </>
              ) : (
                'Gerar Token'
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  <div className="whitespace-pre-wrap">{error}</div>
                </AlertDescription>
              </Alert>
            )}

            {token && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Token Gerado:</h3>
                <div className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {JSON.stringify(token, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthTokenGenerator;