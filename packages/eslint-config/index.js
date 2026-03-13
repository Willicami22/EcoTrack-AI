/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  rules: {
    // No usar any explícito (usar @ts-expect-error con comentario si es inevitable)
    '@typescript-eslint/no-explicit-any': 'error',
    // Siempre manejar promesas
    '@typescript-eslint/no-floating-promises': 'error',
    // No usar console en producción (usar Logger de NestJS en backend)
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Preferir interfaces para formas de objetos
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    // Importaciones de tipos explícitas
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
  },
}
