import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Redirecionar para a página principal com os parâmetros
  return NextResponse.redirect(new URL(`/?code=${code}&state=${state}`, request.url));
}