import { createSlice } from '../createReduxStore';
import { MEMBERSHIP_LEVELS } from '@/data/memberships';

const initialState = {
  items: Object.values(MEMBERSHIP_LEVELS),
  status: 'succeeded',
  error: null,
  lastFetched: Date.now(),
};

const membershipsSlice = createSlice({
  name: 'memberships',
  initialState,
  reducers: {
    setLoading: (state) => ({ ...state, status: 'loading', error: null }),
    setMembershipsSuccess: (state, action) => ({
      ...state,
      items: action.payload,
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

export default membershipsSlice.reducer;
