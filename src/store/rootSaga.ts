import { all } from "redux-saga/effects";
import { interviewSaga } from './interview/saga';

export default function* rootSaga(): Generator {
    yield all([interviewSaga()]);
}
