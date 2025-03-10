export default {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended'
    ],
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y', 'prettier'],
    env: {
        node: true, // Add this line to define the Node.js environment
        browser: true, // Add this line to define the browser environment
        es2021: true // Add this line to define the ES2021 environment
    },
    globals: {
        module: 'writable',
        require: 'writable'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-empty-interface': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
                'react/prop-types': 'off'
            }
        },
        {
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-empty-interface': 'off'
            }
        }
    ]
};