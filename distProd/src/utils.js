"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToCsv = exports.sortEntriesByValues = void 0;
// count and sort map by count of key (lower case)
function sortEntriesByValues(arr) {
    const occ = arr.reduce((occ, val) => {
        var _a, _b, _c;
        const slug = (_a = val === null || val === void 0 ? void 0 : val.Text) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const k = (_b = slug === null || slug === void 0 ? void 0 : slug.toLowerCase()) !== null && _b !== void 0 ? _b : 'undefined';
        const v = (_c = occ.get(k)) !== null && _c !== void 0 ? _c : 0;
        return occ.set(k, 1 + (v));
    }, new Map());
    return new Map([...occ.entries()].sort((a, b) => b[1] - a[1]));
}
exports.sortEntriesByValues = sortEntriesByValues;
;
function mapToCsv(map) {
    let text = '';
    map.forEach((v, k, m) => {
        text += `${k},${v}\n`;
    });
    return text;
}
exports.mapToCsv = mapToCsv;
;
//# sourceMappingURL=utils.js.map