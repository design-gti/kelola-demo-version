import React, { useState, useRef, useEffect } from 'react';

/**
 * Kelola Select — bordered field with a chevron that opens a soft-shadowed
 * menu. Selected option highlights in primary-1.
 */
export function Select({
  label, placeholder = 'Select…', data = [], value, onChange,
  disabled = false, error, id, style = {},
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value ?? null);
  const ref = useRef(null);
  const selected = value ?? internal;

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const options = data.map((d) => (typeof d === 'string' ? { value: d, label: d } : d));
  const current = options.find((o) => o.value === selected);

  const pick = (v) => { setInternal(v); onChange && onChange(v); setOpen(false); };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'relative', ...style }}>
      {label && <span style={{ fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, color: 'var(--text-body)' }}>{label}</span>}
      <button type="button" disabled={disabled} onClick={() => setOpen((o) => !o)}
        style={{
          height: 38, padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: disabled ? 'var(--neutral-1)' : 'var(--neutral-0)',
          border: `1px solid ${error ? 'var(--error-5)' : open ? 'var(--primary-5)' : 'var(--border-input)'}`,
          borderRadius: 'var(--radius-sm)', cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-body)', fontSize: 12,
          color: current ? 'var(--text-strong)' : 'var(--text-faint)',
          boxShadow: open ? 'var(--shadow-focus)' : 'none', transition: 'all var(--duration-base)',
        }}>
        <span>{current ? current.label : placeholder}</span>
        <i className="ti ti-chevron-down" style={{ color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform var(--duration-base)' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 20,
          background: 'var(--neutral-0)', borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)', padding: 4, maxHeight: 220, overflowY: 'auto',
        }}>
          {options.map((o) => {
            const active = o.value === selected;
            return (
              <div key={o.value} onClick={() => pick(o.value)}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--neutral-1)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                style={{
                  padding: '8px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 12,
                  color: active ? 'var(--primary-6)' : 'var(--text-body)',
                  fontWeight: active ? 700 : 400,
                  background: active ? 'var(--primary-1)' : 'transparent',
                }}>
                {o.label}
              </div>
            );
          })}
        </div>
      )}
      {error && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--error-5)' }}>{error}</span>}
    </div>
  );
}
