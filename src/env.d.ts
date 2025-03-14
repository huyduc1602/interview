/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GOOGLE_SHEET_API_KEY: string
    readonly VITE_SPREADSHEET_ID: string
    readonly VITE_OPENCHAT_API_KEY: string
    readonly VITE_GITHUB_CLIENT_ID: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_SUPABASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}