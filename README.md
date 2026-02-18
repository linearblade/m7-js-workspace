# m7-js-workspace Library

The **WorkSpace** library was built to solve a recurring need: managing JSON-like data structures that often appear as configuration files, package manifests, or scene descriptions. Instead of repeatedly writing ad-hoc object walkers, deep-mergers, or `@ref` resolvers, this library packages those common operations into a lightweight toolkit.

The goal is not to compete with heavy-duty data libraries, but to provide a **simple, dependable core** for projects where you need just enough structure to safely access and resolve nested objects. It abstracts away the error-prone details of deep property access and symbolic reference resolution, leaving application-level classes (like `SceneManager`) focused on orchestration, not plumbing.

At its core, WorkSpace is a “better hash” for nested objects, with optional resolution and manifest workflows layered on top. If you need advanced data manipulation beyond this scope, see [m7-js-lib](https://github.com/linearblade/m7-js-lib-098).

---

## 📂 Project Structure

```
.
├── docs
│   ├── AI_DISCLOSURE.md
│   ├── OPTIONS.md
│   └── USE_POLICY.md
├── LICENSE.md
├── README.md
├── src
│   ├── auto.js
│   ├── index.js
│   ├── install.js
│   ├── ManifestResolver.js
│   ├── Opts.js
│   ├── ResolverWorkSpace.js
│   └── WorkSpace.js
└── test
    └── test.html
```

*(Temporary/backup **`~`** files are excluded.)*

---

## ✨ Components

* **WorkSpace** → Core utility for nested object access, modification, and existence checks.
  Methods: `get`, `getList`, `set`, `delete`, `exists`.
* **ResolverWorkSpace** → Extends WorkSpace with symbolic reference resolution (`resolve`, `resolveList`).
* **ManifestResolver** → High-level workflows for manifests, adds search/filter utilities (`searchList`, `searchOne`).
* **Opts** → Lightweight option manager that unifies runtime options, global defaults, and fallbacks.
* **install(lib, opts?)** → Explicit m7-lib installer that registers `lib.primitive.workspace`.
* **auto.js** → Backward-compatible global shim: installs only if global `lib` exists, otherwise warns and no-ops.

For a full breakdown of available options, see [`docs/OPTIONS.md`](./docs/OPTIONS.md).

---

## 🔧 Usage

### 1) Standalone class usage

```js
import { WorkSpace, ResolverWorkSpace, ManifestResolver } from './src/index.js';

// Basic workspace
const ws = new WorkSpace({ foo: { bar: 42 } });
console.log(ws.get('foo.bar')); // → 42

// Resolver workspace (supports symbolic references)
const rws = new ResolverWorkSpace({ foo: '@bar', bar: 99 });
console.log(rws.resolve(rws.get('foo'))); // → 99

// Manifest resolver (adds search/filter)
const manifest = {
  scenes: [
    { id: 'scene:agility', title: 'Agility Trial' },
    { id: 'scene:chess', title: 'Chess' }
  ]
};
const mr = new ManifestResolver(manifest);
console.log(mr.searchOne('scenes', { id: 'scene:chess' }));
// → { id: 'scene:chess', title: 'Chess' }
```

### 2) Explicit m7-lib install (recommended for integration)

```js
import installWorkspace from './src/install.js';

const result = installWorkspace(lib);
console.log(result.installedService); // false
console.log(result.namespace.WorkSpace); // class WorkSpace
```

This package is a straightforward library module. `install()` only registers namespace helpers at `lib.primitive.workspace`; it does not register `lib.service` entries.

### 3) Legacy/global convenience shim (`auto.js`)

```html
<script type="module" src="/vendor/m7-js-workspace/src/auto.js"></script>
```

If global `lib` is present, `auto.js` installs `lib.primitive.workspace`.
If global `lib` is missing, it logs a warning and safely no-ops.

### Entry points at a glance

* `src/index.js` -> class exports plus `install`.
* `src/install.js` -> explicit `install(lib, opts?)` for m7-lib registration.
* `src/auto.js` -> legacy global auto-install shim.

---

## 📌 Notes

* All options use a flat, namespaced key format (e.g., `set.numeric`, `resolver.maxDepth`).
* Runtime options always override global defaults.
* Defaults are merged automatically when constructing each class.
* The installer returns `{ namespace, instance: null, installedService: false }`.

---

## 🔮 Roadmap

* Potential future helpers: schema validation, deep merging, manifest compilation.
* For complex hash utilities beyond this lightweight scope, see [m7-js-lib](https://github.com/linearblade/m7-js-lib-098).

---

## 📜 License

See [`LICENSE.md`](LICENSE.md) for terms.
Free for personal, non-commercial use.
Commercial licensing available under M7 Moderate Team License (MTL-10).

---

## 🤖 AI Usage Disclosure

For detailed instructions and examples, please refer to the usage guide:
See [`docs/AI_DISCLOSURE.md`](docs/AI_DISCLOSURE.md) and [`docs/USE_POLICY.md`](docs/USE_POLICY.md)
for details on permitted AI usage and operational security boundaries.

---

## 🛠️ Philosophy

> “Fewer assumptions. More control.”
> WorkSpace prefers *explicit* behavior and composability over frameworks that abstract away too much.

---

## 💬 Feedback / Security

* General inquiries: [legal@m7.org](mailto:legal@m7.org)
* Security issues: [security@m7.org](mailto:security@m7.org)
