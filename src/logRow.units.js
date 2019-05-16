const _ = require("lodash");

const settingsDefaults = {
  missingKeys: null,
  separator: " | ",
  defaultAlign: "right",
  columns: ["No columns specified"]
};

function isLeft(align) {
  return align === "left";
}

function getTruncateFn(field) {
  const { width, align, truncate } = field;
  if (width && truncate) {
    if (isLeft(align)) {
      return function(value) {
        return String(value).slice(0, width);
      };
    }
    return function(value) {
      return String(value).slice(-width);
    };
  }
  return _.identity;
}

function getPadFn(field) {
  const { width, align, pad } = field;
  if (width) {
    if (isLeft(align)) {
      return function(value) {
        return _.padEnd(value, width, pad);
      };
    }
    return function(value) {
      return _.padStart(value, width, pad);
    };
  }
  return _.identity;
}

function getFieldFunction(field) {
  const { key, label, missingKeys = null } = field;
  const truncate = getTruncateFn(field);
  const pad = getPadFn(field);
  const prefix = label === null ? "" : `${label || key} `;
  return function(obj) {
    if (_.has(obj, key) || !_.isNull(missingKeys)) {
      const value = _.get(obj, key, missingKeys);
      return `${prefix}${pad(truncate(value))}`;
    }
    return "";
  };
}

function getColumnFunctions(settings) {
  const { columns, missingKeys, defaultAlign } = settings;
  return _.map(columns, field => {
    if (_.isNil(field) || _.isArray(field)) {
      throw new Error("Invalid column arguments. Must be string or object");
    }
    if (_.isString(field)) {
      return _.constant(field);
    }
    return getFieldFunction({
      align: defaultAlign,
      missingKeys,
      ...field
    });
  });
}

function getRowFormatter(settings) {
  const options = _.defaultsDeep(settings, settingsDefaults);
  const columnFunctions = getColumnFunctions(options);
  return function(obj) {
    return _(columnFunctions)
      .map(column => column(obj))
      .compact()
      .value()
      .join(options.separator);
  };
}

module.exports = {
  isLeft,
  getTruncateFn,
  getPadFn,
  getFieldFunction,
  getColumnFunctions,
  getRowFormatter
};
