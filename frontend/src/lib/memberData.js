/**
 * Selectors over a user object. Components get data via props/selectors,
 * so swapping mock data for a real API only requires changing the source.
 */
export const getNetwork = (user) => user?.network ?? { level1: [], level2: [] };
export const getTransactions = (user) => user?.transactions ?? [];
export const getRedemptions = (user) => getTransactions(user).filter((t) => t.type === 'redemption');
