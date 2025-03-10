overrides: [
    {
        files: ['*.ts', '*.tsx'],
        // TypeScript rules
    },
    {
        files: ['*.d.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-interface': 'off'
        }
    }
]