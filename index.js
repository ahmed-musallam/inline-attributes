const decodeHTML = (str) =>
  str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));

const encodeHTML = (str) =>
  str.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);

const isValidHtmlAttr = (key) => key.match(/^[a-zA-Z0-9-]+$/);

/**
 *
 * @param {string} html
 */
export const html2text = (html) => {
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
 *
 * @param {*} text
 */
export const text2html = (expression) => {
  // Regular expression to match the pattern
  const regex = /\[([^[\]]*)\]\{(.*?)\}/g;

  // Replace function
  return expression.replace(regex, function (match, text, attrs) {
    // Encode the text and attribute values
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
