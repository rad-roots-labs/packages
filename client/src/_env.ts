import dotenv from "dotenv";
dotenv.config();

const RADROOTS_API = process.env.VITE_PUBLIC_RADROOTS_API;
if (!RADROOTS_API || typeof RADROOTS_API !== 'string') throw new Error('Missing env var: VITE_PUBLIC_RADROOTS_API');

const PROD = process.env.NODE_ENV === 'production';

export const _envLib = {
  PROD,
  RADROOTS_API,
} as const;
