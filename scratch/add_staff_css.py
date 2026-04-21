import os

css_append = """
/* ── ENTERPRISE STAFF MODE STYLES ── */
body.mode-staff { --canvas-bg: #0F172A; --surface: #1E293B; --surface-hover: #334155; --text-primary: #F8FAFC; --text-secondary: #94A3B8; --border-light: #334155; }
.staff-ui { background: var(--canvas-bg) !important; color: var(--text-primary); }

/* STAFF KPI */
.kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 20px; }
.kpi-card { background: var(--surface); border-radius: 16px; padding: 16px; border: 1px solid var(--border-light); }
.kpi-val { font-size: 24px; font-weight: 800; color: white; margin-bottom: 4px; }
.kpi-lbl { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }

/* KDS KANBAN */
.kds-board { display: flex; overflow-x: auto; padding: 20px; gap: 16px; height: calc(100vh - 140px); scroll-snap-type: x mandatory; }
.kds-col { flex: 0 0 280px; scroll-snap-align: start; display: flex; flex-direction: column; gap: 12px; }
.kds-col-title { font-size: 14px; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 8px; border-bottom: 2px solid var(--border-light); }
.kds-ticket { background: var(--surface); border-radius: 12px; padding: 16px; border-left: 4px solid var(--brand-blue); box-shadow: 0 4px 12px rgba(0,0,0,0.2); animation: slideInUp 0.3s ease; }
.kds-ticket.urgent { border-left-color: var(--brand-red); }
.kds-ticket-id { font-size: 11px; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px; }
.kds-ticket-items { font-size: 14px; font-weight: 600; color: white; line-height: 1.4; margin-bottom: 12px; }
.kds-ticket-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); }

/* POS TABLES */
.pos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 20px; }
.pos-table { aspect-ratio: 1; background: var(--surface); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 800; color: white; border: 2px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.pos-table:active { transform: scale(0.9); }
.pos-table.occupied { border-color: var(--brand-red); background: rgba(239, 68, 68, 0.1); }
.pos-table.available { border-color: var(--success); background: rgba(16, 185, 129, 0.1); }
.pos-table-lbl { font-size: 18px; }
.pos-table-status { font-size: 10px; text-transform: uppercase; margin-top: 4px; }

/* PDF RECEIPT */
.pdf-receipt { text-align: left; color: black; font-family: monospace; font-size: 13px; line-height: 1.6; }
.pdf-header { text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 16px; margin-bottom: 16px; }
.pdf-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
.pdf-total { font-size: 16px; font-weight: bold; border-top: 1px dashed #ccc; padding-top: 16px; margin-top: 16px; }
"""

with open("C:\\Users\\patil\\.gemini\\antigravity\\scratch\\dosc-app\\css\\app.css", "a", encoding="utf-8") as f:
    f.write(css_append)
print("Staff CSS Appended")
