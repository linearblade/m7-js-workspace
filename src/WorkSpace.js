import  Opts  from './Opts.js';

/**
 * WorkSpace
 *
 * Purpose:
 * --------
 * A general-purpose container for working with nested JavaScript objects
 * (hashes, configs, manifests). Provides safe path-based access (`get`),
 * option management (`Opts`), and utility helpers (`_hashGet`).
 *
 * Conceptually, WorkSpace is a "better hash" — a structured dictionary that
 * can be extended with additional tools like merge, set, or deep clone.
 * 
 * This is intended as the foundation on which specialized resolvers (such as
 * ManifestResolver) can be built.
 *
 * Intended Use:
 * -------------
 * - Store and query structured objects (e.g. JSON manifests, configs).
 * - Retrieve values safely using dot-paths.
 * - Manage options (`Opts`) for extended behavior.
 * 
 * Notes:
 * ------
 * - Resolution of symbolic references (e.g. "@resources.foo") is not handled
 *   here — that belongs in higher-level classes built on WorkSpace.
 * - Arrays are treated as objects with stringified numeric keys.
 */
export class WorkSpace {
    /**
     * Create a new WorkSpace container.
     *
     * @param {object} [data={}] - Initial data object. If null/undefined, defaults to {}.
     * @param {object} [opts={}] - Optional configuration options.
     *
     * Notes:
     * - Always ensures `this.data` is a non-null object.
     */
    constructor(data = {}, opts = {}) {
	this.data = null;
	this.opts = new Opts();
	this.load(data ?? {});
	this.opts.merge(opts);
    }

    /**
     * Load a new data object into the workspace.
     * Must be a non-null object.
     */
    load(data) {
	if ([undefined, null].includes(data)) data = {};
	if (typeof data !== 'object' || data === null) {
	    throw new Error("WorkSpace requires a non-null object");
	}
	this.data = data;
	return this; // chainable
    }

    /**
     * Replace or merge global options.
     * @param {object} opts - Options object.
     * @param {boolean} merge - If true, merge into existing opts. If false, replace entirely.
     */
    setOpts(opts = {}, merge = false) {
	if (merge) this.opts.merge(opts);
	else this.opts = new Opts(opts);
    }

    /**
     * Retrieve a value from the workspace by a literal path.
     * (Does not resolve symbolic refs — higher layers may add that.)
     *
     * @param {string|array} path - Dot/array notation (e.g. "foo.bar.1.test").
     * @param {*} def - Fallback if not found.
     */
    get(path, def = undefined) {
	return this.constructor._hashGet(this.data, path, def);
    }

    /**
     * Retrieve multiple values from the workspace by a list of paths.
     *
     * @param {array|string} input - A list of paths, or a single path.
     *   Each path may be a string ("a.b.c") or an array of keys (["a","b","c"]).
     * @param {*} def - Default value if a path does not exist.
     *
     * @returns {array} An array of values corresponding to each path.
     *
     * Example:
     *   ws.data = { foo: { bar: 42 }, a: { b: { c: "x" } } };
     *
     *   ws.getList(["foo.bar","a.b.c"]);
     *   // → [42, "x"]
     *
     *   ws.getList([["foo","bar"],["a","b","c"]]);
     *   // → [42, "x"]
     */
    getList(input, def = undefined) {
	const paths = Array.isArray(input) ? input : [input];
	return paths.map(path => this.get(path, def)).filter(v => v !== undefined);
    }

    
    /**
     * Safely retrieve a nested value from an object using a dot-path.
     */
    static _hashGet(obj, path, def = undefined) {
	if (typeof obj !== 'object' || obj === null) return def;
	const parts = Array.isArray(path) ? path : String(path).split('.');
	let ptr = obj;
	for (const key of parts) {
	    if (typeof ptr !== 'object' || !(key in ptr)) return def;
	    ptr = ptr[key];
	}
	return ptr;
    }

    /**
     * Set a value in the workspace at a dot-path, creating
     * intermediate objects or arrays as needed.
     */
    set(path, value, opts = {}) {
	const parts = Array.isArray(path) ? path : String(path).split('.');

	const numeric = this.opts.check(opts, 'numeric', 'set.numeric', false);
	const overwrite = this.opts.check(opts, 'overwrite', 'set.overwrite', true);

	let ptr = this.data;

	for (let i = 0; i < parts.length; i++) {
	    const key = parts[i];
	    const isLast = i === parts.length - 1;

	    if (isLast) {
		if (!overwrite && key in ptr) {
		    // skip overwrite
		} else {
		    ptr[key] = value;
		}
	    } else {
		if (!(key in ptr) || typeof ptr[key] !== 'object' || ptr[key] === null) {
		    if (numeric && /^\d+$/.test(parts[i + 1])) {
			ptr[key] = [];
		    } else {
			ptr[key] = {};
		    }
		}
		ptr = ptr[key];
	    }
	}

	return this;
    }

    /**
     * Delete a value from the workspace by dot-path.
     */
    delete(path, opts = {}) {
	const parts = Array.isArray(path) ? path : String(path).split('.');
	let ptr = this.data;

	const rvMode = this.opts.check(opts, 'rv', 'delete.rv', false);

	for (let i = 0; i < parts.length - 1; i++) {
	    const key = parts[i];
	    if (typeof ptr !== 'object' || ptr === null || !(key in ptr)) {
		return rvMode === 'object' ? undefined : false;
	    }
	    ptr = ptr[key];
	}

	const lastKey = parts[parts.length - 1];
	if (typeof ptr === 'object' && ptr !== null && lastKey in ptr) {
	    const deleted = ptr[lastKey];
	    delete ptr[lastKey];
	    return rvMode === 'object' ? deleted : true;
	}

	return rvMode === 'object' ? undefined : false;
    }

    /**
     * Check whether a value exists in the workspace at a dot-path.
     */
    exists(path, opts = {}) {
	const parts = Array.isArray(path) ? path : String(path).split('.');
	let ptr = this.data;

	for (let i = 0; i < parts.length - 1; i++) {
	    const key = parts[i];
	    if (typeof ptr !== 'object' || ptr === null || !(key in ptr)) {
		return false;
	    }
	    ptr = ptr[key];
	}

	const lastKey = parts[parts.length - 1];
	if (typeof ptr === 'object' && ptr !== null && lastKey in ptr) {
	    const truthy = this.opts.check(opts, 'truthy', 'exists.truthy', false);
	    if (truthy) return Boolean(ptr[lastKey]);
	    return true;
	}

	return false;
    }


}

export default WorkSpace;
