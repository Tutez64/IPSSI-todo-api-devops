module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 60,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
