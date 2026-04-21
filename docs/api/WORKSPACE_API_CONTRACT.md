<!--
Copyright (c) 2026 m7.org
SPDX-License-Identifier: LicenseRef-MTL-10
-->

# WorkSpace API Contract

[README](../../README.md) -> [API Index](./INDEX.md)

**(m7-js-workspace)**

> This document defines the public, stable interface only.
> Anything not explicitly specified here should be treated as undefined behavior.

---

## Scope

This contract covers:

* `Opts`
* `WorkSpace`
* `ResolverWorkSpace`
* `ManifestResolver`
* `installNamespace(lib)`
* `install(lib)`

This contract does not define:

* `src/auto.js`
* standalone bundles that include `m7-js-lib`
* private helpers or undocumented internal state

---

## Important posture

This package is a small data utility and lib namespace install.

It does not install a service. It does not create a standalone m7-lib bundle. The supported m7 integration path is to pass an existing `lib` instance into `install(lib)`.

---

## IDs and exports

### Namespace id

* `NAMESPACE_ID` = `primitive.workspace`

### `src/index.js`

Exports:

* `Opts`
* `WorkSpace`
* `ResolverWorkSpace`
* `ManifestResolver`
* `installNamespace`
* `install`
* `NAMESPACE_ID`
* `VERSION`

Default export is an object containing the same surface.

---

## Installation API

### Required lib surface

`installNamespace(lib)` and `install(lib)` require:

* `lib.hash.set`

Optional but used when present:

* `lib.hash.get`

### `installNamespace(lib) -> { namespace, installedNamespace }`

Registers constructors at `lib.primitive.workspace`.

The installed namespace contains:

* `WorkSpace`
* `ResolverWorkSpace`
* `ManifestResolver`
* `Opts`

`installedNamespace` is `true` when the call succeeds.

### `install(lib) -> { namespace, installedNamespace }`

Canonical entrypoint.

Behavior:

* installs the `primitive.workspace` namespace
* does not register a service
* returns the same shape as `installNamespace(lib)`

---

## `Opts`

### Construction

```js
const opts = new Opts(defaults);
```

### Public methods

* `get(key, def?)`
* `set(key, value)`
* `merge(opts?)`
* `check(runtimeOpts, key, defKey, def)`

Runtime option values take precedence over stored defaults.

---

## `WorkSpace`

### Construction

```js
const ws = new WorkSpace(data, opts);
```

### Public methods

* `load(data)`
* `setOpts(opts?, merge = false)`
* `get(path, def?)`
* `getList(input, def?)`
* `set(path, value, opts?)`
* `delete(path, opts?)`
* `exists(path, opts?)`
* `WorkSpace._hashGet(obj, path, def?)`

### Supported option keys

* `set.numeric`
* `set.overwrite`
* `delete.rv`
* `exists.truthy`

### Behavioral notes

* `getList(...)` drops entries that resolve to `undefined`
* `delete(..., { rv: "object" })` returns the deleted value
* `exists(..., { truthy: true })` requires the final value to be truthy

---

## `ResolverWorkSpace`

Extends `WorkSpace` with symbolic reference resolution.

### Public methods

* `resolve(ref, def?)`
* `resolveList(input, def?)`

### Supported option keys

* `resolver.maxDepth`
* `resolver.prefix`

### Behavioral notes

* references are resolved only while the current value is a string beginning with the configured prefix
* `resolveList(...)` filters out falsey resolved values

---

## `ManifestResolver`

Extends `ResolverWorkSpace` with manifest search helpers.

### Construction

```js
const mr = new ManifestResolver(manifest, {
  workspace: {},
  "resolver.maxDepth": 5,
  "resolver.prefix": "@"
});
```

### Public methods

* `searchList(sectionPath, criteria)`
* `searchOne(sectionPath, criteria)`

### Behavioral notes

* `criteria` may be an object matcher or predicate function
* `searchList(...)` resolves each entry before filtering
* `searchOne(...)` returns the first match or `null`
