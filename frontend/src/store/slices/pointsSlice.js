import { createSlice } from '../createReduxStore';
import { pointsApi } from '@/lib/apiClient';

const initialState = {
  summary: {
    availablePoints: 0,
    totalEarnedPoints: 0,
    redeemedPoints: 0,
    level1Points: 0,
    level2Points: 0,
  },
  transactions: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const pointsSlice = createSlice({
  name: 'points',
  initialState,
  reducers: {
    setLoading: (state) => ({ ...state, status: 'loading', error: null }),
    setSummarySuccess: (state, action) => ({
      ...state,
      summary: { ...state.summary, ...action.payload },
      status: 'succeeded',
      lastFetched: Date.now(),
      error: null,
    }),
    setTransactionsSuccess: (state, action) => ({
      ...state,
      transactions: action.payload.transactions || action.payload,
      status: 'succeeded',
      lastFetched: Date.now(),
      error: null,
    }),
    setPointsFailure: (state, action) => ({
      ...state,
      status: 'failed',
      error: action.payload,
    }),
    // In-memory instant transaction addition & balance update without recall
    addTransaction: (state, action) => {
      const tx = action.payload;
      const points = Number(tx.points || 0);

      const newTransactions = [tx, ...state.transactions];

      let newAvailable = state.summary.availablePoints + points;
      let newTotalEarned = state.summary.totalEarnedPoints;
      let newRedeemed = state.summary.redeemedPoints;
      let newLevel1 = state.summary.level1Points;
      let newLevel2 = state.summary.level2Points;

      if (points > 0) {
        newTotalEarned += points;
        if (tx.level === 1) newLevel1 += points;
        if (tx.level === 2) newLevel2 += points;
      } else {
        newRedeemed += Math.abs(points);
      }

      return {
        ...state,
        transactions: newTransactions,
        summary: {
          ...state.summary,
          availablePoints: Math.max(0, newAvailable),
          totalEarnedPoints: newTotalEarned,
          redeemedPoints: newRedeemed,
          level1Points: newLevel1,
          level2Points: newLevel2,
        },
      };
    },
    // Instant points deduction for redemptions
    deductRedeemedPoints: (state, action) => {
      const redeemedAmt = Number(action.payload || 0);
      return {
        ...state,
        summary: {
          ...state.summary,
          availablePoints: Math.max(0, state.summary.availablePoints - redeemedAmt),
          redeemedPoints: state.summary.redeemedPoints + redeemedAmt,
        },
      };
    },
  },
});

export const {
  setLoading,
  setSummarySuccess,
  setTransactionsSuccess,
  setPointsFailure,
  addTransaction,
  deductRedeemedPoints,
} = pointsSlice.actions;

/**
 * Fetch Points summary with caching
 */
export const fetchPointsSummary = (force = false) => async (dispatch, getState) => {
  const { points } = getState();
  if (!force && points.lastFetched && points.status === 'succeeded') {
    return points.summary;
  }

  dispatch(setLoading());
  try {
    const res = await pointsApi.getSummary();
    if (res?.data) {
      dispatch(setSummarySuccess(res.data));
      return res.data;
    }
  } catch (err) {
    dispatch(setPointsFailure(err.message));
  }
};

/**
 * Fetch Points transactions with caching
 */
export const fetchPointsTransactions = (params = {}, force = false) => async (dispatch, getState) => {
  const { points } = getState();
  if (!force && points.transactions && points.transactions.length > 0) {
    return points.transactions;
  }

  dispatch(setLoading());
  try {
    const res = await pointsApi.getTransactions(params);
    if (res?.data?.transactions) {
      dispatch(setTransactionsSuccess(res.data.transactions));
      return res.data.transactions;
    }
  } catch (err) {
    dispatch(setPointsFailure(err.message));
  }
};

export default pointsSlice.reducer;
