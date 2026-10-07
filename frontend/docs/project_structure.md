# Travel Referral Platform — Frontend

Premium Spanish-language travel and referral platform frontend built with **Next.js, JavaScript, Tailwind CSS, and reusable UI components**.

The objective is to create a production-quality travel platform that combines:

- Travel offers
- Membership levels
- Referral networks
- Points
- Member dashboards
- Points redemption
- User authentication
- Premium travel experience

The frontend must feel like a professionally designed product, not an AI-generated template.

---

# 1. Project Objective

Build the complete **public website, authentication system, and member-side frontend** for a Dominican Republic travel agency.

The platform allows users to:

1. Register
2. Become members
3. View travel offers
4. Build a referral network
5. Earn referral points according to their membership level
6. Track points
7. View their referral network
8. Redeem eligible points

The platform is **not an ecommerce website**.

Travel purchases are handled offline.

Purchase points are assigned manually by the administrator.

The Admin Dashboard is **out of scope for this phase**.

---

# 2. Important Scope

## Included

- Public website
- Landing page
- Header
- Footer
- Hero section
- How It Works
- Membership information
- Travel offers
- Offer details
- About page
- FAQ
- Authentication
- Registration
- Login
- Forgot password
- Reset password
- Email verification
- Member dashboard
- Member profile
- Member network
- Points page
- Points transaction history
- Redemption UI
- Responsive navigation
- Mobile navigation
- Loading states
- Empty states
- Error states
- Success states
- Reusable UI components

## Not Included

Do NOT build:

- Admin Dashboard
- Admin authentication interface
- Admin purchase management
- Admin point assignment interface
- Admin member management
- Admin referral management
- Online checkout
- Shopping cart
- Payment gateway
- Online travel purchasing
- Financial payment processing

These will be handled separately.

---

# 3. Technology Stack

Use:

- Latest stable Next.js
- Next.js App Router
- JavaScript
- JSX
- Tailwind CSS
- React
- Reusable component architecture

## Strictly Do Not Use

- TypeScript
- TSX
- MUI
- Bootstrap-based UI
- Large monolithic components

The project must use:

```text
JavaScript + JSX
```

throughout the frontend.

---

# 4. Design Intelligence

The UI must be designed using professional UI/UX principles.

Before implementing the interface, inspect and use available design guidance and reference resources.

## UI Pro Max

Use **UI Pro Max** and its available design intelligence whenever available.

Use it for:

- Layout decisions
- Typography
- Color systems
- Spacing
- Component composition
- UX patterns
- Navigation
- Forms
- Cards
- Tables
- Responsive behavior
- Accessibility
- Interaction patterns
- Visual hierarchy
- Micro-interactions
- Conversion-focused CTAs

Do not blindly copy UI Pro Max designs.

Use it as design intelligence.

---

# 5. Other Design References

Inspect the project/environment for relevant:

- UI libraries
- Design-system files
- UX documentation
- Component guidelines
- Design tokens
- Existing reusable components
- Professional UI references
- Accessibility guidelines

Use significant available reference files when they improve the design.

If a reference conflicts with the actual project requirements, the project requirements take priority.

---

# 6. Core Design Philosophy

The website must feel:

- Premium
- Modern
- Elegant
- Professional
- Trustworthy
- Travel-focused
- Human-designed
- Easy to understand
- Fast
- Smooth
- Intuitive
- Visually coherent

The website should communicate:

> Travel + Community + Opportunity + Rewards

---

# 7. Anti-AI-Generated Design Rule

The website must NOT look like a generic AI-generated website.

Avoid:

- Generic SaaS templates
- Excessive gradients
- Excessive glassmorphism
- Random floating blobs
- Excessive rounded cards
- Repetitive card grids
- Huge meaningless headings
- Random decorative elements
- Excessive shadows
- Excessive animation
- Random icons
- Fake statistics
- Fake testimonials
- Fake reviews
- Fake trust badges
- Excessive pill UI
- Poor spacing
- Random colors
- Generic dashboards
- Repetitive three-card sections
- Components without a clear purpose

Every UI element must serve a purpose.

The final interface should look intentionally designed by an experienced senior product designer and frontend engineer.

---

# 8. User Experience Philosophy

The most important UX requirement is:

> The user should not have to think about how to use the website.

A first-time visitor should immediately understand:

```text
Where am I?
What is this?
What can I do?
What should I do next?
What happens when I click this?
```

The interface should naturally guide the user.

---

# 9. "Next Action" Principle

Every major screen must have an obvious next action.

Examples:

### Landing Page

```text
Understand platform
        ↓
View offers / Join
```

### Offer Page

```text
Understand offer
        ↓
View details
        ↓
Take action
```

### Registration

```text
Enter information
        ↓
Create account
        ↓
Verify email
```

### Dashboard

```text
Understand membership
        ↓
Check points
        ↓
View network
        ↓
Take relevant action
```

### Points

```text
See points
        ↓
Understand source
        ↓
Redeem
```

If the primary action is not visually obvious, redesign the page.

---

# 10. Cognitive Load

Do not overwhelm users.

Use:

- One primary CTA
- One secondary CTA
- Supporting actions only when necessary

Do not give five buttons equal visual importance.

Use progressive disclosure when appropriate.

---

# 11. Progressive Disclosure

Show users only the information they need at the current stage.

Use:

- Tabs
- Accordions
- Modals
- Tooltips
- Drawers
- Expandable sections
- Detail views

Avoid showing every piece of information at once.

---

# 12. Navigation

Navigation must be predictable.

Users should always understand:

- Current location
- Available destinations
- Previous context
- Next possible action

Use clear Spanish labels.

Example:

```text
Inicio
Ofertas
Membresía
Mi Red
Mis Puntos
Perfil
```

Avoid clever or ambiguous navigation labels.

---

# 13. Centralized Theme

Create one centralized theme/color system.

Do not scatter hardcoded colors throughout the application.

Use centralized values for:

- Primary color
- Secondary color
- Accent
- Background
- Surface
- Text
- Muted text
- Border
- Success
- Warning
- Error
- Hover
- Focus

---

# 14. Recommended Color Direction

Use a sophisticated travel-inspired palette.

Suggested colors:

- Deep Midnight Navy
- Ocean / Teal Blue
- Warm Gold
- Soft Sand / Cream
- White
- Slate Gray
- Success Green
- Error Red

Exact shades can be selected professionally.

The palette must remain cohesive.

---

# 15. Typography

Use a modern premium typography system.

Requirements:

- Strong headings
- Excellent readability
- Clear hierarchy
- Proper line height
- Responsive font sizes
- Appropriate spacing

Do not make every heading oversized.

---

# 16. Spacing System

Use a consistent spacing system.

Avoid random:

```text
mt-3
mt-7
mt-11
mt-14
```

without design reasoning.

Spacing should follow a predictable rhythm.

---

# 17. Border Radius

Use a consistent radius system.

Define reusable values for:

- Small components
- Cards
- Inputs
- Buttons
- Modals
- Large containers

Do not randomly change border radius between sections.

---

# 18. Shadows

Use subtle shadows.

Avoid:

- Huge shadows
- Excessive glow
- Multiple competing shadows

Elevation should communicate hierarchy.

---

# 19. Animation System

Animations should be smooth and professional.

Use:

- Fade in
- Slide up
- Staggered reveal
- Hover elevation
- Image zoom
- Button transitions
- Modal transitions
- Accordion transitions
- Dropdown transitions
- Counter animations
- Mobile menu animations
- Page transitions where appropriate

Do not over-animate.

Animation should improve usability rather than distract.

---

# 20. Reusable UI Components

Create reusable components.

Suggested structure:

```text
components/
├── ui/
├── layout/
├── common/
├── landing/
├── offers/
├── membership/
├── referral/
├── points/
├── auth/
└── dashboard/
```

Reusable components should include:

- Button
- Input
- Select
- Checkbox
- Radio
- Modal
- Dialog
- Accordion
- Dropdown
- Tabs
- Badge
- Card
- Tooltip
- Toast
- Spinner
- Skeleton
- Pagination
- Avatar
- Breadcrumb
- Empty State
- Confirmation Dialog
- Mobile Navigation
- Section Heading
- Form components
- Table components
- List components

---

# 21. Component Consistency

Once a component is created, reuse it.

For example:

If the primary button uses a specific style:

```text
Primary Button
```

the same style should be used across:

- Landing
- Offers
- Auth
- Dashboard
- Points
- Profile

Do not recreate slightly different versions.

---

# 22. Landing Page

Create a premium landing page.

Sections:

1. Header
2. Hero
3. How It Works
4. Membership
5. Travel Offers
6. Referral Explanation
7. Points Explanation
8. About/Trust section
9. FAQ
10. CTA
11. Footer

---

# 23. Header

Include:

- Logo
- Inicio
- Ofertas
- Cómo funciona
- Membresía
- Nosotros
- FAQ
- Iniciar sesión
- Únete ahora

Desktop:

- Premium navigation
- Sticky/scroll behavior
- Clear active states

Mobile:

- Hamburger
- Animated menu drawer
- Large touch targets
- Clear CTA

---

# 24. Hero

Main message:

> Viaja. Comparte. Gana.

Supporting message should explain:

- Travel opportunities
- Membership
- Referral network
- Points

Primary CTA:

> Únete Ahora

Secondary CTA:

> Ver Ofertas

Use premium travel imagery.

Possible floating information:

```text
100% Nivel 1
50% Nivel 2
4 Niveles de Membresía
Ofertas de Viaje
```

These must represent the actual platform mechanics and should not be presented as guaranteed financial returns.

---

# 25. How It Works

Create 3–4 steps.

Example:

### 01 — Regístrate Gratis

Create an account.

### 02 — Descubre Ofertas

Explore available travel opportunities.

### 03 — Construye Tu Red

Invite people.

### 04 — Gana Puntos

Eligible members receive referral points.

---

# 26. Membership System

There are four membership levels.

## Member

- Free registration
- Access to offers
- No referral benefits

## Active Member

- Activated through required points
- First-level referral access
- 100% of first-level points

## Ambassador

- Manually assigned
- First-level benefits
- Second-level benefits
- 100% first level
- 50% second level

## Elite Ambassador

- Ambassador benefits
- Premium level
- Internal discount benefit

The internal discount does not need to be publicly displayed.

---

# 27. Membership UI

Create:

- Membership cards
- Badges
- Comparison section
- Current membership indicator
- Upgrade/status messaging where applicable

Keep the visual hierarchy clear.

---

# 28. Travel Offers

Create premium offer cards.

Each card should contain:

- Image
- Destination
- Title
- Description
- Price
- Points
- CTA

Example:

```text
Viaje a París

$3,000

100 puntos

Ver Oferta
```

Demo destinations:

- Punta Cana
- Santo Domingo
- Puerto Plata
- Cancún
- Madrid
- París
- Cartagena
- Nueva York

---

# 29. Offer Details

Include:

- Image gallery
- Destination
- Title
- Description
- Price
- Points
- Duration
- Highlights
- What's included
- What's not included
- CTA
- Related offers

Do not implement online purchase.

---

# 30. Referral System

The referral system supports more than two levels conceptually.

However, members only benefit from levels permitted by their membership.

Example:

```text
A
│
B
│
C
│
D
│
E
```

A network may continue beyond two levels.

The member's visible/beneficial levels depend on membership.

---

# 31. Referral Rules

## Active Member

Receives:

```text
Level 1 = 100%
```

## Ambassador

Receives:

```text
Level 1 = 100%
Level 2 = 50%
```

## Elite Ambassador

Receives:

```text
Level 1 = 100%
Level 2 = 50%
```

Members do not receive referral benefits from levels outside their permitted visibility/benefit scope.

---

# 32. Important Points Rule

A member's purchase points are NOT their own redeemable referral earnings.

The purchase happens offline.

The administrator assigns purchase points manually.

Assigned purchase points:

- Help determine/maintain Active Member status
- Generate eligible upline referral points
- Are not treated as the purchaser's own referral earnings

The frontend must not accidentally represent purchase points as personal referral earnings.

---

# 33. Points Example

Example:

```text
Person A
   ↓
Person B
   ↓
Person C
```

If Person C generates:

```text
150 points
```

Then:

```text
Person B = +150 points
Person A = +75 points
```

if Person A is Ambassador or Elite Ambassador.

Person C does not receive referral earnings from their own purchase.

---

# 34. Points Page

Show:

- Available points
- Total earned
- Total redeemed
- Level 1 points
- Level 2 points
- Transaction history

Example:

```text
Referral from Carlos
+150 puntos
Nivel 1
```

```text
Referral from Maria
+75 puntos
Nivel 2
```

---

# 35. Dashboard

Create a personalized member dashboard.

Show:

- Welcome message
- Membership badge
- Current membership
- Available points
- Total earned
- Redeemed points
- Referral statistics
- Network preview
- Recent point activity
- Available offers

---

# 36. Member Dashboard

Normal Member should see:

- Member status
- Offers
- Profile
- Basic account information

Do not expose referral earnings/downline features unnecessarily.

---

# 37. Active Member Dashboard

Show:

- Active Member badge
- Available referral points
- Level 1 network
- Level 1 points
- Recent activity
- Offers

Only Level 1 should be displayed.

---

# 38. Ambassador Dashboard

Show:

- Ambassador badge
- Available points
- Total earned
- Redeemed
- Level 1 earnings
- Level 2 earnings
- Network
- Recent transactions
- Offers

Display:

```text
Level 1
Level 2
```

Do not show Level 3+.

---

# 39. Elite Ambassador Dashboard

Same referral functionality as Ambassador.

Display:

```text
Elite Ambassador
```

Internal discount functionality does not need to be exposed unless required.

---

# 40. My Network

Create:

```text
Mi Red
```

Page.

Show:

### Level 1

Direct referrals.

### Level 2

Referrals of Level 1 members.

Include:

- Member name
- Membership badge
- Points generated
- Referral information
- Profile/detail action

Use a clear network visualization or hierarchical cards.

---

# 41. Network UX

The network visualization must remain understandable.

Desktop can use:

- Tree
- Node diagram
- Hierarchical cards

Mobile can use:

- Nested cards
- Expand/collapse
- Horizontal scroll only when necessary

Do not sacrifice usability for visual complexity.

---

# 42. Profile

Create:

```text
Mi Perfil
```

Include:

- Profile image
- Name
- Email
- Membership
- Referral information
- Account details
- Password/security
- Settings

Use tabs or sections where appropriate.

---

# 43. Redemption

Create:

```text
Redimir puntos
```

Show:

- Available points
- Redeemable points
- Redemption history
- Redemption CTA
- Confirmation modal

Do not assume a final redemption process that has not been specified.

Keep the UI flexible.

---

# 44. Authentication

Create:

## Login

- Email
- Password
- Remember me
- Forgot password
- Login
- Register link

## Registration

- Full name
- Email
- Password
- Confirm password
- Referral code
- Terms
- Create account

## Forgot Password

- Email
- Submit
- Success state

## Reset Password

- New password
- Confirm password
- Reset

## Email Verification

Create a polished verification screen.

---

# 45. Authentication UX

Forms must include:

- Clear labels
- Helpful placeholders
- Inline validation
- Password visibility
- Proper input types
- Required indicators
- Loading states
- Success states
- Error states

Do not make users guess what information is required.

---

# 46. Spanish Language

All visible UI must be in Spanish.

Use natural Spanish suitable for a Dominican Republic travel agency.

Do not leave English labels such as:

```text
Login
Sign Up
Dashboard
Settings
My Points
My Network
```

Use:

```text
Iniciar sesión
Registrarse
Panel
Configuración
Mis puntos
Mi red
```

---

# 47. Spanish Microcopy

Avoid robotic translations.

Use natural wording.

Examples:

```text
Continuar
Procesando...
Guardar cambios
Ver oferta
Ver detalles
Redimir puntos
Invitar
Reintentar
```

---

# 48. About Page

Include:

- Company introduction
- Mission
- Vision
- Why choose us
- Travel/community concept
- Referral explanation
- Premium imagery
- CTA

Do not invent real company claims.

---

# 49. FAQ

Create reusable accordion FAQ.

Questions:

- ¿Cómo puedo registrarme?
- ¿Es gratis registrarse?
- ¿Qué es un Active Member?
- ¿Cómo funcionan los puntos?
- ¿Qué es un Ambassador?
- ¿Qué es un Elite Ambassador?
- ¿Cómo funciona mi red?
- ¿Cuántos niveles puedo ver?
- ¿Cómo se obtienen los puntos?
- ¿Las compras se realizan online?
- ¿Cómo puedo redimir mis puntos?

---

# 50. Footer

Include:

- Logo
- Company description
- Navigation
- Offers
- About
- FAQ
- Contact
- Login
- Register
- Social placeholders
- Legal links

---

# 51. Loading States

Every data-driven area must have a loading state.

Use:

- Skeletons
- Spinners
- Button loading states
- Content placeholders

Do not leave blank screens while data is loading.

---

# 52. Empty States

Every empty data state must have:

1. Clear explanation
2. Helpful context
3. Relevant next action

Example:

```text
Aún no tienes actividad de referidos.

Invita a una persona para comenzar a construir tu red.

[Invitar]
```

---

# 53. Error States

Never expose technical errors.

Bad:

```text
500 Internal Server Error
P2002
undefined
Network Error
```

Good:

```text
No pudimos cargar esta información.

Intenta nuevamente en unos momentos.

[Reintentar]
```

---

# 54. Success States

Use clear confirmation.

Examples:

```text
Cuenta creada correctamente.
```

```text
Cambios guardados.
```

```text
Solicitud enviada correctamente.
```

---

# 55. Button States

Every interactive button should support:

- Default
- Hover
- Active
- Focus
- Loading
- Disabled
- Success where applicable

---

# 56. Responsive Design

Support:

- Large desktop
- Desktop
- Tablet
- Mobile
- Small mobile

Do not simply shrink desktop layouts.

Mobile must be intentionally designed.

---

# 57. Mobile UX

Mobile navigation:

```text
Top bar
   ↓
Navigation drawer
```

Dashboard:

```text
Stacked cards
Compact navigation
Clear primary actions
```

Offer cards:

```text
Image
Title
Price
Points
CTA
```

Network:

```text
Expandable hierarchy
```

Touch targets must be comfortable.

---

# 58. Accessibility

Use:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Sufficient contrast
- Accessible dialogs
- Accessible dropdowns
- Correct button semantics
- Form error association
- Screen reader labels

Accessibility must not be treated as an afterthought.

---

# 59. Realistic Demo Data

Use realistic Spanish demo data.

Do not use:

```text
Lorem ipsum
John Doe
Test User
Example Product
```

Use realistic travel destinations:

```text
Punta Cana
Santo Domingo
Puerto Plata
Cancún
Madrid
París
Cartagena
Nueva York
```

Do not invent:

- Fake company statistics
- Fake reviews
- Fake awards
- Fake certifications
- Fake customer claims

---

# 60. Data Architecture

Do not hardcode repeated data inside JSX.

Use appropriate data/config files.

Example:

```text
data/
├── offers.js
├── memberships.js
├── faqs.js
├── navigation.js
└── demo-users.js
```

This makes backend/API integration easier later.

---

# 61. Backend-Ready Frontend

The frontend must be designed so APIs can be integrated later without rebuilding the UI.

Components should receive data through props.

Avoid tightly coupling UI components to mock data.

Bad:

```jsx
<Card>
  <h2>Paris</h2>
</Card>
```

Better:

```jsx
<OfferCard offer={offer} />
```

The same component should work with:

```text
Mock API data
```

and later:

```text
Real backend data
```

---

# 62. UX Flow

## Public User

```text
Landing
   ↓
Discover platform
   ↓
View offers
   ↓
View offer details
   ↓
Understand membership
   ↓
Register
```

## New Member

```text
Register
   ↓
Verify email
   ↓
Member dashboard
   ↓
Explore offers
   ↓
Build network
```

## Active Member

```text
Dashboard
   ↓
Level 1 network
   ↓
Points
   ↓
Redeem
```

## Ambassador

```text
Dashboard
   ↓
Level 1
   ↓
Level 2
   ↓
Points
   ↓
Redeem
```

---

# 63. Visual Hierarchy Example

Offer page:

### Highest priority

```text
Destination
Offer title
Price
Primary CTA
```

### Secondary

```text
Duration
Points
What's included
```

### Supporting

```text
Additional information
Terms
Related offers
```

Do not give every piece of information equal visual weight.

---

# 64. Information Density

The interface should be easy to scan.

Users should understand a page within seconds.

Avoid:

- Huge paragraphs
- Dense tables
- Unnecessary statistics
- Repetitive cards
- Excessive visual decoration

Use whitespace intentionally.

---

# 65. Real Product Feel

The website must feel interactive.

Implement:

- Hover states
- Focus states
- Loading states
- Empty states
- Error states
- Success states
- Disabled states
- Smooth transitions
- Modal transitions
- Navigation transitions
- Form feedback

Do not build static screenshots disguised as a website.

---

# 66. Senior Designer Review

Before finishing the project, review the entire application.

## Visual Quality

Check:

- Premium appearance
- Unique identity
- Typography
- Spacing
- Colors
- Hierarchy
- Image quality

## UX

Check:

- Can a new user understand the platform?
- Is the next action obvious?
- Is navigation predictable?
- Are labels clear?
- Is cognitive load low?

## Consistency

Check:

- Buttons
- Cards
- Inputs
- Badges
- Modals
- Colors
- Typography
- Spacing
- Animations

## Responsive

Check:

- Desktop
- Tablet
- Mobile
- Small mobile

## States

Check:

- Loading
- Empty
- Error
- Success
- Disabled
- Hover
- Focus

---

# 67. Definition of Done

The frontend is complete only when:

- The entire public website is implemented
- Authentication screens are implemented
- Member dashboard is implemented
- Membership logic is represented correctly
- Referral logic is represented correctly
- Points logic is represented correctly
- Redemption UI exists
- Admin UI is excluded
- All UI is Spanish
- Responsive behavior works
- Reusable components are used
- Theme is centralized
- Mock data is separated from JSX
- Loading states exist
- Empty states exist
- Error states exist
- Success states exist
- Accessibility is considered
- Animations are polished
- Navigation is intuitive
- Primary actions are obvious
- UI Pro Max/design guidance has been considered
- The website does not look AI-generated
- The website feels like a real production product

---

# 68. Final Product Standard

Do not optimize for:

> "Generate as many UI sections as possible."

Optimize for:

> "Build the clearest, most intuitive and professionally designed travel platform possible."

The final experience should make a first-time user immediately understand:

```text
What is this?
        ↓
What can I do?
        ↓
What should I do next?
        ↓
What happens after I do it?
```

The website should feel natural enough that the user does not need a tutorial for basic navigation.

The final result should look like a product designed by a senior product designer and implemented by a senior frontend engineer.

It must not look like an AI-generated website.
