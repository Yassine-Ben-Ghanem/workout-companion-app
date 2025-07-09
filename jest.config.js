module.exports = {
  projects: [
    // Configuration for use case tests (no JSX needed)
    {
      displayName: 'usecases',
      testMatch: [
        '<rootDir>/src/__tests__/domain/usecases/**/*.test.ts',
        '<rootDir>/src/__tests__/data/store/**/*.test.ts',
      ],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|react-navigation|@react-native-community|react-native-vector-icons|react-redux|redux-mock-store|react-native-config)/)',
      ],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      moduleNameMapper: {
        'react-native': '<rootDir>/__mocks__/react-native.js',
        '@env': '<rootDir>/__mocks__/env.js',
      },
    },
    // Configuration for UI tests (JSX rendering needed)
    {
      displayName: 'ui',
      testMatch: ['<rootDir>/src/__tests__/integration/**/*.test.tsx'],
      testEnvironment: 'node',
      setupFilesAfterEnv: [
        '@testing-library/jest-native/extend-expect',
        '<rootDir>/jest.setup.js',
      ],
      transformIgnorePatterns: [
        'node_modules/(?!(react-native|@react-native|@react-navigation|react-navigation|@react-native-community|react-native-vector-icons|react-redux|redux-mock-store|react-native-config)/)',
      ],
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
      moduleNameMapper: {
        '\\.svg': '<rootDir>/__mocks__/svgMock.js',
        'react-native$': '<rootDir>/__mocks__/react-native.js',
        'react-native/(.*)': '<rootDir>/__mocks__/react-native.js',
        '@env': '<rootDir>/__mocks__/env.js',
      },
    },
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/mocks/**',
  ],
  coverageThreshold: {
    global: {
      statements: 1.9,
      branches: 2.2,
      functions: 3.3,
      lines: 2.0,
    },
  },
};
