'use client';

import React from 'react';
import {
  createStore,
  combineReducers,
  Provider as ReduxProvider,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  useStore as useReduxStore,
} from './createReduxStore';

import offersReducer from './slices/offersSlice';
import pointsReducer from './slices/pointsSlice';
import networkReducer from './slices/networkSlice';
import redemptionsReducer from './slices/redemptionsSlice';
import membershipsReducer from './slices/membershipsSlice';
import faqsReducer from './slices/faqsSlice';

const rootReducer = combineReducers({
  offers: offersReducer,
  points: pointsReducer,
  network: networkReducer,
  redemptions: redemptionsReducer,
  memberships: membershipsReducer,
  faqs: faqsReducer,
});

export const store = createStore(rootReducer);

export function AppStoreProvider({ children }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}

export const useDispatch = useReduxDispatch;
export const useSelector = useReduxSelector;
export const useStore = useReduxStore;
