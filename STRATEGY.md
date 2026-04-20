# DOSC Mobile App — Expert Architecture & Delivery Strategy
## Built for Adamas Tech Consulting | Version 1.0 | April 2026

---

## 1. WHAT THIS DOCUMENT IS

This is a **sharp, expert-level** architecture and build strategy for the DOSC Member Mobile App — the consumer-facing iOS & Android layer of the broader ERP transformation. Not generic. Not theoretical. Every recommendation is grounded in the DOSC RFI scope and Adamas's proposed solution.

**The app this document governs:**
- A native-quality PWA (Phase 1 / MVP) delivered in 8 weeks
- Native iOS (Swift/SwiftUI) + Android (Kotlin/Compose) for App Store submission (Phase 2)
- Deeply integrated with SAP B1 or Oracle NetSuite as the ERP backend

---

## 2. THE NON-NEGOTIABLES FOR 2026

Before any architecture decision, these are the baseline expectations a DOSC member will have:

| Expectation | What It Means for You |
|---|---|
| Sub-1s load | First meaningful paint < 1s on 4G. No splash screen excuses. |
| Offline-first QR | The member card MUST work with zero internet (cryptographic offline validation) |
| Biometric auth | Face ID / Touch ID on first login. No password re-entry. |
| Real-time sync | Balance updates, booking confirmations — no polling. WebSockets or SSE. |
| Dark-by-default | The app lives at the marina at night. Dark UI is functional, not aesthetic. |
| Zero-friction POS | QR scan at F&B counter should take < 2 seconds end to end |

---

## 3. TECHNOLOGY STACK DECISION

### Phase 1: PWA (Weeks 1–8, ship fast)

**Why PWA first:** DOSC has 2,000+ members. You need adoption before you spend on native app store review cycles. A high-quality PWA installed on the home screen is indistinguishable from native for 90% of use cases.

```
Frontend:   React 19 + TypeScript
Styling:    Tailwind CSS 4 (utility-first, no runtime cost)
Animation:  Framer Motion 11
State:      Zustand + React Query (TanStack Query v5)
Offline:    Workbox 7 (service workers)
QR:         qr-code-generator (offline capable, no external deps)
Push:       Web Push API + VAPID
Build:      Vite 6 (< 500ms HMR)
Deploy:     Vercel Edge Network (UAE CDN nodes) OR AWS CloudFront + S3 (UAE region)
```

### Phase 2: Native (Months 3–5, post-UAT)

**Do NOT use React Native or Flutter.** Here is why this matters in 2026:

- DOSC's QR gate access requires **cryptographic key storage in the secure enclave** — only available natively
- NFC marina key integration (future) requires native APIs
- Biometric auth with ERP token refresh needs native Keychain (iOS) / Keystore (Android)
- The performance ceiling of RN/Flutter for smooth sailing event animations is lower

**The right stack:**

```
iOS:        SwiftUI + Swift Concurrency (async/await)
            SwiftData for local persistence
            CryptoKit for QR signing/verification
            PassKit for digital membership card in Apple Wallet
            
Android:    Kotlin + Jetpack Compose
            Room database for local persistence
            Android Keystore for secure credential storage
            Google Wallet API for digital membership card
            
Shared:     OpenAPI 3.1 generated client (no handwritten API code)
            GraphQL (Apollo) for real-time subscriptions
            Protocol Buffers for offline sync payloads
```

---

## 4. BACKEND INTEGRATION ARCHITECTURE

This is the most critical architectural decision. The app must NOT talk directly to SAP B1 / NetSuite APIs.

### The Integration Layer (BFF — Backend for Frontend)

```
[DOSC Mobile App]
       ↕ HTTPS / WSS
[API Gateway — AWS API GW or Kong]
       ↕
[BFF Service — Node.js 22 + Fastify]
       ↕ — splits into:
       ├── [SAP B1 / NetSuite Adapter]    → Finance, AR/AP, Inventory
       ├── [DOSC Operational DB]           → Bookings, Events, Sailing
       ├── [Gulf HR API]                   → Payroll, Attendance (staff-only)
       ├── [POS Integration Service]       → LightSpeed / Custom POS
       ├── [Loyalty Engine]               → Points, Tiers, Campaigns
       └── [Gate Access Service]           → QR validation, Access logs
```

**Why this pattern:**
1. ERP APIs (SAP B1 OData, NetSuite REST) are not mobile-optimized — they return 50 fields when you need 5
2. BFF aggregates multiple ERP calls into one mobile API response
3. If you switch from SAP B1 to NetSuite (or vice versa), the mobile app never changes
4. You can cache aggressively at the BFF layer (member profile: 30-min TTL; balance: 5-min TTL; QR status: real-time WebSocket push)

### API Design Rules

```
Base URL:    https://api.dosc.ae/mobile/v1/
Auth:        OAuth 2.0 + PKCE (no password in request body ever)
Token:       JWT (15-min access) + Refresh (30-day, stored in Keychain/Keystore)
Format:      JSON:API spec for consistency
Real-time:   WebSocket channel: wss://ws.dosc.ae/member/{id}
```

**Critical endpoints for MVP:**
```
GET  /member/me                    → Profile + membership status
GET  /member/me/qr                 → Signed QR payload (15-min TTL)
GET  /member/me/balance            → Dues summary
GET  /member/me/invoices           → Invoice list with status
GET  /member/me/bookings           → Upcoming + past bookings
POST /bookings                     → Create booking
GET  /events?upcoming=true         → Event catalogue
GET  /loyalty/balance              → Points + tier
GET  /loyalty/transactions         → Earn/burn history
POST /loyalty/redeem               → Redemption request
WS   /notifications                → Real-time push channel
```

---

## 5. THE QR SYSTEM — MOST CRITICAL FEATURE

The QR card is the single most important feature. It must work at the gate at 6 AM with no internet.

### How to Build It Correctly

**Step 1 — Server generates a signed payload:**
```json
{
  "memberId": "DOSC-2847",
  "status": "ACTIVE",
  "tier": "GOLD",
  "issuedAt": 1714000000,
  "expiresAt": 1714003600,
  "nonce": "a9f3b2...",
  "signature": "ES256:<base64url>"
}
```
Signed using **ES256 (ECDSA P-256)** — fast to verify on any device.

**Step 2 — App stores payload in Keychain/Keystore:**
- Refreshes silently every 45 seconds when online
- Falls back to cached payload when offline
- Gate scanner validates locally without internet using DOSC's public key

**Step 3 — Gate scanner validation (< 200ms):**
```
1. Decode QR payload
2. Check signature against DOSC public key (embedded in scanner firmware)
3. Check nonce not already used (local cache, 24h)
4. Check expiry timestamp
5. Check member status field
6. Grant/deny access + log event
```

**Step 4 — Anti-fraud:**
- Screen brightness auto-max when QR is displayed
- QR regenerates every 45 seconds (timestamp embedded)
- Screenshot detection triggers QR invalidation (iOS/Android API)
- Used nonces stored in Redis with 24h TTL at gate devices

---

## 6. OFFLINE STRATEGY

DOSC's environment has spotty marina connectivity. Every screen that matters must work offline.

| Feature | Offline Behaviour | Sync Strategy |
|---|---|---|
| QR Card | Full offline (cryptographic) | WebSocket push when online |
| Member Profile | Show cached, badge "Last synced Xm ago" | On foreground resume |
| Bookings | Show cached list, grey out actions | Background sync every 5min |
| Balance | Show last-known, show warning banner | On foreground resume |
| Events | Cached 4h | Background refresh |
| Loyalty Points | Show cached, no redeem offline | Block offline redemption |
| Notifications | Cached in app | Real-time WebSocket |

**Implementation:** Workbox + IndexedDB (PWA) / Core Data + NSUserDefaults (iOS) / Room + DataStore (Android)

---

## 7. SCREEN ARCHITECTURE (All 14 Screens)

### Group 1: Auth Flow
1. **Splash** — Logo, version check, deep link handling
2. **Login** — Email/biometric, MFA (OTP for first login), forgot password
3. **Onboarding** — 3-screen walkthrough for new members only

### Group 2: Core Member Screens (Bottom Nav)
4. **Home/Dashboard** — Personalised greeting, QR card preview, dues banner, quick actions, events carousel, recent activity
5. **QR Card** — Full-screen digital member card, brightness boost, countdown refresh, Apple/Google Wallet add button
6. **Bookings** — Tab: Upcoming | Past | Waitlist. Category filter. Booking cards with status. Book new flow.
7. **Finances** — Outstanding balance hero, pay CTA, invoice list, downloadable statements
8. **Profile** — Member details, membership info, boats, certifications, preferences, sign out

### Group 3: Deep-Linked Screens (Push via nav)
9. **Event Detail** — Full event info, capacity, eligibility check, book CTA, share
10. **Booking Confirmation** — Success state, booking ref, add to calendar, QR for event
11. **Invoice Detail** — Invoice breakdown, VAT summary, payment options, download PDF
12. **Loyalty Hub** — Points balance, tier progress, earn/burn history, redeem flow, offers
13. **Notifications** — Grouped by date, mark read, deep link to relevant screen
14. **Settings** — Push notifications, biometrics, language (EN/AR), data & privacy

---

## 8. UI/UX DESIGN SYSTEM

### Design Philosophy: "Luxury Maritime"

DOSC is a private club. The app must feel like it. Not a SaaS dashboard. Not a racing game. A refined, premium experience — closer to a private banking app than a booking widget.

**Color System:**
```css
--navy:       #0A1628  /* Primary background — deep night sea */
--navy-mid:   #0F2040  /* Cards, surfaces */
--gold:       #C9973A  /* DOSC's accent — anchor brass */
--teal:       #1B7A7A  /* Secondary actions — sea glass */
--white:      #FFFFFF
--off-white:  #F4F1EB  /* Warm paper white for light mode (Phase 2) */
```

**Typography:**
```
Display/Headings: Cormorant Garamond (serif) — old-money authority
Body/UI:          DM Sans — clean, neutral, technical
Monospace:        JetBrains Mono — member IDs, ref numbers
```

**Spacing scale:** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px (4px grid)

**Motion principles:**
- Entry: fade + translateY(16px), 300ms ease-out
- Transitions: 300ms cubic-bezier(0.22,1,0.36,1) (iOS spring feel)
- QR refresh: 2s pulse, no hard flash
- Skeleton loading: not spinners — skeleton shimmer only
- Haptics (native): light on selection, medium on confirmation, error on failure

**Component standards:**
- Cards: 1px border rgba(255,255,255,0.08), border-radius 20px, no drop shadows
- Buttons: Primary = gold bg + navy text. Secondary = outline. Destructive = red outline only.
- Form inputs: dark surface, 1px gold border on focus, no floating labels (bad UX)
- Status badges: semantic color, never just color — always include text label

---

## 9. PUSH NOTIFICATIONS STRATEGY

Notifications are where most apps fail. Here is what DOSC's should send and how:

| Trigger | Message | Deep Link | Timing |
|---|---|---|---|
| Booking confirmed | "⛵ Your Keelboat L2 booking is confirmed for Fri 3 May." | /bookings/BK-8754 | Immediate |
| Payment due (7 days) | "Annual membership of AED 2,400 due in 7 days." | /finances | D-7 |
| Payment due (1 day) | "⚠️ Membership payment due tomorrow. Tap to pay." | /finances | D-1 |
| Event reminder | "IRC Championship starts in 2h. Race briefing at Dock C." | /events/123 | 2h before |
| Points earned | "You earned 150 points from today's lesson. Balance: 3,842." | /loyalty | Post-activity |
| Tier upgrade | "🏆 Congratulations — you've reached Platinum status!" | /loyalty | Immediate |
| Waitlist cleared | "Good news! A spot opened for Advanced Racing Tactics." | /bookings | Immediate |
| Guest fee charged | "Guest fee of AED 45 charged to your account for 2 guests." | /finances | Immediate |

**Technical implementation:**
- PWA: Web Push API + VAPID keys (works on Android; iOS 16.4+ on home-screen PWA)
- Native: APNs (iOS) + FCM (Android), unified through Firebase Cloud Messaging
- Personalisation: All notifications personalised with member name, specific amounts, booking refs
- Quiet hours: No pushes between 23:00–07:00 (respects user timezone)
- Frequency cap: Max 3 marketing notifications per week, unlimited transactional

---

## 10. DELIVERY PLAN — PHASED

### Phase 1: PWA MVP (Weeks 1–8)

**Week 1–2: Foundation**
- Set up Vite + React + TypeScript monorepo
- Design system: Tailwind config, typography, color tokens
- Auth flow: OAuth PKCE, JWT management, biometric (WebAuthn)
- BFF scaffolding: Fastify + OpenAPI spec
- Mock data layer for all screens

**Week 3–4: Core Screens**
- Home dashboard with all data sections
- QR card with offline crypto validation
- Finances: balance hero, invoice list
- Bottom navigation with screen transitions

**Week 5–6: Bookings + Loyalty**
- Bookings: list, filter, detail, booking flow
- Event catalogue and detail screens
- Loyalty hub, earn/burn, redemption flow
- Push notification integration

**Week 7–8: Integration + Polish**
- Connect BFF to SAP B1 / NetSuite sandbox
- QR validation end-to-end test with gate simulator
- PWA manifest, service worker, installability
- Performance audit (Lighthouse score > 95)
- UAT with DOSC stakeholders
- Staging deployment to UAE CDN

**Deliverables:**
- Installable PWA on iOS (Safari "Add to Home Screen") and Android (Chrome install prompt)
- Full QR offline capability
- All 14 screens functional with real or realistic mock data
- Push notifications working
- Lighthouse PWA score ≥ 95

### Phase 2: Native Apps (Months 3–5)

**Month 3:** iOS SwiftUI build (identical UX, native APIs: Keychain, Face ID, Apple Wallet)
**Month 4:** Android Kotlin/Compose build (Keystore, biometrics, Google Wallet)
**Month 5:** App Store + Play Store submission, review management, staged rollout to members

**App Store requirements to prepare early:**
- Privacy policy URL (required for both stores)
- App review account credentials (DOSC test account for reviewer)
- iOS: 6 screenshots per device size (iPhone 15 Pro, iPad if applicable)
- Android: Feature graphic 1024×500, phone screenshots
- App description (highlight: member card, bookings, loyalty)
- Keywords: sailing club, DOSC, membership, UAE, marina

---

## 11. SECURITY REQUIREMENTS (Non-Negotiable)

| Requirement | Implementation |
|---|---|
| No sensitive data in logs | Redact token, member ID from all log statements |
| Certificate pinning | Pin DOSC API certificate (prevent MITM) |
| Jailbreak/root detection | Block app on compromised devices |
| Biometric re-auth | Require biometric re-auth after 15min background |
| Secure storage | Keychain (iOS) / Keystore (Android) for all tokens |
| QR anti-screenshot | Blank QR when screenshot detected (iOS: UIScreen.isCaptured) |
| API rate limiting | 100 req/min per authenticated user at API Gateway |
| Input validation | Whitelist validation on all form inputs, server-side |
| GDPR / UAE DPL | Data minimization, consent management, right to delete |

---

## 12. WHAT THE PROMPT FOR ANTIGRAVITY SHOULD CONTAIN

When handing this to Antigravity (or your development team) for the full build, give them this as a requirements specification:

---

### ANTIGRAVITY BUILD BRIEF: DOSC Member App

**Project:** Dubai Offshore Sailing Club — Member Mobile Application  
**Client:** DOSC via Adamas Tech Consulting  
**Timeline:** 8 weeks to PWA MVP, 5 additional months for native  
**Platforms:** iOS 16+, Android 11+, Web PWA  

**Stack (mandatory, do not deviate):**
- Frontend: React 19, TypeScript 5, Tailwind CSS 4, Framer Motion
- State: Zustand + TanStack Query v5
- Offline: Workbox 7
- Build: Vite 6
- Backend: Node.js 22 + Fastify (BFF layer only — no direct ERP calls from app)
- Native Phase 2: SwiftUI (iOS), Jetpack Compose (Android)

**Design System:**
- Color: Navy #0A1628, Gold #C9973A, Teal #1B7A7A
- Fonts: Cormorant Garamond (headings), DM Sans (body)
- Motion: 300ms ease-out entries, iOS-spring transitions
- No shadows. No gradients on backgrounds. Clean dark surfaces only.

**The 5 things that must be perfect (everything else can be iterated):**
1. QR card offline validation — cryptographic, 45s refresh, full-screen, brightness boost
2. Home dashboard — personalised, loads in < 800ms, all data meaningful
3. Biometric auth — Face ID/Touch ID from second login, no password re-entry
4. Real-time balance + notification sync — WebSocket, no polling
5. Booking confirmation flow — < 3 taps from event to confirmed booking

**ERP Integration handshake:**
- All SAP B1 / NetSuite calls via BFF only
- BFF must expose OpenAPI 3.1 spec (generate from code, not docs)
- Member financial data: read-only on app (no payment processing in MVP)
- Loyalty redemption: authorisation token to POS, settlement in ERP

**Definition of Done for PWA MVP:**
- Lighthouse PWA score ≥ 95 (all categories)
- Offline QR works after 60 seconds of flight mode
- First contentful paint < 1.2s on 4G
- Zero console errors in production
- WCAG 2.1 AA compliance
- Security: OWASP Mobile Top 10 addressed
- All 14 screens implemented
- 5 real DOSC staff complete UAT with zero critical bugs
- Installable on iOS Safari + Android Chrome

---

## 13. RISKS AND MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| SAP B1 API rate limits blocking real-time sync | High | High | BFF caching layer with Redis; WebSocket push instead of polling |
| iOS PWA push notification limitations | Medium | Medium | Native app Phase 2 solves fully; interim: in-app notification inbox |
| QR offline window insufficient (45s) | Low | High | Extend to 15-min window with nonce replay protection |
| ERP data latency > 3min (per NFR) | Medium | High | Optimistic UI updates + background reconciliation |
| App Store rejection (privacy/data) | Low | Medium | Apple review account ready; privacy manifest prepared in advance |
| DOSC member adoption < 60% | Medium | High | Launch with incentive (500 bonus loyalty points for first QR scan) |

---

## 14. SUCCESS METRICS (Month 1 Post-Launch)

| Metric | Target |
|---|---|
| PWA install rate | > 70% of active members |
| Daily active usage | > 40% of installed base |
| QR gate scan success rate | > 99.5% |
| Booking via app (vs email/phone) | > 50% of all bookings |
| Push notification open rate | > 35% |
| App crash rate | < 0.1% |
| Member NPS (app-specific) | > 65 |
| ERP integration posting success | > 99.5% (per DOSC SLA) |

---

*Prepared by: Expert AI Architecture Review*  
*Based on: DOSC RFI + Adamas Tech Consulting RFI Response V1.1*  
*For use by: Adamas Tech Consulting in DOSC RFP submission*
