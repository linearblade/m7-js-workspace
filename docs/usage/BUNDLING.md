<!--
Copyright (c) 2026 m7.org
SPDX-License-Identifier: LicenseRef-MTL-10
-->

# Dist Bundling

[README](../../README.md) -> [Usage TOC](./TOC.md)

This guide documents how to produce a versioned single-file ESM distribution for the supported source surface.

Outputs:

* `dist/nomap/workspace.bundle.v<version>.min.js`
* `dist/nomap/workspace.bundle.v<version>.min.js.LEGAL.txt`
* `dist/map/workspace.bundle.v<version>.min.js`
* `dist/map/workspace.bundle.v<version>.min.js.LEGAL.txt`
* `dist/map/workspace.bundle.v<version>.min.js.map`

The bundle entry is:

* [../../src/index.js](../../src/index.js)

---

## Goal

Generate a minified ESM artifact for consumers that want a versioned `dist/` file instead of source-path imports.

The bundle exports:

* `Opts`
* `WorkSpace`
* `ResolverWorkSpace`
* `ManifestResolver`
* `install`
* `installNamespace`
* `NAMESPACE_ID`
* `VERSION`

---

## Build commands

From repo root:

```bash
npm run build:nomap
```

This reads the release version from:

* [../../VERSION](../../VERSION)

It writes:

* `dist/nomap/workspace.bundle.v<version>.min.js`
* `dist/nomap/workspace.bundle.v<version>.min.js.LEGAL.txt`

Sourcemap build:

```bash
npm run build:map
```

Build both outputs:

```bash
npm run build
```

Optional direct script usage:

```bash
scripts/build-dist.sh --version 1.0.0 --out-dir dist/map --with-map
```

Build details:

* Entry: [../../src/index.js](../../src/index.js)
* Bundler: `esbuild@0.27.3` via `npx` unless `esbuild` is already on `PATH`
* Minification: enabled
* Legal comments: preserved via `--legal-comments=linked`
* Output naming: versioned only (`workspace.bundle.v<version>.min.js`)

---

## Important note

This build does not produce:

* a standalone bundle that includes `m7-js-lib`
* a release artifact for `src/auto.js`

`src/auto.js` remains legacy-only and is intentionally outside the supported build contract.
