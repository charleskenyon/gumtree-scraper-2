module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '/opt/(.*)$': '<rootDir>/src/opt/$1'
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src/query-scraper-lambda/node_modules'
  ]
}
