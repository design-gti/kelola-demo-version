Pill-shaped action button — the primary CTA across Kelola. Use `filled`/`primary` for the main action, `subtle`/`light` for secondary, `outline` for tertiary; switch `color` to `error` for destructive actions.

```jsx
<Button onClick={save}>Save</Button>
<Button variant="subtle">Cancel</Button>
<Button color="error" variant="light">Delete</Button>
<Button uppercase loading>Log in</Button>
```

Variants: `filled` (default), `light`, `outline`, `subtle`. Colors: primary/secondary/error/success/warning. Sizes sm/md/lg. Supports `leftIcon`/`rightIcon`, `fullWidth`, `loading`, `uppercase`.
