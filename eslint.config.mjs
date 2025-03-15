import { createConfigForNuxt } from '@nuxt/eslint-config/flat';

export default createConfigForNuxt({
  features: {
    stylistic: true,
  },
  rules: {
    'vue/multi-word-component-names': 'off',
    'nuxt/nuxt-config-keys-order': 'off',
    'nuxt/prefer-import-meta': 'none',
  },
})
