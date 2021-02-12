export const filterHtml = (html) => {
  return html.trim().replace(/[\n]+[\s]*/g, "")
}