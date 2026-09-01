// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    // Ngăn các service import code trực tiếp từ nhau (chỉ giao tiếp qua HTTP).
    files: ['apps/user-service/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['apps/authentication-service/*', 'apps/authorization-service/*', 'apps/department-service/*', 'apps/employee-service/*', 'apps/gateway-service/*'], message: 'user-service must not import from other services; communicate via HTTP.' },
        ],
      }],
    },
  },
  {
    files: ['apps/authentication-service/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['apps/user-service/*', 'apps/authorization-service/*', 'apps/department-service/*', 'apps/employee-service/*', 'apps/gateway-service/*'], message: 'authentication-service must not import from other services; communicate via HTTP.' },
        ],
      }],
    },
  },
  {
    files: ['apps/authorization-service/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['apps/user-service/*', 'apps/authentication-service/*', 'apps/department-service/*', 'apps/employee-service/*', 'apps/gateway-service/*'], message: 'authorization-service must not import from other services; communicate via HTTP.' },
        ],
      }],
    },
  },
  {
    files: ['apps/department-service/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['apps/user-service/*', 'apps/authentication-service/*', 'apps/authorization-service/*', 'apps/employee-service/*', 'apps/gateway-service/*'], message: 'department-service must not import from other services; communicate via HTTP.' },
        ],
      }],
    },
  },
  {
    files: ['apps/employee-service/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['apps/user-service/*', 'apps/authentication-service/*', 'apps/authorization-service/*', 'apps/department-service/*', 'apps/gateway-service/*'], message: 'employee-service must not import from other services; communicate via HTTP.' },
        ],
      }],
    },
  },
  {
    files: ['apps/gateway-service/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [
          { group: ['apps/user-service/*', 'apps/authentication-service/*', 'apps/authorization-service/*', 'apps/department-service/*', 'apps/employee-service/*'], message: 'gateway-service must not import from other services; communicate via HTTP.' },
        ],
      }],
    },
  },
  {
    files: ['**/*e2e-spec.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
);
