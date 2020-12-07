// jest.config.js
module.exports = {
  verbose: true,
  preset: "@testing-library/react-native",
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svg-mock.ts",
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/build/",
    "<rootDir>/node_modules/",
    "<rootDir>/src/test/",
  ],
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|@react-native-async-storage|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|async-storage|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)",
  ],
};
