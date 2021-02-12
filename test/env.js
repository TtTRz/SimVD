export const env = () => {
  console.log('env init')
  let root = document.getElementById("root")
  root && root.parentNode.removeChild(root)
  root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.appendChild(root)
}