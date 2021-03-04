const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: `<rootDir>/${compilerOptions.baseUrl}`,
  }),
  transform: {
    '\\.css$': 'jest-raw-loader',
    '\\.png$': 'jest-raw-loader',
    '\\.jpg$': 'jest-raw-loader',
    '\\.jpeg$': 'jest-raw-loader',
    '\\.svg$': 'jest-raw-loader',
  }
};
