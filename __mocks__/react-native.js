// Mock for react-native to avoid Flow syntax issues in tests
const React = require('react');

// Create mock components that can be rendered by React Testing Library
const createMockComponent = name => {
  return React.forwardRef((props, ref) => {
    return React.createElement(name, { ...props, ref });
  });
};

module.exports = {
  // Core components
  View: createMockComponent('View'),
  Text: createMockComponent('Text'),
  TouchableOpacity: createMockComponent('TouchableOpacity'),
  TouchableHighlight: createMockComponent('TouchableHighlight'),
  TextInput: createMockComponent('TextInput'),
  ScrollView: createMockComponent('ScrollView'),
  FlatList: createMockComponent('FlatList'),
  SectionList: createMockComponent('SectionList'),
  Image: createMockComponent('Image'),
  Button: createMockComponent('Button'),
  Alert: {
    alert: jest.fn(),
  },

  // Layout
  SafeAreaView: createMockComponent('SafeAreaView'),
  KeyboardAvoidingView: createMockComponent('KeyboardAvoidingView'),

  // Style
  StyleSheet: {
    create: styles => styles,
    flatten: styles => styles,
  },

  // Dimensions
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },

  // Platform
  Platform: {
    OS: 'ios',
    select: obj => obj.ios || obj.default,
  },

  // Navigation
  AppRegistry: {
    registerComponent: jest.fn(),
  },

  // Utils
  PixelRatio: {
    get: jest.fn(() => 2),
    getFontScale: jest.fn(() => 1),
  },

  // Animated
  Animated: {
    View: createMockComponent('Animated.View'),
    Text: createMockComponent('Animated.Text'),
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
    sequence: jest.fn(),
    parallel: jest.fn(),
  },

  // Keyboard
  Keyboard: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dismiss: jest.fn(),
  },
};
