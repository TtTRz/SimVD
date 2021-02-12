const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { document }= (new JSDOM(`<!DOCTYPE html><html><body></body></html>`)).window;

export const env = () => {
  console.log('env init')
  global.document = document;
  let root = document.getElementById("root")
  root && root.parentNode.removeChild(root)
  root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.appendChild(root)
}