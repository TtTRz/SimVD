'use strict';

const NodeType = {
  ElementNode: "ElementNode",
  TextNode: "TextNode",
  FragmentNode: "FragmentNode"
};

const nodePatchTypes = {
  CREATE: 'create node',
  REMOVE: 'remove node',
  REPLACE: 'replace node',
  UPDATE: 'update node',
};

const attrPatchTypes = {
  REMOVE: 'remove attrs',
  UPDATE: 'update attrs',
};

// element 
const createElement = (vd) => {

  // TextNode
  if (vd.node_type === NodeType.TextNode) {
    return document.createTextNode(vd.inner_html)
  }

  // FragmentNode
  if (vd.node_type === NodeType.FragmentNode) {
    const FragmentElement = document.createDocumentFragment();

    const { children } = vd;

    children.map((child) => {
      let childElement = createElement(child);
      FragmentElement.appendChild.call(FragmentElement, childElement);
    });

    return FragmentElement;
  }

  // ElementNode
  const {tag, children, attrs} = vd;

  // 1. createRealDomElement
  const element = document.createElement(tag);

  // 2. setDomAttrs
  setAttrs(element, attrs);

  // 3. createChildElement
  children.map((child) => {
    let childElement = createElement(child);
    element.appendChild.call(element, childElement);
  });

  return element

};

// attrs
const setAttrs = (element, attrs) => {
  for (let attr of attrs) {
    element.setAttribute(attr.name, attr.value);
  }
};

let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}
/**
* @param {string} html
* @returns {any}
*/
function html_2_vd(html) {
    var ptr0 = passStringToWasm0(html, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.html_2_vd(ptr0, len0);
    return takeObject(ret);
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('bundle.js', document.baseURI).href)).replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

const diffVd = (prevVd, nextVd) => {

  // fragmentNode
  // TODO
  // if (prevVd.node_type === NodeType.FragmentNode && nextVd.node_type === NodeType.FragmentNode) {
  //   return {
  //     type: nodePatchTypes.UPDATE,
  //     attrs: [],
  //     children: diffChildren(prevVd, nextVd)
  //   }
  // }
  
  // create
  if (prevVd === undefined) {
    return {
      type: nodePatchTypes.CREATE,
      vd: nextVd,
    }
  }

  // remove
  if (nextVd === undefined) {
    return {
      type: nodePatchTypes.REMOVE,
    }
  }

  // replace
  // rules TextNode, Tag not equal, NodeType not equal, 
  if (
    prevVd.node_type !== nextVd.node_type 
    || prevVd.inner_html !== nextVd.inner_html
    || prevVd.tag !== nextVd.tag
  ) {
    return {
      type: nodePatchTypes.REPLACE,
      vd: nextVd,
    }
  }
  
  // update
  // diff attrs
  const attrsDiff = diffAttrs(prevVd, nextVd);

  // diff children
  const childrenDiff = diffChildren(prevVd, nextVd);

  if (attrsDiff.length > 0 || childrenDiff.some(p => (p !== undefined))) {
    return {
      type: nodePatchTypes.UPDATE,
      attrs: attrsDiff,
      children: childrenDiff,
    }
  }

};


const diffAttrs = (prevVd, nextVd) => {
  const patches = [];
  const prevVdAttrs = {};
  const nextVdAttrs = {};
  prevVd.attrs.forEach((i) => {
    prevVdAttrs[i.name] = i.value;
  });

  nextVd.attrs.forEach((i) => {
    nextVdAttrs[i.name] = i.value;
  });

  const allAttrs = {...prevVdAttrs, ...nextVdAttrs};
  Object.keys(allAttrs).forEach((key) => {
    const prevAttr = prevVdAttrs[key];
    const nextAttr = nextVdAttrs[key];
    
    // delete
    if (nextAttr === undefined) {
      patches.push({
        type: attrPatchTypes.REMOVE,
        key,
      });
    }

    // update
    else if (prevAttr == undefined || prevAttr !== nextAttr) {
      patches.push({
        type: attrPatchTypes.UPDATE,
        key,
        value: nextAttr,
      });
    }
  });
  
  return patches
};

const diffChildren = (prevVd, nextVd) => {
  const patches = [];

  const maxLen = Math.max(prevVd.children.length, nextVd.children.length);
  
  for (let i = 0; i < maxLen; i++) {
    let childPatcher = diffVd(prevVd.children[i], nextVd.children[i]);
    patches.push(childPatcher);
  }

  return patches
  
};

const filterHtml = (html) => {
  return html.trim().replace(/[\n]+[\s]*/g, "")
};

let prevVdObj = undefined;
let rootElement = undefined;
let isWasmInitial = false;

const render = (vdObj) => {
  if (prevVdObj) {
    const patches = diffVd(prevVdObj, vdObj);
    prevVdObj = vdObj;
    patch(rootElement, patches);
  } else {
    let root = createElement(vdObj).cloneNode(true);
    prevVdObj = vdObj;
    rootElement.appendChild(root);
  }
};

const renderHtml = async (html, options = {bind: "#root"}) => {
  prevVdObj = undefined;
  rootElement = undefined;
  if (!isWasmInitial) {
    await init();
    isWasmInitial = true;
  }

  const _html = filterHtml(html);
  const vdObj = html_2_vd(_html);

  rootElement = document.querySelector(options.bind);
  render(vdObj);
};

const renderHtml_cmj = (html, options = {bind: "#root"}) => {
  const html2VD = require('./pkg_node/html2VD.js');
  prevVdObj = undefined;
  rootElement = undefined;
  const _html = filterHtml(html);
  const vdObj = html2VD.html_2_vd(_html);
  rootElement = document.querySelector(options.bind);
  render(vdObj);
};


const triggerRender = () => {
  render();
};

const patch = (parent, patches, index = -1) => {
  let isRoot = false;

  if (index === -1) {
    isRoot = true;
  }


  if (!patches) {
    return;
  }

  // create
  if (patches.type === nodePatchTypes.CREATE) {
    return parent.appendChild(createElement(patches.vd))
  }

  let element = parent.childNodes[index];
  // remove
  if (patches.type === nodePatchTypes.REMOVE) {
    return parent.removeChild(element)
  }

  // replace
  if (patches.type === nodePatchTypes.REPLACE) {
    return parent.replaceChild(createElement(patches.vd), element)
  }

  // update
  if (patches.type === nodePatchTypes.UPDATE) {
    const {attrs, children} = patches;
    !isRoot && patchAttrs(element, attrs);
    children.forEach((patcher, i) => {
      if (isRoot) {
        patch(parent, patcher, i);
      } else {
        patch(element, patcher, i);
      }
    });
  }
};

const patchAttrs = (element, attrs) => {
  if (!attrs) return
  attrs.forEach(patches => {
    if (patches.type === attrPatchTypes.REMOVE) {
      element.removeAttribute(patches.key);
    } else if (patches.type === attrPatchTypes.UPDATE) {
      element.setAttribute(patches.key, patches.value);
    }
  });
};


var VD = {
  triggerRender,
  render,
  renderHtml,
  renderHtml_cmj,
};

var index = {
  createElement,
  triggerRender: VD.triggerRender,
  render: VD.render,
  renderHtml: VD.renderHtml,
  renderHtml_cmj: VD.renderHtml_cmj,
};

module.exports = index;
