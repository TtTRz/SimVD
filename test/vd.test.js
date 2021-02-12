import { expect }from 'chai'
const html2VD = require('../pkg_node/html2VD.js');
const {html_2_vd} = html2VD
import vd from '../index.js';
import {filterHtml} from '../utils/html_filter';
import { env }from './env';

describe("test single element tag change", () => {
  beforeEach(() => {
    env()
  })
  it("test single element tag change", () => {
    const html = `
      <span>hello</span>
    `
    const html_new = `
      <div>hello</div>
    `
    const root = document.getElementById("root");
    vd.renderHtml_cmj(html);
    console.log("document", document.body.innerHTML)

    expect(root.innerHTML).to.equal("<span>hello</span>")
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal("<div>hello</div>")
  })
})

describe("test single element attrs change", () => {
  beforeEach(() => {
    env()
  })
  it("test single element attrs change", () => {
    const html = `
      <div>hello</div>
    `
    const html_new = `
      <div class="hello">hello</div>
    `
    const root = document.getElementById("root");
    vd.renderHtml_cmj(html);
    // console.log(root.innerHTML)
    console.log("document", document.body.innerHTML)
    expect(root.innerHTML).to.equal("<div>hello</div>")
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal("<div class=\"hello\">hello</div>")
    console.log(root.innerHTML)
  })
})