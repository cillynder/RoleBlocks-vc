/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import definePlugin from "@utils/types";

import { getFgFor } from "./APCA";

export default definePlugin({
    name: "RoleBlocks",
    description: "Wraps usernames in a block coloured by role, to improve contrast on certain role colours",
    authors: [{ name: "cilly", id: 368398754077868032n }],
    patches: [
        {
            find: "]=\"SYSTEM_TAG\"",
            replacement: {
                match: /null!=\i\?\{color:(\i)\}:void 0/,
                replace: "$self.styles($1)"
            }
        },
        {
            find: "className:\"left\"",
            replacement: {
                match: /color:(\i)&&!(\i)&&null!=\i\?(\i):void 0/,
                replace: "...$self.styles($1&&!$2?$3:void 0)"
            }
        }
    ],
    styles(o: string | undefined) {
        return ({
            "background-color": o || "var(--background-mod-strong)",
            "color": (o && o.startsWith("#")) ? getFgFor(o) : "var(--text-default)",
            "padding": "0 4px",
            "margin-top": "2px",
            "margin-bottom": "2px",
            "border-radius": "4px",
        });
    }
});
