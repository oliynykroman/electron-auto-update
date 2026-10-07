# Layouts

There is no shared navigation component. `AppComponent` is the complete application shell: a full-height page containing one centered version and update card. See the full component source in `components.md`.

Global page shell source from `src/styles.scss`:

```scss
* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
  margin: 0;
}

body {
  color: #17212b;
  background:
    radial-gradient(circle at top left, rgba(49, 120, 198, 0.12), transparent 34%),
    #f5f7fb;
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

