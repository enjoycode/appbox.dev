//const smMimeEncodedRx = /^[ \t]*\/\/[@|#][ \t]+sourceMappingURL=data:(?:application|text)\/json;base64,(.+)/m;
import BytesOutputStream from "@/assets/js/Serialization/BytesOutputStream";
import {Utf8Encode} from "@/assets/js/Serialization/Utf8";
import {Base64Encode} from "@/assets/js/Serialization/Base64";

const smCommentRx = /^[ \t]*\/\/[@|#][ \t]+sourceMappingURL=(.*)/m;

export default function (runtimeCode, sourceCode, mapJson) {
    let match = runtimeCode.match(smCommentRx);
    if (!match) {
        return runtimeCode;
    }
    let map = JSON.parse(mapJson);
    map.sourcesContent = [];
    map.sourcesContent.push(sourceCode);
    map.mappings = ';;;' + map.mappings; //偏移3行

    //不要使用btoa转换Base64,源码中包含中文会报错
    let outputStream = new BytesOutputStream();
    Utf8Encode(JSON.stringify(map), outputStream);
    let base64 = Base64Encode(outputStream.Bytes, true);

    let newContent = '//# sourceMappingURL=data:application/json;base64,' + base64;
    return runtimeCode.slice(0, match.index) + newContent + runtimeCode.slice(match.index + match[0].length);
}
