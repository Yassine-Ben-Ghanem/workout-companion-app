import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { baseApi } from '../api/baseApi';
import { weatherApi } from '../api/weatherApi';
import { reduxStorage } from '../storage/mmkvStorage';
import workoutSlice from './slices/workoutSlice';

// Configuration for Redux Persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage: reduxStorage,
  // Blacklist specific reducers you don't want to persist
  blacklist: [baseApi.reducerPath, weatherApi.reducerPath],
};

// Combine all reducers
const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  [weatherApi.reducerPath]: weatherApi.reducer,
  workout: workoutSlice,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  // Adding the api middleware enables caching, invalidation, polling, and other features of RTK Query
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types since they contain non-serializable values
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware, weatherApi.middleware),
});

// Create a persistor
export const persistor = persistStore(store);

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
