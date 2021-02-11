import { NodeType } from './type.js';

// element 
export const createElement = (vd) => {

  // TextNode
  if (vd.node_type === NodeType.TextNode) {
    return document.createTextNode(vd.inner_html)
  }

  // FragmentNode
  if (vd.node_type === NodeType.FragmentNode) {
    const FragmentElement = document.createDocumentFragment()

    const { children } = vd;

    children.map((child) => {
      let childElement = createElement(child)
      FragmentElement.appendChild.call(FragmentElement, childElement)
    })

    return FragmentElement;
  }

  // ElementNode
  const {tag, children, attrs} = vd

  // 1. createRealDomElement
  const element = document.createElement(tag)

  // 2. setDomAttrs
  setAttrs(element, attrs)

  // 3. createChildElement
  children.map((child) => {
    let childElement = createElement(child)
    element.appendChild.call(element, childElement)
  })

  return element

}

// attrs
const setAttrs = (element, attrs) => {
  for (let key in attrs) {
    element.setAttributes(key, attrs[key])
  }
}


export default {
  createElement,
}


