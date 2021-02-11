import { NodeType, attrPatchTypes, nodePatchTypes } from './type.js';



export const diffVd = (prevVd, nextVd) => {

  // fragmentNode
  // TODO
  if (prevVd.node_type === NodeType.FragmentNode && nextVd.node_type === NodeType.FragmentNode) {
    return diffChildren(prevVd, nextVd)[0];
  }
  
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

}


export const diffAttrs = (prevVd, nextVd) => {
  const patches = [];

  const allAttrs = {...prevVd.attrs, ...nextVd.attrs}
  
  Object.keys(allAttrs).forEach((key) => {
    for (key in allAttrs.keys()) {
      const prevAttr = prevVd.attrs[key]
      const nextAttr = nextVd.attrs[key]
      
      // delete
      if (nextAttr === undefined) {
        patches.push({
          type: attrPatchTypes.REMOVE,
        })
      }
  
      // update
      else if (prevAttr == undefined || prevAttr !== nextAttr) {
        patches.push({
          type: attrPatchTypes.UPDATE,
          key,
          value: nextAttr,
        })
      }
    }
  })
  
  return patches
}

export const diffChildren = (prevVd, nextVd) => {
  const patches = [];

  const maxLen = Math.max(prevVd.children.length, nextVd.children.length);
  
  for (let i = 0; i < maxLen; i++) {
    let childPatcher = diffVd(prevVd.children[i], nextVd.children[i])
    patches.push(childPatcher)
  }

  return patches
  
}