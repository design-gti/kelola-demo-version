/* Kelola UI Kit — lean primitives that mirror the design-system components,
   using the same tokens from styles.css. Registered on window for the screens.
   (A self-contained mirror so the kit renders standalone, in the DS tab, and when downloaded.) */

function KButton({ children, variant = 'filled', color = 'primary', size = 'md', fullWidth, leftIcon, rightIcon, uppercase, loading, disabled, onClick, style = {} }) {
  const sizes = { sm: { h: 30, p: '0 16px', f: 13 }, md: { h: 38, p: '0 22px', f: 14 }, lg: { h: 46, p: '0 30px', f: 15 } };
  const s = sizes[size]; const c = color;
  const V = {
    filled: { background: `var(--${c}-5)`, color: '#fff' },
    light: { background: `var(--${c}-1)`, color: `var(--${c}-6)` },
    outline: { background: 'transparent', color: `var(--${c}-5)`, border: '1px solid currentColor' },
    subtle: { background: 'transparent', color: `var(--${c}-5)` },
  }[variant];
  const [h, setH] = React.useState(false);
  const hover = h && !disabled ? { background: variant === 'filled' ? `var(--${c}-6)` : `var(--${c}-1)` } : {};
  return (
    <button onClick={onClick} disabled={disabled || loading} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: s.h, padding: s.p, width: fullWidth ? '100%' : 'auto', fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: s.f, lineHeight: 1, textTransform: uppercase ? 'uppercase' : 'none', letterSpacing: uppercase ? '.04em' : 0, borderRadius: 'var(--radius-pill)', border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .5 : 1, whiteSpace: 'nowrap', transition: 'background .2s', ...V, ...hover, ...style }}>
      {loading && <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'kspin .7s linear infinite' }} />}
      {!loading && leftIcon}{children}{!loading && rightIcon}
    </button>
  );
}

function KIconButton({ children, variant = 'subtle', color = 'primary', size = 34, onClick, title, style = {} }) {
  const [h, setH] = React.useState(false);
  const V = { filled: { background: `var(--${color}-5)`, color: '#fff' }, light: { background: `var(--${color}-1)`, color: `var(--${color}-6)` }, subtle: { background: h ? `var(--${color}-1)` : 'transparent', color: `var(--${color}-5)` } }[variant];
  return <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer', fontSize: 18, ...V, ...style }}>{children}</button>;
}

function KCard({ children, title, subtitle, action, padding = 16, style = {}, onClick, hoverable }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: hoverable && h ? 'var(--gradient-card-action)' : 'var(--surface-card)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', overflow: 'hidden', cursor: onClick ? 'pointer' : 'default', transition: 'background .2s', ...style }}>
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: `${padding}px ${padding}px 0` }}>
          <div>
            {title && <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 16, color: 'var(--text-strong)', lineHeight: 1.3 }}>{title}</div>}
            {subtitle && <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

function KBadge({ children, variant = 'light', color = 'primary', notch, gradient, leftDot, style = {} }) {
  const V = gradient ? { background: 'var(--gradient-primary)', color: '#fff' } : { filled: { background: `var(--${color}-5)`, color: '#fff' }, light: { background: `var(--${color}-1)`, color: `var(--${color}-6)` }, outline: { background: 'transparent', color: `var(--${color}-6)`, border: `1px solid var(--${color}-3)` } }[variant];
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 20, padding: '0 9px', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, lineHeight: 1, whiteSpace: 'nowrap', borderRadius: notch ? 'var(--radius-notch)' : 'var(--radius-pill)', ...V, ...style }}>{leftDot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}{children}</span>;
}

function KAvatar({ src, name = '', size = 40, color = 'primary', ring = true, style = {} }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  return <span style={{ width: size, height: size, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: src ? 'var(--neutral-0)' : `var(--${color}-1)`, border: ring ? '2px solid var(--neutral-3)' : 'none', boxSizing: 'border-box', overflow: 'hidden', flexShrink: 0, ...style }}>{src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: size * 0.38, color: `var(--${color}-6)` }}>{initials || '?'}</span>}</span>;
}

function KTextInput({ label, type = 'text', placeholder, value, onChange, leftSection, required, error, style = {} }) {
  const [f, setF] = React.useState(false);
  const [reveal, setReveal] = React.useState(false);
  const isPw = type === 'password';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {label && <label style={{ fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, color: 'var(--text-body)' }}>{label}{required && <span style={{ color: 'var(--error-5)' }}> *</span>}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftSection && <span style={{ position: 'absolute', left: 12, color: 'var(--text-faint)', display: 'flex' }}>{leftSection}</span>}
        <input type={isPw ? (reveal ? 'text' : 'password') : type} placeholder={placeholder} value={value} onChange={onChange} onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ width: '100%', boxSizing: 'border-box', height: 38, padding: '0 12px', paddingLeft: leftSection ? 36 : 12, paddingRight: isPw ? 36 : 12, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-strong)', background: 'var(--neutral-0)', border: `1px solid ${error ? 'var(--error-5)' : f ? 'var(--primary-5)' : 'var(--border-input)'}`, borderRadius: 'var(--radius-sm)', outline: 'none', boxShadow: f && !error ? 'var(--shadow-focus)' : 'none', transition: 'all .2s' }} />
        {isPw && <button type="button" onClick={() => setReveal(r => !r)} style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}><i className={reveal ? 'ti ti-eye-off' : 'ti ti-eye'} /></button>}
      </div>
      {error && <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--error-5)' }}>{error}</span>}
    </div>
  );
}

function KCheckbox({ label, checked, onChange }) {
  return <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><span style={{ position: 'relative', width: 18, height: 18, display: 'inline-flex' }}><input type="checkbox" checked={checked} onChange={onChange} style={{ position: 'absolute', opacity: 0, width: 18, height: 18, margin: 0, cursor: 'pointer' }} /><span style={{ width: 18, height: 18, borderRadius: 'var(--radius-sm)', border: `1.5px solid ${checked ? 'var(--primary-5)' : 'var(--border-strong)'}`, background: checked ? 'var(--primary-5)' : '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>{checked && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2.5 6.2L4.8 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}</span></span><span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-body)' }}>{label}</span></label>;
}

function KTabs({ tabs, value, onChange }) {
  return <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--neutral-2)' }}>{tabs.map(t => { const on = t.value === value; return <button key={t.value} onClick={() => onChange(t.value)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px', marginBottom: -1, fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14, color: on ? 'var(--primary-5)' : 'var(--text-muted)', borderBottom: `2px solid ${on ? 'var(--primary-5)' : 'transparent'}`, transition: 'all .2s' }}>{t.label}</button>; })}</div>;
}

if (typeof document !== 'undefined' && !document.getElementById('kspin-kf')) {
  const st = document.createElement('style'); st.id = 'kspin-kf'; st.textContent = '@keyframes kspin{to{transform:rotate(360deg)}}'; document.head.appendChild(st);
}

Object.assign(window, { KButton, KIconButton, KCard, KBadge, KAvatar, KTextInput, KCheckbox, KTabs });
