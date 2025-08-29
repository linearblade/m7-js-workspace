import  ResolverWorkSpace  from './ResolverWorkSpace.js';

/**
 * ManifestResolver
 *
 * Purpose:
 * --------
 * A specialized resolver for manifest-style objects that may contain symbolic
 * references (e.g. "@resources.foo").
 *
 * Responsibilities:
 * -----------------
 * - Extends ResolverWorkSpace to inherit get/set/exists/delete/resolve/resolveList.
 * - Adds manifest-specific workflows like `searchList` and `searchOne`.
 * - Manages resolver options via Opts.
 *
 * Notes:
 * ------
 * - Keeps WorkSpace pure; this class is the higher-level utility.
 * - Inherits `resolve` and `resolveList` from ResolverWorkSpace.
 *
 * Supported Options:
 * ------------------
 * - "resolver.maxDepth" (number, default: 5)
 *   Controls how many symbolic reference hops are allowed before resolution stops.
 * - "resolver.prefix" (string, default: "@")
 *   Symbol prefix for references inside the manifest.
 */
export class ManifestResolver extends ResolverWorkSpace {
  static DEFAULTS = {
    'resolver.maxDepth': 5,
    'resolver.prefix': '@'
  };

  constructor(manifest = null, { workspace = {}, ...resolver } = {}) {
    super(manifest ?? {}, workspace);
    this.opts.merge(ManifestResolver.DEFAULTS);
    this.opts.merge(resolver);
  }

  /**
   * Search a manifest list section for matching entries.
   */
  searchList(sectionPath, criteria) {
    const rawList = this.get(sectionPath, [], { resolve: false });
    const list = Array.isArray(rawList) ? rawList : [rawList];

    const predicate = (typeof criteria === 'function')
      ? criteria
      : (entry) => {
          if (typeof criteria !== 'object' || !criteria) return true;
          return Object.entries(criteria).every(([k, v]) => entry?.[k] === v);
        };

    return list
      .map(item => this.resolve(item))
      .filter(Boolean)
      .filter(predicate);
  }

  /**
   * Search for the first matching entry in a manifest list section.
   */
  searchOne(sectionPath, criteria) {
    const results = this.searchList(sectionPath, criteria);
    return results.length > 0 ? results[0] : null;
  }
}

export default ManifestResolver;
