import { createSlice } from '../createReduxStore';
import { membershipApi } from '@/lib/apiClient';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const membershipsSlice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
    setLoading: (state) => ({ ...state, status: 'loading', error: null }),
    setMembershipsSuccess: (state, action) => ({
      ...state,
      items: Array.isArray(action.payload) ? action.payload : [],
      status: 'succeeded',
      lastFetched: Date.now(),
      error: null,
    }),
    setMembershipsFailure: (state, action) => ({
      ...state,
      status: 'failed',
      error: action.payload,
    }),
    // In-memory CRUD without API recall
    addMembership: (state, action) => ({
      ...state,
      items: [...state.items, action.payload],
    }),
    updateMembershipInCache: (state, action) => ({
      ...state,
      items: state.items.map((m) =>
        m.id === action.payload.id || m._id === action.payload._id ? { ...m, ...action.payload } : m
      ),
    }),
    removeMembershipFromCache: (state, action) => ({
      ...state,
      items: state.items.filter((m) => m.id !== action.payload && m._id !== action.payload),
    }),
  },
});

export const {
  setLoading,
  setMembershipsSuccess,
  setMembershipsFailure,
  addMembership,
  updateMembershipInCache,
  removeMembershipFromCache,
} = membershipsSlice.actions;

/**
 * Fetch Membership Tiers from API
 */
export const fetchMemberships = (force = false) => async (dispatch, getState) => {
  const { memberships } = getState();
  if (!force && memberships.lastFetched && memberships.status === 'succeeded') {
    return memberships.items;
  }

  dispatch(setLoading());
  try {
    const res = await membershipApi.getAll();
    const data = Array.isArray(res?.data) ? res.data : [];
    dispatch(setMembershipsSuccess(data));
    return data;
  } catch (err) {
    console.warn('API fetch memberships failed:', err.message);
    dispatch(setMembershipsFailure(err.message));
    return [];
  }
};

export default membershipsSlice.reducer;
