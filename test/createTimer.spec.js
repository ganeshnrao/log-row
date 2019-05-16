const lolex = require("lolex");
const test = require("ava");
const timer = require("../src/createTimer");

let clock;

test.before(() => {
  clock = lolex.install({ shouldAdvanceTime: true });
});

test.after(() => {
  clock.uninstall();
});

test("automatically starts", t => {
  const duration = timer();
  clock.tick(200);
  t.is(duration.valueOf(), 200);
});

test("disable auto-start. calling stop before start does nothing", t => {
  const duration = timer(false);
  clock.tick(200);
  duration.stop();
  t.is(duration.valueOf(), 0);
});

test("calling start after already started does nothing", t => {
  const duration = timer();
  duration.start();
  t.is(duration.valueOf(), 0);
});

test("convert to string or JSON", t => {
  const duration = timer();
  clock.tick(200);
  t.is(String(duration), "200");
  t.is(duration.toJSON(), 200);
});

test("starting and stopping multiple times will get total run time duration", t => {
  const duration = timer();
  clock.tick(200);
  duration.stop();
  clock.tick(400);
  duration.start();
  clock.tick(200);
  t.is(duration.valueOf(), 400);
});
