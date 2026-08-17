/** @type {import('jest').Config} */
module.exports = {
  // No 'preset' — the react-native preset pulls in its own TS setup.js
  // that our Babel version can't parse. We configure everything manually.
  testEnvironment: 'node',
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { configFile: './babel.config.test.js' }],
  },
  // Don't transform anything in node_modules
  transformIgnorePatterns: ['node_modules/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^react-native-maps$': '<rootDir>/__mocks__/react-native-maps.js',
    '^react-native-maps-directions$': '<rootDir>/__mocks__/react-native-maps-directions.js',
    '^expo-location$': '<rootDir>/__mocks__/expo-location.js',
    '^expo-task-manager$': '<rootDir>/__mocks__/expo-task-manager.js',
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/async-storage.js',
    '^expo-router$': '<rootDir>/__mocks__/expo-router.js',
    // Stub anything from react-native itself (View, Text, etc.) to avoid native deps
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
    // Stub lucide icons
    '^lucide-react-native$': '<rootDir>/__mocks__/lucide-react-native.js',
  },
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  collectCoverageFrom: [
    'services/**/*.ts',
    'hooks/**/*.ts',
    '!**/__mocks__/**',
  ],
};
