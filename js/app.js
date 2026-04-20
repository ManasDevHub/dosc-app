'use strict';

// ── DATA ──
const MEMBER = {
  name: 'James Hartwell', initials: 'JH',
  id: 'DOSC-2847', type: 'Full Sailing Member',
  tier: 'Gold', memberSince: 'March 2019',
  points: 3842, nextTier: 5000, 
  dues: { membership: 2400, sailing: 850, fnb: 0, total: 3250 },
  stats: { visits: 47, bookings: 12, points: 3842 }
};
const EVENTS = [
  { icon: '⛵', type: 'regatta', name: 'Dubai IRC Championship', date: 'Apr 26–27', slots: '8 berths left' },
  { icon: '🎓', type: 'lesson', name: 'Keelboat Level 2', date: 'May 3, 9:00 AM', slots: '4 spots left' },
  { icon: '🥂', type: 'social', name: 'Sundowner at Terrace', date: 'May 10, 6:30 PM', slots: 'Open' }
];
const ACTIVITIES = [
  { icon: '⛵', type: 'sailing', title: 'Keelboat Lesson — Level 1', time: 'Today, 09:30', amount: null },
  { icon: '🍽️', type: 'fb', title: 'Club Restaurant — Lunch', time: 'Yesterday', amount: -128, currency: 'AED' },
  { icon: '📄', type: 'finance', title: 'Annual Membership Due', time: '15 Apr', amount: 2400, due: true },
  { icon: '🏆', type: 'event', title: 'Gulf Regatta Reg. Confirmed', time: '12 Apr', amount: null }
];
const INVOICES = [
  { icon: '⚓', cat: '#EEF2FF', title: 'Annual Membership 2025', date: '01 Jan 2025', amount: 'AED 2,400', status: 'due' },
  { icon: '⛵', cat: '#E0F2FE', title: 'Sailing Programme Q2', date: '01 Apr 2025', amount: 'AED 850', status: 'partial' },
  { icon: '🍽️', cat: '#FEF3C7', title: 'F&B Account — March', date: '31 Mar 2025', amount: 'AED 364', status: 'paid' },
  { icon: '🚤', cat: '#D1FAE5', title: 'Berth Rental — Berth 14', date: '01 Mar 2025', amount: 'AED 1,200', status: 'paid' },
  { icon: '📋', cat: '#FEE2E2', title: 'Guest Fees — April', date: '20 Apr 2025', amount: 'AED 90', status: 'due' }
];
const BOOKINGS = [
  { title: 'IRC Offshore Championship', type: 'Regatta', date: 'Sat 26 Apr – Sun 27 Apr', time: '07:00 – 18:00', instructor: 'Race Officer: Cmdr. Al Maktoum', status: 'confirmed', ref: 'BK-8821' },
  { title: 'Keelboat Level 2 — Session 3', type: 'Sailing Lesson', date: 'Fri 3 May', time: '09:00 – 12:00', instructor: 'Instructor: Sarah Mitchell', status: 'confirmed', ref: 'BK-8754' },
  { title: 'Advanced Racing Tactics', type: 'Course', date: 'Wed 7 May', time: '17:00 – 20:00', instructor: 'Instructor: TBC', status: 'pending', ref: 'BK-8901' },
  { title: 'Dinghy Racing Club', type: 'Club Race', date: 'Sat 10 May', time: '14:00 – 17:00', instructor: 'Open Fleet', status: 'waitlist', ref: 'BK-8925' }
];
const NOTIFS = [
  { title: 'Booking Confirmed', body: 'Your registration for IRC Championship is confirmed. Briefing at 06:30.', time: '2h ago', read: false },
  { title: 'Payment Reminder', body: 'Annual Membership fee of AED 2,400 is due by 30 April 2025.', time: '1d ago', read: false },
  { title: 'Gold Tier Achievement', body: 'You reached Gold tier status! Enjoy 1.5x points on F&B.', time: '3d ago', read: true },
  { title: 'New Event: Sundowner', body: 'Members\' Sundowner at The Terrace, May 10 at 6:30 PM.', time: '4d ago', read: true },
  { title: 'Sailing School Update', body: 'Keelboat Level 2 Session 3 is on schedule for Friday 3 May.', time: '5d ago', read: true }
];

// ── QR SVG GENERATOR ──
function generateQR() {
  const bg = '#FFFFFF';
  const fg = '#111827';
  const cells = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,1,0,1,1,0,1,1,0,1,1,0,0,1,1,0,1,0,1,1,0],
    [0,1,1,0,0,1,0,0,1,0,0,1,1,0,0,1,1,0,0,1,1],
    [1,0,1,1,0,0,1,1,0,1,1,0,0,1,1,0,0,1,1,0,0],
    [0,1,0,0,1,1,0,0,1,0,0,1,0,0,1,1,0,1,0,1,1],
    [1,1,1,0,1,0,1,1,0,1,1,0,1,1,1,0,1,0,1,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,0,1,0,1,1,0,1,0,1,0,0,1,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,1,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,0,1,1,0,0,0,1,0,0],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,0,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,1,0,0,1,0,0,0],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,0,1,1,0,1,1,0]
  ];
  const size = 21; const cell = 8;
  let rects = '';
  for (let r=0;r<size;r++) for (let c=0;c<size;c++) {
    if (cells[r][c]) rects += `<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}" fill="${fg}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size*cell} ${size*cell}"><rect width="${size*cell}" height="${size*cell}" fill="${bg}"/>${rects}</svg>`;
}

// ── ROUTER ──
let currentScreen = 'splash';
let navHistory = [];
let activeTab = 'home';

window.navigate = function(to, addToHistory = true) {
  const from = document.querySelector('.screen.active');
  if (from) { from.classList.add('exit'); setTimeout(() => { from.classList.remove('active','exit'); }, 300); }
  if (addToHistory && currentScreen !== 'splash' && currentScreen !== 'login') navHistory.push(currentScreen);
  currentScreen = to;
  const toEl = document.getElementById('screen-' + to);
  if (!toEl) return;
  requestAnimationFrame(() => { toEl.classList.add('active'); });
  renderScreen(to);
}

window.goBack = function() {
  if (navHistory.length) navigate(navHistory.pop(), false);
}

function renderScreen(name) {
  const el = document.getElementById('screen-' + name);
  if (!el) return;
  const r = renderers[name];
  if (r) r(el);
}

// ── RENDERERS ──
const renderers = {
  home(el) {
    const content = el.querySelector('.scroll-content');
    if (!content) return;
    content.innerHTML = `
      <div class="home-header animate-in">
        <p class="member-greeting">Good morning,</p>
        <h1 class="member-name">${MEMBER.name.split(' ')[0]}</h1>
        <p class="member-id">${MEMBER.id} · ${MEMBER.type}</p>
      </div>
      <div class="stats-row animate-in">
        <div class="stat-card"><div class="stat-value">${MEMBER.stats.visits}</div><div class="stat-label">Visits</div></div>
        <div class="stat-card"><div class="stat-value">${MEMBER.stats.bookings}</div><div class="stat-label">Bookings</div></div>
        <div class="stat-card"><div class="stat-value stat-accent">${(MEMBER.stats.points/1000).toFixed(1)}k</div><div class="stat-label">Points</div></div>
      </div>
      <div class="section-header animate-in"><span class="section-title">Quick Access</span></div>
      <div class="quick-actions animate-in">
        <div class="quick-action" onclick="navigate('bookings')"><span class="quick-action-icon">⛵</span><span class="quick-action-label">Sailing</span></div>
        <div class="quick-action" onclick="navigate('qr')"><span class="quick-action-icon">📱</span><span class="quick-action-label">QR Card</span></div>
        <div class="quick-action" onclick="navigate('finances')"><span class="quick-action-icon">💳</span><span class="quick-action-label">Pay Bills</span></div>
        <div class="quick-action" onclick="navigate('notifications')"><span class="quick-action-icon">🔔</span><span class="quick-action-label">Alerts</span></div>
      </div>
      <div class="section-header animate-in"><span class="section-title">Upcoming Events</span><button class="section-link" onclick="navigate('bookings')">See all</button></div>
      <div class="events-scroll animate-in">
        ${EVENTS.map(e => `<div class="event-card" onclick="showBookModal('${e.name}','${e.type}','${e.date}','${e.slots}')">
          <div class="event-card-img ${e.type}">${e.icon}</div>
          <div class="event-card-body">
            <div class="event-card-title">${e.name}</div>
            <div class="event-card-date">📅 ${e.date}</div>
            <div class="event-card-slots">${e.slots}</div>
          </div></div>`).join('')}
      </div>
      <div class="section-header animate-in"><span class="section-title">Recent Activity</span><button class="section-link" onclick="navigate('finances')">View all</button></div>
      <div class="activity-list animate-in">
        ${ACTIVITIES.map(a => `<div class="activity-item">
          <div class="activity-icon-wrap ${a.type}">${a.icon}</div>
          <div class="activity-info"><div class="activity-title">${a.title}</div><div class="activity-time">${a.time}</div></div>
          ${a.amount ? `<div class="activity-amount ${a.due ? 'debit' : (a.amount < 0 ? 'debit' : 'credit')}">${a.amount < 0 ? '-' : ''}AED ${Math.abs(a.amount).toLocaleString()}</div>` : ''}
        </div>`).join('')}
      </div>`;
  },

  qr(el) {
    el.querySelector('.qr-full-code').innerHTML = generateQR();
    startQRCountdown(el);
  },

  bookings(el) {
    renderBookings(el, 'upcoming');
  },

  finances(el) {
    const content = el.querySelector('.scroll-content');
    content.innerHTML = `
      <div class="balance-hero animate-in">
        <div class="balance-label">Outstanding Balance</div>
        <div class="balance-amount"><span class="balance-currency">AED</span>${MEMBER.dues.total.toLocaleString()}</div>
        <div class="balance-meta">Due by 30 April 2025 · 2 invoices pending</div>
        <div class="balance-breakdown">
          <div class="balance-cat"><div class="balance-cat-label">Membership</div><div class="balance-cat-value due">2,400</div></div>
          <div class="balance-cat"><div class="balance-cat-label">Sailing</div><div class="balance-cat-value due">850</div></div>
          <div class="balance-cat"><div class="balance-cat-label">F&B</div><div class="balance-cat-value">0</div></div>
        </div>
      </div>
      <div style="padding:0 20px; margin-bottom:16px" class="animate-in">
        <button class="btn-primary" onclick="showToast('Payment gateway — coming in full build 🚀')">Pay All Dues  ·  AED 3,250</button>
      </div>
      <div class="section-header animate-in"><span class="section-title">Invoice History</span></div>
      <div class="animate-in">
        ${INVOICES.map(inv => `<div class="invoice-item">
          <div class="invoice-category-icon" style="background:${inv.cat}">${inv.icon}</div>
          <div class="invoice-info"><div class="invoice-title">${inv.title}</div><div class="invoice-date">${inv.date}</div></div>
          <div class="invoice-right">
            <div class="invoice-amount">${inv.amount}</div>
            <span class="invoice-status ${inv.status}">${inv.status.charAt(0).toUpperCase()+inv.status.slice(1)}</span>
          </div></div>`).join('')}
      </div>`;
  },

  notifications(el) {
    const container = el.querySelector('#notifs-container');
    if (!container) return;
    container.innerHTML = `
      <div style="padding:12px 20px;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Recent Notifications</div>
      ${NOTIFS.map(n => `<div class="invoice-item" style="${n.read ? 'opacity:0.6;' : ''}">
        <div class="invoice-category-icon">${n.read ? '💬' : '🔴'}</div>
        <div class="invoice-info">
          <div class="invoice-title">${n.title}</div>
          <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${n.body}</div>
          <div class="invoice-date" style="margin-top:6px;font-weight:600">${n.time}</div>
        </div>
      </div>`).join('')}
    `;
  },
  
  profile(el) {},
  loyalty(el) {} // Reused in Home for now
};

// ── BOOKINGS TAB SWITCHER ──
window.renderBookings = function(el, tab) {
  const tabs = el.querySelectorAll('.tab-btn');
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const content = el.querySelector('.booking-list');
  const filtered = tab === 'upcoming' ? BOOKINGS : BOOKINGS.filter(b => b.status === tab);
  content.innerHTML = filtered.map(b => `
    <div class="booking-item animate-in">
      <div class="booking-header">
        <span class="booking-title">${b.title}</span>
        <span class="booking-badge ${b.status}">${b.status}</span>
      </div>
      <div class="booking-detail">📅 ${b.date} · ${b.time}</div>
      <div class="booking-detail">👤 ${b.instructor}</div>
      <div class="booking-detail" style="color:var(--text-muted);font-family:monospace;margin-top:8px;">REF: ${b.ref}</div>
      <div class="booking-actions">
        <button class="btn-outline-sm" onclick="showToast('Loading booking details...')">Details</button>
        ${b.status !== 'confirmed' ? '' : `<button class="btn-solid-sm" onclick="showToast('Cancel request sent')">Cancel</button>`}
      </div>
    </div>`).join('');
}

// ── QR COUNTDOWN ──
let qrInterval;
function startQRCountdown(el) {
  let secs = 45;
  clearInterval(qrInterval);
  const update = () => {
    const r = el.querySelector('.qr-refresh-text');
    if (r) r.textContent = `Auto-refreshes in ${secs}s · offline secure`;
    if (secs <= 0) { secs = 45; el.querySelector('.qr-full-code').innerHTML = generateQR(); }
    secs--;
  };
  update();
  qrInterval = setInterval(update, 1000);
}

// ── MODAL ──
window.showBookModal = function(name, type, date, slots) {
  const overlay = document.getElementById('book-modal');
  overlay.querySelector('.modal-title').textContent = name;
  overlay.querySelector('.modal-sub').textContent = type + ' · ' + date;
  overlay.querySelector('.modal-details').innerHTML = `
    <div class="modal-detail-row"><span class="modal-detail-label">Date</span><span style="color:var(--text-primary)">${date}</span></div>
    <div class="modal-detail-row"><span class="modal-detail-label">Availability</span><span style="color:var(--success)">${slots}</span></div>
    <div class="modal-detail-row"><span class="modal-detail-label">Your tier</span><span style="color:var(--text-primary)">${MEMBER.tier}</span></div>
    <div class="modal-detail-row"><span class="modal-detail-label">Points earn</span><span style="color:var(--brand-blue)">+150 pts</span></div>`;
  overlay.classList.add('show');
}

window.closeModal = function() { document.getElementById('book-modal').classList.remove('show'); }

window.confirmBooking = function() {
  closeModal();
  showToast('Registration confirmed! ⛵');
}

// ── TOAST ──
let toastTimer;
window.showToast = function(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── BOTTOM NAV SWITCH ──
window.switchTab = function(tab) {
  activeTab = tab;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.tab === tab));
  if (tab !== 'qr') clearInterval(qrInterval);
  navigate(tab, false);
  document.querySelector('.bottom-nav').style.display = 'flex';
}

// ── SPLASH → LOGIN ──
window.addEventListener('DOMContentLoaded', () => {
  const splashEl = document.getElementById('screen-splash');
  splashEl.classList.add('active');
  setTimeout(() => navigate('login'), 2000);
});

// ── LOGIN ──
window.loginSubmit = function() {
  const email = document.getElementById('login-email').value;
  if (!email) { showToast('Please enter your email'); return; }
  showToast('Authenticating…');
  setTimeout(() => {
    navigate('home', false);
    document.querySelector('.bottom-nav').style.display = 'flex';
    navHistory = [];
  }, 1000);
};

window.biometricLogin = function() {
  showToast('Authenticating Biometrics…');
  setTimeout(() => {
    navigate('home', false);
    document.querySelector('.bottom-nav').style.display = 'flex';
    navHistory = [];
  }, 1200);
};

// ── CLOCK ──
function updateClock() {
  const now = new Date();
  const t = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  document.querySelectorAll('.time').forEach(el => el.textContent = t);
}
setInterval(updateClock, 10000);
updateClock();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
