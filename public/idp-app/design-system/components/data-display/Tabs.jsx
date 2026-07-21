import React, { useState } from 'react';

/**
 * Kelola Tabs — underline tabs (as on the Home dashboard: Company / Individual).
 * Active tab text turns primary and grows a primary underline.
 */
export function Tabs({ tabs = [], value, defaultValue, onChange, style = {} }) {
  const items = tabs.map((t) => (typeof t === 'string' ? { value: t, label: t } : t));
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const active = value ?? internal;
  const pick = (v) => { setInternal(v); onChange && onChange(v); };

  return (
    <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--neutral-2)', ...style }}>
      {items.map((t) => {
        const on = t.value === active;
        return (
          <button key={t.value} onClick={() => pick(t.value)}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.color = 'var(--text-body)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.color = 'var(--text-muted)'; }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '10px 14px', marginBottom: -1,
              fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14,
              color: on ? 'var(--primary-5)' : 'var(--text-muted)',
              borderBottom: `2px solid ${on ? 'var(--primary-5)' : 'transparent'}`,
              transition: 'color var(--duration-base), border-color var(--duration-base)',
            }}>
            {t.icon}{t.label}
            {t.count != null && (
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                background: on ? 'var(--primary-1)' : 'var(--neutral-2)',
                color: on ? 'var(--primary-6)' : 'var(--text-muted)',
                borderRadius: 'var(--radius-pill)', padding: '1px 7px',
              }}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
