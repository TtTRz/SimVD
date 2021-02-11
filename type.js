export const NodeType = {
  ElementNode: "ElementNode",
  TextNode: "TextNode",
  FragmentNode: "FragmentNode"
}

export const nodePatchTypes = {
  CREATE: 'create node',
  REMOVE: 'remove node',
  REPLACE: 'replace node',
  UPDATE: 'update node',
}

export const attrPatchTypes = {
  REMOVE: 'remove attrs',
  UPDATE: 'update attrs',
}