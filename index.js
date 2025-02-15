const { readFileSync, existsSync } = require("fs");
const { join } = require("path");

/**
 * @typedef {object} Options
 * @property {string[]} filename
 * @property {string} cwd
 * @property {boolean} skipIfEmpty
 */

const messages = {
    fileNotFound: (path) =>
        `File(s) not found at ${path}. Please specify a path with the filename option or create a COPYRIGHT file in the root of the project.`,
};

/**
 * @type {import('postcss').PluginCreator<Options>}
 * @param {Options} options
 * @returns {import('postcss').Plugin}
 */
module.exports = (options = { filename, cwd, skipIfEmpty }) => {
    let {
        filename = ["COPYRIGHT", "LICENSE"],
        cwd = process.cwd(),
        skipIfEmpty = true,
    } = options;
    return {
        postcssPlugin: "postcss-licensing",
        OnceExit(css, { Comment, result }) {
            /* Don't add a license if there are no nodes unless opted in via skipIfEmpty = false */
            if (css.nodes.length === 0 && skipIfEmpty) {
                css.cleanRaws();
                return;
            }

            /* Fetch the license from the provided location */
            if (typeof filename === "string") {
                filename = [filename];
            }

            /* Find which file can be found in the order provided */
            let content;
            filename.forEach((f) => {
                // If we already found a file, don't look for another
                if (content) return;
                else if (existsSync(join(cwd, f))) {
                    content = readFileSync(join(cwd, f), "utf8")?.trim();

                    // If the file is empty, reset content to undefined
                    if (!content) content = undefined;
                }
            });

            /* If none of the provided paths exist, return a warning */
            if (!content) {
                return result.warn(
                    messages.fileNotFound(filename.join(", ")),
                    { node: css }
                );
            }

            // Add the license to the top of the file
            const lines = content.split("\n").map((l) => l.trim());
            const text = lines.map((l) => (l ? ` * ${l}` : " *")).join("\n");
            const comment = new Comment({
                text,
                raws: { left: "!\n", right: "\n " },
            });

            css.prepend(comment);

            if (comment.next()) {
                comment.next().raws.before = "\n\n";
            } else {
                comment.parent.raws.after = "\n";
            }
        },
    };
};

module.postcss = true;
module.exports.messages = messages;
