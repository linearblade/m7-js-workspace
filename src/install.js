/*
 * Copyright (c) 2026 m7.org
 * SPDX-License-Identifier: LicenseRef-MTL-10
 *
 * Canonical installer for m7-js-workspace.
 */

import WorkSpace from "./WorkSpace.js";
import ResolverWorkSpace from "./ResolverWorkSpace.js";
import ManifestResolver from "./ManifestResolver.js";
import Opts from "./Opts.js";

const MOD = "[primitive.workspace]";
const NAMESPACE_ID = "primitive.workspace";

function normalizeNamespace(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function assertLibWithHashSet(lib, label) {
    if (!lib || typeof lib !== "object") {
        throw new Error(`${MOD} ${label} requires an m7-lib instance object.`);
    }

    if (!lib.hash || typeof lib.hash.set !== "function") {
        throw new Error(`${MOD} ${label} requires lib.hash.set.`);
    }
}

function readNamespace(lib) {
    if (!lib || !lib.hash || typeof lib.hash.get !== "function") {
        return {};
    }

    try {
        return normalizeNamespace(lib.hash.get(lib, NAMESPACE_ID));
    } catch (err) {
        return {};
    }
}

/**
 * Install WorkSpace constructors into the lib namespace registry.
 *
 * @param {Object} lib Initialized m7 lib instance.
 * @returns {{ namespace:Object, installedNamespace:boolean }}
 */
export function installNamespace(lib) {
    assertLibWithHashSet(lib, "installNamespace(lib)");

    const namespace = readNamespace(lib);
    namespace.WorkSpace = WorkSpace;
    namespace.ResolverWorkSpace = ResolverWorkSpace;
    namespace.ManifestResolver = ManifestResolver;
    namespace.Opts = Opts;
    lib.hash.set(lib, NAMESPACE_ID, namespace);

    return {
        namespace,
        installedNamespace: true,
    };
}

/**
 * Canonical install entrypoint.
 *
 * @param {Object} lib Initialized m7 lib instance.
 * @returns {{ namespace:Object, installedNamespace:boolean }}
 */
export function install(lib) {
    return installNamespace(lib);
}

export { WorkSpace, ResolverWorkSpace, ManifestResolver, Opts, NAMESPACE_ID };
export default install;
