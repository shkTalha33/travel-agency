import { createSlice } from '../createReduxStore';
import { faqsApi } from '@/lib/apiClient';
import { FAQS } from '@/data/faqs';

const initialState = {
  items: FAQS,
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
      items: action.payload,
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
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      dispatch(setFaqsSuccess(res.data));
      return res.data;
    }
    dispatch(setFaqsSuccess(FAQS));
    return FAQS;
  } catch (err) {
    dispatch(setFaqsSuccess(FAQS));
    return FAQS;
  }
};

export default faqsSlice.reducer;
