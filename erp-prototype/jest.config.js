module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "backend/app.js",
    "backend/routes.js"
  ],
  coverageReporters: ["text", "lcov", "text-summary"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 85,
      functions: 100,
      lines: 100
    }
  },
  maxWorkers: 1,
  verbose: false
};
