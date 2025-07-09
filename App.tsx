/**
 * Workout Companion App
 * React Native application for tracking workouts
 *
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { store, persistor } from './src/data/store/store';
import AppNavigator from './src/presentation/navigation/AppNavigator';

// Loading component for PersistGate
const LoadingComponent = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4CAF50" />
  </View>
);

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
