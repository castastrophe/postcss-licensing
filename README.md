# postcss-licensing

> Prepends licensing information to CSS files

## Installation

```sh
yarn add -D postcss-licensing
postcss -u postcss-licensing -o dist/index.css src/index.css
```

## Usage

This plugin will prepend your CSS file with a copyright/license. If no path or filename is provided, the plugin will try to find a file with the name `LICENSE` or `COPYRIGHT` at the cwd of the postcss config.

You can expect to turn a file like this:

```css
.spectrum--express {
  --spectrum-actionbutton-border-color: transparent;
  --spectrum-actionbutton-background-color: purple;
}

```

into this:

```css
/*!
 * <copyright content>
 */

.spectrum--express {
  --spectrum-actionbutton-background-color: purple;
  --spectrum-actionbutton-border-color: transparent;
}

```

## Options

- `filename` [type: `string[] or string`]: optional filename or set of possible filenames. A single filename or full path is allowed. The first item found in the array will be used so be sure to provide them in priority order. Defaults to: `["COPYRIGHT", "LICENSE"]`.
- `cwd` [type: `string`]: optional working directory from which to search for license files. Defaults to: `process.cwd()`.
- `skipIfEmpty` [type: `boolean`]: if true, skips adding the license when the rest of the file is empty. Defaults to: `true`.

### Example

```js
postcss([
  require('postcss-licensing')({
    filename: 'LICENSE.txt',
    cwd: path.join(process.cwd(), '../../'),
    skipIfEmpty: false,
  })
]).process(...)
```
