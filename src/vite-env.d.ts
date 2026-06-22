/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_MTSTUDIO_ENDPOINT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
