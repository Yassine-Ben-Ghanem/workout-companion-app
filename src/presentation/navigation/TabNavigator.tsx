import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TabParamList } from './navigationConfig';
import TodayScreen from '../screens/today/TodayScreen';
import WorkoutsScreen from '../screens/workouts/WorkoutsScreen';
import SummaryScreen from '../screens/summary/SummaryScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon, DumbbellIcon, ChartBarIcon } from '../components/icons';

const Tab = createBottomTabNavigator<TabParamList>();

// Icon components defined outside render
const TodayIcon = ({ color, size }: { color: string; size: number }) => (
  <HomeIcon color={color} size={size} />
);

const WorkoutsIcon = ({ color, size }: { color: string; size: number }) => (
  <DumbbellIcon color={color} size={size} />
);

const SummaryIcon = ({ color, size }: { color: string; size: number }) => (
  <ChartBarIcon color={color} size={size} />
);

const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#757575',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarAllowFontScaling: false,
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarIcon: TodayIcon,
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          tabBarIcon: WorkoutsIcon,
        }}
      />
      <Tab.Screen
        name="Summary"
        component={SummaryScreen}
        options={{
          tabBarIcon: SummaryIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
});

export default TabNavigator;
