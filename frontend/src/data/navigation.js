export const MAIN_NAV = [
  { key: 'home', href: '/' },
  { key: 'offers', href: '/offers' },
  { key: 'how', href: '/#como-funciona' },
  { key: 'membership', href: '/membership' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
  { key: 'faq', href: '/faq' },
];

export const PANEL_NAV = [
  { key: 'dashboard', href: '/dashboard', icon: 'dashboard' },
  { key: 'offers', href: '/offers', icon: 'offers' },
  { key: 'network', href: '/dashboard/network', icon: 'network' },
  { key: 'points', href: '/dashboard/points', icon: 'points' },
  { key: 'redeem', href: '/dashboard/redeem', icon: 'redeem' },
  { key: 'profile', href: '/dashboard/profile', icon: 'profile' },
];

export const FOOTER_COLUMNS = [
  {
    titleKey: 'explore',
    links: [
      { labelKey: 'nav.offers', href: '/offers' },
      { labelKey: 'nav.membership', href: '/membership' },
      { labelKey: 'nav.about', href: '/about' },
      { labelKey: 'nav.contact', href: '/contact' },
      { labelKey: 'footer.faq', href: '/faq' },
    ],
  },
  {
    titleKey: 'account',
    links: [
      { labelKey: 'auth.login', href: '/login' },
      { labelKey: 'footer.register', href: '/register' },
      { labelKey: 'auth.dashboard', href: '/dashboard' },
    ],
  },
  {
    titleKey: 'legal',
    links: [
      { labelKey: 'footer.terms', href: '/terms' },
      { labelKey: 'footer.privacy', href: '/privacy' },
      { labelKey: 'footer.contact', href: '/contact' },
    ],
  },
];
