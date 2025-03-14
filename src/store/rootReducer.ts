import { combineReducers } from '@reduxjs/toolkit';
import interviewReducer from './interview/slice';

const rootReducer = combineReducers({
    interview: interviewReducer,
});

// Export RootState type for use throughout the application
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
