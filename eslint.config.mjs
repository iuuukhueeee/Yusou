import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:react-hooks/recommended'),
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
]

export default eslintConfig
