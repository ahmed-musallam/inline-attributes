const decodeHTML = (str) =>
  str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

const encodeHTML = (str) =>
  str.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);

const isValidHtmlAttr = (key) => key.match(/^[a-zA-Z0-9-]+$/);

/**
 * converts html with spans to text with inline attributes.
 * @param {string} html
 */
export const html2text = (html) => {
  if (!html) return html;
  // Regular expression to match the pattern
  const regex = /<span (.*?)>(.*?)<\/span>/g;

  // Replace function
  return html.replace(regex, function (match, attrs, text) {
    // Decode the text and attribute values
    text = decodeHTML(text);
    attrs = attrs
      .split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g) // match spaces only if not within quotes
      .map((attr) => {
        const [key, value] = attr.split("=");
        // check if key is valid html attribute
        if (!isValidHtmlAttr(key)) return undefined;
        return `${key}="${decodeHTML(value.replace(/"/g, ""))}"`;
      })
      .filter(Boolean)
      .join(" ");

    // Construct the text format
    return `[${text}]{${attrs}}`;
  });
};

/**
 * converts text with attributes to <span> elements wit given attributes.
 * eg: [text]{color="red" class="highlight"} => <span color="red" class="highlight">text</span>
 * @param {string} inputStr
 */
export const text2html = (inputStr) => {
  if (!inputStr) return inputStr;
  const regex = /\[([^[\]]*)\]\{(.*?)\}/g;
  return inputStr.replace(regex, function (match, text, attrs) {
    text = encodeHTML(text);
    attrs = attrs
      .split(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g) // match spaces only if not within quotes
      .map((attr) => {
        const [key, value] = attr.split("=");
        return `${key}="${encodeHTML(value.replace(/"/g, ""))}"`;
      })
      .join(" ");

    // Construct the HTML equivalent
    return `<span ${attrs}>${text}</span>`;
  });
};

/**
 * helper - walkes the DOM and replaces text nodes with spans if they have inline-attributes
 * @param {HTMLElement} main
 */
export function decorateSpans(main) {
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    decorateTextNode(walker.currentNode);
  }
}

/**
 * decorates a text node with inline attributes to a span element
 * @param {Node} node
 */
export function decorateTextNode(node) {
  const textContent = node.textContent;
  if (textContent.includes("[") && textContent.includes("]{")) {
    const span = document.createElement("span");
    span.innerHTML = text2html(textContent);
    window.requestAnimationFrame(() => {
      node.replaceWith(span);
    });
  }
}
