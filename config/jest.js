module.exports = {
  automock: false,
  rootDir: '../',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  transform: { '^.*\\.js$': '<rootDir>/config/jest-transform-flow' }
}
