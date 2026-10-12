import { createSlice } from '../createReduxStore';
import { faqsApi } from '@/lib/apiClient';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const faqsSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {
    setLoading: (state) => ({ ...state, status: 'loading', error: null }),
    setFaqsSuccess: (state, action) => ({
      ...state,
      items: Array.isArray(action.payload) ? action.payload : [],
      status: 'succeeded',
      lastFetched: Date.now(),
      error: null,
    }),
    setFaqsFailure: (state, action) => ({
      ...state,
      status: 'failed',
      error: action.payload,
    }),
    // In-memory CRUD without recall
    addFaqInCache: (state, action) => ({
      ...state,
      items: [...state.items, action.payload],
    }),
    updateFaqInCache: (state, action) => ({
      ...state,
      items: state.items.map((faq) =>
        faq.id === action.payload.id || faq._id === action.payload._id ? { ...faq, ...action.payload } : faq
      ),
    }),
    removeFaqFromCache: (state, action) => ({
      ...state,
      items: state.items.filter((faq) => faq.id !== action.payload && faq._id !== action.payload),
    }),
  },
});

export const {
  setLoading,
  setFaqsSuccess,
  setFaqsFailure,
  addFaqInCache,
  updateFaqInCache,
  removeFaqFromCache,
} = faqsSlice.actions;

/**
 * Fetch FAQs with caching
 */
export const fetchFaqs = (force = false) => async (dispatch, getState) => {
  const { faqs } = getState();
  if (!force && faqs.lastFetched && faqs.status === 'succeeded') {
    return faqs.items;
  }

  dispatch(setLoading());
  try {
    const res = await faqsApi.getAll();
    const data = Array.isArray(res?.data) ? res.data : [];
    dispatch(setFaqsSuccess(data));
    return data;
  } catch (err) {
    console.warn('API fetch faqs failed:', err.message);
    dispatch(setFaqsFailure(err.message));
    return [];
  }
};

export default faqsSlice.reducer;
