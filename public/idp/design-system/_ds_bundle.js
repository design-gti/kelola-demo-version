/* @ds-bundle: {"format":3,"namespace":"KelolaDesignSystem_59e7aa","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/data-display/Avatar.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"Tabs","sourcePath":"components/data-display/Tabs.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"NavItem","sourcePath":"components/navigation/NavItem.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/NavItem.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"e1914e6ff454","components/buttons/IconButton.jsx":"e4e7b214d103","components/data-display/Avatar.jsx":"81a8f8c864cb","components/data-display/Card.jsx":"03188c639e01","components/data-display/Tabs.jsx":"ff5252463bd0","components/feedback/Alert.jsx":"960e4dca53f4","components/feedback/Badge.jsx":"3abbe3b20365","components/forms/Checkbox.jsx":"7d2b4af4eda1","components/forms/Select.jsx":"c449648cd96a","components/forms/Switch.jsx":"1bba06c8eb7c","components/forms/TextInput.jsx":"fe96f337ca3e","components/navigation/NavItem.jsx":"4fe3536daed1","ui_kits/kelola-app/data.js":"3f373a28dc32","ui_kits/kelola-app/kit-ui.jsx":"e344c89efd48","ui_kits/kelola-app/screens.jsx":"e9dd1fc9fb19","ui_kits/kelola-app/shell.jsx":"96c64b7a18e0"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KelolaDesignSystem_59e7aa = window.KelolaDesignSystem_59e7aa || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kelola Button — pill-shaped, Avenir 14/700 label.
 * Mirrors the product's Mantine Button (radius "xl", className "font-title").
 */
function Button({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  uppercase = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      height: 30,
      padding: '0 16px',
      font: 13
    },
    md: {
      height: 38,
      padding: '0 22px',
      font: 14
    },
    lg: {
      height: 46,
      padding: '0 30px',
      font: 15
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-title)',
    fontWeight: 700,
    fontSize: s.font,
    lineHeight: 1,
    letterSpacing: uppercase ? '0.04em' : 0,
    textTransform: uppercase ? 'uppercase' : 'none',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)',
    border: '1px solid transparent',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...style
  };
  const c = color; // primary | secondary | error | success | warning
  const solid = `var(--${c}-5)`;
  const solidHover = `var(--${c}-6)`;
  const soft = `var(--${c}-1)`;
  const deep = `var(--${c}-6)`;
  const variants = {
    filled: {
      background: solid,
      color: '#fff',
      '--hover-bg': solidHover
    },
    light: {
      background: soft,
      color: deep,
      '--hover-bg': `var(--${c}-2)`
    },
    outline: {
      background: 'transparent',
      color: solid,
      borderColor: 'currentColor',
      '--hover-bg': soft
    },
    subtle: {
      background: 'transparent',
      color: solid,
      '--hover-bg': soft
    }
  };
  const v = variants[variant] || variants.filled;
  const onEnter = e => {
    if (!disabled && !loading) e.currentTarget.style.background = e.currentTarget.style.getPropertyValue('--hover-bg');
  };
  const onLeave = e => {
    e.currentTarget.style.background = v.background;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled || loading,
    onClick: onClick,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    style: {
      ...base,
      ...v
    }
  }, rest), loading && /*#__PURE__*/React.createElement(Spinner, null), !loading && leftIcon, children, !loading && rightIcon);
}
function Spinner() {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block',
      animation: 'kelola-spin 0.7s linear infinite'
    }
  });
}

// keyframes injected once
if (typeof document !== 'undefined' && !document.getElementById('kelola-btn-kf')) {
  const st = document.createElement('style');
  st.id = 'kelola-btn-kf';
  st.textContent = '@keyframes kelola-spin{to{transform:rotate(360deg)}}';
  document.head.appendChild(st);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kelola IconButton — square/circular icon-only action.
 * Use for toolbar actions, close buttons, table row actions.
 */
function IconButton({
  children,
  variant = 'subtle',
  color = 'primary',
  size = 'md',
  radius = 'pill',
  disabled = false,
  onClick,
  'aria-label': ariaLabel,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: 28,
    md: 34,
    lg: 42
  };
  const dim = sizes[size] || sizes.md;
  const c = color;
  const solid = `var(--${c}-5)`;
  const soft = `var(--${c}-1)`;
  const variants = {
    filled: {
      background: solid,
      color: '#fff',
      '--hover-bg': `var(--${c}-6)`
    },
    light: {
      background: soft,
      color: `var(--${c}-6)`,
      '--hover-bg': `var(--${c}-2)`
    },
    subtle: {
      background: 'transparent',
      color: solid,
      '--hover-bg': soft
    }
  };
  const v = variants[variant] || variants.subtle;
  const radii = {
    pill: 'var(--radius-pill)',
    md: 'var(--radius-md)',
    sm: 'var(--radius-sm)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: e => {
      if (!disabled) e.currentTarget.style.background = e.currentTarget.style.getPropertyValue('--hover-bg');
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = v.background;
    },
    style: {
      width: dim,
      height: dim,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radii[radius] || radii.pill,
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background-color var(--duration-base) var(--ease-standard)',
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Avatar.jsx
try { (() => {
/**
 * Kelola Avatar — circular, white-padded with a thin ring (the product's
 * "border-avatar"). Falls back to initials on a tinted background.
 */
function Avatar({
  src,
  name = '',
  size = 40,
  color = 'primary',
  ring = true,
  style = {}
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: src ? 'var(--neutral-0)' : `var(--${color}-1)`,
      border: ring ? '2px solid var(--neutral-3)' : 'none',
      boxSizing: 'border-box',
      overflow: 'hidden',
      flexShrink: 0,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: size * 0.38,
      color: `var(--${color}-6)`
    }
  }, initials || '?'));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Kelola Card — white surface, 8px radius, the signature soft shadow.
 * Optional header (title + action) and footer.
 */
function Card({
  children,
  title,
  subtitle,
  action,
  footer,
  padding = 16,
  withBorder = false,
  hoverable = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: hoverable ? e => {
      e.currentTarget.style.background = 'var(--gradient-card-action)';
    } : undefined,
    onMouseLeave: hoverable ? e => {
      e.currentTarget.style.background = 'var(--surface-card)';
    } : undefined,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      border: withBorder ? '1px solid var(--border)' : 'none',
      overflow: 'hidden',
      transition: 'background var(--duration-base) var(--ease-standard)',
      cursor: hoverable ? 'pointer' : 'default',
      ...style
    }
  }, rest), (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      padding: `${padding}px ${padding}px ${subtitle ? 4 : 0}px`
    }
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 800,
      fontSize: 16,
      color: 'var(--text-strong)',
      lineHeight: 1.3
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, subtitle)), action && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, action)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `0 ${padding}px ${padding}px`,
      borderTop: '1px solid var(--neutral-2)',
      paddingTop: 12,
      marginTop: 4
    }
  }, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Tabs.jsx
try { (() => {
const {
  useState
} = React;
/**
 * Kelola Tabs — underline tabs (as on the Home dashboard: Company / Individual).
 * Active tab text turns primary and grows a primary underline.
 */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style = {}
}) {
  const items = tabs.map(t => typeof t === 'string' ? {
    value: t,
    label: t
  } : t);
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const active = value ?? internal;
  const pick = v => {
    setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--neutral-2)',
      ...style
    }
  }, items.map(t => {
    const on = t.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      onClick: () => pick(t.value),
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.color = 'var(--text-body)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.color = 'var(--text-muted)';
      },
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 14px',
        marginBottom: -1,
        fontFamily: 'var(--font-title)',
        fontWeight: 700,
        fontSize: 14,
        color: on ? 'var(--primary-5)' : 'var(--text-muted)',
        borderBottom: `2px solid ${on ? 'var(--primary-5)' : 'transparent'}`,
        transition: 'color var(--duration-base), border-color var(--duration-base)'
      }
    }, t.icon, t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 10,
        fontWeight: 700,
        background: on ? 'var(--primary-1)' : 'var(--neutral-2)',
        color: on ? 'var(--primary-6)' : 'var(--text-muted)',
        borderRadius: 'var(--radius-pill)',
        padding: '1px 7px'
      }
    }, t.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
/**
 * Kelola Alert (AlertBox) — soft tinted panel with a leading icon and a
 * left accent. Types map to the semantic colors.
 */
function Alert({
  type = 'info',
  title,
  children,
  icon,
  onClose,
  style = {}
}) {
  const map = {
    info: {
      c: 'primary',
      i: 'ti-info-circle'
    },
    error: {
      c: 'error',
      i: 'ti-alert-circle'
    },
    success: {
      c: 'success',
      i: 'ti-circle-check'
    },
    warning: {
      c: 'warning',
      i: 'ti-alert-triangle'
    }
  };
  const m = map[type] || map.info;
  return /*#__PURE__*/React.createElement("div", {
    role: "alert",
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '12px 14px',
      background: `var(--${m.c}-0)`,
      borderRadius: 'var(--radius-md)',
      borderLeft: `3px solid var(--${m.c}-5)`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: `var(--${m.c}-5)`,
      display: 'flex',
      fontSize: 18,
      marginTop: 1
    }
  }, icon || /*#__PURE__*/React.createElement("i", {
    className: `ti ${m.i}`
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 13,
      color: `var(--${m.c}-7)`,
      marginBottom: children ? 2 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      lineHeight: 1.45,
      color: 'var(--text-body)'
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "dismiss",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 2
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-x"
  })));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
/**
 * Kelola Badge — compact status pill. Open Sans 10/700 label.
 * `notch` renders the signature 8/0/8/0 asymmetric corner (used for BETA tags).
 */
function Badge({
  children,
  variant = 'light',
  color = 'primary',
  notch = false,
  gradient = false,
  leftDot = false,
  style = {}
}) {
  const c = color;
  const variants = {
    filled: {
      background: `var(--${c}-5)`,
      color: '#fff'
    },
    light: {
      background: `var(--${c}-1)`,
      color: `var(--${c}-6)`
    },
    outline: {
      background: 'transparent',
      color: `var(--${c}-6)`,
      border: `1px solid var(--${c}-3)`
    }
  };
  const v = gradient ? {
    background: 'var(--gradient-primary)',
    color: '#fff'
  } : variants[variant] || variants.light;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 9px',
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: '.02em',
      whiteSpace: 'nowrap',
      borderRadius: notch ? 'var(--radius-notch)' : 'var(--radius-pill)',
      ...v,
      ...style
    }
  }, leftDot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Kelola Checkbox — square check, primary fill when checked.
 */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {}
}) {
  const inputId = id || `kelola-cb-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      width: 18,
      height: 18
    }
  }, /*#__PURE__*/React.createElement("input", {
    id: inputId,
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 18,
      height: 18,
      margin: 0,
      cursor: 'inherit'
    }
  }), /*#__PURE__*/React.createElement(Box, {
    checked: checked ?? defaultChecked
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, label));
}
function Box({
  checked
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${checked ? 'var(--primary-5)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--primary-5)' : 'var(--neutral-0)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--duration-base) var(--ease-standard)',
      boxSizing: 'border-box'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2L4.8 8.5L9.5 3.5",
    stroke: "#fff",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
/**
 * Kelola Select — bordered field with a chevron that opens a soft-shadowed
 * menu. Selected option highlights in primary-1.
 */
function Select({
  label,
  placeholder = 'Select…',
  data = [],
  value,
  onChange,
  disabled = false,
  error,
  id,
  style = {}
}) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value ?? null);
  const ref = useRef(null);
  const selected = value ?? internal;
  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const options = data.map(d => typeof d === 'string' ? {
    value: d,
    label: d
  } : d);
  const current = options.find(o => o.value === selected);
  const pick = v => {
    setInternal(v);
    onChange && onChange(v);
    setOpen(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      position: 'relative',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    style: {
      height: 38,
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: disabled ? 'var(--neutral-1)' : 'var(--neutral-0)',
      border: `1px solid ${error ? 'var(--error-5)' : open ? 'var(--primary-5)' : 'var(--border-input)'}`,
      borderRadius: 'var(--radius-sm)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: current ? 'var(--text-strong)' : 'var(--text-faint)',
      boxShadow: open ? 'var(--shadow-focus)' : 'none',
      transition: 'all var(--duration-base)'
    }
  }, /*#__PURE__*/React.createElement("span", null, current ? current.label : placeholder), /*#__PURE__*/React.createElement("i", {
    className: "ti ti-chevron-down",
    style: {
      color: 'var(--text-muted)',
      transform: open ? 'rotate(180deg)' : 'none',
      transition: 'transform var(--duration-base)'
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      zIndex: 20,
      background: 'var(--neutral-0)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: 4,
      maxHeight: 220,
      overflowY: 'auto'
    }
  }, options.map(o => {
    const active = o.value === selected;
    return /*#__PURE__*/React.createElement("div", {
      key: o.value,
      onClick: () => pick(o.value),
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'var(--neutral-1)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      },
      style: {
        padding: '8px 10px',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: active ? 'var(--primary-6)' : 'var(--text-body)',
        fontWeight: active ? 700 : 400,
        background: active ? 'var(--primary-1)' : 'transparent'
      }
    }, o.label);
  })), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--error-5)'
    }
  }, error));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * Kelola Switch — pill toggle, primary track when on.
 */
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style = {}
}) {
  const inputId = id || `kelola-sw-${Math.random().toString(36).slice(2, 8)}`;
  const on = checked ?? defaultChecked;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("input", {
    id: inputId,
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 38,
      height: 22,
      margin: 0,
      cursor: 'inherit'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 22,
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--primary-5)' : 'var(--neutral-4)',
      transition: 'background var(--duration-base) var(--ease-standard)',
      display: 'inline-flex',
      alignItems: 'center',
      padding: 2,
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      transform: on ? 'translateX(16px)' : 'translateX(0)',
      transition: 'transform var(--duration-base) var(--ease-standard)',
      boxShadow: '0 1px 3px rgba(0,0,0,.2)'
    }
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState
} = React;
/**
 * Kelola TextInput — label (Avenir 12/700) over a bordered field.
 * Value text is Open Sans 12/400 on white. Supports left/right sections,
 * password reveal, error + description.
 */
function TextInput({
  label,
  description,
  error,
  required = false,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  disabled = false,
  leftSection = null,
  rightSection = null,
  passwordToggle = false,
  id,
  style = {},
  ...rest
}) {
  const [reveal, setReveal] = useState(false);
  const inputId = id || `kelola-in-${Math.random().toString(36).slice(2, 8)}`;
  const isPassword = type === 'password' || passwordToggle;
  const effType = isPassword ? reveal ? 'text' : 'password' : type;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: 'var(--font-title)',
      fontSize: 12,
      fontWeight: 700,
      lineHeight: '16.39px',
      color: 'var(--text-body)',
      display: 'flex',
      gap: 3
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-5)'
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, leftSection && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      color: 'var(--text-faint)',
      display: 'flex',
      pointerEvents: 'none'
    }
  }, leftSection), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: effType,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 38,
      padding: '0 12px',
      paddingLeft: leftSection ? 36 : 12,
      paddingRight: rightSection || isPassword ? 36 : 12,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 400,
      color: 'var(--text-strong)',
      background: disabled ? 'var(--neutral-1)' : 'var(--neutral-0)',
      border: `1px solid ${error ? 'var(--error-5)' : 'var(--border-input)'}`,
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      transition: 'border-color var(--duration-base), box-shadow var(--duration-base)'
    },
    onFocus: e => {
      if (!error) {
        e.target.style.borderColor = 'var(--primary-5)';
        e.target.style.boxShadow = 'var(--shadow-focus)';
      }
    },
    onBlur: e => {
      e.target.style.borderColor = error ? 'var(--error-5)' : 'var(--border-input)';
      e.target.style.boxShadow = 'none';
    }
  }, rest)), isPassword && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setReveal(r => !r),
    "aria-label": "toggle password",
    style: {
      position: 'absolute',
      right: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: reveal ? 'ti ti-eye-off' : 'ti ti-eye'
  })), !isPassword && rightSection && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 12,
      color: 'var(--text-faint)',
      display: 'flex'
    }
  }, rightSection)), error ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--error-5)'
    }
  }, error) : description && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, description));
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavItem.jsx
try { (() => {
const {
  useState
} = React;
/**
 * Kelola Sidebar nav item — the signature carved-notch active state on the
 * blue gradient rail. When active, the item background becomes the canvas
 * color and concave notches are carved above/below via box-shadow pseudo-
 * elements. Renders inside a `.bg-gradient-primary` container.
 */
function NavItem({
  icon,
  label,
  active = false,
  badge,
  onClick,
  canvas = 'var(--background)'
}) {
  const [hover, setHover] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      marginBottom: 4,
      marginLeft: active ? 10 : 0,
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 14,
      color: active ? 'var(--primary-5)' : '#fff',
      background: active ? canvas : hover ? 'rgba(255,255,255,0.14)' : 'transparent',
      borderRadius: active || hover ? '18px 0 0 18px' : '0',
      cursor: active ? 'default' : 'pointer',
      transition: 'background var(--duration-base), color var(--duration-base)'
    }
  }, active && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: 'transparent',
      bottom: '100%',
      right: 0,
      height: 18,
      width: 18,
      borderBottomRightRadius: 14,
      boxShadow: `0 9px 0 0 ${canvas}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: 'transparent',
      top: '100%',
      right: 0,
      height: 18,
      width: 18,
      borderTopRightRadius: 14,
      boxShadow: `0 -9px 0 0 ${canvas}`
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      fontSize: 16,
      zIndex: 1
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      zIndex: 1
    }
  }, label), badge && /*#__PURE__*/React.createElement("span", {
    style: {
      zIndex: 1
    }
  }, badge));
}

/**
 * Container rail. Pass NavItem children; provides the brand gradient and a
 * white logo strip at the top.
 */
function Sidebar({
  children,
  logo,
  width = 264,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      width,
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--gradient-primary)',
      ...style
    }
  }, logo && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 8
    }
  }, logo), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 0 16px 16px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children));
}
Object.assign(__ds_scope, { NavItem, Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavItem.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kelola-app/data.js
try { (() => {
/* Kelola UI Kit — fake data (Indonesian names + HR domain) */

window.KELOLA_DATA = {
  user: {
    name: 'Rina Wijaya',
    role: 'HR Manager',
    email: 'rina@acmecorp.co.id'
  },
  company: 'PT Acme Indonesia',
  nav: [{
    id: 'home',
    icon: 'ti-home',
    label: 'Home'
  }, {
    id: 'assignment',
    icon: 'ti-clipboard-list',
    label: 'Assignment'
  }, {
    id: 'development',
    icon: 'ti-certificate',
    label: 'Development',
    beta: true
  }, {
    id: 'organization',
    icon: 'ti-building',
    label: 'Organization'
  }, {
    id: 'employees',
    icon: 'ti-users',
    label: 'Employee List'
  }, {
    id: 'mapping',
    icon: 'ti-box',
    label: 'Box Mapping'
  }, {
    id: 'teams',
    icon: 'ti-users-group',
    label: 'Teams'
  }],
  stats: {
    profileCompletion: 87,
    successionRisk: {
      count: 6,
      total: 24
    },
    needDevelopment: {
      count: 18,
      total: 248
    },
    avgScore: 3.7
  },
  // aspect-to-standard chart (company)
  aspects: [{
    label: 'Leadership',
    score: 3.9,
    standard: 3.5
  }, {
    label: 'Communication',
    score: 3.4,
    standard: 3.5
  }, {
    label: 'Problem Solving',
    score: 4.1,
    standard: 3.8
  }, {
    label: 'Adaptability',
    score: 3.2,
    standard: 3.6
  }, {
    label: 'Collaboration',
    score: 4.3,
    standard: 3.5
  }, {
    label: 'Integrity',
    score: 4.0,
    standard: 4.0
  }],
  employees: [{
    id: 1,
    name: 'Budi Santoso',
    position: 'Senior Engineer',
    dept: 'Technology',
    status: 'Active',
    score: 4.2,
    completion: 100,
    disc: 'D'
  }, {
    id: 2,
    name: 'Citra Lestari',
    position: 'Product Manager',
    dept: 'Product',
    status: 'Active',
    score: 3.9,
    completion: 92,
    disc: 'I'
  }, {
    id: 3,
    name: 'Doni Prasetyo',
    position: 'UX Designer',
    dept: 'Product',
    status: 'On Leave',
    score: 3.5,
    completion: 78,
    disc: 'S'
  }, {
    id: 4,
    name: 'Eka Putri',
    position: 'Finance Analyst',
    dept: 'Finance',
    status: 'Active',
    score: 4.0,
    completion: 100,
    disc: 'C'
  }, {
    id: 5,
    name: 'Fajar Nugroho',
    position: 'Sales Lead',
    dept: 'Commercial',
    status: 'Active',
    score: 3.7,
    completion: 64,
    disc: 'D'
  }, {
    id: 6,
    name: 'Gita Rahmawati',
    position: 'HR Specialist',
    dept: 'People',
    status: 'Active',
    score: 3.8,
    completion: 88,
    disc: 'I'
  }, {
    id: 7,
    name: 'Hadi Kusuma',
    position: 'Data Scientist',
    dept: 'Technology',
    status: 'Resigned',
    score: 4.4,
    completion: 100,
    disc: 'C'
  }, {
    id: 8,
    name: 'Indah Permata',
    position: 'Marketing Mgr',
    dept: 'Commercial',
    status: 'Active',
    score: 3.6,
    completion: 71,
    disc: 'I'
  }],
  // 9-box talent mapping: rows = performance (3..1 top→bottom), cols = potential (1..3)
  boxLabels: [['Effective', 'Future Star', 'Consistent Star'], ['Inconsistent', 'Core Player', 'High Potential'], ['Risk', 'Average', 'Solid']],
  boxCounts: [[4, 9, 12], [7, 31, 18], [3, 14, 6]]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kelola-app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/kelola-app/kit-ui.jsx
try { (() => {
/* Kelola UI Kit — lean primitives that mirror the design-system components,
   using the same tokens from styles.css. Registered on window for the screens.
   (A self-contained mirror so the kit renders standalone, in the DS tab, and when downloaded.) */

function KButton({
  children,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  fullWidth,
  leftIcon,
  rightIcon,
  uppercase,
  loading,
  disabled,
  onClick,
  style = {}
}) {
  const sizes = {
    sm: {
      h: 30,
      p: '0 16px',
      f: 13
    },
    md: {
      h: 38,
      p: '0 22px',
      f: 14
    },
    lg: {
      h: 46,
      p: '0 30px',
      f: 15
    }
  };
  const s = sizes[size];
  const c = color;
  const V = {
    filled: {
      background: `var(--${c}-5)`,
      color: '#fff'
    },
    light: {
      background: `var(--${c}-1)`,
      color: `var(--${c}-6)`
    },
    outline: {
      background: 'transparent',
      color: `var(--${c}-5)`,
      border: '1px solid currentColor'
    },
    subtle: {
      background: 'transparent',
      color: `var(--${c}-5)`
    }
  }[variant];
  const [h, setH] = React.useState(false);
  const hover = h && !disabled ? {
    background: variant === 'filled' ? `var(--${c}-6)` : `var(--${c}-1)`
  } : {};
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled || loading,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: s.h,
      padding: s.p,
      width: fullWidth ? '100%' : 'auto',
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: s.f,
      lineHeight: 1,
      textTransform: uppercase ? 'uppercase' : 'none',
      letterSpacing: uppercase ? '.04em' : 0,
      borderRadius: 'var(--radius-pill)',
      border: '1px solid transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      whiteSpace: 'nowrap',
      transition: 'background .2s',
      ...V,
      ...hover,
      ...style
    }
  }, loading && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      animation: 'kspin .7s linear infinite'
    }
  }), !loading && leftIcon, children, !loading && rightIcon);
}
function KIconButton({
  children,
  variant = 'subtle',
  color = 'primary',
  size = 34,
  onClick,
  title,
  style = {}
}) {
  const [h, setH] = React.useState(false);
  const V = {
    filled: {
      background: `var(--${color}-5)`,
      color: '#fff'
    },
    light: {
      background: `var(--${color}-1)`,
      color: `var(--${color}-6)`
    },
    subtle: {
      background: h ? `var(--${color}-1)` : 'transparent',
      color: `var(--${color}-5)`
    }
  }[variant];
  return /*#__PURE__*/React.createElement("button", {
    title: title,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: 'pointer',
      fontSize: 18,
      ...V,
      ...style
    }
  }, children);
}
function KCard({
  children,
  title,
  subtitle,
  action,
  padding = 16,
  style = {},
  onClick,
  hoverable
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: hoverable && h ? 'var(--gradient-card-action)' : 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background .2s',
      ...style
    }
  }, (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      padding: `${padding}px ${padding}px 0`
    }
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 800,
      fontSize: 16,
      color: 'var(--text-strong)',
      lineHeight: 1.3
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, subtitle)), action), /*#__PURE__*/React.createElement("div", {
    style: {
      padding
    }
  }, children));
}
function KBadge({
  children,
  variant = 'light',
  color = 'primary',
  notch,
  gradient,
  leftDot,
  style = {}
}) {
  const V = gradient ? {
    background: 'var(--gradient-primary)',
    color: '#fff'
  } : {
    filled: {
      background: `var(--${color}-5)`,
      color: '#fff'
    },
    light: {
      background: `var(--${color}-1)`,
      color: `var(--${color}-6)`
    },
    outline: {
      background: 'transparent',
      color: `var(--${color}-6)`,
      border: `1px solid var(--${color}-3)`
    }
  }[variant];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 9px',
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      fontWeight: 700,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      borderRadius: notch ? 'var(--radius-notch)' : 'var(--radius-pill)',
      ...V,
      ...style
    }
  }, leftDot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
function KAvatar({
  src,
  name = '',
  size = 40,
  color = 'primary',
  ring = true,
  style = {}
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('');
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: src ? 'var(--neutral-0)' : `var(--${color}-1)`,
      border: ring ? '2px solid var(--neutral-3)' : 'none',
      boxSizing: 'border-box',
      overflow: 'hidden',
      flexShrink: 0,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%'
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: size * 0.38,
      color: `var(--${color}-6)`
    }
  }, initials || '?'));
}
function KTextInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  leftSection,
  required,
  error,
  style = {}
}) {
  const [f, setF] = React.useState(false);
  const [reveal, setReveal] = React.useState(false);
  const isPw = type === 'password';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-title)',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--text-body)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-5)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, leftSection && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      color: 'var(--text-faint)',
      display: 'flex'
    }
  }, leftSection), /*#__PURE__*/React.createElement("input", {
    type: isPw ? reveal ? 'text' : 'password' : type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      height: 38,
      padding: '0 12px',
      paddingLeft: leftSection ? 36 : 12,
      paddingRight: isPw ? 36 : 12,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-strong)',
      background: 'var(--neutral-0)',
      border: `1px solid ${error ? 'var(--error-5)' : f ? 'var(--primary-5)' : 'var(--border-input)'}`,
      borderRadius: 'var(--radius-sm)',
      outline: 'none',
      boxShadow: f && !error ? 'var(--shadow-focus)' : 'none',
      transition: 'all .2s'
    }
  }), isPw && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setReveal(r => !r),
    style: {
      position: 'absolute',
      right: 8,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 4
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: reveal ? 'ti ti-eye-off' : 'ti ti-eye'
  }))), error && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--error-5)'
    }
  }, error));
}
function KCheckbox({
  label,
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 18,
      height: 18,
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 18,
      height: 18,
      margin: 0,
      cursor: 'pointer'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: 'var(--radius-sm)',
      border: `1.5px solid ${checked ? 'var(--primary-5)' : 'var(--border-strong)'}`,
      background: checked ? 'var(--primary-5)' : '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }
  }, checked && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2L4.8 8.5L9.5 3.5",
    stroke: "#fff",
    strokeWidth: "1.8",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, label));
}
function KTabs({
  tabs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      borderBottom: '1px solid var(--neutral-2)'
    }
  }, tabs.map(t => {
    const on = t.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      onClick: () => onChange(t.value),
      style: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 14px',
        marginBottom: -1,
        fontFamily: 'var(--font-title)',
        fontWeight: 700,
        fontSize: 14,
        color: on ? 'var(--primary-5)' : 'var(--text-muted)',
        borderBottom: `2px solid ${on ? 'var(--primary-5)' : 'transparent'}`,
        transition: 'all .2s'
      }
    }, t.label);
  }));
}
if (typeof document !== 'undefined' && !document.getElementById('kspin-kf')) {
  const st = document.createElement('style');
  st.id = 'kspin-kf';
  st.textContent = '@keyframes kspin{to{transform:rotate(360deg)}}';
  document.head.appendChild(st);
}
Object.assign(window, {
  KButton,
  KIconButton,
  KCard,
  KBadge,
  KAvatar,
  KTextInput,
  KCheckbox,
  KTabs
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kelola-app/kit-ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kelola-app/screens.jsx
try { (() => {
/* Kelola UI Kit — content screens: Dashboard, Employee List, Talent Mapping (9-box) */

function BannerCard() {
  const D = window.KELOLA_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      background: 'var(--gradient-primary)',
      padding: '22px 26px',
      color: '#fff',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 800,
      fontSize: 22
    }
  }, "Selamat datang, ", D.user.name.split(' ')[0], " \uD83D\uDC4B"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      opacity: .92,
      marginTop: 4,
      maxWidth: 460
    }
  }, "Pantau pencapaian, kompetensi, dan pengembangan talenta di ", D.company, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 18,
      top: 14,
      opacity: .9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/team-type-strategic.svg",
    height: "78",
    alt: ""
  })));
}
function StatCard({
  label,
  value,
  suffix,
  hint,
  color = 'primary',
  icon
}) {
  return /*#__PURE__*/React.createElement(KCard, {
    padding: 16
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '.03em',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 8,
      background: `var(--${color}-1)`,
      color: `var(--${color}-6)`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: 'ti ' + icon
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 900,
      fontSize: 30,
      color: 'var(--text-strong)',
      lineHeight: 1
    }
  }, value), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)'
    }
  }, suffix)), hint && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: 'var(--text-faint)',
      marginTop: 6
    }
  }, hint));
}
function AspectChart() {
  const D = window.KELOLA_DATA;
  const max = 5;
  return /*#__PURE__*/React.createElement(KCard, {
    title: "Aspect to Standard",
    subtitle: "Company average vs. role standard",
    action: /*#__PURE__*/React.createElement(KBadge, {
      color: "primary"
    }, "2025 Q2")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      marginTop: 6
    }
  }, D.aspects.map(a => {
    const met = a.score >= a.standard;
    return /*#__PURE__*/React.createElement("div", {
      key: a.label
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        color: 'var(--text-body)'
      }
    }, a.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-title)',
        fontSize: 12,
        fontWeight: 700,
        color: met ? 'var(--success-5)' : 'var(--warning-6)'
      }
    }, a.score.toFixed(1))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        height: 8,
        borderRadius: 99,
        background: 'var(--neutral-2)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${a.score / max * 100}%`,
        height: '100%',
        borderRadius: 99,
        background: met ? 'var(--primary-5)' : 'var(--warning-5)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: -2,
        bottom: -2,
        left: `${a.standard / max * 100}%`,
        width: 2,
        background: 'var(--neutral-7)',
        borderRadius: 2
      },
      title: "standard"
    })));
  })));
}
function DonutCard() {
  const pct = window.KELOLA_DATA.stats.profileCompletion;
  const r = 52,
    circ = 2 * Math.PI * r,
    off = circ * (1 - pct / 100);
  return /*#__PURE__*/React.createElement(KCard, {
    title: "Profile Data",
    subtitle: "Completion \xB7 248 employees"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 128,
      height: 128,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "128",
    height: "128",
    style: {
      transform: 'rotate(-90deg)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "64",
    r: r,
    fill: "none",
    stroke: "var(--neutral-2)",
    strokeWidth: "14"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "64",
    cy: "64",
    r: r,
    fill: "none",
    stroke: "var(--primary-5)",
    strokeWidth: "14",
    strokeLinecap: "round",
    strokeDasharray: circ,
    strokeDashoffset: off
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 900,
      fontSize: 26,
      color: 'var(--text-strong)'
    }
  }, pct, "%"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Legend, {
    c: "var(--primary-5)",
    label: "Complete",
    v: "216 employees"
  }), /*#__PURE__*/React.createElement(Legend, {
    c: "var(--neutral-3)",
    label: "Incomplete",
    v: "32 employees"
  }), /*#__PURE__*/React.createElement(KButton, {
    variant: "subtle",
    size: "sm",
    rightIcon: /*#__PURE__*/React.createElement("i", {
      className: "ti ti-arrow-right"
    }),
    style: {
      marginTop: 4,
      paddingLeft: 0
    }
  }, "Review data"))));
}
function Legend({
  c,
  label,
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: c
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-body)',
      minWidth: 78
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontSize: 12,
      fontWeight: 700,
      color: 'var(--text-muted)'
    }
  }, v));
}
function DashboardScreen() {
  const D = window.KELOLA_DATA;
  const [tab, setTab] = React.useState('company');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(BannerCard, null), /*#__PURE__*/React.createElement(KTabs, {
    value: tab,
    onChange: setTab,
    tabs: [{
      value: 'company',
      label: 'Company'
    }, {
      value: 'individu',
      label: 'Individual'
    }]
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Avg Score",
    value: D.stats.avgScore.toFixed(1),
    suffix: "/ 5.0",
    hint: "Company-wide",
    color: "primary",
    icon: "ti-star"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Profile Data",
    value: D.stats.profileCompletion,
    suffix: "%",
    hint: "Completion",
    color: "success",
    icon: "ti-database"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Succession Risk",
    value: D.stats.successionRisk.count,
    suffix: `/ ${D.stats.successionRisk.total}`,
    hint: "Positions at risk",
    color: "warning",
    icon: "ti-alert-triangle"
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Need Development",
    value: D.stats.needDevelopment.count,
    suffix: "employees",
    hint: "Below standard",
    color: "error",
    icon: "ti-trending-down"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(AspectChart, null), /*#__PURE__*/React.createElement(DonutCard, null)));
}
function StatusBadge({
  status
}) {
  const m = {
    Active: 'success',
    'On Leave': 'warning',
    Resigned: 'error'
  }[status];
  return /*#__PURE__*/React.createElement(KBadge, {
    color: m,
    leftDot: true
  }, status);
}
function EmployeeListScreen({
  onOpenMapping
}) {
  const D = window.KELOLA_DATA;
  const [q, setQ] = React.useState('');
  const rows = D.employees.filter(e => e.name.toLowerCase().includes(q.toLowerCase()) || e.position.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 280
    }
  }, /*#__PURE__*/React.createElement(KTextInput, {
    placeholder: "Find employee",
    leftSection: /*#__PURE__*/React.createElement("i", {
      className: "ti ti-search"
    }),
    value: q,
    onChange: e => setQ(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(KButton, {
    variant: "light",
    leftIcon: /*#__PURE__*/React.createElement("i", {
      className: "ti ti-filter"
    })
  }, "Filter"), /*#__PURE__*/React.createElement(KButton, {
    leftIcon: /*#__PURE__*/React.createElement("i", {
      className: "ti ti-plus"
    })
  }, "Add Employee"))), /*#__PURE__*/React.createElement(KCard, {
    padding: 0
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: 'var(--neutral-1)'
    }
  }, ['Employee', 'Department', 'DISC', 'Score', 'Profile', 'Status'].map((h, i) => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: i > 1 && i < 5 ? 'center' : 'left',
      padding: '12px 16px',
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 12,
      color: 'var(--text-muted)',
      borderBottom: '1px solid var(--border)'
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, rows.map(e => /*#__PURE__*/React.createElement("tr", {
    key: e.id,
    style: {
      borderBottom: '1px solid var(--neutral-2)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: e.name,
    size: 36,
    color: e.id % 2 ? 'primary' : 'secondary'
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--text-strong)'
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, e.position)))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 16px',
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-body)'
    }
  }, e.dept), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 16px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(KBadge, {
    variant: "light",
    color: "primary"
  }, e.disc)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 16px',
      textAlign: 'center',
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 13,
      color: 'var(--text-strong)'
    }
  }, e.score.toFixed(1)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 6,
      borderRadius: 99,
      background: 'var(--neutral-2)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${e.completion}%`,
      height: '100%',
      background: e.completion === 100 ? 'var(--success-5)' : 'var(--primary-5)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      color: 'var(--text-muted)'
    }
  }, e.completion, "%"))), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '10px 16px'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: e.status
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Showing ", rows.length, " of ", D.employees.length, " employees"), /*#__PURE__*/React.createElement(KButton, {
    variant: "subtle",
    rightIcon: /*#__PURE__*/React.createElement("i", {
      className: "ti ti-box"
    }),
    onClick: onOpenMapping
  }, "Open Box Mapping")));
}
function TalentMappingScreen() {
  const D = window.KELOLA_DATA;
  const [sel, setSel] = React.useState(null);
  const tints = [['var(--warning-1)', 'var(--primary-1)', 'var(--success-1)'], ['var(--neutral-1)', 'var(--primary-1)', 'var(--primary-1)'], ['var(--error-1)', 'var(--neutral-1)', 'var(--primary-1)']];
  const txt = [['var(--warning-7)', 'var(--primary-6)', 'var(--success-6)'], ['var(--text-muted)', 'var(--primary-6)', 'var(--primary-6)'], ['var(--error-6)', 'var(--text-muted)', 'var(--primary-6)']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(KCard, {
    title: "9-Box Talent Mapping",
    subtitle: "Performance \xD7 Potential \u2014 248 employees mapped",
    action: /*#__PURE__*/React.createElement(KButton, {
      size: "sm",
      variant: "light",
      leftIcon: /*#__PURE__*/React.createElement("i", {
        className: "ti ti-download"
      })
    }, "Export")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      writingMode: 'vertical-rl',
      transform: 'rotate(180deg)',
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Performance \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: 8,
      aspectRatio: '3 / 2'
    }
  }, D.boxLabels.map((row, r) => row.map((label, c) => {
    const id = `${r}-${c}`;
    const on = sel === id;
    return /*#__PURE__*/React.createElement("div", {
      key: id,
      onClick: () => setSel(on ? null : id),
      style: {
        background: tints[r][c],
        border: `2px solid ${on ? 'var(--secondary-6)' : 'transparent'}`,
        borderRadius: 'var(--radius-md)',
        padding: 12,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color .2s'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-title)',
        fontWeight: 700,
        fontSize: 13,
        color: txt[r][c]
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-title)',
        fontWeight: 900,
        fontSize: 24,
        color: txt[r][c]
      }
    }, D.boxCounts[r][c]));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 8,
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 12,
      color: 'var(--text-muted)'
    }
  }, "Potential \u2192")))), sel && /*#__PURE__*/React.createElement(KCard, {
    padding: 14,
    style: {
      borderLeft: '3px solid var(--secondary-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-body)'
    }
  }, "Selected box ", /*#__PURE__*/React.createElement("b", null, D.boxLabels[+sel[0]][+sel[2]]), " \u2014 ", D.boxCounts[+sel[0]][+sel[2]], " employees. Click again to deselect.")));
}
Object.assign(window, {
  DashboardScreen,
  EmployeeListScreen,
  TalentMappingScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kelola-app/screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kelola-app/shell.jsx
try { (() => {
/* Kelola UI Kit — Login screen + App shell (sidebar, header) */

function LoginScreen({
  onLogin
}) {
  const [email, setEmail] = React.useState('rina@acmecorp.co.id');
  const [pw, setPw] = React.useState('password');
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const submit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 650);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--background)'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 56,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 8,
      background: '#fff',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-kelola-mark.svg",
    height: "28",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 900,
      fontSize: 20,
      color: 'var(--primary-5)'
    }
  }, "Kelola")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(KCard, {
    style: {
      width: 400,
      maxWidth: '100%'
    },
    padding: 28
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 800,
      fontSize: 20,
      color: 'var(--text-strong)'
    }
  }, "Masuk ke Kelola"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-muted)',
      marginTop: 4
    }
  }, "Kelola talenta perusahaan Anda")), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(KTextInput, {
    label: "Email",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    leftSection: /*#__PURE__*/React.createElement("i", {
      className: "ti ti-mail"
    }),
    required: true
  }), /*#__PURE__*/React.createElement(KTextInput, {
    label: "Password",
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    required: true
  }), /*#__PURE__*/React.createElement(KCheckbox, {
    label: "Remember email",
    checked: remember,
    onChange: e => setRemember(e.target.checked)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => e.preventDefault(),
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: 'var(--text-muted)',
      textDecoration: 'underline'
    }
  }, "Forgot your password?"), /*#__PURE__*/React.createElement(KButton, {
    type: "submit",
    uppercase: true,
    loading: loading
  }, "Log in"))))));
}
function Sidebar({
  active,
  onNavigate
}) {
  const D = window.KELOLA_DATA;
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      width: 252,
      flexShrink: 0,
      background: 'var(--gradient-primary)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-kelola-mark.svg",
    height: "26",
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 900,
      fontSize: 19,
      color: 'var(--primary-5)'
    }
  }, "Kelola")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '16px 0 16px 14px',
      display: 'flex',
      flexDirection: 'column'
    }
  }, D.nav.map(it => /*#__PURE__*/React.createElement(SideItem, {
    key: it.id,
    item: it,
    active: active === it.id,
    onClick: () => onNavigate(it.id)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 14px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 12px',
      background: 'rgba(248,249,250,0.18)',
      borderRadius: 'var(--radius-pill)'
    }
  }, /*#__PURE__*/React.createElement(KAvatar, {
    name: D.user.name,
    size: 32,
    ring: false,
    color: "secondary"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 12,
      color: '#fff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, D.user.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 10,
      color: 'rgba(255,255,255,0.8)'
    }
  }, D.user.role)), /*#__PURE__*/React.createElement("i", {
    className: "ti ti-chevron-up",
    style: {
      color: '#fff',
      fontSize: 14
    }
  }))));
}
function SideItem({
  item,
  active,
  onClick
}) {
  const [h, setH] = React.useState(false);
  const canvas = 'var(--background)';
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      marginBottom: 4,
      marginLeft: active ? 10 : 0,
      fontFamily: 'var(--font-title)',
      fontWeight: 700,
      fontSize: 14,
      color: active ? 'var(--primary-5)' : '#fff',
      background: active ? canvas : h ? 'rgba(255,255,255,0.14)' : 'transparent',
      borderRadius: active || h ? '18px 0 0 18px' : 0,
      cursor: active ? 'default' : 'pointer',
      transition: 'background .2s,color .2s'
    }
  }, active && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: 'transparent',
      bottom: '100%',
      right: 0,
      height: 18,
      width: 18,
      borderBottomRightRadius: 14,
      boxShadow: `0 9px 0 0 ${canvas}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      background: 'transparent',
      top: '100%',
      right: 0,
      height: 18,
      width: 18,
      borderTopRightRadius: 14,
      boxShadow: `0 -9px 0 0 ${canvas}`
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      fontSize: 16,
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: 'ti ' + item.icon
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      zIndex: 1
    }
  }, item.label), item.beta && /*#__PURE__*/React.createElement("span", {
    style: {
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(KBadge, {
    gradient: true,
    notch: true
  }, "BETA")));
}
function Header({
  title,
  onLogout
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 56,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      background: '#fff',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-title)',
      fontWeight: 800,
      fontSize: 18,
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(KIconButton, {
    title: "Search"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-search"
  })), /*#__PURE__*/React.createElement(KIconButton, {
    title: "Notifications"
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-bell"
  })), /*#__PURE__*/React.createElement(KIconButton, {
    title: "Log out",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement("i", {
    className: "ti ti-logout"
  }))));
}
Object.assign(window, {
  LoginScreen,
  Sidebar,
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kelola-app/shell.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.NavItem = __ds_scope.NavItem;

__ds_ns.Sidebar = __ds_scope.Sidebar;

})();
