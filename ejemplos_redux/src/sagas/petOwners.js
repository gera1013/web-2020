import {
    call,
    takeEvery,
    put,
    // race,
    // all,
    delay,
    select,
} from 'redux-saga/effects';

import omit from 'lodash/omit';
  
import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners';
  
  
const API_BASE_URL = 'http://localhost:8000/api/v1';
  
// FUNCIÓN
// Comienza a hacer fetch de los pet owners en el API
// 
// Si realiza el fetch con éxito se agregan los pet owners al estado
// Si no, se devuelve un mensaje de error
function* startFetching(action) {
    try {
      const isAuth = yield select(selectors.isAuthenticated);
  
      if (isAuth) {
        const token = yield select(selectors.getAuthToken);
        const response = yield call(
            fetch,
            `${API_BASE_URL}/owners/`,
            {
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${token}`,
                },
            }
        );
  
        if (response.status === 200) {
            const result = yield response.json();
            const ids = result.map(owner => owner.id);
            const owners = {}
            result.map(owner => owners[owner.id] = owner)
            yield put(actions.completeFetchingPetOwners(owners, ids));
        } else {
            const { non_field_errors } = yield response.json();
            yield put(actions.failLogin(non_field_errors[0]));
        }
      }
    } catch (error) {
        yield put(actions.failFetchingPetOwners('Falló el fetching'));
    }
  }
  
// FUNCIÓN
// Hace watch de la función startFetching, se activa con una acción de tipo FETCH_STARTED
// Se exporta al main saga
export function* watchFetch() {
    yield takeEvery(
        types.PET_OWNERS_FETCH_STARTED,
        startFetching,
    );
}

// FUNCIÓN
// Comienza a agregar un nuevo pet owner
// 
// Si se agrega el nuevo pet owner con éxito este recibe un nuevo id y es confirmado
// Si no, se devuelve un mensaje de error
function* startAdding(action){
    try {
        const isAuth = yield select(selectors.isAuthenticated);
        
        if (isAuth) {
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}/owners/`,
                {
                    method: 'POST',
                    body: JSON.stringify(omit(action.payload, 'id')),
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
  
            if (response.status === 201) {
                const result = yield response.json();
                yield put(actions.completeAddingPetOwner(action.payload.id, result));
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failLogin(non_field_errors[0]));
            }
        } 
    } catch (error) {
        yield put(actions.failAddingPetOwner('id', 'Falló el remove'))
    }
}

// FUNCIÓN
// Hace watch de la función startAdding, se activa con una acción de tipo ADD_STARTED
// Se exporta al main saga
export function* watchAdd() {
    yield takeEvery(
        types.PET_OWNER_ADD_STARTED,
        startAdding,
    )
}

// FUNCIÓN
// Comienza a eliminar a un pet owner
// 
// Si se elimina con éxito se elimina del estado también
// Si no, se devuelve un mensaje de error
function* startRemoving(action){
    try {
        const isAuth = yield select(selectors.isAuthenticated);
        
        if (isAuth) {
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}/owners/${action.payload.id}/`,
                {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
  
            if (response.status === 204) {
                const result = yield response.json();
                yield put(actions.completeRemovingPetOwner());
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failLogin(non_field_errors[0]));
            }
        }
    } catch (error) {
        yield put(actions.failRemovingPetOwner(action.payload.id, 'Falló el remove'))
    }
}

// FUNCIÓN
// Hace watch de la función startRemoving, se activa con una acción de tipo REMOVE_STARTED
// Se exporta al main saga
export function* watchRemove() {
    yield takeEvery(
        types.PET_OWNER_REMOVE_STARTED,
        startRemoving,
    )
}

