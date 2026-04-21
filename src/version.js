/*
 * Copyright (c) 2026 m7.org
 * SPDX-License-Identifier: LicenseRef-MTL-10
 */

const VERSION = typeof __WORKSPACE_VERSION__ !== "undefined"
    ? __WORKSPACE_VERSION__
    : "0.0.0-dev";

export { VERSION };
export default VERSION;
