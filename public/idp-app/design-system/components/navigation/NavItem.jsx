import React, { useState } from 'react';

/**
 * Kelola Sidebar nav item — the signature carved-notch active state on the
 * blue gradient rail. When active, the item background becomes the canvas
 * color and concave notches are carved above/below via box-shadow pseudo-
 * elements. Renders inside a `.bg-gradient-primary` container.
 */
export function NavItem({ icon, label, active = false, badge, onClick, canvas = 'var(--background)' }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 12px', marginBottom: 4, marginLeft: active ? 10 : 0,
        fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14,
        color: active ? 'var(--primary-5)' : '#fff',
        background: active ? canvas : (hover ? 'rgba(255,255,255,0.14)' : 'transparent'),
        borderRadius: active || hover ? '18px 0 0 18px' : '0',
        cursor: active ? 'default' : 'pointer',
        transition: 'background var(--duration-base), color var(--duration-base)',
      }}
    >
      {active && <>
        <span style={{ position: 'absolute', background: 'transparent', bottom: '100%', right: 0, height: 18, width: 18, borderBottomRightRadius: 14, boxShadow: `0 9px 0 0 ${canvas}` }} />
        <span style={{ position: 'absolute', background: 'transparent', top: '100%', right: 0, height: 18, width: 18, borderTopRightRadius: 14, boxShadow: `0 -9px 0 0 ${canvas}` }} />
      </>}
      <span style={{ display: 'flex', alignItems: 'center', fontSize: 16, zIndex: 1 }}>{icon}</span>
      <span style={{ flex: 1, zIndex: 1 }}>{label}</span>
      {badge && <span style={{ zIndex: 1 }}>{badge}</span>}
    </div>
  );
}

/**
 * Container rail. Pass NavItem children; provides the brand gradient and a
 * white logo strip at the top.
 */
export function Sidebar({ children, logo, width = 264, style = {} }) {
  return (
    <nav style={{
      width, minHeight: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--gradient-primary)', ...style,
    }}>
      {logo && (
        <div style={{
          height: 56, background: '#fff', display: 'flex', alignItems: 'center',
          padding: '0 20px', gap: 8,
        }}>{logo}</div>
      )}
      <div style={{ padding: '16px 0 16px 16px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </nav>
  );
}
