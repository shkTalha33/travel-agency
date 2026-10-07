/**
 * Demo users. Each user's network, transactions and stats come from ONE source
 * (their network members' purchase points), so every number in the UI is consistent.
 *
 * Rules applied (spec §31–33):
 *  - Level 1 earns 100% of the purchase points, Level 2 earns 50%.
 *  - A user only receives/sees the levels allowed by their membership.
 *  - A person's own purchase points are never their own referral earnings.
 */
const pic = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=200&q=80`;
const RATES = { 1: 1, 2: 0.5 };
const MAX_LEVEL = { member: 0, active_member: 1, ambassador: 2, elite_ambassador: 2 };

export const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });

function buildUser(base, members = [], redemptions = []) {
  const max = MAX_LEVEL[base.membershipId];
  const visible = members.filter((m) => m.level <= max);

  const earnings = visible.flatMap((m) =>
    m.purchases.map((p) => ({
      id: `tx_${m.id}_${p.id}`,
      iso: p.iso,
      date: formatDate(p.iso),
      type: m.level === 1 ? 'referral_l1' : 'referral_l2',
      level: m.level,
      memberId: m.id,
      sourcePerson: m.name,
      purchaseDescription: p.offer,
      points: p.points * RATES[m.level],
    }))
  );
  const reds = redemptions.map((r) => ({ ...r, date: formatDate(r.iso), type: 'redemption', level: null }));
  const transactions = [...earnings, ...reds].sort((a, b) => b.iso.localeCompare(a.iso));

  const sum = (list) => list.reduce((a, t) => a + t.points, 0);
  const level1Points = sum(earnings.filter((t) => t.level === 1));
  const level2Points = sum(earnings.filter((t) => t.level === 2));
  const totalEarnedPoints = level1Points + level2Points;
  const redeemedPoints = -sum(reds);

  const decorate = (m) => ({
    ...m,
    joinedDate: formatDate(m.joinedIso),
    pointsGeneratedToUpline: sum(earnings.filter((t) => t.memberId === m.id)),
    downlineCount: max >= 2 && m.level === 1 ? visible.filter((x) => x.sponsorId === m.id).length : 0,
  });

  const level1 = visible.filter((m) => m.level === 1).map(decorate);
  const level2 = visible.filter((m) => m.level === 2).map(decorate);

  return {
    ...base,
    network: { level1, level2 },
    transactions,
    stats: {
      availablePoints: totalEarnedPoints - redeemedPoints,
      totalEarnedPoints,
      redeemedPoints,
      level1Points,
      level2Points,
      directReferralsCount: level1.length,
      secondLevelReferralsCount: level2.length,
      totalNetworkCount: level1.length + level2.length,
    },
  };
}

const member = (id, name, status, level, joinedIso, avatar, extra = {}) => ({
  id, name, email: `${id.replace(/_/g, '.')}@ejemplo.com`, status, level, joinedIso, avatar: pic(avatar), purchases: [], ...extra,
});
const buy = (id, iso, offer, points) => ({ id, iso, offer, points });

const SOFIA_MEMBERS = [
  member('marcos_pena', 'Marcos Peña', 'active_member', 1, '2026-02-12', 'photo-1535713875002-d1d0cf377fde', { purchases: [buy('a', '2026-08-08', 'Punta Cana Todo Incluido', 120)] }),
  member('laura_gomez', 'Laura Gómez', 'active_member', 1, '2026-03-01', 'photo-1494790108377-be9c29b29330', { purchases: [buy('a', '2026-09-28', 'Cancún y Riviera Maya', 150)] }),
  member('rafael_valdes', 'Rafael Valdés', 'member', 1, '2026-04-18', 'photo-1507003211169-0a1dd7228f2d'),
  member('carmen_tavarez', 'Carmen Tavárez', 'active_member', 1, '2026-05-05', 'photo-1534528741775-53994a69daeb', { purchases: [buy('a', '2026-06-30', 'Puerto Plata y Teleférico', 70)] }),
  member('gabriel_morales', 'Gabriel Morales', 'active_member', 2, '2026-03-20', 'photo-1522075469751-3a6694fb2f61', { sponsorId: 'marcos_pena', sponsorName: 'Marcos Peña', purchases: [buy('a', '2026-07-19', 'Santo Domingo y la Zona Colonial', 80)] }),
  member('jorge_cruz', 'Jorge Cruz', 'active_member', 2, '2026-04-15', 'photo-1506794778202-cad84cf45f1d', { sponsorId: 'laura_gomez', sponsorName: 'Laura Gómez', purchases: [buy('a', '2026-09-24', 'Punta Cana Todo Incluido', 120)] }),
  member('estela_rosario', 'Estela Rosario', 'active_member', 2, '2026-04-28', 'photo-1524504388940-b1c1722653e1', { sponsorId: 'laura_gomez', sponsorName: 'Laura Gómez', purchases: [buy('a', '2026-09-10', 'Cancún y Riviera Maya', 150)] }),
  member('andres_gil', 'Andrés Gil', 'active_member', 2, '2026-05-19', 'photo-1492562080023-ab3db95bfbce', { sponsorId: 'carmen_tavarez', sponsorName: 'Carmen Tavárez', purchases: [buy('a', '2026-07-02', 'Puerto Plata y Teleférico', 70)] }),
];

const CARLOS_MEMBERS = [
  member('monica_reyes', 'Mónica Reyes', 'active_member', 1, '2026-04-02', 'photo-1544005313-94ddf0286df2', { purchases: [buy('a', '2026-07-14', 'Santo Domingo y la Zona Colonial', 80)] }),
  member('luis_batista', 'Luis Batista', 'active_member', 1, '2026-05-21', 'photo-1519085360753-af0119f7cbe7', { purchases: [buy('a', '2026-08-30', 'Cartagena de Indias', 130)] }),
  member('ivan_diaz', 'Iván Díaz', 'member', 1, '2026-06-11', 'photo-1472099645785-5658abf4ff4e'),
];

const ELENA_MEMBERS = [
  member('ricardo_nunez', 'Ricardo Núñez', 'active_member', 1, '2026-01-20', 'photo-1500648767791-00dcc994a43e', { purchases: [buy('a', '2026-06-10', 'París: la Ciudad Luz', 260)] }),
  member('yesenia_mejia', 'Yesenia Mejía', 'active_member', 1, '2026-02-08', 'photo-1573496359142-b8d87734a5a2', { purchases: [buy('a', '2026-07-22', 'Madrid: arte y gastronomía', 200)] }),
  member('hugo_felix', 'Hugo Féliz', 'member', 1, '2026-03-14', 'photo-1507003211169-0a1dd7228f2d'),
  member('daniela_polanco', 'Daniela Polanco', 'active_member', 1, '2026-03-30', 'photo-1580489944761-15a19d654956', { purchases: [buy('a', '2026-09-05', 'Nueva York esencial', 220)] }),
  member('fabian_soto', 'Fabián Soto', 'active_member', 2, '2026-04-09', 'photo-1492562080023-ab3db95bfbce', { sponsorId: 'ricardo_nunez', sponsorName: 'Ricardo Núñez', purchases: [buy('a', '2026-08-12', 'Cancún y Riviera Maya', 150)] }),
  member('claudia_ramos', 'Claudia Ramos', 'active_member', 2, '2026-04-25', 'photo-1494790108377-be9c29b29330', { sponsorId: 'ricardo_nunez', sponsorName: 'Ricardo Núñez', purchases: [buy('a', '2026-08-26', 'Punta Cana Todo Incluido', 120)] }),
  member('omar_castro', 'Omar Castro', 'active_member', 2, '2026-05-13', 'photo-1506794778202-cad84cf45f1d', { sponsorId: 'yesenia_mejia', sponsorName: 'Yesenia Mejía', purchases: [buy('a', '2026-09-01', 'Cartagena de Indias', 130)] }),
  member('lidia_marte', 'Lidia Marte', 'active_member', 2, '2026-05-30', 'photo-1534528741775-53994a69daeb', { sponsorId: 'yesenia_mejia', sponsorName: 'Yesenia Mejía', purchases: [buy('a', '2026-09-15', 'Santo Domingo y la Zona Colonial', 80)] }),
  member('ramon_acosta', 'Ramón Acosta', 'active_member', 2, '2026-06-17', 'photo-1519085360753-af0119f7cbe7', { sponsorId: 'daniela_polanco', sponsorName: 'Daniela Polanco', purchases: [buy('a', '2026-09-20', 'Puerto Plata y Teleférico', 70)] }),
];

export const MOCK_USERS = {
  ambassador: buildUser(
    {
      id: 'usr_sofia', name: 'Sofía Almonte', email: 'sofia.almonte@ejemplo.com', phone: '+1 (809) 555-0192',
      city: 'Santo Domingo', country: 'República Dominicana', membershipId: 'ambassador',
      referralCode: 'SOFIA-VIAJES', referralLink: 'https://viajesdominicana.com/register?ref=SOFIA-VIAJES',
      joinedDate: '15 ene 2026', avatar: pic('photo-1573496359142-b8d87734a5a2'),
    },
    SOFIA_MEMBERS,
    [{ id: 'red_1', iso: '2026-09-15', sourcePerson: 'Solicitud personal', purchaseDescription: 'Canje de puntos', points: -200 }]
  ),
  active_member: buildUser(
    {
      id: 'usr_carlos', name: 'Carlos Mendoza', email: 'carlos.mendoza@ejemplo.com', phone: '+1 (829) 555-0144',
      city: 'Santiago de los Caballeros', country: 'República Dominicana', membershipId: 'active_member',
      referralCode: 'CARLOS-RD', referralLink: 'https://viajesdominicana.com/register?ref=CARLOS-RD',
      joinedDate: '10 mar 2026', avatar: pic('photo-1500648767791-00dcc994a43e'),
    },
    CARLOS_MEMBERS
  ),
  elite_ambassador: buildUser(
    {
      id: 'usr_elena', name: 'Elena Castillo', email: 'elena.castillo@ejemplo.com', phone: '+1 (849) 555-0188',
      city: 'Punta Cana', country: 'República Dominicana', membershipId: 'elite_ambassador',
      referralCode: 'ELENA-ELITE', referralLink: 'https://viajesdominicana.com/register?ref=ELENA-ELITE',
      joinedDate: '01 dic 2025', avatar: pic('photo-1580489944761-15a19d654956'),
    },
    ELENA_MEMBERS,
    [{ id: 'red_1', iso: '2026-08-20', sourcePerson: 'Solicitud personal', purchaseDescription: 'Canje de puntos', points: -400 }]
  ),
  member: buildUser({
    id: 'usr_pedro', name: 'Pedro Santos', email: 'pedro.santos@ejemplo.com', phone: '+1 (809) 555-0177',
    city: 'La Romana', country: 'República Dominicana', membershipId: 'member',
    referralCode: 'PEDRO-SANTOS', referralLink: 'https://viajesdominicana.com/register?ref=PEDRO-SANTOS',
    joinedDate: '28 sep 2026', avatar: pic('photo-1472099645785-5658abf4ff4e'),
  }),
};
