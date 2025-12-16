/// <reference path="../.env" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ORIGIN_TRIAL_TOKEN: string;

    readonly VITE_API_URL: string;
}

interface ImportMeta {
    env: ImportMetaEnv
}
