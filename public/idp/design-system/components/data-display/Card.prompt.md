The white content surface used everywhere in Kelola — dashboard panels, chart cards, list rows. Soft shadow, 8px radius, no border by default. Pass `title`/`action` for a header; `hoverable` adds the card-action gradient wash.

```jsx
<Card title="Succession Risk" subtitle="By position" action={<Button size="sm" variant="subtle">View all</Button>}>
  …chart…
</Card>
```
