module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "backend/app.js",
    "backend/routes.js"
  ],
  coverageReporters: ["text", "lcov"],
  maxWorkers: 1,
  verbose: false
};
