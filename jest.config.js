// 
process.env.DATABASE_URL = 'file:./test.db';

export default {
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverage: true,
  transform: {},
  extensionsToTreatAsEsm: [],
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
