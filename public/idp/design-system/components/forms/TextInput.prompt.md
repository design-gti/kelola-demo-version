Labelled text input — the backbone of every Kelola form (login, batch creation, settings). Avenir bold label, Open Sans value. Pass `error` to turn the border red and show the message; `passwordToggle` (or `type="password"`) adds an eye reveal.

```jsx
<TextInput label="Email" type="email" placeholder="you@company.com" required />
<TextInput label="Password" type="password" />
<TextInput label="Search" leftSection={<i className="ti ti-search" />} placeholder="Find employee" />
```
