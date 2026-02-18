/*
 * Copyright (c) 2025 m7.org
 * License: MTL-10 (see LICENSE.md)
 */
// auto.js
//
// Backward-compatible shim for legacy m7 usage.
// - v098 style: if global lib exists, auto-install into it.
// - v1 style: no global lib required; this file safely no-ops.
//
// For explicit/module installs, prefer importing install() directly.

import install, {
    WorkSpace,
    Opts,
    ResolverWorkSpace,
    ManifestResolver,
} from "./install.js";

const MOD = "[primitive.workspace]";

const host = resolveHost();
const lib = host && host.lib ? host.lib : null;

let installResult = null;

if (lib) {
    installResult = install(lib, { host });
} else if (host && host.console && typeof host.console.warn === "function") {
    host.console.warn(`${MOD} auto.js: global lib not found; skipping auto-install.`);
}

const workspace =
    installResult && installResult.namespace
        ? installResult.namespace
        : { WorkSpace, Opts, ResolverWorkSpace, ManifestResolver };

export { workspace, WorkSpace, Opts, ResolverWorkSpace, ManifestResolver, install };
export default workspace;

function resolveHost() {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    return undefined;
}
