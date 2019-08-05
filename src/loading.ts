/*  Package for loading documents and packages
    Author: Malte Rosenbjerg
    License: MIT */

import {INxtx, NodeType, Package} from '../nxtx-interface';

declare const nxtx: INxtx;

let loaded = {
    documents: {},
    packages: []
};

const pkg : Package = {
    name: 'loading',
    preprocessors: {
        'load:document': async nameNode => {
            const name = nameNode.value.toString();
            const filename = (name.substr(name.length - 5).toLowerCase() !== '.nxtx') ? `${name}.nxtx` : name;
            const response = await fetch(filename);
            if (!response.ok) return console.error(`NxTx document ${filename} not found`);

            const lastModified = response.headers.get('last-modified');
            const cached = loaded.documents[filename];
            if (lastModified && cached && cached.lastModified === lastModified) {
                return loaded.documents[filename].nodes;
            }

            const content = await response.text();
            const nodes = nxtx.parse(content);
            if (lastModified) {
                loaded.documents[filename] = {lastModified, nodes};
            }
            return nodes;
        },

        'load:package': srcNode => new Promise((acc, rej) => {
            const argsOk = nxtx.verifyArguments([], srcNode);
            console.log('args ok?', argsOk);
            if (loaded.packages[srcNode.value])
                return acc();
            loaded.packages[srcNode.value] = true;
            const script : HTMLScriptElement = document.createElement('script');
            script.src = srcNode.value;
            script.async = true;
            let done = false;
            // @ts-ignore
            script.onreadystatechange = script.onload = () => {
                // @ts-ignore
                if (!done && (!script.readyState || /loaded|complete/.test(script.readyState))) {
                    done = true;
                    acc();
                }
            };
            document.head.appendChild(script);
        }),

        'load:nxtxorg:package': (srcNode, minify = { type: NodeType.Boolean, value: true }) => {
            const min = minify.value ? '.min' : '';
            const ext = !srcNode.value.endsWith('.js') ? '.js' : '';
            const url = `https://nxtxorg.github.io/${srcNode.value}/build/${srcNode.value}${min}${ext}`;
            return {
                type: NodeType.Command,
                name: 'load:package',
                args: [ { type: NodeType.String, value: url } ]
            }
        }
    }
};

if (nxtx) nxtx.registerPackage(pkg);

export default pkg;