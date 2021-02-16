import { expect }from 'chai'
const html2VD = require('../pkg_node/html2VD.js');
const {html_2_vd} = html2VD
import vd from '../scripts/index.js';
import {filterHtml} from '../utils/html_filter';
import { env }from './env';

describe("single element", () => {
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
    expect(root.innerHTML).to.equal("<span>hello</span>")
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal("<div>hello</div>")
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
    expect(root.innerHTML).to.equal("<div>hello</div>")
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal(`<div class="hello">hello</div>`)
  })

  it("test single element children change", () => {
    const html = `
      <div>hello</div>
    `
    const html_new = `
      <div>
        <span>hello</span>
      </div>
    `
    const root = document.getElementById("root");
    vd.renderHtml_cmj(html);
    expect(root.innerHTML).to.equal("<div>hello</div>")
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal(`<div><span>hello</span></div>`)
  })

  it("test single element children list change", () => {
    const html = `
      <div>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
      </div>
    `
    const html_new = `
      <div>
        <li>2</li>
        <li>3</li>
        <li>3</li>
        <li>4</li>
        <li>6</li>
      </div>
    `

    const root = document.getElementById("root");
    vd.renderHtml_cmj(html);
    expect(root.innerHTML).to.equal("<div><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></div>")
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal(`<div><li>2</li><li>3</li><li>3</li><li>4</li><li>6</li></div>`)

  })
})

describe("multiple element", () => {
  beforeEach(() => {
    env()
  })
  
  it("test multiple element tag change", () => {
    const html = `
      <span>hello</span>
      <div>rom</div>
    `

    const html_new = `
      <div>hello</div>
      <span>rom</span>
    `
    const root = document.getElementById("root");
    vd.renderHtml_cmj(html);
    expect(root.innerHTML).to.equal("<span>hello</span><div>rom</div>")
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal("<div>hello</div><span>rom</span>")
  })

  it("test multiple element attrs change", () => {
    const html = `
      <div class="hello">hello</div>
      <span id="rom" class="chung">rom</span>
    `
    const html_new = `
      <div class="rom">hello</div>
      <span id="hello" class="rom">rom</span>
    `
    const root = document.getElementById("root");
    vd.renderHtml_cmj(html);
    expect(root.innerHTML).to.equal(`<div class="hello">hello</div><span id="rom" class="chung">rom</span>`)
    vd.render(html_2_vd(filterHtml(html_new)))
    expect(root.innerHTML).to.equal(`<div class="rom">hello</div><span id="hello" class="rom">rom</span>`)
  })

})


