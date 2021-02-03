module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": ["@vkontakte/eslint-config/typescript/react"],
  "parserOptions": {
    "project": "./tsconfig.json",
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "restParams": true,
      "spread": true
    }
  },
  "env": {
    "browser": true,
    "node": true
  },
  "globals": {
    "Promise": true,
    "Set": true,
    "Map": true
  },
  "rules": {
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/no-magic-numbers": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/typedef": "off",
    "@typescript-eslint/no-unnecessary-type-arguments": "off",

    // Delete then @vkontakte/eslint-config update @typescript-eslint/eslint-plugin and @typescript-eslint/parser deps
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/class-name-casing": "off"
  }
}