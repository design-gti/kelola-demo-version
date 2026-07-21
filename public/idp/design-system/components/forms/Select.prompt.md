Dropdown select with a soft-shadowed popover menu; the chosen row highlights in primary-1. Use for filters, status pickers, job/position selectors.

```jsx
<Select label="Status" placeholder="Choose…" data={["Active","On Leave","Resigned"]} onChange={setStatus} />
```

Accepts `string[]` or `{value,label}[]`.
