/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Cloud Maps Embed API key (optional; public embed uses coordinate fallback without it). */
  readonly VITE_GOOGLE_MAPS_EMBED_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
