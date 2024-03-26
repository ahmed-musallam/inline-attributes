# inline-attributes

A simple utility to convert a special syntx to html <span> with attributes.

Inspired by: https://htmlpreview.github.io/?https://github.com/jgm/djot/blob/master/doc/syntax.html#inline-attributes

## examples

the text:

```html
[text]{color="red" class="highlight"}
```

Can be converted to:

```html
<span color="red" class="highlight">text</span>
```

Another example with a link:

```html
<a href="/">[text]{color="red" class="highlight"}<a></a></a>
```

Can be converted to:

```html
<a href="/"><span color="red" class="highlight">text</span><a></a></a>
```

See `index.test` for more examples and usage
