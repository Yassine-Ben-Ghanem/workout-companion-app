/* eslint-env jest */

// Mock the MMKV storage
jest.mock('react-native-mmkv', () => {
  const MMKV = {
    getString: jest.fn(),
    setString: jest.fn(),
    getBoolean: jest.fn(),
    setBoolean: jest.fn(),
    getNumber: jest.fn(),
    setNumber: jest.fn(),
    contains: jest.fn(),
    delete: jest.fn(),
    getAllKeys: jest.fn(),
    clearAll: jest.fn(),
  };
  return { MMKV: jest.fn(() => MMKV) };
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: jest.fn(() => inset),
  };
});

// Mock react-native-chart-kit
jest.mock('react-native-chart-kit', () => ({
  LineChart: 'LineChart',
  BarChart: 'BarChart',
  PieChart: 'PieChart',
  ProgressChart: 'ProgressChart',
  ContributionGraph: 'ContributionGraph',
  StackedBarChart: 'StackedBarChart',
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const MockSvg = jest.requireActual('react-native').View;
  MockSvg.Circle = jest.requireActual('react-native').View;
  MockSvg.Rect = jest.requireActual('react-native').View;
  MockSvg.Path = jest.requireActual('react-native').View;
  MockSvg.Defs = jest.requireActual('react-native').View;
  MockSvg.LinearGradient = jest.requireActual('react-native').View;
  MockSvg.Stop = jest.requireActual('react-native').View;
  MockSvg.G = jest.requireActual('react-native').View;
  MockSvg.Text = jest.requireActual('react-native').Text;
  MockSvg.Svg = jest.requireActual('react-native').View;
  return MockSvg;
});

// Mock the navigation
jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({ children }) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
    createNavigationContainerRef: jest.fn(),
  };
});

// Mock React Navigation Stack
jest.mock('@react-navigation/native-stack', () => {
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }) => children,
      Screen: ({ children }) => children,
    }),
  };
});

// Global fetch mock
global.fetch = jest.fn();

// React Native global variables
global.__DEV__ = true;

// Mock react-native-config
jest.mock('react-native-config', () => ({
  default: {},
}));

// @env will be handled by moduleNameMapper in jest config

// Mock React Native Testing Library
jest.mock('@testing-library/react-native', () => {
  const actualRTL = jest.requireActual('@testing-library/react-native');

  const mockQueries = {
    getByText: jest.fn(text => ({ children: text })),
    getByTestId: jest.fn(testId => ({
      props: {
        style: [
          { borderColor: '#FF6B6B' }, // Mock error style
          { backgroundColor: 'white' },
        ],
      },
      type: 'mock',
    })),
    getByDisplayValue: jest.fn(value => ({ value })),
    queryByText: jest.fn(text => null),
    queryByTestId: jest.fn(testId => null),
  };

  return {
    ...actualRTL,
    render: component => mockQueries,
    screen: mockQueries,
    fireEvent: {
      press: jest.fn(),
      changeText: jest.fn(),
    },
    waitFor: jest.fn(callback => Promise.resolve(callback())),
  };
});
