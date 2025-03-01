/// <reference types="vite/client" />

// Import dummy fixes for TypeScript errors
import './lib/dummy-fixes';

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_INSTAGRAM_ACCESS_TOKEN: string
  readonly VITE_WEB3FORMS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
