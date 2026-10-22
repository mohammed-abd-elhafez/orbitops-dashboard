import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'test-results', 'playwright-report'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'error',
    },
  },
  // Node script that also evaluates snippets in the browser; console output is its purpose.
  { files: ['scripts/**'], languageOptions: { globals: { ...globals.node, ...globals.browser } }, rules: { 'no-console': 'off' } },
  { files: ['e2e/**', 'vite.config.ts', 'playwright.config.ts'], languageOptions: { globals: { ...globals.node } } },
)
