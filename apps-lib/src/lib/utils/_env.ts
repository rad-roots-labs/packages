const KEYVAL_NAME = import.meta.env.VITE_PUBLIC_KEYVAL_NAME;
if (!KEYVAL_NAME || typeof KEYVAL_NAME !== 'string') throw new Error('Missing env var: VITE_PUBLIC_KEYVAL_NAME');

const NDK_CACHE = import.meta.env.VITE_PUBLIC_NDK_CACHE;
if (!NDK_CACHE || typeof NDK_CACHE !== 'string') throw new Error('Missing env var: VITE_PUBLIC_NDK_CACHE');

const NDK_CLIENT = import.meta.env.VITE_PUBLIC_NDK_CLIENT;
if (!NDK_CLIENT || typeof NDK_CLIENT !== 'string') throw new Error('Missing env var: VITE_PUBLIC_NDK_CLIENT');

const RADROOTS_RELAY = import.meta.env.VITE_PUBLIC_RADROOTS_RELAY;
if (!RADROOTS_RELAY || typeof RADROOTS_RELAY !== 'string') throw new Error('Missing env var: VITE_PUBLIC_RADROOTS_RELAY');

const PROD = import.meta.env.MODE === 'production';

export const _envLib = {
  PROD,
  KEYVAL_NAME,
  NDK_CACHE,
  NDK_CLIENT,
  RADROOTS_RELAY,
} as const;
