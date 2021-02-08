/**
 * @param {String} block
 * @param {Object} [presetOptions]
 * @param {String} [presetOptions.namespace]
 * @returns {RegExp}
 */
function bemSelector(block, presetOptions) {
  const ns =
    presetOptions && presetOptions.namespace
      ? `${presetOptions.namespace}-`
      : '';
  const WORD = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';
  const element = `(?:__${WORD})?`;
  const modifier = `(?:(?:_|--)${WORD}){0,2}`;
  const attribute = '(?:\\[.+\\])?';
  return new RegExp(`^\\.${ns}${block}${element}${modifier}${attribute}$`);
}

module.exports = {
  "extends": ["@vkontakte/stylelint-config"],
  "rules": {
    "plugin/selector-bem-pattern": {
      "preset": "bem",
      "componentSelectors": bemSelector,
      'implicitComponents': true,
    },
  },
}
