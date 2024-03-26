import { html2text, text2html } from ".";
import { expect, jest, test } from "@jest/globals";

const testCases = [
  {
    description: "text with attributes",
    text: `prefix [Lorem ipsum dolor]{class="foo" id="bar"}`,
    html: `prefix <span class="foo" id="bar">Lorem ipsum dolor</span>`,
  },
  {
    description: "text to with attributes values that have spaces",
    text: `prefix [Lorem ipsum dolor]{class="foo here" id="foo there"}`,
    html: `prefix <span class="foo here" id="foo there">Lorem ipsum dolor</span>`,
  },
  {
    description: "text to with attribute values that have html reserved chars",
    text: `prefix [Lorem ipsum dolor]{class="foo > bar" id="bar < foo"}`,
    html: `prefix <span class="foo &#62; bar" id="bar &#60; foo">Lorem ipsum dolor</span>`,
  },
  {
    description: "text to with attribute values that are empty",
    text: `prefix [Lorem ipsum dolor]{class="" id=""}`,
    html: `prefix <span class="" id="">Lorem ipsum dolor</span>`,
  },
  {
    description: "span in link",
    text: `prefix <a href="/">[like this one]{type="badge" color="green"}</a>`,
    html: `prefix <a href="/"><span type="badge" color="green">like this one</span></a>`,
  },
];

testCases.forEach(({ description, text, html }) => {
  test(`[text2html] ${description}`, () => {
    expect(text2html(text)).toBe(html);
  });
  test(`[html2text] ${description}`, () => {
    expect(html2text(html)).toBe(text);
  });
});
