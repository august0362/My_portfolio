import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importPlugin from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const worlds = ['information', 'production', 'character', 'wanderlight', 'ethereal'];

export default defineConfig([
  globalIgnores(['data/**', 'node_modules/**', 'dist/**', 'coverage/**', '.cache/**', '.vite/**']),
  {
    files: ['**/*.{js,ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    plugins: { 'import-x': importPlugin },
    languageOptions: { globals: globals.browser },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ project: './tsconfig.json' }),
      ],
    },
    rules: {
      'import-x/no-unresolved': 'error',
      // Resolve aliases and relative paths before enforcing architecture boundaries.
      'import-x/no-restricted-paths': ['error', {
        basePath: fileURLToPath(new URL('.', import.meta.url)),
        zones: [
          { target: './src/shared', from: ['./src/core', './src/worlds'] },
          { target: './src/worlds', from: './src/core' },
          ...worlds.map((world) => ({
            target: `./src/worlds/${world}`,
            from: './src/worlds',
            except: [`./${world}`],
          })),
        ],
      }],
    },
  },
  {
    files: ['*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    // Node build scripts (CORE-03 image pipeline and its test).
    files: ['scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
  },
]);
