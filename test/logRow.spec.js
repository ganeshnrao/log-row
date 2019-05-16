const test = require("ava");
const units = require("../src/logRow.units");

test("isLeft: return true if argument is left", t => {
  t.is(units.isLeft("left"), true);
  t.is(units.isLeft("foo"), false);
});

test("getTruncateFn", t => {
  const truncateLeft = units.getTruncateFn({
    width: 5,
    align: "left",
    truncate: true
  });
  t.is(truncateLeft("hello world"), "hello", "truncates to width from left");

  const truncateRight = units.getTruncateFn({
    width: 5,
    align: "right",
    truncate: true
  });
  t.is(truncateRight("hello world"), "world", "truncates to width from right");

  const truncate = units.getTruncateFn({
    width: 5,
    align: "left"
  });
  t.is(truncate("hello world"), "hello world", "truncate disabled");
});

test("getPadFn: function pads from left", t => {
  const left = units.getPadFn({ width: 5, align: "left" });
  t.is(left("foo"), "foo  ", "align left");

  const right = units.getPadFn({ width: 5, align: "right" });
  t.is(right("foo"), "  foo", "align right");
});

test("getFieldFunction: function for field object", t => {
  const settings = { key: "foo.bar", width: 5, align: "left" };
  let fn = units.getFieldFunction(settings);
  t.is(fn({ foo: { bar: 2 } }), "foo.bar 2    ", "no label specified");

  fn = units.getFieldFunction({ ...settings, label: null });
  t.is(fn({ foo: { bar: 2 } }), "2    ", "label set to null");

  fn = units.getFieldFunction({ ...settings, label: "Foo", align: "right" });
  t.is(fn({ foo: { bar: 2 } }), "Foo     2", "explicit label, right align");

  fn = units.getFieldFunction({
    ...settings,
    label: "Foo",
    align: "right"
  });
  t.is(fn({ bar: 2 }), "", "missingKeys hidden");

  fn = units.getFieldFunction({
    ...settings,
    label: "Foo",
    align: "right",
    missingKeys: "none"
  });
  t.is(fn({ bar: 2 }), "Foo  none", "custom missingKeys value");

  fn = units.getFieldFunction({ key: "foo.bar", label: "Foo", missingKeys: "NA" });
  t.is(fn({ bar: 2 }), "Foo NA", "No width specified");
});

test("getRowFormatter", t => {
  const row = units.getRowFormatter({
    columns: [
      "test",
      { key: "foo", width: 5, truncate: true },
      { key: "bar", width: 4 },
      { key: "bar.baz", label: "baz", width: 3, align: "left", truncate: true }
    ]
  });
  t.throws(
    () => units.getRowFormatter({ columns: [null] }),
    "Invalid column arguments. Must be string or object",
    "invalid columns"
  );
  t.is(
    row({ foo: "hello world", bar: { a: "apple", baz: 12345 } }),
    "test | foo world | bar [object Object] | baz 123",
    "example"
  );
  t.is(
    units.getRowFormatter()({}),
    "No columns specified",
    "no columns specified"
  );
});
