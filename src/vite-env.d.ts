/// <reference types="vite/client" />

// Import dummy fixes for TypeScript errors - these are needed for Vercel builds
import { dummyImports, validHosts, planId } from './lib/dummy-fixes';

// Use the imports to prevent TypeScript from removing them
const _dummy = { ...dummyImports, validHosts, planId };

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_INSTAGRAM_ACCESS_TOKEN: string
  readonly VITE_WEB3FORMS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
