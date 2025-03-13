import { SharedCategory, SharedItem, User } from '@/types/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InterviewState {
  knowledge: unknown[];
  questions: unknown[];
  answers: { [key: string]: unknown };
  loading: boolean;
  error: null | unknown;
  cachedAnswers: {
    [language: string]: {
      [type: string]: {
        [questionId: string]: unknown;
      };
    };
  };
  [key: string]: unknown[] | unknown;
}

const loadCachedAnswers = () => {
  try {
    const cached = localStorage.getItem('cachedAnswers');
    return cached ? JSON.parse(cached) : { en: {}, vi: {} };
  } catch (error) {
    console.error('Failed to load cached answers:', error);
    return { en: {}, vi: {} };
  }
};

const initialState: InterviewState = {
  knowledge: [],
  questions: [],
  answers: {},
  loading: false,
  error: null,
  cachedAnswers: loadCachedAnswers()
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    // Data fetching actions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchDataRequest: (state, _action: PayloadAction<{
      apiKey: string;
      spreadsheetId: string;
      user: User | null;
      onComplete?: () => void;
    }>) => {
      state.loading = true;
    },
    fetchDataSuccess: (state, action) => {
      state.loading = false;
      state.knowledge = action.payload.knowledge;
      state.questions = action.payload.questions;
    },
    fetchDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Answer handling actions
    fetchAnswerRequest: (state) => {
      state.loading = true;
    },
    fetchAnswerSuccess: (state, action) => {
      state.loading = false;
      const { question, category, answer } = action.payload;
      state.answers[`${category}-${question}`] = answer;
    },
    fetchAnswerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Knowledge status actions
    updateKnowledgeStatusRequest: (state) => {
      state.loading = true;
    },
    updateKnowledgeStatusSuccess: (state, action) => {
      state.loading = false;
      const { rowIndex, status } = action.payload;

      state.knowledge = (state.knowledge as SharedCategory[]).map((category: SharedCategory) => ({
        ...category,
        items: category.items.map((item: SharedItem) =>
          item.rowIndex === rowIndex
            ? { ...item, status }
            : item
        )
      }));
    },
    updateKnowledgeStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    setCachedAnswer: (state, action) => {
      const { language, questionId, answer, type = 'questions' } = action.payload;
      if (!state.cachedAnswers[language]) {
        state.cachedAnswers[language] = {};
      }
      if (!state.cachedAnswers[language][type]) {
        state.cachedAnswers[language][type] = {};
      }
      state.cachedAnswers[language][type][questionId] = answer;

      // Save to localStorage
      try {
        localStorage.setItem('cachedAnswers', JSON.stringify(state.cachedAnswers));
      } catch (error) {
        console.error('Failed to save cached answers:', error);
      }
    },
    clearCachedAnswers: (state) => {
      state.cachedAnswers = { en: {}, vi: {} };
      localStorage.removeItem('cachedAnswers');
    },

    setItems: (state, action: PayloadAction<{ key: string; items: unknown[] }>) => {
      state[`${action.payload.key}`] = action.payload.items;
    },
    addItems: (state, action: PayloadAction<{ key: string; items: unknown[] }>) => {
      const currentItems = (state[action.payload.key] as unknown[]) || [];
      state[action.payload.key] = [
        ...currentItems,
        ...action.payload.items.filter(item => !currentItems.includes(item))
      ];
    }
  },
});

export const {
  fetchDataRequest,
  fetchDataSuccess,
  fetchDataFailure,
  fetchAnswerRequest,
  fetchAnswerSuccess,
  fetchAnswerFailure,
  updateKnowledgeStatusRequest,
  updateKnowledgeStatusSuccess,
  updateKnowledgeStatusFailure,
  setCachedAnswer,
  clearCachedAnswers,
  setItems,
  addItems,
} = interviewSlice.actions;

export default interviewSlice.reducer;