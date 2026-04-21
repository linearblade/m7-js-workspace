<!--
Copyright (c) 2026 m7.org
SPDX-License-Identifier: LicenseRef-MTL-10
-->

# m7-js-workspace v1.0.0

m7-js-workspace is a small nested-object utility package for m7 projects. It provides path-based object access, simple manifest-style reference resolution, and a canonical installer that attaches the constructors to `lib.primitive.workspace`.

Docs: [TOC](docs/TOC.md) | [API Contract](docs/api/WORKSPACE_API_CONTRACT.md) | [Installation](docs/usage/INSTALLATION.md) | [Bundling](docs/usage/BUNDLING.md)

---

## Quick example

```js
import { install, WorkSpace } from "./src/index.js";

install(lib);

const ws = new WorkSpace({
  manifest: {
    title: "Example",
    current: "@manifest.title"
  }
});

console.log(ws.get("manifest.title")); // "Example"
```

The canonical m7-lib namespace is:

* `primitive.workspace`

Installed members:

* `WorkSpace`
* `ResolverWorkSpace`
* `ManifestResolver`
* `Opts`

---

## Notes

* The supported integration path is `install(lib)` from `src/install.js`.
* `src/auto.js` is legacy and is not part of the supported build/release flow.
* This package does not build a standalone bundle that includes `m7-js-lib`.

---

## License

See [LICENSE.md](LICENSE.md) for full terms.

* Usage rights and restrictions are defined in [LICENSE.md](LICENSE.md)
* Commercial licensing inquiries: [legal@m7.org](mailto:legal@m7.org)

## AI Usage Disclosure

See:

* [docs/AI_DISCLOSURE.md](docs/AI_DISCLOSURE.md)
* [docs/USE_POLICY.md](docs/USE_POLICY.md)

for permitted use of AI in derivative tools or automation layers.

## Feedback / Security

* General inquiries: [legal@m7.org](mailto:legal@m7.org)
* Security issues: [security@m7.org](mailto:security@m7.org)
