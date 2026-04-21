// DOSC PWA - Complete Dual Mode Ecosystem (Member & Staff)

let staffModeActive = false;

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
  { id: 1, title: 'Booking Confirmed', body: 'Your registration for IRC Championship is confirmed.', time: '2h ago', read: false },
  { id: 2, title: 'Payment Reminder', body: 'Annual Membership fee of AED 2,400 is due.', time: '1d ago', read: false }
];

const MENU = [
  { id: "m1", name: "Angus Beef Burger", desc: "Aged cheddar, brioche bun, club fries", price: 65, pts: 65, img: "🍔" },
  { id: "m2", name: "Catch of the Day", desc: "Pan-seared local hamour", price: 95, pts: 95, img: "🐟" },
  { id: "m4", name: "Marina Sundowner (Pint)", desc: "Ice cold premium draught", price: 42, pts: 42, img: "🍺" }
];

let EVENTS = [
  { id: "e1", name: "Dubai IRC Championship", date: "May 12-14", type: "regatta", icon: "⛵", slots: "Confirmed" },
  { id: "e2", name: "Keelboat Level 2", date: "Friday, May 3", type: "lesson", icon: "🎓", slots: "Waitlist" }
];

let ACTIVITIES = [
  { id: "a1", title: "F&B: The Terrace", time: "Today, 14:30", type: "fb", icon: "🍽️", amount: -185, due: false }
];

// STAFF DATA
const STAFF_METRICS = { revenue: 14500, checkins: 142, activeTables: 4 };
let TABLES = [
  { id: 1, status: "available" }, { id: 2, status: "occupied" },
  { id: 3, status: "available" }, { id: 4, status: "occupied" },
  { id: 5, status: "available" }, { id: 6, status: "available" }
];
let KDS_TICKETS = [
  { id: "KOT-102", table: 2, items: "2x Angus Beef Burger\n1x Sundowner Pint", time: "4m ago", status: "prep" },
  { id: "KOT-103", table: 4, items: "1x Catch of the Day", time: "1m ago", status: "prep" }
];


// ── NAVIGATION & INIT ──
window.loginSubmit = function() {
  const btn = document.querySelector('.btn-primary');
  btn.innerHTML = 'Authenticating...';
  setTimeout(() => {
    navigate('home', false);
    document.getElementById('member-bottom-nav').style.display = 'flex';
  }, 1000);
};

window.biometricLogin = function() {
  showToast('Face ID recognized'); window.loginSubmit();
};

document.addEventListener('DOMContentLoaded', () => { setTimeout(() => { switchTab('login'); }, 1800); });

function navigate(tabId, push = true) { switchTab(tabId); }

function switchTab(tabId) {
  document.querySelectorAll('.screen').forEach(s => { s.classList.remove('active'); s.classList.add('exit'); });
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  
  const target = document.getElementById('screen-' + tabId);
  if(target) {
    target.classList.remove('exit');
    target.classList.add('active');
    setTimeout(() => document.querySelectorAll('.screen.exit').forEach(s => s.classList.remove('exit')), 350);
  }
  
  const btn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  if(btn) btn.classList.add('active');
  
  if (renderers[tabId]) renderers[tabId](target);
}

window.toggleStaffMode = function() {
  staffModeActive = !staffModeActive;
  document.body.classList.toggle('mode-member', !staffModeActive);
  document.body.classList.toggle('mode-staff', staffModeActive);
  
  document.getElementById('member-bottom-nav').style.display = staffModeActive ? 'none' : 'flex';
  document.getElementById('staff-bottom-nav').style.display = staffModeActive ? 'flex' : 'none';
  
  if(staffModeActive) { switchTab('staff-kpi'); showToast('Enterprise Mode Enabled'); }
  else { switchTab('home'); showToast('Member Mode Active'); }
};

// ── RENDERERS ──
const renderers = {
  // MEMBER SCREENS
  home(el) {
    el.querySelector('.scroll-content').innerHTML = `
      <div class="home-header animate-in">
        <div class="member-greeting">Good morning,</div>
        <div class="member-name">${MEMBER.name.split(' ')[0]}</div>
      </div>
      <div class="stats-row animate-in">
        <div class="stat-card"><div class="stat-value">24</div><div class="stat-label">Visits</div></div>
        <div class="stat-card"><div class="stat-value stat-accent">${EVENTS.length}</div><div class="stat-label">Bookings</div></div>
        <div class="stat-card"><div class="stat-value" style="color:#F59E0B">${MEMBER.points}</div><div class="stat-label">Points</div></div>
      </div>
      <div class="section-header animate-in" style="padding-top:24px"><span class="section-title">Quick Access</span></div>
      <div class="quick-actions animate-in">
        <div class="quick-action" onclick="navigate('qr')"><div class="quick-action-icon">📱</div><div class="quick-action-label">ID Pass</div></div>
        <div class="quick-action" onclick="navigate('dining')"><div class="quick-action-icon">🍔</div><div class="quick-action-label">Menu</div></div>
        <div class="quick-action" onclick="showGuestModal()"><div class="quick-action-icon">🎫</div><div class="quick-action-label">Guest</div></div>
        <div class="quick-action" onclick="navigate('finances')"><div class="quick-action-icon">💳</div><div class="quick-action-label">Finance</div></div>
      </div>
      <div class="section-header animate-in"><span class="section-title">Upcoming Schedule</span></div>
      <div class="events-scroll animate-in">
        ${EVENTS.map(e => `<div class="event-card">
          <div class="event-card-img ${e.type}">${e.icon}</div>
          <div class="event-card-body">
            <div class="event-card-title">${e.name}</div>
            <div class="event-card-date">📅 ${e.date}</div>
          </div></div>`).join('')}
      </div>`;
    updateBell();
  },
  qr(el) {
    document.getElementById('qr-name').innerText = MEMBER.name;
    document.getElementById('qr-id').innerText = "ID: " + MEMBER.id;
  },
  bookings(el) { window.renderBookings(el, 'upcoming'); },
  dining(el) {
    document.getElementById('dining-points-badge').innerText = MEMBER.points.toLocaleString() + " Pts";
    el.querySelector('#dining-menu').innerHTML = `<div class="menu-list animate-in">
      ${MENU.map(m => `<div class="menu-item" onclick="showDiningModal('${m.id}')">
        <div class="menu-img">${m.img}</div>
        <div class="menu-info"><div class="menu-title">${m.name}</div><div class="menu-desc">${m.desc}</div></div>
        <div class="menu-price-wrap"><div class="menu-price">AED ${m.price}</div><div class="menu-points">+${m.pts} Pts</div></div>
      </div>`).join('')}
    </div>`;
  },
  finances(el) {
    el.querySelector('.scroll-content').innerHTML = `
      <div class="balance-hero animate-in">
        <div class="balance-label">Total Outstanding</div>
        <div class="balance-amount"><span class="balance-currency">AED</span>${MEMBER.balanceAED.toLocaleString()}</div>
        <div style="margin-top:20px;"><button class="btn-solid-sm" onclick="settleAllBalance()" style="padding:14px 40px; font-size:16px;">Pay All Dues</button></div>
      </div>
      <div class="section-header animate-in" style="padding-top:0"><span class="section-title">Invoices</span></div>
      <div class="animate-in" style="padding-bottom:100px;">
        ${INVOICES.map(i => `<div class="invoice-item" onclick="${i.status==='DUE' ? "showCheckoutModal('"+i.name+"', "+i.amount+", '"+i.id+"')" : "generatePDFStatement('"+i.id+"')"}">
          <div class="invoice-category-icon" style="background:${i.status==='DUE'?'#FEF2F2':'#F1F5F9'}">${i.status==='DUE'?'📄':'✅'}</div>
          <div class="invoice-info"><div class="invoice-title">${i.name}</div><div class="invoice-date">${i.date}</div></div>
          <div class="invoice-right">
            <div class="invoice-amount">AED ${i.amount.toLocaleString()}</div>
            <div class="invoice-status" style="background:${i.status==='DUE'?'var(--brand-red-light)':'#ECFDF5'};color:${i.status==='DUE'?'var(--brand-red)':'var(--success)'}">${i.status}</div>
          </div>
        </div>`).join('')}
      </div>`;
  },
  profile(el) {
    el.querySelector('.scroll-content').innerHTML = `
      <div class="loyalty-card animate-in" style="margin: 20px;">
        <div class="loyalty-tier">⭐ ${MEMBER.tier}</div>
        <div class="loyalty-pts">${MEMBER.points.toLocaleString()} <span>Points</span></div>
      </div>
      <div class="profile-hero animate-in" style="padding-top:0;"><div class="profile-avatar">JH</div><div class="profile-name" id="prof-name">${MEMBER.name}</div></div>
      <div class="profile-section animate-in">
        <div class="profile-section-title">My Registered Marina Boats</div>
        <div style="padding: 16px 20px;">
          ${MEMBER.boats.map(b => `
            <div class="boat-card" onclick="reqMaintenance('${b.name}')">
              <div class="boat-icon">⛵</div>
              <div class="boat-info"><div class="boat-name">${b.name}</div><div class="boat-meta">${b.type}</div></div>
              <div class="boat-status">${b.status}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="profile-section animate-in" style="margin-bottom:120px">
        <div class="profile-section-title">Settings & App</div>
        <div class="profile-row" onclick="toggleStaffMode()"><span class="profile-row-icon">🛠️</span><span class="profile-row-label">Toggle Staff Mode</span></div>
        <div class="profile-row" onclick="location.reload()"><span class="profile-row-icon" style="color:var(--brand-red);">🚪</span><span class="profile-row-label" style="color:var(--brand-red)">Sign Out</span></div>
      </div>`;
  },

  // STAFF SCREENS
  'staff-kpi'(el) {
    el.querySelector('.scroll-content').innerHTML = `
      <div style="padding:20px; font-size:24px; font-weight:800; color:white;">Today's Operations</div>
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-val">AED ${STAFF_METRICS.revenue.toLocaleString()}</div><div class="kpi-lbl">POS Revenue</div></div>
        <div class="kpi-card"><div class="kpi-val">${STAFF_METRICS.checkins}</div><div class="kpi-lbl">Gate Check-ins</div></div>
        <div class="kpi-card"><div class="kpi-val">${STAFF_METRICS.activeTables}</div><div class="kpi-lbl">Active F&B Tables</div></div>
        <div class="kpi-card"><div class="kpi-val">98%</div><div class="kpi-lbl">ERP Sync Rate</div></div>
      </div>
      <div style="padding:20px; color:var(--text-secondary); font-size:13px;">Live linked with SAP Business One.</div>`;
  },
  'staff-pos'(el) {
    el.querySelector('.scroll-content').innerHTML = `
      <div style="padding:20px; color:white; font-size:20px; font-weight:800;">Floor Map (Terrace)</div>
      <div class="pos-grid">
        ${TABLES.map(t => `<div class="pos-table ${t.status}" onclick="staffOrder(${t.id})">
          <div class="pos-table-lbl">T${t.id}</div>
          <div class="pos-table-status">${t.status}</div>
        </div>`).join('')}
      </div>`;
  },
  'staff-kds'(el) {
    el.querySelector('.scroll-content').innerHTML = `
      <div class="kds-board">
        <div class="kds-col">
          <div class="kds-col-title">Preparing (${KDS_TICKETS.length})</div>
          ${KDS_TICKETS.map(t => `<div class="kds-ticket" onclick="markKDSTicket('${t.id}')">
            <div class="kds-ticket-meta"><span>${t.id}</span><span>${t.time}</span></div>
            <div style="color:var(--brand-blue); font-size:16px; font-weight:800; margin: 4px 0 8px;">Table ${t.table}</div>
            <div class="kds-ticket-items">${t.items.replace(/\\n/g, '<br>')}</div>
            <button class="btn-solid-sm" style="width:100%; padding:8px; font-size:12px;">Mark as Ready</button>
          </div>`).join('')}
        </div>
        <div class="kds-col"><div class="kds-col-title">Ready for Pickup (0)</div></div>
      </div>`;
  },
  'staff-gate'(el) {
    el.querySelector('.scroll-content').innerHTML = `
      <div style="padding:40px; text-align:center;">
        <div style="width:120px; height:120px; margin:0 auto 24px; border:4px dashed var(--border-light); border-radius:24px; display:flex; align-items:center; justify-content:center; font-size:40px; color:white;">📷</div>
        <div style="font-size:20px; font-weight:800; color:white; margin-bottom:8px;">Ready to Scan QR</div>
        <div style="color:var(--text-secondary); font-size:14px; margin-bottom:32px;">Align member QR inside the frame.</div>
        <button class="btn-solid-sm" style="padding:14px 40px;" onclick="showToast('Simulating manual member lookup...'); setTimeout(()=>showToast('Member James Hartwell active!'), 1000)">Manual ID Lookup</button>
      </div>`;
  }
};


// ── NOTIFICATIONS & BELL ──
function updateBell() {
  const badge = document.getElementById('bell-badge');
  if(badge) badge.style.display = NOTIFS.some(n=>!n.read) ? 'block' : 'none';
}

window.toggleNotifications = function() {
  const tray = document.getElementById('notification-tray');
  if(tray.classList.contains('show')) { tray.classList.remove('show'); return; }
  let html = `<div class="notif-header"><span>Alerts</span><span class="notif-mark" onclick="NOTIFS.forEach(n=>n.read=true);updateBell();toggleNotifications()">Mark Read</span></div>`;
  html += NOTIFS.map(n => `<div class="notif-item ${n.read?'':'unread'}" onclick="this.classList.remove('unread');">
    <div class="notif-title">${n.title}</div><div class="notif-body">${n.body}</div><div class="notif-time">${n.time}</div></div>`).join('');
  tray.innerHTML = html;
  tray.classList.add('show');
};

// ── BOOKING TABS ──
window.renderBookings = function(screen, filter) {
  screen.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  screen.querySelector(`.tab-btn[data-tab="${filter}"]`).classList.add('active');
  const list = screen.querySelector('.booking-list');
  if(filter === 'upcoming') {
    list.innerHTML = EVENTS.map(e => `
      <div class="booking-item animate-in">
        <div class="booking-header"><div class="booking-title">${e.name}</div><div class="booking-badge ${e.slots==='Confirmed'?'confirmed':'waitlist'}">${e.slots}</div></div>
        <div class="booking-detail">📅 ${e.date}</div>
        <div class="booking-actions" style="margin-top:12px;">
          <button class="btn-outline-sm" style="color:var(--brand-red);border-color:#FEE2E2" onclick="cancelBooking('${e.id}')">Cancel</button>
        </div>
      </div>`).join('');
  } else {
    list.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-secondary);">No history found.</div>`;
  }
};

window.cancelBooking = function(id) {
  EVENTS = EVENTS.filter(e => e.id !== id);
  showToast("Booking cancelled successfully.");
  renderBookings(document.getElementById('screen-bookings'), 'upcoming');
};


// ── MODALS (GUEST, DINING, CHECKOUT, PROFILE, BOATS) ──
window.showModal = function(html) {
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('global-modal').classList.add('show');
};
window.closeModal = function() { document.getElementById('global-modal').classList.remove('show'); };

window.showGuestModal = function() {
  showModal(`
    <div class="modal-title">Sponsor a Guest</div>
    <div class="modal-sub">Generate temporary QR. Guest Fee AED 150 will be posted.</div>
    <input type="text" class="input-field" id="guest-name" placeholder="Guest Name">
    <div class="modal-actions" style="margin-top:16px;">
      <button class="btn-outline-sm" onclick="closeModal()">Cancel</button>
      <button class="btn-solid-sm" onclick="confirmGuest()">Generate Pass</button>
    </div>`);
};
window.confirmGuest = function() {
  closeModal(); showToast('Pass Generated! Added AED 150 to Dues.');
  MEMBER.balanceAED += 150;
  INVOICES.unshift({ id: "INV-" + Math.floor(Math.random()*9000), name: "Guest Fee ("+(document.getElementById('guest-name').value||'Guest')+")", date: "Today", amount: 150, status: "DUE" });
  if(!staffModeActive) renderers.finances(document.getElementById('screen-finances'));
};

window.showDiningModal = function(id) {
  const m = MENU.find(x => x.id === id);
  showModal(`
    <div class="modal-title">${m.name}</div>
    <div class="modal-total-box"><div class="modal-total-val">AED ${m.price}</div><div style="font-size:12px;color:var(--success);margin-top:4px;">Earns ${m.pts} Pts</div></div>
    <div class="modal-actions">
      <button class="btn-outline-sm" onclick="payPoints(${m.price*10})">Pay with Points</button>
      <button class="btn-solid-sm" onclick="chargeRoom(${m.price}, ${m.pts}, '${m.name}')">Charge to Account</button>
    </div>`);
};
window.payPoints = function(cost) {
  if(MEMBER.points < cost) return showToast("Insufficient Points!");
  MEMBER.points -= cost; closeModal(); showToast(`Paid using ${cost} points. Order sent to KDS!`);
  KDS_TICKETS.push({ id: "KOT-"+Math.floor(Math.random()*900+100), table: 1, items: "1x Mobile Order", time: "Just now", status: "prep" });
  renderers.dining(document.getElementById('screen-dining'));
};
window.chargeRoom = function(price, pts, name) {
  MEMBER.balanceAED += price; MEMBER.points += pts; closeModal(); showToast("Charged to account. Order sent to KDS!");
  INVOICES.unshift({ id: "INV-" + Math.floor(Math.random()*9000), name: "F&B: " + name, date: "Today", amount: price, status: "DUE" });
  KDS_TICKETS.push({ id: "KOT-"+Math.floor(Math.random()*900+100), table: 1, items: "1x "+name, time: "Just now", status: "prep" });
  renderers.dining(document.getElementById('screen-dining'));
};

window.showCheckoutModal = function(name, amount, id) {
  const action = id ? "settleInvoice('"+id+"', "+amount+")" : "settleAllBalance()";
  showModal(`
    <div class="modal-title">Secure Payment Gateway</div>
    <div class="modal-detail-row" style="margin-top:16px;"><span>${name}</span><span>AED ${(amount*0.95).toFixed(2)}</span></div>
    <div class="modal-detail-row"><span>VAT (5%)</span><span>AED ${(amount*0.05).toFixed(2)}</span></div>
    <div class="modal-total-box"><div class="modal-total-label">Amount to Pay</div><div class="modal-total-val">AED ${amount.toFixed(2)}</div></div>
    <div class="modal-actions"><button class="btn-outline-sm" onclick="closeModal()">Cancel</button><button class="btn-solid-sm" onclick="${action}">Authorize Payment</button></div>`);
};
window.settleInvoice = function(id, amt) {
  const inv = INVOICES.find(i=>i.id===id); if(inv) inv.status = "PAID";
  MEMBER.balanceAED -= amt; closeModal(); showToast("Payment processed. ERP updated.");
  renderers.finances(document.getElementById('screen-finances'));
};
window.settleAllBalance = function() {
  INVOICES.forEach(i => i.status = "PAID"); MEMBER.balanceAED = 0; closeModal(); showToast("All dues paid securely.");
  renderers.finances(document.getElementById('screen-finances'));
};

// ── MEMBER PROFILE GAPS ──
window.showEditProfileModal = function() {
  showModal(`
    <div class="modal-title">Edit Profile</div>
    <input type="text" class="input-field" id="edit-name" value="${MEMBER.name}" style="margin-top:16px;">
    <input type="text" class="input-field" id="edit-phone" value="${MEMBER.phone}">
    <div class="modal-actions"><button class="btn-outline-sm" onclick="closeModal()">Discard</button><button class="btn-solid-sm" onclick="saveProfile()">Save Changes</button></div>`);
};
window.saveProfile = function() {
  MEMBER.name = document.getElementById('edit-name').value;
  MEMBER.phone = document.getElementById('edit-phone').value;
  closeModal(); showToast("Profile updated into CRM.");
  renderers.profile(document.getElementById('screen-profile'));
};
window.reqMaintenance = function(boatName) {
  showModal(`
    <div class="modal-title">Boat Maintenance</div>
    <div class="modal-sub">Submit work request for ${boatName} to the Marina Yard.</div>
    <textarea class="input-field" placeholder="Describe the issue... e.g., Hull cleaning required" style="height:80px; resize:none; margin-top:16px;"></textarea>
    <div class="modal-actions"><button class="btn-outline-sm" onclick="closeModal()">Cancel</button><button class="btn-solid-sm" onclick="closeModal();showToast('Work Order dispatched to Yard')">Submit Request</button></div>`);
};
window.generatePDFStatement = function(invoiceId) {
  const viewer = document.getElementById('pdf-viewer');
  const content = document.getElementById('pdf-content');
  
  if(!invoiceId) {
    // Generate full statement
    let html = `<div class="pdf-receipt"><div class="pdf-header"><h2>DOSC STATEMENT</h2><p>${MEMBER.name}<br>TRN: 1002939922</p></div>`;
    INVOICES.forEach(i => { html += `<div class="pdf-row"><span>${i.date} - ${i.name}</span><span>AED ${i.amount}</span></div>`; });
    html += `<div class="pdf-total"><span>BALANCE DUE:</span><span>AED ${MEMBER.balanceAED.toLocaleString()}</span></div></div>`;
    content.innerHTML = html;
  } else {
    const inv = INVOICES.find(i => i.id === invoiceId);
    let html = `<div class="pdf-receipt"><div class="pdf-header"><h2>TAX INVOICE</h2><p>Inv #: ${inv.id}<br>${inv.date}</p></div>`;
    html += `<div class="pdf-row"><span>${inv.name}</span><span>AED ${(inv.amount*0.95).toFixed(2)}</span></div>`;
    html += `<div class="pdf-row"><span>VAT (5%)</span><span>AED ${(inv.amount*0.05).toFixed(2)}</span></div>`;
    html += `<div class="pdf-total"><span>TOTAL:</span><span>AED ${inv.amount.toLocaleString()}</span></div><div style="text-align:center;margin-top:20px;font-weight:bold;">STATUS: ${inv.status}</div></div>`;
    content.innerHTML = html;
  }
  viewer.classList.add('show');
};

// ── STAFF ACTIONS ──
window.staffOrder = function(tblId) {
  const tbl = TABLES.find(t=>t.id===tblId);
  if(tbl.status === 'occupied') return showToast(`Table ${tblId} is already occupied. Adding items...`);
  tbl.status = 'occupied';
  STAFF_METRICS.activeTables++;
  STAFF_METRICS.revenue += 120; // mock order
  KDS_TICKETS.push({ id: "KOT-"+Math.floor(Math.random()*900+100), table: tblId, items: "1x Staff App Order", time: "Just now", status: "prep" });
  showToast(`Table ${tblId} opened. Order sent to KDS.`);
  renderers['staff-pos'](document.getElementById('screen-staff-pos'));
  renderers['staff-kpi'](document.getElementById('screen-staff-kpi'));
};
window.markKDSTicket = function(id) {
  KDS_TICKETS = KDS_TICKETS.filter(t=>t.id!==id);
  showToast("Ticket marked Ready.");
  renderers['staff-kds'](document.getElementById('screen-staff-kds'));
};

document.addEventListener('click', (e) => {
  const tray = document.getElementById('notification-tray');
  if (tray && tray.classList.contains('show') && !e.target.closest('.bell-wrap') && !e.target.closest('.notification-tray')) {
    toggleNotifications();
  }
});

// INITIALIZE TOAST
window.showToast = function(msg) {
  const t = document.getElementById('toast');
  t.innerText = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
};
