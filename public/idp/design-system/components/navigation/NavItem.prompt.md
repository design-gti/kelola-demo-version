The Kelola sidebar and its signature carved-notch active item. Use `<Sidebar>` as the blue gradient rail and `<NavItem>` for each entry; mark one `active`. Icons are Tabler glyphs at 16px.

```jsx
<Sidebar logo={<><img src="logo-kelola-mark.svg" height="26" /><b>Kelola</b></>}>
  <NavItem icon={<i className="ti ti-home" />} label="Home" active />
  <NavItem icon={<i className="ti ti-clipboard-list" />} label="Assignment" />
  <NavItem icon={<i className="ti ti-building" />} label="Organization" />
</Sidebar>
```

The active item's background flips to the canvas color and carves concave notches top/bottom-right. If your content area isn't `--background`, pass a matching `canvas` color.
