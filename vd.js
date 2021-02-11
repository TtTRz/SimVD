import init, { html_2_vd } from './pkg/html2VD.js'
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
    console.log(rootElement)
    const patches = diffVd(prevVdObj, vdObj)
    prevVdObj = vdObj;
    console.log(patches)
    patch(rootElement, patches);
  } else {
    let root = createElement(vdObj).cloneNode(true);
    prevVdObj = vdObj;
    rootElement.appendChild(root)
    // document.body.appendChild(root);
    // rootElement = document.body.
  }
}

const renderHtml = async (html, options = {bind: "#root"}) => {
  if (!isWasmInitial) {
    await init();
    isWasmInitial = true;
  }

  const _html = filterHtml(html)
  const vdObj = html_2_vd(_html)

  rootElement = document.querySelector(options.bind)
  render(vdObj)
}


const triggerRender = () => {
  render();
}

const patch = (domElement, patches, index = 0) => {
  console.log(domElement)
  console.log(patches)
  if (!patches) {
    return;
  }

  // create
  if (patches.type === nodePatchTypes.CREATE) {
    return domElement.appendChild(createElement(patches.vd))
  }

  const element = domElement.childNodes[index];
  console.log(element)

  // remove
  if (patches.type === nodePatchTypes.REMOVE) {
    return parent.removeChild(element)
  }

  // replace
  if (patches.type === nodePatchTypes.REPLACE) {
    return domElement.replaceChild(createElement(patches.vd), element)
  }

  // update
  if (patches.type === nodePatchTypes.UPDATE) {
    const {attrs, children} = patches
    patchAttrs(domElement, attrs);
    children.forEach((patches, i) => {
      patch(element, patches, i)
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
  renderHtml
}