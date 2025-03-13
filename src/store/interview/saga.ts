import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { fetchGoogleSheetData, updateKnowledgeStatus } from '@/services/googleSheetService';
import { ApiResponse, SheetData } from '@/services/googleSheetService.d';
import { fetchChatGPTAnswer } from '@/services/aiServices/chatgptService';
import type { AIResponse } from '@/services/aiServices/types';
import {
    fetchDataRequest,
    fetchDataSuccess,
    fetchDataFailure,
    fetchAnswerRequest,
    fetchAnswerSuccess,
    fetchAnswerFailure,
    updateKnowledgeStatusRequest,
    updateKnowledgeStatusSuccess,
    updateKnowledgeStatusFailure,
} from './slice';
import { User } from '@/types/common';

interface KnowledgeStatusPayload {
    rowIndex: number;
    status: string;
    user: User | null
}

interface AnswerPayload {
    question: string;
    answer: string;
}

function* fetchDataSaga(action: ReturnType<typeof fetchDataRequest>): Generator<unknown, void, ApiResponse<SheetData>> {
    try {
        const { apiKey, spreadsheetId, user } = action.payload;
        const response = yield call(fetchGoogleSheetData, apiKey, spreadsheetId, user);
        if (response.success && response.data) {
            yield put(fetchDataSuccess(response.data));
            // Call the onComplete callback if provided
            if (action.payload.onComplete) {
                action.payload.onComplete();
            }
        } else {
            throw new Error(response.error || 'Failed to fetch data');
        }
    } catch (error) {
        yield put(fetchDataFailure(
            error instanceof Error ? error.message : 'An unknown error occurred'
        ));

        // Still call onComplete even on error to resolve the promise
        if (action.payload.onComplete) {
            action.payload.onComplete();
        }
    }
}

function* fetchAnswerSaga(action: PayloadAction<{ question: string; user: User }>): Generator<unknown, void, AIResponse> {
    try {
        const { question, user } = action.payload;
        const response: AIResponse = yield call(fetchChatGPTAnswer, question, 'gpt-3.5-turbo-0125', user);
        yield put(fetchAnswerSuccess({
            question,
            answer: 'choices' in response ? response.choices[0].message.content : response.candidates[0].content.parts[0].text,
        } as AnswerPayload));
    } catch (error) {
        yield put(fetchAnswerFailure(
            error instanceof Error ? error.message : 'Failed to fetch answer'
        ));
    }
}

function* updateKnowledgeStatusSaga(
    action: PayloadAction<KnowledgeStatusPayload>
): Generator<unknown, void, boolean> {
    try {
        const { rowIndex, status, user } = action.payload;
        if (!rowIndex || !status) {
            throw new Error('Missing required parameters');
        }

        const success = yield call(updateKnowledgeStatus, rowIndex, status, user);
        if (success) {
            yield put(updateKnowledgeStatusSuccess(action.payload));
        } else {
            throw new Error('Failed to update status');
        }
    } catch (error) {
        yield put(updateKnowledgeStatusFailure(
            error instanceof Error ? error.message : 'Failed to update status'
        ));
    }
}

export function* interviewSaga() {
    yield takeLatest(fetchDataRequest.type, fetchDataSaga);
    yield takeLatest(fetchAnswerRequest.type, fetchAnswerSaga);
    yield takeLatest(updateKnowledgeStatusRequest.type, updateKnowledgeStatusSaga);
}