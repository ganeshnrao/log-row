### A lightweight module to log objects as rows

![Example of log-row](./log-row.jpg)

This utility module exports two methods `logRow(settings)` for logging unstructured data as rows, and `createTimer(autoStart)` to capture time durations.

### Installation

```bash
npm install log-row --save-dev
```
---

# `logRow(settings)`
This method returns a function that takes one argument and formats the object based on the settings provided. See usage below.

### Usage
```js
const { logRow } = require("log-row");

const row = logRow({
  missingKeys: "None",
  defaultAlign: "right",
  separator: "  :  ",
  columns: [
    "Foo",
    { key: "foobar", label: "Foo", width: 6, truncate: true },
    { key: "animal", label: "Animal", width: 8, align: "left" },
    { key: "fruit", label: "Fruit", width: 8, pad: "·" }
  ]
});

console.log(row({ animal: "Cat", fruit: "Peach" }));
console.log(row({ animal: "Dog", fruit: "Apple", foobar: "hello world!" }));
```

The above usage will log the following.
```
Foo  :  Foo   None  :  Animal Cat       :  Fruit ···Peach
Foo  :  Foo world!  :  Animal Dog       :  Fruit ···Apple
```

### `settings`
The `logRow` method returns a function, which when called will format the object passed in as a string using the column setting provided as below. The following also shows the defaults for each property.

```js
const row = logRow({
  separator: " | ",
  missingKeys: null, // if set to string then all missing keys will be
                     // displayed with set value
  defaultAlign: "right",
  columns: [
    "foo" // each column entry can be string or object
          // strings will be printed as is
    { 
      key: "foo.bar",  // path from where to get the value on the object
      label: "FooBar", // is not provided key will be used as label,
                       // if set to null no label will be displayed
      width: 5,        // if provided column will be aligned
                       // to specified characters
      align: "right",  // defaults to the value specified for defaultAlign
      pad: " ",        // when width and align is specified the pad string
                       // will be used for alignment
      truncate: false  // value will be truncated to fit column
                       // width is set to true
    },
    // sepcify more columns here...
  ]
})
```

# `createTimer(autoStart = true)`
This utility measures time. The `autoStart` (defaults to `true`) determines if the timer shoould start measuring as soon as initialized. The timer can be started and stopped multiple times by calling `start` or `stop` on the object returned. The object will measure only the running time.

### Example
```js
const { createTimer } = require("log-row");

async function foo() {
  const duration = createTimer(true); // timer started
  await someAsyncOp(); // takes 100ms
  duration.stop();
  await someOtherAsyncOp(); // takes 200ms
  duration.start();
  await someAsyncOp(); // takes 400ms
  console.log(`someAsyncOp took ${duration}ms`); // logs "someAsyncOp took 500ms"
}
```