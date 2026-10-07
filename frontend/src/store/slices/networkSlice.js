import { createSlice } from '../createReduxStore';
import { userApi } from '@/lib/apiClient';

const initialState = {
  network: {
    level1: [],
    level2: [],
  },
  stats: {
    directReferralsCount: 0,
    secondLevelReferralsCount: 0,
    totalNetworkCount: 0,
  },
  referralCode: '',
  referralLink: '',
  status: 'idle',
  error: null,
  lastFetched: null,
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setLoading: (state) => ({ ...state, status: 'loading', error: null }),
    setNetworkSuccess: (state, action) => ({
      ...state,
      network: action.payload.network || { level1: [], level2: [] },
      stats: action.payload.stats || state.stats,
      referralCode: action.payload.referralCode || state.referralCode,
      referralLink: action.payload.referralLink || state.referralLink,
      status: 'succeeded',
      lastFetched: Date.now(),
      error: null,
    }),
    setNetworkFailure: (state, action) => ({
      ...state,
      status: 'failed',
      error: action.payload,
    }),
    // Optimistic addition of a new referral member into state
    addReferralMember: (state, action) => {
      const newMember = action.payload;
      const targetLevel = newMember.level === 2 ? 'level2' : 'level1';

      const updatedList = [newMember, ...state.network[targetLevel]];
      const newLevel1Count = targetLevel === 'level1' ? state.network.level1.length + 1 : state.network.level1.length;
      const newLevel2Count = targetLevel === 'level2' ? state.network.level2.length + 1 : state.network.level2.length;

      return {
        ...state,
        network: {
          ...state.network,
          [targetLevel]: updatedList,
        },
        stats: {
          directReferralsCount: newLevel1Count,
          secondLevelReferralsCount: newLevel2Count,
          totalNetworkCount: newLevel1Count + newLevel2Count,
        },
      };
    },
  },
});

export const {
  setLoading,
  setNetworkSuccess,
  setNetworkFailure,
  addReferralMember,
} = networkSlice.actions;

/**
 * Fetch Network data with caching
 */
export const fetchNetworkData = (force = false) => async (dispatch, getState) => {
  const { network } = getState();
  if (!force && network.lastFetched && network.status === 'succeeded') {
    return network;
  }

  dispatch(setLoading());
  try {
    const res = await userApi.getNetwork();
    if (res?.data) {
      dispatch(setNetworkSuccess(res.data));
      return res.data;
    }
  } catch (err) {
    dispatch(setNetworkFailure(err.message));
  }
};

export default networkSlice.reducer;
