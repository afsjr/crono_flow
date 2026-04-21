import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'import': importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'import/no-cycle': 'error',
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/components/**',
              from: ['./src/test/**'],
              message: 'Components cannot import from test files',
            },
            {
              target: './src/services/**',
              from: ['./src/components/**'],
              message: 'Services cannot import from components',
            },
            {
              target: './src/utils/**',
              from: ['./src/components/**', './src/services/**'],
              message: 'Utils cannot import from components or services',
            },
          ],
        },
      ],
      'import/no-unresolved': 'error',
      'import/named': 'error',
    },
  },
])