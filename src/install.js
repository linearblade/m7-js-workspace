/*
 * Copyright (c) 2025 m7.org
 * License: MTL-10 (see LICENSE.md)
 */

import WorkSpace from "./WorkSpace.js";
import Opts from "./Opts.js";
import ResolverWorkSpace from "./ResolverWorkSpace.js";
import ManifestResolver from "./ManifestResolver.js";

const MOD = "[primitive.workspace]";
const SERVICE_ID = "primitive.workspace";

/**
 * install(lib, opts?)
 *
 * m7-js-lib integration installer for workspace helpers.
 *
 * This package is a straightforward library module:
 * - Registers workspace helpers at `lib.primitive.workspace`
 * - Does not install shared services
 *
 * @param {Object} lib
 * @param {Object} [opts]
 * @param {boolean} [opts.force=false]
 * @returns {{
 *   namespace: Object,
 *   instance: null,
 *   installedService: boolean
 * }}
 */
export function install(lib, opts = {}) {
    if (!lib || typeof lib !== "object") {
        throw new Error(`${MOD} install(lib) requires an m7-lib instance object.`);
    }

    if (!lib.hash || typeof lib.hash.set !== "function") {
        throw new Error(`${MOD} install(lib) requires lib.hash.set.`);
    }

    const force = !!(opts && opts.force === true);
    const hasHashGet = !!(lib.hash && typeof lib.hash.get === "function");

    let existing = null;
    if (!force && hasHashGet) {
        try {
            existing = lib.hash.get(lib, SERVICE_ID);
        } catch (err) {
            existing = null;
        }
    }

    const namespace = buildNamespace(existing);
    lib.hash.set(lib, SERVICE_ID, namespace);

    return {
        namespace,
        instance: null,
        installedService: false,
    };
}

export { WorkSpace, Opts, ResolverWorkSpace, ManifestResolver, SERVICE_ID };
export default install;

function buildNamespace(existing = null) {
    const namespace = {};

    if (existing && typeof existing === "object") {
        Object.assign(namespace, existing);
    }

    namespace.WorkSpace = WorkSpace;
    namespace.Opts = Opts;
    namespace.ResolverWorkSpace = ResolverWorkSpace;
    namespace.ManifestResolver = ManifestResolver;

    return namespace;
}
