//const smMimeEncodedRx = /^[ \t]*\/\/[@|#][ \t]+sourceMappingURL=data:(?:application|text)\/json;base64,(.+)/m;
const smCommentRx = /^[ \t]*\/\/[@|#][ \t]+sourceMappingURL=(.*)/m;

export default function (runtimeCode, sourceCode, mapJson) {
    let match = runtimeCode.match(smCommentRx);
    if (!match) {
        return runtimeCode;
    }
    let map = JSON.parse(mapJson);
    map.sourcesContent = [];
    map.sourcesContent.push(sourceCode);

    let newContent = '//# sourceMappingURL=data:application/json;base64,' + btoa(JSON.stringify(map));
    // newContent += '\n//# sourceURL=data:application/javascript;base64,' + btoa(sourceCode);
    return runtimeCode.slice(0, match.index) + newContent + runtimeCode.slice(match.index + match[0].length);
}
