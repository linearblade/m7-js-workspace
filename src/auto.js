// auto.js (m7-js-workspace)
// Registers WorkSpace + related utilities into window.lib under: lib.data.ws

import WorkSpace from './WorkSpace.js';
import Opts from './Opts.js';
import ResolverWorkSpace from './ResolverWorkSpace.js';
import ManifestResolver from './ManifestResolver.js';

const MOD = '[workspace]';

// Browser + lib guard
const lib = (typeof window !== 'undefined' && window.lib) ? window.lib : null;

if (!lib) {
  throw new Error(`${MOD} requires window.lib (browser environment).`);
}

if (typeof lib?.hash?.set !== 'function' || typeof lib?.hash?.get !== 'function') {
  throw new Error(`${MOD} requires lib.hash.get + lib.hash.set (m7-lib not installed or incomplete).`);
}

// Package export surface
const pkg = {
  WorkSpace,
  Opts,
  ResolverWorkSpace,
  ManifestResolver,
};

// Register into lib hierarchy (idempotent / merge-safe)
const dst = 'data.ws';
const existing = lib.hash.get(lib, dst);

if (existing && typeof existing === 'object' && typeof lib?.hash?.merge === 'function') {
  lib.hash.set(lib, dst, lib.hash.merge(existing, pkg));
} else {
  lib.hash.set(lib, dst, pkg);
}

// Optional convenience aliases (comment out if you dislike these)
// lib.hash.set(lib, 'data.WorkSpace', WorkSpace);

export { WorkSpace, Opts, ResolverWorkSpace, ManifestResolver };
export default WorkSpace;
