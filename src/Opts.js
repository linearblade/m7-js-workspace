/**
 * Opts
 *
 * Purpose:
 * --------
 * A lightweight options manager for handling runtime options, global defaults,
 * and fallback values in a consistent way. Designed to centralize option
 * resolution logic so that classes like WorkSpace and ManifestResolver stay lean.
 *
 * Intended Use:
 * -------------
 * - Store and manage configuration defaults.
 * - Provide safe access to options with fallback values.
 * - Merge new options into an existing set.
 * - Resolve runtime options (method-level) vs global options vs hard defaults.
 *
 * Behavior:
 * ---------
 * - Runtime options always override global defaults.
 * - Global defaults (stored in `this.values`) are checked next.
 * - If neither are provided, a hardcoded default is returned.
 *
 * Example:
 * --------
 * const opts = new Opts({ "set.numeric": true });
 *
 * opts.get("set.numeric"); // → true
 *
 * opts.check({ numeric: false }, "numeric", "set.numeric", false);
 * // → false (runtime override)
 *
 * opts.check({}, "numeric", "set.numeric", false);
 * // → true (falls back to global default)
 *
 * opts.check({}, "missing", "missingKey", "fallback");
 * // → "fallback"
 *
 * Notes:
 * ------
 * - Keys are stored as flat strings, typically namespaced like "set.numeric".
 * - Runtime opts are usually plain method call objects ({ numeric: true }).
 * - Intended to be generic and reusable — not tied to WorkSpace or ManifestResolver.
 */

export class Opts {
  constructor(defaults = {}) {
    this.values = { ...defaults };
  }

  /**
   * Get a value by key.
   * If key not found, return def.
   */
  get(key, def = undefined) {
    return Object.prototype.hasOwnProperty.call(this.values, key)
      ? this.values[key]
      : def;
  }

  /**
   * Set a value by key.
   */
  set(key, value) {
    this.values[key] = value;
  }

  /**
   * Shallow merge new opts into existing ones.
   */
  merge(opts = {}) {
    this.values = { ...this.values, ...opts };
  }

  /**
   * Resolve an option value from runtime opts, falling back to
   * internal opts, then to a default.
   *
   * @param {object} runtimeOpts - Method-level runtime options.
   * @param {string} key - Key to check in runtime opts.
   * @param {string} defKey - Key to check in internal opts.
   * @param {*} def - Fallback default if not found in either.
   *
   * @returns {*} The resolved option value.
   */
  check(runtimeOpts, key, defKey, def) {
    if (runtimeOpts && Object.prototype.hasOwnProperty.call(runtimeOpts, key)) {
      return runtimeOpts[key];
    }
    if (Object.prototype.hasOwnProperty.call(this.values, defKey)) {
      return this.values[defKey];
    }
    return def;
  }
}

export default Opts;
