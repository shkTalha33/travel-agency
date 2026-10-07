import { createSlice } from '../createReduxStore';
import { redemptionApi } from '@/lib/apiClient';
import { addTransaction, deductRedeemedPoints } from './pointsSlice';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const redemptionsSlice = createSlice({
  name: 'redemptions',
  initialState,
  reducers: {
    setLoading: (state) => ({ ...state, status: 'loading', error: null }),
    setRedemptionsSuccess: (state, action) => ({
      ...state,
      items: action.payload,
      status: 'succeeded',
      lastFetched: Date.now(),
      error: null,
    }),
    setRedemptionsFailure: (state, action) => ({
      ...state,
      status: 'failed',
      error: action.payload,
    }),
    // Optimistic addition of new redemption
    addRedemption: (state, action) => ({
      ...state,
      items: [action.payload, ...state.items],
    }),
  },
});

export const {
  setLoading,
  setRedemptionsSuccess,
  setRedemptionsFailure,
  addRedemption,
} = redemptionsSlice.actions;

/**
 * Fetch user redemptions with caching
 */
export const fetchMyRedemptions = (force = false) => async (dispatch, getState) => {
  const { redemptions } = getState();
  if (!force && redemptions.items.length > 0 && redemptions.status === 'succeeded') {
    return redemptions.items;
  }

  dispatch(setLoading());
  try {
    const res = await redemptionApi.getMyRedemptions();
    if (res?.data) {
      dispatch(setRedemptionsSuccess(res.data));
      return res.data;
    }
  } catch (err) {
    dispatch(setRedemptionsFailure(err.message));
  }
};

/**
 * Request redemption with optimistic Redux state update
 */
export const requestRedemption = (redemptionData) => async (dispatch) => {
  try {
    const res = await redemptionApi.createRequest(redemptionData);
    if (res?.data) {
      // 1. Add to redemptions slice
      dispatch(addRedemption(res.data));

      // 2. Deduct points from pointsSlice instantly
      dispatch(deductRedeemedPoints(res.data.points));

      // 3. Add to transaction list
      dispatch(
        addTransaction({
          id: `red_${res.data._id || Date.now()}`,
          iso: new Date().toISOString().split('T')[0],
          type: 'redemption',
          level: null,
          sourcePerson: 'Solicitud personal',
          purchaseDescription: 'Canje de puntos por crédito de viaje',
          points: -res.data.points,
          status: 'pending',
        })
      );
      return res.data;
    }
  } catch (err) {
    throw err;
  }
};

export default redemptionsSlice.reducer;
