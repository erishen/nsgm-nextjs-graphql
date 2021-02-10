import { useMemo } from 'react'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'
import reducers from './reducers'
import _ from 'lodash'

let store:any

const reducersKeysLen = _.keys(reducers).length
const combineReducer = combineReducers((reducersKeysLen === 0) ? {} : { ...reducers })

export type RootState = ReturnType<typeof combineReducer>

function initStore(initialState:any) {
  return createStore(
    combineReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}

export const initializeStore = (preloadedState:any) => {
  let _store = store ?? initStore(preloadedState)

  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState
    })
    store = undefined
  }

  if (typeof window === 'undefined') return _store

  if (!store) store = _store

  return _store
}

export function useStore(initialState:any) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
