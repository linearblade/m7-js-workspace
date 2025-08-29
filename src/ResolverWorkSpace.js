import WorkSpace from './WorkSpace.js';
export class ResolverWorkSpace extends WorkSpace {
  static DEFAULTS = {
    'resolver.maxDepth': 5,
    'resolver.prefix': '@'
  };

  constructor(data = {}, opts = {}) {
    super(data, opts);
    this.opts.merge(ResolverWorkSpace.DEFAULTS);
  }

  /**
   * Resolve a manifest-style reference into its final value.
   */
  resolve(ref, def = undefined) {
    let current = ref;
    let depth = 0;
    const maxDepth = this.opts.check({}, 'maxDepth', 'resolver.maxDepth', ResolverWorkSpace.DEFAULTS['resolver.maxDepth']);
    const prefix   = this.opts.check({}, 'prefix', 'resolver.prefix', ResolverWorkSpace.DEFAULTS['resolver.prefix']);

    while (typeof current === 'string' && current.startsWith(prefix)) {
      if (depth++ >= maxDepth) {
        console.warn(`[ResolverWorkSpace] Max resolution depth exceeded (${maxDepth}) for ref: ${ref}`);
        return def;
      }
      const key = current.slice(prefix.length);
      current = this.get(key, def, { resolve: false });
    }

    return current ?? def;
  }

  resolveList(input, def = undefined) {
    const list = Array.isArray(input) ? input : [input];
    return list.map(entry => this.resolve(entry, def)).filter(Boolean);
  }
}

export default ResolverWorkSpace;
