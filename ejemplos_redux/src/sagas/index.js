import { fork, all } from 'redux-saga/effects';

import { watchLoginStarted } from './auth';
import { watchSayHappyBirthday } from './happyBirthday';
import { 
  watchFetch,
  watchAdd,
  watchRemove,
} from './petOwners';


function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchFetch),
    fork(watchAdd),
    fork(watchRemove),
  ]);
}


export default mainSaga;
