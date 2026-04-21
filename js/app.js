// DOSC PWA - Advanced Mock Interactions

const MEMBER = {
  name: "James Hartwell",
  id: "DOSC-2847",
  tier: "Gold Member",
  renewal: "Dec 31, 2025",
  email: "j.hartwell@email.com",
  phone: "+971 50 123 4321",
  points: 3842,
  boats: [
    { name: "Aeolus", type: "Beneteau First 40", code: "UAE-992", status: "Berth E-14 (Active)" },
    { name: "Windrider", type: "Laser Standard", code: "LSR-110", status: "Dry Stack 4 (Active)" }
  ],
  balanceAED: 3250
};

let INVOICES = [
  { id: "INV-2993", name: "Annual Membership Fee 2025", date: "01 May 2025", amount: 2400, status: "DUE" },
  { id: "INV-2994", name: "Sailing Programme - Keelboat", date: "15 Apr 2025", amount: 850, status: "DUE" },
  { id: "INV-2841", name: "Marina Berthing (Q1)", date: "01 Jan 2025", amount: 4500, status: "PAID" }
];

let NOTIFS = [
  { id: 1, title: 'Booking Confirmed', body: 'Your registration for IRC Championship is confirmed. Briefing at 06:30.', time: '2h ago', read: false },
  { id: 2, title: 'Payment Reminder', body: 'Annual Membership fee of AED 2,400 is due by 30 April 2025.', time: '1d ago', read: false },
  { id: 3, title: 'Gold Tier Achievement', body: 'You reached Gold tier status! Enjoy 1.5x points on F&B.', time: '3d ago', read: true },
  { id: 4, title: 'New Event: Sundowner', body: 'Members\' Sundowner at The Terrace, May 10 at 6:30 PM.', time: '4d ago', read: true }
];

const MENU = [
  { id: 'm1', name: "Angus Beef Burger", desc: "Aged cheddar, brioche bun, club fries", price: 65, pts: 65, img: "🍔" },
  { id: 'm2', name: "Catch of the Day", desc: "Pan-seared local hamour, lemon butter, asparagus", price: 95, pts: 95, img: "🐟" },
  { id: 'm3', name: "Club Sandwich", desc: "Roast turkey, veal bacon, egg, toasted sourdough", price: 55, pts: 55, img: "🥪" },
  { id: 'm4', name: "Marina Sundowner (Pint)", desc: "Ice cold premium draught", price: 42, pts: 42, img: "🍺" },
  { id: 'm5', name: "Espresso", desc: "Single origin specialty roast", price: 18, pts: 18, img: "☕" }
];

const EVENTS = [
  { id: 'e1', name: "Dubai IRC Championship", date: "May 12-14", type: "regatta", icon: "⛵", slots: "Confirmed" },
  { id: 'e2', name: "Keelboat Level 2", date: "Friday, May 3", type: "lesson", icon: "🎓", slots: "Waitlist" },
  { id: 'e3', name: "Members' Sundowner", date: "Friday, May 10", type: "social", icon: "🍻", slots: "Open" }
];

let ACTIVITIES = [
  { id: 'a1', title: "F&B: The Terrace", time: "Today, 14:30", type: "fb", icon: "🍽️", amount: -185, due: false },
  { id: 'a2', title: "Marina Berth Renewal", time: "Yesterday", type: "finance", icon: "💳", amount: -4500, due: false },
  { id: 'a3', title: "Loyalty Earned (+185)", time: "Today, 14:30", type: "event", icon: "⭐", amount: 0, due: false }
];

let navHistory = [];
const DEFAULT_TAB = 'home';
let notificationsOpen = false;

// ── NAVIGATION ──
function switchTab(tabId) {
  document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.classList.add('exit'); });
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  
  const target = document.getElementById('screen-' + tabId);
  if(target) {
    target.classList.remove('exit');
    target.classList.add('active');
    setTimeout(() => {
      document.querySelectorAll('.screen.exit').forEach(s => s.classList.remove('exit'));
    }, 350);
  }
  
  const btn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if(btn) btn.classList.add('active');
  
  if (renderers[tabId]) renderers[tabId](target);
}

function navigate(tabId, push = true) {
  if(push) {
    const current = document.querySelector('.screen.active');
    if(current) navHistory.push(current.id.replace('screen-',''));
  }
  switchTab(tabId);
}

// ── INIT & LOGIN ──
window.loginSubmit = function() {
  const btn = document.querySelector('.btn-primary');
  btn.innerHTML = 'Authenticating ERP...';
  btn.style.opacity = '0.8';
  setTimeout(() => {
    navigate('home', false);
    document.querySelector('.bottom-nav').style.display = 'flex';
    navHistory = [];
  }, 1000);
};

window.biometricLogin = function() {
  showToast('Face ID / Touch ID recognized');
  window.loginSubmit();
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { switchTab('login'); }, 1800);
});

// ── GLOBAL RENDERERS ──
const renderers = {
  home(el) {
    const content = el.querySelector('.scroll-content');
    content.innerHTML = `
      <div class="home-header animate-in">
        <div class="member-greeting">Good morning,</div>
        <div class="member-name">${MEMBER.name.split(' ')[0]}</div>
      </div>
      <div class="stats-row animate-in">
        <div class="stat-card"><div class="stat-value">24</div><div class="stat-label">Visits</div></div>
        <div class="stat-card"><div class="stat-value stat-accent">4</div><div class="stat-label">Bookings</div></div>
        <div class="stat-card" onclick="navigate('loyalty')"><div class="stat-value" style="color:#F59E0B">${MEMBER.points}</div><div class="stat-label">Points</div></div>
      </div>
      <div class="section-header animate-in" style="padding-top:24px"><span class="section-title">Quick Access</span></div>
      <div class="quick-actions animate-in">
        <div class="quick-action" onclick="navigate('qr')"><div class="quick-action-icon">📱</div><div class="quick-action-label">ID Pass</div></div>
        <div class="quick-action" onclick="navigate('dining')"><div class="quick-action-icon">🍔</div><div class="quick-action-label">F&B Menu</div></div>
        <div class="quick-action" onclick="showGuestModal()"><div class="quick-action-icon">🎫</div><div class="quick-action-label">Guest Pass</div></div>
        <div class="quick-action" onclick="navigate('finances')"><div class="quick-action-icon">💳</div><div class="quick-action-label">Balance</div></div>
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
      <div class="activity-list animate-in" style="padding-bottom:100px;">
        ${ACTIVITIES.map(a => `<div class="activity-item">
          <div class="activity-icon-wrap ${a.type}">${a.icon}</div>
          <div class="activity-info"><div class="activity-title">${a.title}</div><div class="activity-time">${a.time}</div></div>
          ${a.amount ? `<div class="activity-amount ${a.due ? 'debit' : (a.amount < 0 ? 'debit' : 'credit')}">${a.amount < 0 ? '-' : ''}AED ${Math.abs(a.amount).toLocaleString()}</div>` : ''}
        </div>`).join('')}
      </div>`;
    updateBell();
  },
  bookings(el) {
    if(!el.querySelector('.booking-list').innerHTML) {
      window.renderBookings(el, 'upcoming');
    }
  },
  dining(el) {
    const list = document.getElementById('dining-menu');
    document.getElementById('dining-points-badge').innerText = MEMBER.points.toLocaleString() + " Pts";
    list.innerHTML = `<div class="menu-list animate-in">
      ${MENU.map(m => `<div class="menu-item" onclick="showDiningModal('${m.id}')">
        <div class="menu-img">${m.img}</div>
        <div class="menu-info">
          <div class="menu-title">${m.name}</div>
          <div class="menu-desc">${m.desc}</div>
        </div>
        <div class="menu-price-wrap">
          <div class="menu-price">AED ${m.price}</div>
          <div class="menu-points">+${m.pts} Pts</div>
        </div>
      </div>`).join('')}
    </div>`;
  },
  finances(el) {
    const content = el.querySelector('.scroll-content');
    content.innerHTML = `
      <div class="balance-hero animate-in">
        <div class="balance-label">Total Outstanding</div>
        <div class="balance-amount"><span class="balance-currency">AED</span>${MEMBER.balanceAED.toLocaleString()}</div>
        <div class="balance-meta">Syncs in real-time with B1 ERP</div>
        <div style="margin-top:20px;">
          <button class="btn-solid-sm" onclick="showCheckoutModal('Total Balance', ${MEMBER.balanceAED})" style="padding:14px 40px; font-size:16px;">Pay All Dues</button>
        </div>
      </div>
      <div class="section-header animate-in" style="padding-top:0"><span class="section-title">Invoices & Bills</span></div>
      <div class="animate-in" style="padding-bottom:100px;">
        ${INVOICES.map(i => `<div class="invoice-item" onclick="${i.status==='DUE' ? `showCheckoutModal('${i.name}', ${i.amount}, '${i.id}')` : 'showToast(\'Receipt PDF Downloading...\')'}">
          <div class="invoice-category-icon" style="background:${i.status==='DUE'?'#FEF2F2':'#F1F5F9'}">${i.status==='DUE'?'📄':'✅'}</div>
          <div class="invoice-info">
            <div class="invoice-title">${i.name} (${i.id})</div>
            <div class="invoice-date">${i.date}</div>
          </div>
          <div class="invoice-right">
            <div class="invoice-amount">AED ${i.amount.toLocaleString()}</div>
            <div class="invoice-status" style="background:${i.status==='DUE'?'var(--brand-red-light)':'#ECFDF5'};color:${i.status==='DUE'?'var(--brand-red)':'var(--success)'}">${i.status}</div>
          </div>
        </div>`).join('')}
      </div>`;
  },
  profile(el) {
    const content = el.querySelector('.scroll-content');
    content.innerHTML = `
      <div class="loyalty-card animate-in" style="margin: 20px;">
        <div class="loyalty-tier">⭐ ${MEMBER.tier}</div>
        <div class="loyalty-pts">${MEMBER.points.toLocaleString()} <span>Points</span></div>
        <div style="font-size:13px; color:rgba(255,255,255,0.7)">Redeemable at any POS terminal.</div>
      </div>
      <div class="profile-hero animate-in" style="padding-top:0;">
        <div class="profile-avatar" style="border-color:var(--canvas-bg);">JH</div>
        <div class="profile-name">${MEMBER.name}</div>
      </div>
      <div class="profile-section animate-in">
        <div class="profile-section-title">My Registered Boats</div>
        <div style="padding: 16px 20px;">
          ${MEMBER.boats.map(b => `
            <div class="boat-card">
              <div class="boat-icon">⛵</div>
              <div class="boat-info">
                <div class="boat-name">${b.name}</div>
                <div class="boat-meta">${b.type} · ${b.code}</div>
              </div>
              <div class="boat-status">${b.status}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="profile-section animate-in" style="margin-bottom:120px">
        <div class="profile-section-title">Settings & App</div>
        <div class="profile-row" onclick="showToast('Notifications enabled')"><span class="profile-row-icon">🔔</span><span class="profile-row-label">Push Notifications</span></div>
        <div class="profile-row" style="cursor:pointer;" onclick="location.reload()"><span class="profile-row-icon" style="color:var(--brand-red);">🚪</span><span class="profile-row-label" style="color:var(--brand-red)">Sign Out Securely</span></div>
      </div>`;
  }
};

window.renderBookings = function(screen, filter) {
  screen.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  screen.querySelector(`.tab-btn[data-tab="${filter}"]`).classList.add('active');
  const list = screen.querySelector('.booking-list');
  
  if(filter === 'upcoming') {
    list.innerHTML = EVENTS.map(e => `
      <div class="booking-item animate-in">
        <div class="booking-header">
          <div class="booking-title">${e.name}</div>
          <div class="booking-badge ${e.slots==='Confirmed'?'confirmed':(e.slots==='Waitlist'?'waitlist':'pending')}">${e.slots}</div>
        </div>
        <div class="booking-detail">📅 ${e.date}</div>
        <div class="booking-detail">👤 James Hartwell (Member)</div>
        <div class="booking-actions">
          <button class="btn-outline-sm" onclick="showToast('Modifications disabled')">Modify</button>
          <button class="btn-outline-sm" style="color:var(--brand-red);border-color:#FEE2E2" onclick="showToast('Booking cancelled')">Cancel</button>
        </div>
      </div>`).join('');
  } else {
    list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-secondary);font-weight:600">No ${filter} records found.</div>`;
  }
};

// ── NOTIFICATIONS TRAY ──
window.updateBell = function() {
  const unreadCount = NOTIFS.filter(n => !n.read).length;
  const badge = document.getElementById('bell-badge');
  if(badge) badge.style.display = unreadCount > 0 ? 'block' : 'none';
};

window.toggleNotifications = function() {
  const tray = document.getElementById('notification-tray');
  notificationsOpen = !notificationsOpen;
  
  if(notificationsOpen) {
    let html = `<div class="notif-header"><span>Alerts</span> <span class="notif-mark" onclick="markAllRead(event)">Mark all read</span></div>`;
    if(NOTIFS.length === 0) html += `<div style="padding:20px;text-align:center;font-size:13px;color:var(--text-muted)">No new alerts.</div>`;
    
    html += NOTIFS.map(n => `
      <div class="notif-item ${n.read?'':'unread'}" onclick="readNotif(${n.id})">
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    `).join('');
    
    tray.innerHTML = html;
    tray.classList.add('show');
  } else {
    tray.classList.remove('show');
  }
};

window.markAllRead = function(e) {
  e.stopPropagation();
  NOTIFS.forEach(n => n.read = true);
  updateBell();
  toggleNotifications(); // close
  showToast('All alerts cleared');
};

window.readNotif = function(id) {
  const n = NOTIFS.find(x => x.id === id);
  if(n) n.read = true;
  updateBell();
  toggleNotifications(); // close and reopen to refresh
  toggleNotifications();
};

// ── CUSTOM MODALS (GUEST, F&B, PAYMENTS) ──
window.showModal = function(htmlContent) {
  const overlay = document.getElementById('global-modal');
  document.getElementById('modal-content').innerHTML = htmlContent;
  overlay.classList.add('show');
};

window.closeModal = function() {
  document.getElementById('global-modal').classList.remove('show');
};

window.showGuestModal = function() {
  const html = `
    <div class="modal-title">Sponsor a Guest</div>
    <div class="modal-sub">Generate a temporary gate & POS pass for your guest. A guest fee of AED 150 will be posted to your finance portal.</div>
    <input type="text" class="input-field" id="guest-name" placeholder="Guest Full Name">
    <div class="modal-actions" style="margin-top:16px;">
      <button class="btn-outline-sm" onclick="closeModal()">Cancel</button>
      <button class="btn-solid-sm" onclick="confirmGuestpass()">Generate Pass</button>
    </div>
  `;
  showModal(html);
};

window.confirmGuestpass = function() {
  const name = document.getElementById('guest-name').value || 'Uninvited Guest';
  closeModal();
  showToast('Pass Generated! Check Gate SMS.');
  
  // Add to finances
  INVOICES.unshift({ id: "INV-" + Math.floor(Math.random()*9000+1000), name: `Daily Guest Fee (${name})`, date: "Today", amount: 150, status: "DUE" });
  MEMBER.balanceAED += 150;
  ACTIVITIES.unshift({ id: 'a-g', title: `Guest Fee (${name})`, time: "Just now", type: "finance", icon: "🎟️", amount: -150, due: true });
  
  if(document.getElementById('screen-finances').classList.contains('active')) renderers.finances(document.getElementById('screen-finances'));
};

window.showDiningModal = function(id) {
  const item = MENU.find(m => m.id === id);
  const html = `
    <div class="modal-title">${item.name}</div>
    <div class="modal-sub">${item.desc}</div>
    <div class="modal-total-box">
      <div class="modal-total-label">Total Amount</div>
      <div class="modal-total-val">AED ${item.price}</div>
      <div style="font-size:12px;color:var(--success);margin-top:8px;">✅ Earns ${item.pts} Points</div>
    </div>
    <div class="modal-actions">
      <button class="btn-outline-sm" style="color:var(--brand-blue); border-color:var(--brand-blue)" onclick="payWithPoints(${item.price}, ${item.pts})">Pay with Points</button>
      <button class="btn-solid-sm" onclick="chargeToRoom(${item.price}, ${item.pts}, '${item.name}')">Charge to Account</button>
    </div>
  `;
  showModal(html);
};

window.chargeToRoom = function(price, pts, name) {
  closeModal();
  showToast('Order sent to Kitchen KDS!');
  MEMBER.balanceAED += price;
  MEMBER.points += pts;
  
  INVOICES.unshift({ id: "INV-" + Math.floor(Math.random()*9000+1000), name: `F&B POS: ${name}`, date: "Today", amount: price, status: "DUE" });
  ACTIVITIES.unshift({ id: 'a-fb', title: `F&B Order: ${name}`, time: "Just now", type: "fb", icon: "🍽️", amount: -price, due: true });
  
  renderers.dining(document.getElementById('screen-dining')); // refresh points badge
};

window.payWithPoints = function(price, pts) {
  const cost = price * 10; // 10 pts per AED
  if(MEMBER.points < cost) {
    showToast('Insufficient Loyalty Points!');
    return;
  }
  MEMBER.points -= cost;
  closeModal();
  showToast(`Paid with ${cost} Points! Order sent.`);
  renderers.dining(document.getElementById('screen-dining')); 
};

window.showCheckoutModal = function(itemName, amount, invoiceId = null) {
  const vat = amount * 0.05;
  const net = amount - vat;
  const actionStr = invoiceId ? `settleInvoice('${invoiceId}', ${amount})` : `settleAllBalance()`;

  const html = `
    <div class="modal-title">Secure Payment</div>
    <div class="modal-sub">Settle via registered credit card (•••• 4242)</div>
    
    <div class="modal-detail-row" style="border-top:none">
      <span style="color:var(--text-secondary)">${itemName}</span>
      <span>AED ${net.toFixed(2)}</span>
    </div>
    <div class="modal-detail-row">
      <span style="color:var(--text-secondary)">VAT (5%)</span>
      <span>AED ${vat.toFixed(2)}</span>
    </div>
    
    <div class="modal-total-box">
      <div class="modal-total-label">Amount to Pay</div>
      <div class="modal-total-val" style="color:var(--brand-blue-dark)">AED ${amount.toFixed(2)}</div>
    </div>
    
    <div class="modal-actions" style="margin-top:16px;">
      <button class="btn-outline-sm" onclick="closeModal()">Cancel</button>
      <button class="btn-solid-sm" onclick="${actionStr}">Authorize Payment</button>
    </div>
  `;
  showModal(html);
};

window.settleInvoice = function(invoiceId, amount) {
  const inv = INVOICES.find(i => i.id === invoiceId);
  if(inv) inv.status = 'PAID';
  MEMBER.balanceAED -= amount;
  closeModal();
  showToast('Payment successful! ERP updated.');
  renderers.finances(document.getElementById('screen-finances'));
};

window.settleAllBalance = function() {
  INVOICES.forEach(i => i.status = 'PAID');
  MEMBER.balanceAED = 0;
  closeModal();
  showToast('All accounts settled successfully!');
  renderers.finances(document.getElementById('screen-finances'));
};

window.showBookModal = function(name, type, date, slots) {
  const html = `
    <div class="modal-title">${name}</div>
    <div class="modal-sub">${type.toUpperCase()} · ${date}</div>
    <div class="modal-details" style="font-size:14px;color:var(--text-secondary);line-height:1.4">
      This booking will be synced instantly with DOSC operations. Applicable fees (if any) will surface in your Finances tab.
    </div>
    <div class="modal-actions">
      <button class="btn-outline-sm" onclick="closeModal()">Close</button>
      <button class="btn-solid-sm" onclick="closeModal();showToast('Registration Confirmed!');">Confirm Registration</button>
    </div>
  `;
  showModal(html);
};

// ── UTILITIES ──
window.showToast = function(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
};

// Close notifications when clicking outside
document.addEventListener('click', (e) => {
  if (notificationsOpen && !e.target.closest('.bell-wrap') && !e.target.closest('.notification-tray')) {
    toggleNotifications();
  }
});
