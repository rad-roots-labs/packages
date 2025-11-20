const KEYVAL_NAME = import.meta.env.VITE_PUBLIC_KEYVAL_NAME;
if (!KEYVAL_NAME || typeof KEYVAL_NAME !== 'string') throw new Error('Missing env var: VITE_PUBLIC_KEYVAL_NAME');

const NDK_CACHE_NAME = import.meta.env.VITE_PUBLIC_NDK_CACHE_NAME;
if (!NDK_CACHE_NAME || typeof NDK_CACHE_NAME !== 'string') throw new Error('Missing env var: VITE_PUBLIC_NDK_CACHE_NAME');

const NDK_CLIENT_NAME = import.meta.env.VITE_PUBLIC_NDK_CLIENT_NAME;
if (!NDK_CLIENT_NAME || typeof NDK_CLIENT_NAME !== 'string') throw new Error('Missing env var: VITE_PUBLIC_NDK_CLIENT_NAME');

const RADROOTS_RELAY = import.meta.env.VITE_PUBLIC_RADROOTS_RELAY;
if (!RADROOTS_RELAY || typeof RADROOTS_RELAY !== 'string') throw new Error('Missing env var: VITE_PUBLIC_RADROOTS_RELAY');

const PROD = import.meta.env.MODE === 'production';

export const _envLib = {
  PROD,
  KEYVAL_NAME,
  NDK_CACHE_NAME,
  NDK_CLIENT_NAME,
  RADROOTS_RELAY,
} as const;
