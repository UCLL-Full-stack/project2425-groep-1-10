module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@services/(.*)$': '<rootDir>/src/services/$1',
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFiles: ['<rootDir>/jest.setup.js']
  };