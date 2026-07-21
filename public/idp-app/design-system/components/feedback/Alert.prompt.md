Inline alert / message box for form errors, session limits, and empty-state warnings. Indonesian copy is typical.

```jsx
<Alert type="error">Email atau password salah.</Alert>
<Alert type="warning" title="Session Limit Reached" onClose={dismiss}>Akun ini sudah login di 3 perangkat.</Alert>
```

Types: info (primary), error, success, warning.
