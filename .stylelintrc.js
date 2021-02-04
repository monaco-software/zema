module.exports = {
  "extends": ["@vkontakte/stylelint-config"],
  "rules": {
    "plugin/selector-bem-pattern": {
      'componentName': '^[A-Z][a-zA-Z0-9]+$',
      'componentSelectors': '^(?:\.{componentName}(?:__[a-z][a-zA-Z0-9]*)?(?:--[a-z0-9][a-zA-Z0-9]*(?:-[a-z0-9][a-zA-Z0-9]*)?)?)*$',
      'implicitComponents': true,
      'ignoreCustomProperties': /.*/,
    },
  },
}
