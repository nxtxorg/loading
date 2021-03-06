var loading = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var NodeType;
    (function (NodeType) {
        NodeType[NodeType["Paragraph"] = 1] = "Paragraph";
        NodeType[NodeType["Command"] = 2] = "Command";
        NodeType[NodeType["Text"] = 3] = "Text";
        NodeType[NodeType["Block"] = 4] = "Block";
        NodeType[NodeType["Html"] = 5] = "Html";
        NodeType[NodeType["Node"] = 6] = "Node";
        NodeType[NodeType["Boolean"] = 10] = "Boolean";
        NodeType[NodeType["Dictionary"] = 11] = "Dictionary";
        NodeType[NodeType["Array"] = 12] = "Array";
        NodeType[NodeType["Number"] = 13] = "Number";
        NodeType[NodeType["String"] = 14] = "String";
    })(NodeType || (NodeType = {}));

    var _this = undefined;
    var loaded = {
        documents: {},
        packages: []
    };
    var pkg = {
        name: 'loading',
        preprocessors: {
            'load:document': function (nameNode) { return __awaiter(_this, void 0, void 0, function () {
                var name, filename, response, lastModified, cached, content, nodes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            name = nameNode.value.toString();
                            filename = (name.substr(name.length - 5).toLowerCase() !== '.nxtx') ? name + ".nxtx" : name;
                            return [4, fetch(filename)];
                        case 1:
                            response = _a.sent();
                            if (!response.ok)
                                return [2, console.error("NxTx document " + filename + " not found")];
                            lastModified = response.headers.get('last-modified');
                            cached = loaded.documents[filename];
                            if (lastModified && cached && cached.lastModified === lastModified) {
                                return [2, loaded.documents[filename].nodes];
                            }
                            return [4, response.text()];
                        case 2:
                            content = _a.sent();
                            nodes = nxtx.parse(content);
                            if (lastModified) {
                                loaded.documents[filename] = { lastModified: lastModified, nodes: nodes };
                            }
                            return [2, nodes];
                    }
                });
            }); },
            'load:package': function (srcNode) { return new Promise(function (acc, rej) {
                if (loaded.packages[srcNode.value])
                    return acc();
                loaded.packages[srcNode.value] = true;
                var script = document.createElement('script');
                script.src = srcNode.value;
                script.async = true;
                var done = false;
                script.onreadystatechange = script.onload = function () {
                    if (!done && (!script.readyState || /loaded|complete/.test(script.readyState))) {
                        done = true;
                        acc();
                    }
                };
                document.head.appendChild(script);
            }); },
            'load:nxtxorg:package': function (srcNode, minify) {
                if (minify === void 0) { minify = { type: NodeType.Boolean, value: true }; }
                var min = minify.value ? '.min' : '';
                var ext = !srcNode.value.endsWith('.js') ? '.js' : '';
                var url = "https://nxtxorg.github.io/" + srcNode.value + "/build/" + srcNode.value + min + ext;
                return {
                    type: NodeType.Command,
                    name: 'load:package',
                    args: [{ type: NodeType.String, value: url }]
                };
            }
        }
    };
    if (nxtx)
        nxtx.registerPackage(pkg);

    return pkg;

}());
//# sourceMappingURL=loading.js.map
