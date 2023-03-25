const { readFileSync, existsSync } = require("fs");
const { join } = require("path");

/**
 * @typedef {object} Options
 * @property {string[]=} filename
 * @property {string=} cwd
 * @property {boolean=} skipIfEmpty
 */

/**
 * @type {import('postcss').PluginCreator<Options>}
 * @param {Options} options
 * @returns {import('postcss').Plugin}
 */
module.exports = (options = { filename, cwd, skipIfEmpty }) => {
    const {
        filename = ["COPYRIGHT", "LICENSE"],
        cwd = process.cwd(),
        skipIfEmpty = true,
    } = options;
    return {
        postcssPlugin: "postcss-licensing",
        OnceExit(css, { Comment }) {
            // Don't add a license if there are no nodes
            if (css.nodes.length === 0 && skipIfEmpty) {
                css.cleanRaws();
                return;
            }

            function checkForFile(cwd, file) {
                const path = join(cwd, file);
                if (!existsSync(path)) return;
                return path;
            }

            /* Fetch the license from the provided location */
            let path;

            if (typeof filename === "string") {
                filename = [filename];
            }

            filename.forEach((f) => {
                if (path) return;
                else path = checkForFile(cwd, f);
            });

            if (!existsSync(path)) {
                return css.error(
                `File not found at ${path}. Please specify a path with the filename option or create a COPYRIGHT file in the root of the project.`
                );
            }

            const content = readFileSync(path, "utf8").trim();
            if (!content) {
                css.error(
                `File is empty at ${path}. Please specify a path with the filename option or create a COPYRIGHT file in the root of the project.`
                );
            }

            const lines = content.split("\n").map((l) => l.trim());
            const text = lines.map((l) => (l ? ` * ${l}` : " *")).join("\n");
            const comment = new Comment({
                text,
                raws: { left: "!\n", right: "\n " },
            });

            css.prepend(comment);
            if (comment.next()) {
                comment.next().raws.before = "\n\n";
            }
        },
    };
};

module.postcss = true;
