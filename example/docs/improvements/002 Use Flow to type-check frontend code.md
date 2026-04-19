---
status: discarded
tags:
  - frontend
resolves:
  - "[Dynamic typing in frontend](../issues/002 Dynamic typing in frontend.md)"
modifies: []
creates: []
---

# Use Flow to type-check frontend code

[Flow](https://flow.org/) is a static type checker for JavaScript code. It works by placing comments instead of changing the language systax. Example:

```js
// @flow
function square(n: number): number {
  return n * n;
}

square("2"); // Error!
```

Source: https://flow.org/en/docs/getting-started/
