import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import {
  persistStore,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducers';
import mainSaga from './sagas';


export const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const persistedReducer = persistReducer(
    {
      key: 'rootxxxx',
      storage,
      whitelist: ['auth'],
    },
    reducer,
  );

  const store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware),
  );

  const persistor = persistStore(store);

  sagaMiddleware.run(mainSaga);

  store.subscribe(() => console.log(store.getState()));

  return { store, persistor };
}
