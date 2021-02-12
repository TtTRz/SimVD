import { NodeType, attrPatchTypes, nodePatchTypes } from './type.js';



export const diffVd = (prevVd, nextVd) => {

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

}


export const diffAttrs = (prevVd, nextVd) => {
  const patches = [];
  const prevVdAttrs = {};
  const nextVdAttrs = {};
  prevVd.attrs.forEach((i) => {
    prevVdAttrs[i.name] = i.value
  })

  nextVd.attrs.forEach((i) => {
    nextVdAttrs[i.name] = i.value
  })

  const allAttrs = {...prevVdAttrs, ...nextVdAttrs}
  Object.keys(allAttrs).forEach((key) => {
    const prevAttr = prevVdAttrs[key]
    const nextAttr = nextVdAttrs[key]
    
    // delete
    if (nextAttr === undefined) {
      patches.push({
        type: attrPatchTypes.REMOVE,
        key,
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