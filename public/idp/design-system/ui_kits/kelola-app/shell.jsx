/* Kelola UI Kit — Login screen + App shell (sidebar, header) */

function LoginScreen({ onLogin }) {
  const [email, setEmail] = React.useState('rina@acmecorp.co.id');
  const [pw, setPw] = React.useState('password');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const submit = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 650); };

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <header style={{ height: 56, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 8, background: '#fff', borderBottom: '1px solid var(--border)' }}>
        <img src="../../assets/logo-kelola-mark.svg" height="28" alt="" />
        <span style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: 20, color: 'var(--primary-5)' }}>Kelola</span>
      </header>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <KCard style={{ width: 400, maxWidth: '100%' }} padding={28}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 20, color: 'var(--text-strong)' }}>Masuk ke Kelola</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Kelola talenta perusahaan Anda</div>
          </div>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <KTextInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} leftSection={<i className="ti ti-mail" />} required />
            <KTextInput label="Password" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
            <KCheckbox label="Remember email" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)', textDecoration: 'underline' }}>Forgot your password?</a>
              <KButton type="submit" uppercase loading={loading}>Log in</KButton>
            </div>
          </form>
        </KCard>
      </div>
    </div>
  );
}

function Sidebar({ active, onNavigate }) {
  const D = window.KELOLA_DATA;
  return (
    <nav style={{ width: 252, flexShrink: 0, background: 'var(--gradient-primary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 56, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 8 }}>
        <img src="../../assets/logo-kelola-mark.svg" height="26" alt="" />
        <span style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: 19, color: 'var(--primary-5)' }}>Kelola</span>
      </div>
      <div style={{ flex: 1, padding: '16px 0 16px 14px', display: 'flex', flexDirection: 'column' }}>
        {D.nav.map((it) => <SideItem key={it.id} item={it} active={active === it.id} onClick={() => onNavigate(it.id)} />)}
      </div>
      <div style={{ padding: '0 14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(248,249,250,0.18)', borderRadius: 'var(--radius-pill)' }}>
          <KAvatar name={D.user.name} size={32} ring={false} color="secondary" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{D.user.name}</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.8)' }}>{D.user.role}</div>
          </div>
          <i className="ti ti-chevron-up" style={{ color: '#fff', fontSize: 14 }} />
        </div>
      </div>
    </nav>
  );
}

function SideItem({ item, active, onClick }) {
  const [h, setH] = React.useState(false);
  const canvas = 'var(--background)';
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 4, marginLeft: active ? 10 : 0, fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14, color: active ? 'var(--primary-5)' : '#fff', background: active ? canvas : (h ? 'rgba(255,255,255,0.14)' : 'transparent'), borderRadius: active || h ? '18px 0 0 18px' : 0, cursor: active ? 'default' : 'pointer', transition: 'background .2s,color .2s' }}>
      {active && <>
        <span style={{ position: 'absolute', background: 'transparent', bottom: '100%', right: 0, height: 18, width: 18, borderBottomRightRadius: 14, boxShadow: `0 9px 0 0 ${canvas}` }} />
        <span style={{ position: 'absolute', background: 'transparent', top: '100%', right: 0, height: 18, width: 18, borderTopRightRadius: 14, boxShadow: `0 -9px 0 0 ${canvas}` }} />
      </>}
      <span style={{ display: 'flex', fontSize: 16, zIndex: 1 }}><i className={'ti ' + item.icon} /></span>
      <span style={{ flex: 1, zIndex: 1 }}>{item.label}</span>
      {item.beta && <span style={{ zIndex: 1 }}><KBadge gradient notch>BETA</KBadge></span>}
    </div>
  );
}

function Header({ title, onLogout }) {
  return (
    <header style={{ height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', background: '#fff', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 18, color: 'var(--text-strong)', whiteSpace: 'nowrap', flexShrink: 0 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <KIconButton title="Search"><i className="ti ti-search" /></KIconButton>
        <KIconButton title="Notifications"><i className="ti ti-bell" /></KIconButton>
        <KIconButton title="Log out" onClick={onLogout}><i className="ti ti-logout" /></KIconButton>
      </div>
    </header>
  );
}

Object.assign(window, { LoginScreen, Sidebar, Header });
