import { createSlice } from '../createReduxStore';
import { offersApi } from '@/lib/apiClient';
import { TRAVEL_OFFERS } from '@/data/offers';

const initialState = {
  items: TRAVEL_OFFERS, // Preloaded with default travel offers
  selectedOffer: null,
  relatedOffers: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastFetched: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setLoading: (state) => ({ ...state, status: 'loading', error: null }),
    setOffersSuccess: (state, action) => ({
      ...state,
      status: 'succeeded',
      items: action.payload.offers || action.payload,
      lastFetched: Date.now(),
      error: null,
    }),
    setSelectedOffer: (state, action) => ({
      ...state,
      selectedOffer: action.payload.offer,
      relatedOffers: action.payload.relatedOffers || [],
      status: 'succeeded',
    }),
    setOffersFailure: (state, action) => ({
      ...state,
      status: 'failed',
      error: action.payload,
    }),
    // Optimistic CRUD without recall
    addOffer: (state, action) => ({
      ...state,
      items: [action.payload, ...state.items],
    }),
    updateOfferInCache: (state, action) => ({
      ...state,
      items: state.items.map((offer) =>
        offer.id === action.payload.id || offer.slug === action.payload.slug || offer._id === action.payload._id
          ? { ...offer, ...action.payload }
          : offer
      ),
      selectedOffer:
        state.selectedOffer &&
        (state.selectedOffer.id === action.payload.id || state.selectedOffer.slug === action.payload.slug)
          ? { ...state.selectedOffer, ...action.payload }
          : state.selectedOffer,
    }),
    removeOfferFromCache: (state, action) => ({
      ...state,
      items: state.items.filter(
        (offer) =>
          offer.id !== action.payload &&
          offer.slug !== action.payload &&
          offer._id !== action.payload
      ),
      selectedOffer:
        state.selectedOffer &&
        (state.selectedOffer.id === action.payload || state.selectedOffer.slug === action.payload)
          ? null
          : state.selectedOffer,
    }),
  },
});

export const {
  setLoading,
  setOffersSuccess,
  setSelectedOffer,
  setOffersFailure,
  addOffer,
  updateOfferInCache,
  removeOfferFromCache,
} = offersSlice.actions;

/**
 * Thunk to fetch offers with smart in-memory caching.
 * If offers already exist and force is false, it avoids making repeated network calls.
 */
export const fetchOffers = (params = {}, force = false) => async (dispatch, getState) => {
  const { offers } = getState();

  // If already loaded recently and not forced, return cached data immediately
  if (!force && offers.items && offers.items.length > 0 && offers.status === 'succeeded') {
    return offers.items;
  }

  dispatch(setLoading());
  try {
    const res = await offersApi.getAll(params);
    if (res?.data?.offers) {
      dispatch(setOffersSuccess(res.data.offers));
      return res.data.offers;
    } else if (Array.isArray(res?.data)) {
      dispatch(setOffersSuccess(res.data));
      return res.data;
    }
  } catch (err) {
    // If API is not reachable, fallback to existing local mock offers without breaking the UI
    console.warn('API fetch failed, utilizing cached/mock travel offers:', err.message);
    dispatch(setOffersSuccess(offers.items || TRAVEL_OFFERS));
    return offers.items || TRAVEL_OFFERS;
  }
};

/**
 * Thunk to get single offer by slug/id with cache-first lookup
 */
export const fetchOfferBySlugOrId = (idOrSlug) => async (dispatch, getState) => {
  const { offers } = getState();

  // Check if already in cache
  const cached = offers.items.find((o) => o.slug === idOrSlug || o.id === idOrSlug || o._id === idOrSlug);
  if (cached) {
    const related = offers.items.filter((o) => o.slug !== idOrSlug && o.id !== idOrSlug).slice(0, 3);
    dispatch(setSelectedOffer({ offer: cached, relatedOffers: related }));
    return cached;
  }

  dispatch(setLoading());
  try {
    const res = await offersApi.getBySlugOrId(idOrSlug);
    if (res?.data?.offer) {
      dispatch(setSelectedOffer(res.data));
      return res.data.offer;
    }
  } catch (err) {
    console.warn('Single offer fetch error, checking local data:', err.message);
    const local = TRAVEL_OFFERS.find((o) => o.slug === idOrSlug || o.id === idOrSlug);
    if (local) {
      const related = TRAVEL_OFFERS.filter((o) => o.slug !== idOrSlug && o.id !== idOrSlug).slice(0, 3);
      dispatch(setSelectedOffer({ offer: local, relatedOffers: related }));
      return local;
    }
    dispatch(setOffersFailure(err.message));
  }
};

export default offersSlice.reducer;
