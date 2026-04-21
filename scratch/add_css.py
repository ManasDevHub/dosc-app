import os

css_append = """
/* ── DINING & F&B ── */
#screen-dining { background: var(--canvas-bg); }
.menu-category-title { font-size: 18px; font-weight: 800; color: var(--text-primary); margin: 24px 20px 12px; letter-spacing: -0.3px; }
.menu-list { display: flex; flex-direction: column; gap: 12px; padding: 0 20px 24px; }
.menu-item { background: var(--surface); border-radius: var(--radius-xl); padding: 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm); border: 1px solid white; cursor: pointer; transition: transform 0.2s; }
.menu-item:active { transform: scale(0.98); background: var(--surface-hover); }
.menu-img { width: 64px; height: 64px; border-radius: 12px; background: #EFF6FF; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; margin-right: 16px; }
.menu-info { flex: 1; }
.menu-title { font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
.menu-desc { font-size: 13px; font-weight: 500; color: var(--text-secondary); line-height: 1.3; }
.menu-price-wrap { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.menu-price { font-size: 16px; font-weight: 800; color: var(--brand-blue-dark); }
.menu-points { font-size: 11px; font-weight: 700; color: var(--brand-red); background: var(--brand-red-light); padding: 4px 8px; border-radius: 8px; }

/* ── MARINA & BOATS ── */
.boat-card { background: var(--surface); border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-sm); border: 1px solid white; margin-bottom: 16px; display: flex; align-items: center; gap: 16px; }
.boat-icon { width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
.boat-info { flex: 1; }
.boat-name { font-size: 18px; font-weight: 800; color: var(--text-primary); margin-bottom: 4px; }
.boat-meta { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
.boat-status { font-size: 12px; font-weight: 700; color: var(--success); background: #ECFDF5; padding: 4px 10px; border-radius: 8px; }

/* ── NOTIFICATION TRAY ── */
.bell-wrap { position: relative; cursor: pointer; padding: 8px; margin-right: -8px; }
.bell-badge { position: absolute; top: 6px; right: 8px; width: 8px; height: 8px; background: var(--brand-red); border-radius: 50%; box-shadow: 0 0 0 2px var(--surface); }
.notification-tray { position: absolute; top: 100%; right: 20px; width: 320px; max-height: 400px; background: var(--surface); border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); border: 1px solid var(--border-light); overflow-y: auto; z-index: 50; opacity: 0; pointer-events: none; transform: translateY(-10px) scale(0.98); transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); transform-origin: top right; }
.notification-tray.show { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }
.notif-header { padding: 16px 20px; border-bottom: 1px solid var(--border-light); font-size: 14px; font-weight: 700; color: var(--text-primary); display: flex; justify-content: space-between; position: sticky; top: 0; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); z-index: 2; }
.notif-mark { font-size: 12px; color: var(--brand-blue); cursor: pointer; font-weight: 600; }
.notif-item { padding: 16px 20px; border-bottom: 1px solid var(--border-light); transition: background 0.2s; cursor: pointer; position: relative; }
.notif-item:active { background: var(--surface-hover); }
.notif-item.unread::before { content: ''; position: absolute; left: 8px; top: 22px; width: 6px; height: 6px; border-radius: 50%; background: var(--brand-blue); }
.notif-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; padding-left: 8px; }
.notif-body { font-size: 13px; font-weight: 500; color: var(--text-secondary); line-height: 1.4; margin-bottom: 8px; padding-left: 8px; }
.notif-time { font-size: 11px; font-weight: 600; color: var(--text-muted); padding-left: 8px; }

/* ── MODALS (GUEST & PAYMENT) ── */
.input-field { width: 100%; padding: 14px 16px; background: var(--canvas-bg); border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 15px; font-family: 'Inter', sans-serif; font-weight: 500; transition: all 0.2s; margin-bottom: 16px; outline: none; }
.input-field:focus { background: var(--surface); border-color: var(--brand-blue); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
.modal-total-box { background: var(--canvas-bg); border-radius: var(--radius-lg); padding: 16px; text-align: center; margin: 24px 0; border: 1px solid var(--border-light); }
.modal-total-label { font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 8px; }
.modal-total-val { font-size: 28px; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }

/* ── ADDITIONAL FIXES ── */
.loyalty-card { background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); border-radius: var(--radius-xl); padding: 24px; color: white; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 16px 32px rgba(15,23,42,0.2); margin-bottom: 24px; position: relative; overflow: hidden; }
.loyalty-card::after { content: 'DOSC'; position: absolute; right: -20px; bottom: -20px; font-size: 100px; font-weight: 800; opacity: 0.05; letter-spacing: -5px; }
.loyalty-tier { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #FCD34D; }
.loyalty-pts { font-size: 36px; font-weight: 800; letter-spacing: -1px; }
.loyalty-pts span { font-size: 16px; color: var(--text-muted); font-weight: 600; }
"""

with open("C:\\Users\\patil\\.gemini\\antigravity\\scratch\\dosc-app\\css\\app.css", "a", encoding="utf-8") as f:
    f.write(css_append)
print("CSS injected successfully.")
