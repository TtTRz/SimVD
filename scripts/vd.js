import init, { html_2_vd } from '../pkg/html2VD.js'
import { createElement } from './element.js'
import { attrPatchTypes, nodePatchTypes } from './type.js';
import {diffVd } from './diff.js';

const filterHtml = (html) => {
  return html.trim().replace(/[\n]+[\s]*/g, "")
}

let prevVdObj = undefined;
let rootElement = undefined;
let isWasmInitial = false;

const render = (vdObj) => {
  if (prevVdObj) {
    const patches = diffVd(prevVdObj, vdObj)
    prevVdObj = vdObj;
    patch(rootElement, patches);
  } else {
    let root = createElement(vdObj).cloneNode(true);
    prevVdObj = vdObj;
    rootElement.appendChild(root)
  }
}

const renderHtml = async (html, options = {bind: "#root"}) => {
  prevVdObj = undefined;
  rootElement = undefined;
  if (!isWasmInitial) {
    await init();
    isWasmInitial = true;
  }

  const _html = filterHtml(html)
  const vdObj = html_2_vd(_html)

  rootElement = document.querySelector(options.bind)
  render(vdObj)
}

const renderHtml_cmj = (html, options = {bind: "#root"}) => {
  const html2VD = require('./pkg_node/html2VD.js')
  prevVdObj = undefined;
  rootElement = undefined;
  const _html = filterHtml(html)
  const vdObj = html2VD.html_2_vd(_html)
  rootElement = document.querySelector(options.bind)
  render(vdObj)
}


const triggerRender = () => {
  render();
}

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
    const {attrs, children} = patches
    !isRoot && patchAttrs(element, attrs);
    children.forEach((patcher, i) => {
      if (isRoot) {
        patch(parent, patcher, i)
      } else {
        patch(element, patcher, i)
      }
    })
  }
}

const patchAttrs = (element, attrs) => {
  if (!attrs) return
  attrs.forEach(patches => {
    if (patches.type === attrPatchTypes.REMOVE) {
      element.removeAttribute(patches.key)
    } else if (patches.type === attrPatchTypes.UPDATE) {
      element.setAttribute(patches.key, patches.value)
    }
  })
}


export default {
  triggerRender,
  render,
  renderHtml,
  renderHtml_cmj,
}