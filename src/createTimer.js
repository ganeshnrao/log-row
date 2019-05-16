const _ = require("lodash");

module.exports = function(autoStart = true) {
  let startMs = undefined;
  let totalMs = 0;
  const timer = {
    start() {
      startMs = _.isUndefined(startMs) ? Date.now() : startMs;
      return timer;
    },
    stop() {
      if (!_.isUndefined(startMs)) {
        totalMs += Date.now() - startMs;
        startMs = undefined;
      }
      return timer;
    },
    valueOf() {
      timer.stop();
      return totalMs;
    },
    toJSON() {
      return timer.valueOf();
    },
    toString() {
      return timer.valueOf();
    }
  };
  if (autoStart) {
    timer.start();
  }
  return timer;
};
