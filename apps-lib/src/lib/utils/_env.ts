const KEYVAL_NAME = import.meta.env.VITE_PUBLIC_KEYVAL_NAME;
if (!KEYVAL_NAME || typeof KEYVAL_NAME !== 'string') throw new Error('Missing env var: VITE_PUBLIC_KEYVAL_NAME');

const NOSTR_CLIENT = import.meta.env.VITE_PUBLIC_NOSTR_CLIENT;
if (!NOSTR_CLIENT || typeof NOSTR_CLIENT !== 'string') throw new Error('Missing env var: VITE_PUBLIC_NOSTR_CLIENT');

const RADROOTS_RELAY = import.meta.env.VITE_PUBLIC_RADROOTS_RELAY;
if (!RADROOTS_RELAY || typeof RADROOTS_RELAY !== 'string') throw new Error('Missing env var: VITE_PUBLIC_RADROOTS_RELAY');

const PROD = import.meta.env.MODE === 'production';

export const _env_lib = {
  PROD,
  KEYVAL_NAME,
  NOSTR_CLIENT,
  RADROOTS_RELAY,
} as const;
