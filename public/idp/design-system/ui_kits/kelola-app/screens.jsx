/* Kelola UI Kit — content screens: Dashboard, Employee List, Talent Mapping (9-box) */

function BannerCard() {
  const D = window.KELOLA_DATA;
  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--gradient-primary)', padding: '22px 26px', color: '#fff', boxShadow: 'var(--shadow-card)' }}>
      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: 22 }}>Selamat datang, {D.user.name.split(' ')[0]} 👋</div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, opacity: .92, marginTop: 4, maxWidth: 460 }}>
        Pantau pencapaian, kompetensi, dan pengembangan talenta di {D.company}.
      </div>
      <div style={{ position: 'absolute', right: 18, top: 14, opacity: .9 }}>
        <img src="../../assets/team-type-strategic.svg" height="78" alt="" />
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, hint, color = 'primary', icon }) {
  return (
    <KCard padding={16}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '.03em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: `var(--${color}-1)`, color: `var(--${color}-6)`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}><i className={'ti ' + icon} /></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 10 }}>
        <span style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: 30, color: 'var(--text-strong)', lineHeight: 1 }}>{value}</span>
        {suffix && <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-muted)' }}>{suffix}</span>}
      </div>
      {hint && <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-faint)', marginTop: 6 }}>{hint}</div>}
    </KCard>
  );
}

function AspectChart() {
  const D = window.KELOLA_DATA;
  const max = 5;
  return (
    <KCard title="Aspect to Standard" subtitle="Company average vs. role standard" action={<KBadge color="primary">2025 Q2</KBadge>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
        {D.aspects.map((a) => {
          const met = a.score >= a.standard;
          return (
            <div key={a.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-body)' }}>{a.label}</span>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, color: met ? 'var(--success-5)' : 'var(--warning-6)' }}>{a.score.toFixed(1)}</span>
              </div>
              <div style={{ position: 'relative', height: 8, borderRadius: 99, background: 'var(--neutral-2)' }}>
                <div style={{ width: `${(a.score / max) * 100}%`, height: '100%', borderRadius: 99, background: met ? 'var(--primary-5)' : 'var(--warning-5)' }} />
                <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${(a.standard / max) * 100}%`, width: 2, background: 'var(--neutral-7)', borderRadius: 2 }} title="standard" />
              </div>
            </div>
          );
        })}
      </div>
    </KCard>
  );
}

function DonutCard() {
  const pct = window.KELOLA_DATA.stats.profileCompletion;
  const r = 52, circ = 2 * Math.PI * r, off = circ * (1 - pct / 100);
  return (
    <KCard title="Profile Data" subtitle="Completion · 248 employees">
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 4 }}>
        <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
          <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="64" cy="64" r={r} fill="none" stroke="var(--neutral-2)" strokeWidth="14" />
            <circle cx="64" cy="64" r={r} fill="none" stroke="var(--primary-5)" strokeWidth="14" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: 26, color: 'var(--text-strong)' }}>{pct}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Legend c="var(--primary-5)" label="Complete" v="216 employees" />
          <Legend c="var(--neutral-3)" label="Incomplete" v="32 employees" />
          <KButton variant="subtle" size="sm" rightIcon={<i className="ti ti-arrow-right" />} style={{ marginTop: 4, paddingLeft: 0 }}>Review data</KButton>
        </div>
      </div>
    </KCard>
  );
}
function Legend({ c, label, v }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 3, background: c }} /><span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-body)', minWidth: 78 }}>{label}</span><span style={{ fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{v}</span></div>;
}

function DashboardScreen() {
  const D = window.KELOLA_DATA;
  const [tab, setTab] = React.useState('company');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <BannerCard />
      <KTabs value={tab} onChange={setTab} tabs={[{ value: 'company', label: 'Company' }, { value: 'individu', label: 'Individual' }]} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard label="Avg Score" value={D.stats.avgScore.toFixed(1)} suffix="/ 5.0" hint="Company-wide" color="primary" icon="ti-star" />
        <StatCard label="Profile Data" value={D.stats.profileCompletion} suffix="%" hint="Completion" color="success" icon="ti-database" />
        <StatCard label="Succession Risk" value={D.stats.successionRisk.count} suffix={`/ ${D.stats.successionRisk.total}`} hint="Positions at risk" color="warning" icon="ti-alert-triangle" />
        <StatCard label="Need Development" value={D.stats.needDevelopment.count} suffix="employees" hint="Below standard" color="error" icon="ti-trending-down" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
        <AspectChart />
        <DonutCard />
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { Active: 'success', 'On Leave': 'warning', Resigned: 'error' }[status];
  return <KBadge color={m} leftDot>{status}</KBadge>;
}

function EmployeeListScreen({ onOpenMapping }) {
  const D = window.KELOLA_DATA;
  const [q, setQ] = React.useState('');
  const rows = D.employees.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()) || e.position.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ width: 280 }}><KTextInput placeholder="Find employee" leftSection={<i className="ti ti-search" />} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <KButton variant="light" leftIcon={<i className="ti ti-filter" />}>Filter</KButton>
          <KButton leftIcon={<i className="ti ti-plus" />}>Add Employee</KButton>
        </div>
      </div>
      <KCard padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--neutral-1)' }}>
              {['Employee', 'Department', 'DISC', 'Score', 'Profile', 'Status'].map((h, i) => (
                <th key={h} style={{ textAlign: i > 1 && i < 5 ? 'center' : 'left', padding: '12px 16px', fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} style={{ borderBottom: '1px solid var(--neutral-2)' }}>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <KAvatar name={e.name} size={36} color={e.id % 2 ? 'primary' : 'secondary'} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 13, color: 'var(--text-strong)' }}>{e.name}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)' }}>{e.position}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 16px', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-body)' }}>{e.dept}</td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}><KBadge variant="light" color="primary">{e.disc}</KBadge></td>
                <td style={{ padding: '10px 16px', textAlign: 'center', fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 13, color: 'var(--text-strong)' }}>{e.score.toFixed(1)}</td>
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <div style={{ width: 56, height: 6, borderRadius: 99, background: 'var(--neutral-2)', overflow: 'hidden' }}><div style={{ width: `${e.completion}%`, height: '100%', background: e.completion === 100 ? 'var(--success-5)' : 'var(--primary-5)' }} /></div>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)' }}>{e.completion}%</span>
                  </div>
                </td>
                <td style={{ padding: '10px 16px' }}><StatusBadge status={e.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </KCard>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>Showing {rows.length} of {D.employees.length} employees</span>
        <KButton variant="subtle" rightIcon={<i className="ti ti-box" />} onClick={onOpenMapping}>Open Box Mapping</KButton>
      </div>
    </div>
  );
}

function TalentMappingScreen() {
  const D = window.KELOLA_DATA;
  const [sel, setSel] = React.useState(null);
  const tints = [['var(--warning-1)', 'var(--primary-1)', 'var(--success-1)'], ['var(--neutral-1)', 'var(--primary-1)', 'var(--primary-1)'], ['var(--error-1)', 'var(--neutral-1)', 'var(--primary-1)']];
  const txt = [['var(--warning-7)', 'var(--primary-6)', 'var(--success-6)'], ['var(--text-muted)', 'var(--primary-6)', 'var(--primary-6)'], ['var(--error-6)', 'var(--text-muted)', 'var(--primary-6)']];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <KCard title="9-Box Talent Mapping" subtitle="Performance × Potential — 248 employees mapped" action={<KButton size="sm" variant="light" leftIcon={<i className="ti ti-download" />}>Export</KButton>}>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>Performance →</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 8, aspectRatio: '3 / 2' }}>
              {D.boxLabels.map((row, r) => row.map((label, c) => {
                const id = `${r}-${c}`; const on = sel === id;
                return (
                  <div key={id} onClick={() => setSel(on ? null : id)}
                    style={{ background: tints[r][c], border: `2px solid ${on ? 'var(--secondary-6)' : 'transparent'}`, borderRadius: 'var(--radius-md)', padding: 12, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color .2s' }}>
                    <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 13, color: txt[r][c] }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: 24, color: txt[r][c] }}>{D.boxCounts[r][c]}</span>
                  </div>
                );
              }))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 8, fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)' }}>Potential →</div>
          </div>
        </div>
      </KCard>
      {sel && <KCard padding={14} style={{ borderLeft: '3px solid var(--secondary-6)' }}><span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-body)' }}>Selected box <b>{D.boxLabels[+sel[0]][+sel[2]]}</b> — {D.boxCounts[+sel[0]][+sel[2]]} employees. Click again to deselect.</span></KCard>}
    </div>
  );
}

Object.assign(window, { DashboardScreen, EmployeeListScreen, TalentMappingScreen });
