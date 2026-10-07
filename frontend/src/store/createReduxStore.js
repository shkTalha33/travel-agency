'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useRef, useCallback } from 'react';

const ReduxContext = createContext(null);

/**
 * Lightweight & Robust Redux Core compatible with Next.js App Router
 */
export function createStore(rootReducer, preloadedState = {}) {
  let state = rootReducer(preloadedState, { type: '@@INIT' });
  const listeners = new Set();

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const dispatch = (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    if (!action || typeof action.type !== 'string') {
      throw new Error('Actions must be plain objects with a type property');
    }
    state = rootReducer(state, action);
    listeners.forEach((listener) => listener(state));
    return action;
  };

  return {
    getState,
    dispatch,
    subscribe,
  };
}

export function combineReducers(reducers) {
  return (state = {}, action) => {
    const nextState = {};
    let hasChanged = false;
    for (const key of Object.keys(reducers)) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}

export function createSlice({ name, initialState, reducers = {}, extraReducers }) {
  const actions = {};

  Object.keys(reducers).forEach((actionName) => {
    const type = `${name}/${actionName}`;
    actions[actionName] = (payload) => ({ type, payload });
  });

  const reducer = (state = initialState, action) => {
    const prefix = `${name}/`;
    if (action.type && action.type.startsWith(prefix)) {
      const actionName = action.type.slice(prefix.length);
      const caseReducer = reducers[actionName];
      if (caseReducer) {
        return caseReducer(state, action);
      }
    }
    if (typeof extraReducers === 'function') {
      const builder = {
        addCase: (actionCreatorOrType, caseReducer) => {
          const targetType = typeof actionCreatorOrType === 'string' ? actionCreatorOrType : actionCreatorOrType.type;
          if (action.type === targetType) {
            return caseReducer(state, action);
          }
          return null;
        },
      };
      // Simple extraReducers delegation if needed
    }
    return state;
  };

  return {
    name,
    actions,
    reducer,
  };
}

/**
 * Redux Provider Component
 */
export function Provider({ store, children }) {
  return <ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>;
}

/**
 * Hook to get the Redux dispatch function
 */
export function useDispatch() {
  const store = useContext(ReduxContext);
  if (!store) {
    throw new Error('useDispatch must be used within a Redux Provider');
  }
  return store.dispatch;
}

/**
 * Hook to select and memoize slice of state from the store
 */
export function useSelector(selector, equalityFn = (a, b) => a === b) {
  const store = useContext(ReduxContext);
  if (!store) {
    throw new Error('useSelector must be used within a Redux Provider');
  }

  const [, forceRender] = useState({});
  const selectedStateRef = useRef(selector(store.getState()));

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      try {
        const nextSelected = selector(newState);
        if (!equalityFn(selectedStateRef.current, nextSelected)) {
          selectedStateRef.current = nextSelected;
          forceRender({});
        }
      } catch (err) {
        forceRender({});
      }
    });
    return unsubscribe;
  }, [store, selector, equalityFn]);

  return selectedStateRef.current;
}

export function useStore() {
  const store = useContext(ReduxContext);
  if (!store) {
    throw new Error('useStore must be used within a Redux Provider');
  }
  return store;
}
