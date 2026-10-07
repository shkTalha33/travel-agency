const DB_NAME = "travel_agency_db";

const MEMBERSHIP_TIERS = {
  MEMBER: "member",
  ACTIVE_MEMBER: "active_member",
  AMBASSADOR: "ambassador",
  ELITE_AMBASSADOR: "elite_ambassador",
};

const MEMBERSHIP_CONFIG = {
  [MEMBERSHIP_TIERS.MEMBER]: {
    id: "member",
    name: "Miembro",
    maxReferralLevel: 0,
    rates: { 1: 0, 2: 0 },
  },
  [MEMBERSHIP_TIERS.ACTIVE_MEMBER]: {
    id: "active_member",
    name: "Miembro Activo",
    maxReferralLevel: 1,
    rates: { 1: 1.0, 2: 0 },
  },
  [MEMBERSHIP_TIERS.AMBASSADOR]: {
    id: "ambassador",
    name: "Embajador",
    maxReferralLevel: 2,
    rates: { 1: 1.0, 2: 0.5 },
  },
  [MEMBERSHIP_TIERS.ELITE_AMBASSADOR]: {
    id: "elite_ambassador",
    name: "Embajador Élite",
    maxReferralLevel: 2,
    rates: { 1: 1.0, 2: 0.5 },
  },
};

const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

const USER_STATUS = {
  ACTIVE: "active",
  DEACTIVATE: "deactivate",
  DELETED: "deleted",
};

const TRANSACTION_TYPES = {
  REFERRAL_L1: "referral_l1",
  REFERRAL_L2: "referral_l2",
  PURCHASE_POINTS: "purchase_points",
  REDEMPTION: "redemption",
  MANUAL_ADJUSTMENT: "manual_adjustment",
};

const REDEMPTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
};

module.exports = {
  DB_NAME,
  MEMBERSHIP_TIERS,
  MEMBERSHIP_CONFIG,
  USER_ROLES,
  USER_STATUS,
  TRANSACTION_TYPES,
  REDEMPTION_STATUS,
};
