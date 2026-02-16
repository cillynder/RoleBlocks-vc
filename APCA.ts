/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// APCA code from https://github.com/Myndex/apca-w3/blob/c012257167d822f91bc417120bdb82e1b854b4a4/src/apca-w3.js

const exp = (c: number) => (c / 255.0) ** SA98G.mainTRC;

const hexToY = (colorHex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex)!;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return SA98G.sRco * exp(r)
         + SA98G.sGco * exp(g)
         + SA98G.sBco * exp(b);
};

const contrast = (fg: number, bg: number): number => {
    if (Math.min(fg, bg) < 0.0 || Math.max(fg, bg) > 1.1)
        return 0.0;

    if (fg <= SA98G.blkThrs)
        fg += (SA98G.blkThrs - fg) ** SA98G.blkClmp;
    if (bg <= SA98G.blkThrs)
        bg += (SA98G.blkThrs - bg) ** SA98G.blkClmp;

    if (Math.abs(bg - fg) < SA98G.deltaYmin)
        return 0.0;

    let outputContrast: number;
    if (bg > fg) {
        const sapc = (bg ** SA98G.normBG - fg ** SA98G.normTXT) * SA98G.scaleBoW;
        outputContrast = sapc < SA98G.loClip
            ? 0.0
            : sapc - SA98G.loBoWoffset;
    } else {
        const sapc = (bg ** SA98G.revBG - fg ** SA98G.revTXT) * SA98G.scaleWoB;
        outputContrast = sapc > -SA98G.loClip
            ? 0.0
            : sapc + SA98G.loWoBoffset;
    }

    return outputContrast * 100;
};

const SA98G = {
    mainTRC: 2.4, // 2.4 exponent for emulating actual monitor perception

    // For reverseAPCA
    get mainTRCencode() { return 1 / this.mainTRC; },

    // sRGB coefficients
    sRco: 0.2126729,
    sGco: 0.7151522,
    sBco: 0.0721750,

    // G-4g constants for use with 2.4 exponent
    normBG: 0.56,
    normTXT: 0.57,
    revTXT: 0.62,
    revBG: 0.65,

    // G-4g Clamps and Scalers
    blkThrs: 0.022,
    blkClmp: 1.414,
    scaleBoW: 1.14,
    scaleWoB: 1.14,
    loBoWoffset: 0.027,
    loWoBoffset: 0.027,
    deltaYmin: 0.0005,
    loClip: 0.1,
};

export const getFgFor = (roleHex: string) => {
    const bg = hexToY(roleHex);
    const blackContrast = Math.abs(contrast(0, bg));
    const whiteContrast = Math.abs(contrast(1, bg));
    if (blackContrast > whiteContrast)
        return "#000000";
    else
        return "#FFFFFF";
};
