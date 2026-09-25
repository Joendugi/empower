/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_DEPLOYMENT_MODE?: 'offline' | 'campus' | 'cloud';
  readonly VITE_MEDIA_CDN_URL?: string;
  readonly VITE_ADMIN_STAFF_HASH?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
