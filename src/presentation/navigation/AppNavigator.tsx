import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList, linking } from './navigationConfig';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CreateWorkoutScreen from '../screens/workout/CreateWorkoutScreen';
import EditWorkoutScreen from '../screens/workout/EditWorkoutScreen';
import TabNavigator from './TabNavigator';
import WorkoutDetailScreen from '../screens/workout/WorkoutDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: '#F5F5F5',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WorkoutDetail"
            component={WorkoutDetailScreen}
            options={{ title: 'Workout Details' }}
          />
          <Stack.Screen
            name="CreateWorkout"
            component={CreateWorkoutScreen}
            options={{ title: 'Create Workout' }}
          />
          <Stack.Screen
            name="EditWorkout"
            component={EditWorkoutScreen}
            options={{ title: 'Edit Workout' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
