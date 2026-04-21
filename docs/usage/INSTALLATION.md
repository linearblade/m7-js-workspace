<!--
Copyright (c) 2026 m7.org
SPDX-License-Identifier: LicenseRef-MTL-10
-->

# Installation

[README](../../README.md) -> [Usage TOC](./TOC.md)

This package installs constructors into an existing m7 `lib` instance. It does not install a service.

---

## What gets installed

The canonical installer writes to:

* namespace id: `primitive.workspace`

Installed namespace members:

* `WorkSpace`
* `ResolverWorkSpace`
* `ManifestResolver`
* `Opts`

---

## Required lib surface

The installer requires:

* `lib.hash.set`

It will also reuse an existing namespace when available through:

* `lib.hash.get`

---

## Canonical install

```js
import { install, NAMESPACE_ID } from "../../src/index.js";

const { namespace } = install(lib);

const WorkSpace = namespace.WorkSpace;
const ws = new WorkSpace({
  app: {
    title: "Dashboard"
  }
});

console.log(lib.hash.get(lib, NAMESPACE_ID) === namespace); // true
console.log(ws.get("app.title")); // "Dashboard"
```

---

## Direct source usage

```js
import { ManifestResolver } from "../../src/index.js";

const resolver = new ManifestResolver({
  pages: [
    { id: "home", title: "@strings.home" }
  ],
  strings: {
    home: "Home"
  }
});

console.log(resolver.searchOne("pages", { id: "home" }).title); // "Home"
```

---

## Notes

* `install(lib)` is the supported m7-lib integration path.
* `src/auto.js` is a legacy shim and is not part of the supported release flow.
