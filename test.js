const fs = require("fs");
const test = require("ava");
const postcss = require("postcss");

const plugin = require("./index.js");
const { messages } = require("./index.js");

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

function fetchWarnings(
  fixtureFilePath,
  options = {}
) {
  return postcss([plugin(options)])
    .process(fs.readFileSync(`./fixtures/${fixtureFilePath}`, "utf8"), {
      from: fixtureFilePath,
    })
    .then((result) => {
      return result.warnings();
    });
}

test("create basic output", (t) => {
  return compare(t, "basic.css", "basic.css");
});

test("add no license if the file is empty", (t) => {
  return compare(t, "empty.css", "empty.css");
});

test("load license from file", (t) => {
  return compare(t, "basic.css", "custom_copyright.css", { filename: './fixtures/CUSTOM_COPYRIGHT' });
});

test("add license to empty file is option skipIfEmpty = false", (t) => {
  return compare(t, "empty.css", "empty_with_license.css", { skipIfEmpty: false });
});

test("warn if files don't exist", async (t) => {
  const warnings = await fetchWarnings("basic.css", { filename: './fixtures/FAIL_COPYRIGHT' });
  t.is(warnings.length, 1);
  t.is(warnings?.[0]?.text, messages.fileNotFound('./fixtures/FAIL_COPYRIGHT'));
});
