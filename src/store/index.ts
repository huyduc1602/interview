import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import interviewReducer from '@/store/interview/slice';
import rootSaga from './rootSaga';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Define the root reducer with all sub-reducers
const rootReducer = {
  interview: interviewReducer,
  // Add other reducers here as needed
};

// Configure the store with middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore onComplete functions in fetchDataRequest actions
        ignoredActionPaths: ['payload.onComplete'],
      },
    }).concat(sagaMiddleware),
});

// Run the saga
sagaMiddleware.run(rootSaga);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;