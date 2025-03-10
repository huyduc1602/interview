import { Store } from 'redux';
import { Category } from '../services/googleSheetService.d';

export interface InterviewState {
    questions: Category[];
    // Add other interview state properties here
}

export interface RootState {
    interview: InterviewState;
    // Add other state slices here
}

declare module 'store' {
    const store: Store<RootState>;
    export default store;
}