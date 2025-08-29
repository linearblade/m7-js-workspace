# ⚙️ WorkSpace Options Reference

The `WorkSpace` class supports **global option defaults** through its `opts` object.
These values are applied automatically by methods when runtime options are not provided.

Options can be set via the constructor:

```js
const ws = new WorkSpace({}, {
  "set.numeric": true,
  "delete.rv": "object"
});
```

Or updated later with `setOpts`:

```js
ws.setOpts({ "exists.truthy": true });
```

---

## 🔑 Option Keys

All options are stored in `this.opts` as **flat, namespaced strings**:
`"<method>.<option>"`

### 1. **Set Method**

`ws.set(path, value, opts)`

* `"set.numeric"` *(boolean, default: false)*

  * If `true`, numeric keys in a path will create arrays.
  * If `false`, numeric keys are treated as object properties.

  ```js
  ws.set("foo.list.1", "x", { numeric: true });
  // { foo: { list: [ , "x" ] } }
  ```

* `"set.overwrite"` *(boolean, default: true)*

  * If `true`, existing keys are overwritten.
  * If `false`, existing keys are preserved.

  ```js
  ws.set("foo.bar", "a");
  ws.set("foo.bar", "b", { overwrite: false });
  // foo.bar stays "a"
  ```

---

### 2. **Delete Method**

`ws.delete(path, opts)`

* `"delete.rv"` *(string, default: false)*

  * If `"object"`, return the deleted value.
  * Otherwise returns `true`/`false` depending on success.

  ```js
  ws.delete("foo.bar");
  // true

  ws.delete("foo.bar", { rv: "object" });
  // returns deleted value (e.g., 42)
  ```

---

### 3. **Exists Method**

`ws.exists(path, opts)`

* `"exists.truthy"` *(boolean, default: false)*

  * If `false`, returns `true` if the key/index exists (even if `null` or `undefined`).
  * If `true`, only returns `true` if the value also evaluates truthy.

  ```js
  const ws = new WorkSpace({ foo: { bar: [ null, 99 ] } });

  ws.exists("foo.bar.0"); // true (index exists, value = null)
  ws.exists("foo.bar.0", { truthy: true }); // false

  ws.exists("foo.bar.1", { truthy: true }); // true
  ```

---

## 🧩 Runtime Options vs Global Options

* **Runtime opts** → passed directly to a method call.
* **Global opts** → stored in `this.opts` as `"method.option"` strings.

Runtime always overrides global defaults:

```js
ws.setOpts({ "set.overwrite": false });

ws.set("foo.bar", 123);
// won't overwrite (global default)

ws.set("foo.bar", 456, { overwrite: true });
// runtime override → does overwrite
```

---

## ✅ Summary

* Options are stored flat in `this.opts` as `"method.option"`.
* Runtime opts take priority, then global opts, then hard defaults.
* Currently supported:

  * `"set.numeric"`
  * `"set.overwrite"`
  * `"delete.rv"`
  * `"exists.truthy"`
