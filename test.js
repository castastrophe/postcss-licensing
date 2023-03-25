const fs = require("fs");
const test = require("ava");
const postcss = require("postcss");
const plugin = require("./index.js");

function compare(
  t,
  fixtureFilePath,
  expectedFilePath,
  options = {}
) {
  return postcss([plugin(options)])
    .process(fs.readFileSync(`./fixtures/${fixtureFilePath}`, "utf8"), {
      from: fixtureFilePath,
    })
    .then((result) => {
      const actual = result.css;
      const expected = fs.readFileSync(
        `./expected/${expectedFilePath}`,
        "utf8"
      );
      t.is(actual, expected);
      t.is(result.warnings().length, 0);
    });
}

test("create basic output", (t) => {
  return compare(t, "basic.css", "basic.css");
});
