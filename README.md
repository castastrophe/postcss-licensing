# postcss-licensing

> Prepends licensing or other metadata to CSS files

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

## Contributing

Contributions are welcome! Please open an [issue](https://github.com/castastrophe/glob-concat-cli/issues/new) or submit a pull request.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details. This means you can use this however you like as long as you provide attribution back to this one. It's nice to share but it's also nice to get credit for your work. 😉

## Funding ☕️

If you find this plugin useful and would like to buy me a coffee/beer as a small thank you, I would greatly appreciate it! Funding links are available in the GitHub UI for this repo.

<a href="https://www.buymeacoffee.com/castastrophe" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
