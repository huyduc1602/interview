import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

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

sagaMiddleware.run(rootSaga);

export default store;