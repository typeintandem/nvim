/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * Displays a helpful message and the source of
 * the format when it is invalid.
 */
class InvalidFormatError extends Error {
  constructor(formatFn) {
    super(`Format functions must be synchronous taking a two arguments: (info, opts)
Found: ${formatFn.toString().split('\n')[0]}\n`);

    Error.captureStackTrace(this, InvalidFormatError);
  }
}

/*
 * function format (formatFn)
 * Returns a create function for the `formatFn`.
 */
module.exports = function (formatFn) {
  if (formatFn.length > 2) {
    throw new InvalidFormatError(formatFn);
  }

  /*
   * function Format (options)
   * Base prototype which calls a `_format`
   * function and pushes the result.
   */
  function Format(options) { this.options = options || {}; }
  Format.prototype.transform = formatFn;

  //
  // Create a function which returns new instances of
  // FormatWrap for simple syntax like:
  //
  // require('winston').formats.json();
  //
  function createFormatWrap(opts) {
    return new Format(opts);
  }

  //
  // Expose the FormatWrap through the create function
  // for testability.
  //
  createFormatWrap.Format = Format;
  return createFormatWrap;
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * @api public
 * @property {function} format
 * Both the construction method and set of exposed
 * formats.
 */
const format = exports.format = __webpack_require__(0);

/*
 * @api public
 * @method {function} levels
 * Registers the specified levels with logform.
 */
exports.levels = __webpack_require__(15);

/*
 * @api private
 * method {function} exposeFormat
 * Exposes a sub-format on the main format object
 * as a lazy-loaded getter.
 */
function exposeFormat(name, path) {
  path = path || name;
  Object.defineProperty(format, name, {
    get: function () { return __webpack_require__(99)("./" + path); }
  });
}

//
// Setup all transports as lazy-loaded getters.
//
exposeFormat('align');
exposeFormat('cli');
exposeFormat('combine');
exposeFormat('colorize');
exposeFormat('json');
exposeFormat('label');
exposeFormat('logstash');
exposeFormat('padLevels', 'pad-levels');
exposeFormat('prettyPrint', 'pretty-print');
exposeFormat('printf');
exposeFormat('simple');
exposeFormat('splat');
exposeFormat('timestamp');
exposeFormat('uncolorize');


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let localDocument = null;

/* harmony default export */ __webpack_exports__["a"] = ({
    getDocument: () => localDocument,
    setDocument: newDocument => {
        localDocument = newDocument;
    }
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stream = __webpack_require__(3);
const util = __webpack_require__(1);
const LEVEL = Symbol.for('level');

/**
 * Constructor function for the TransportStream. This is the base prototype
 * that all `winston >= 3` transports should inherit from.
 *
 * @param  {Object} opts Options for this TransportStream instance
 *   @param {String} opts.level HIGHEST level according to RFC5424.
 *   @param {Boolean} opts.handleExceptions If true, info with { exception: true } will be written.
 *   @param {Function} opts.log Custom log function for simple Transport creation
 *   @param {Function} opts.close Called on "unpipe" from parent
 */
var TransportStream = module.exports = function TransportStream(opts) {
  stream.Writable.call(this, { objectMode: true });
  opts = opts || {};

  this.format = opts.format;
  this.level = opts.level;
  this.handleExceptions = opts.handleExceptions;

  if (opts.log) this.log = opts.log;
  if (opts.logv) this.logv = opts.logv;
  if (opts.close) this.close = opts.close;

  var self = this;

  //
  // Get the levels from the source we are piped from.
  //
  this.once('pipe', function (logger) {
    //
    // Remark (indexzero): this bookkeeping can only support multiple
    // Logger parents with the same `levels`. This comes into play in
    // the `winston.Container` code in which `container.add` takes
    // a fully realized set of options with pre-constructed TransportStreams.
    //
    self.levels = logger.levels;
    self.level = self.level || logger.level;
    self.parent = logger;
  });

  //
  // If and/or when the transport is removed from this instance
  //
  this.once('unpipe', function (src) {
    //
    // Remark (indexzero): this bookkeeping can only support multiple
    // Logger parents with the same `levels`. This comes into play in
    // the `winston.Container` code in which `container.add` takes
    // a fully realized set of options with pre-constructed TransportStreams.
    //
    if (src === self.parent) {
      this.parent = null;
      if (self.close) {
        self.close();
      }
    }
  });
};

util.inherits(TransportStream, stream.Writable);

/*
 * @private function _write(info)
 * Writes the info object to our transport instance.
 */
TransportStream.prototype._write = function (info, enc, callback) {
  if (info.exception === true && !this.handleExceptions) {
    return callback(null);
  }

  //
  // Remark: This has to be handled in the base transport now because we cannot
  // conditionally write to our pipe targets as stream.
  //
  if (!this.level || this.levels[this.level] >= this.levels[info[LEVEL]]) {
    if (this.format) {
      return this.log(
        this.format.transform(Object.assign({}, info), this.format.options),
        callback
      );
    }

    return this.log(info, callback);
  }

  return callback(null);
};

/*
 * @private function _writev(chunks, callback)
 * Writes the batch of info objects (i.e. "object chunks") to our transport instance
 * after performing any necessary filtering.
 */
TransportStream.prototype._writev = function (chunks, callback) {
  const infos = chunks.filter(this._accept, this);
  if (this.logv) {
    return this.logv(infos, callback);
  }

  for (var i = 0; i < infos.length; i++) {
    this.log(infos[i].chunk, infos[i].callback);
  }

  return callback(null);
};

/**
 * Predicate function that returns true if the specfied `info` on the WriteReq, `write`, should
 * be passed down into the derived TransportStream's I/O via `.log(info, callback)`.
 * @param   {WriteReq} write winston@3 Node.js WriteReq for the `info` object representing the log message.
 * @returns {Boolean} Value indicating if the `write` should be accepted & logged.
 */
TransportStream.prototype._accept = function (write) {
  const info = write.chunk;

  //
  // Immediately check the average case: log level filtering.
  //
  if (info.exception === true || !this.level || this.levels[this.level] >= this.levels[info[LEVEL]]) {
    //
    // Ensure the info object is valid based on `{ exception }`:
    // 1. { handleExceptions: true }: all `info` objects are valid
    // 2. { exception: false }: accepted by all transports.
    //
    if (this.handleExceptions || info.exception !== true) {
      return true;
    }
  }

  return false;
};

/**
 * _nop is short for "No operation"
 * @return {Boolean} Intentionally false.
 */
TransportStream.prototype._nop = function () {
  return void undefined;
};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A shareable symbol constant that can be used
 * as a non-enumerable / semi-hidden level identifier
 * to allow the readable level property to be mutable for
 * operations like colorization
 *
 * @type {Symbol}
 */
Object.defineProperty(exports, 'LEVEL', {
  value: Symbol.for('level')
});

/**
 * A shareable symbol constant that can be used
 * as a non-enumerable / semi-hidden message identifier
 * to allow the final message property to not have
 * side effects on another.
 *
 * @type {Symbol}
 */
Object.defineProperty(exports, 'MESSAGE', {
  value: Symbol.for('message')
});


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*

The MIT License (MIT)

Original Library 
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var colors = {};
module['exports'] = colors;

colors.themes = {};

var ansiStyles = colors.styles = __webpack_require__(90);
var defineProps = Object.defineProperties;

colors.supportsColor = __webpack_require__(91);

if (typeof colors.enabled === "undefined") {
  colors.enabled = colors.supportsColor;
}

colors.stripColors = colors.strip = function(str){
  return ("" + str).replace(/\x1B\[\d+m/g, '');
};


var stylize = colors.stylize = function stylize (str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  return ansiStyles[style].open + str + ansiStyles[style].close;
}

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function (str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe,  '\\$&');
}

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles = (function () {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function (key) {
    ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);

function applyStyle() {
  var args = arguments;
  var argsLen = args.length;
  var str = argsLen !== 0 && String(arguments[0]);
  if (argsLen > 1) {
    for (var a = 1; a < argsLen; a++) {
      str += ' ' + args[a];
    }
  }

  if (!colors.enabled || !str) {
    return str;
  }

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
  }

  return str;
}

function applyTheme (theme) {
  for (var style in theme) {
    (function(style){
      colors[style] = function(str){
        if (typeof theme[style] === 'object'){
          var out = str;
          for (var i in theme[style]){
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style)
  }
}

colors.setTheme = function (theme) {
  if (typeof theme === 'string') {
    try {
      colors.themes[theme] = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
      applyTheme(colors.themes[theme]);
      return colors.themes[theme];
    } catch (err) {
      console.log(err);
      return err;
    }
  } else {
    applyTheme(theme);
  }
};

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

var sequencer = function sequencer (map, str) {
  var exploded = str.split(""), i = 0;
  exploded = exploded.map(map);
  return exploded.join("");
};

// custom formatter methods
colors.trap = __webpack_require__(93);
colors.zalgo = __webpack_require__(94);

// maps
colors.maps = {};
colors.maps.america = __webpack_require__(95);
colors.maps.zebra = __webpack_require__(96);
colors.maps.rainbow = __webpack_require__(97);
colors.maps.random = __webpack_require__(98)

for (var map in colors.maps) {
  (function(map){
    colors[map] = function (str) {
      return sequencer(colors.maps[map], str);
    }
  })(map)
}

defineProps(colors, init());

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const colors = __webpack_require__(25);

//
// Fix colors not appearing in non-tty environments
//
colors.enabled = true;

/**
 * @property {RegExp} hasSpace
 * Simple regex to check for presence of spaces.
 */
const hasSpace = /\s+/;

/*
 * function colorize (info)
 * Returns a new instance of the colorize Format that applies
 * level colors to `info` objects. This was previously exposed
 * as { colorize: true } to transports in `winston < 3.0.0`.
 */
module.exports = function createColorize(opts) {
  return new Colorizer(opts);
};

//
// Attach the Colorizer for registration purposes
//
module.exports.Colorizer
  = module.exports.Format
  = Colorizer;

/*
 * function setupColors(info)
 * Attaches a Colorizer instance to the format.
 */
function Colorizer(opts) {
  opts = opts || {};
  if (opts.colors) {
    this.addColors(opts.colors);
  }

  this.options = opts;
}

/*
 * Adds the colors Object to the set of allColors
 * known by the Colorizer
 *
 * @param {Object} colors Set of color mappings to add.
 */
Colorizer.addColors = function (colors) {
  const nextColors = Object.keys(colors).reduce((acc, level) => {
    acc[level] = hasSpace.test(colors[level])
      ? colors[level].split(hasSpace)
      : colors[level];

    return acc;
  }, {});

  Colorizer.allColors = Object.assign({}, Colorizer.allColors || {}, nextColors);
  return Colorizer.allColors;
};

/*
 * Adds the colors Object to the set of allColors
 * known by the Colorizer
 *
 * @param {Object} colors Set of color mappings to add.
 */
Colorizer.prototype.addColors = function addColors(colors) {
  return Colorizer.addColors(colors);
};

/*
 * function colorize (level, message)
 * Performs multi-step colorization using colors/safe
 */
Colorizer.prototype.colorize = function colorize(level, message) {
  if (typeof message === 'undefined') {
    message = level;
  }

  //
  // If the color for the level is just a string
  // then attempt to colorize the message with it.
  //
  if (!Array.isArray(Colorizer.allColors[level])) {
    return colors[Colorizer.allColors[level]](message);
  }

  //
  // If it is an Array then iterate over that Array, applying
  // the colors function for each item.
  //
  for (var i = 0, len = Colorizer.allColors[level].length; i < len; i++) {
    message = colors[Colorizer.allColors[level][i]](message);
  }

  return message;
};

/*
 * function transform (info, opts)
 * Attempts to colorize the { level, message } of the given
 * `logform` info object.
 */
Colorizer.prototype.transform = function transform(info, opts) {
  var level = info.level;

  if (opts.level || opts.all || !opts.message) {
    info.level = this.colorize(level);
  }

  if (opts.all || opts.message) {
    info.message = this.colorize(level, info.message);
  }

  return info;
};



/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

const assert = __webpack_require__(21)

exports.ZERO_POINT = Object.freeze({row: 0, column: 0})

exports.compare = function (a, b) {
  return primitiveCompare(a.row, a.column, b.row, b.column)
}

function primitiveCompare (rowA, columnA, rowB, columnB) {
  if (rowA === rowB) {
    return columnA - columnB
  } else {
    return rowA - rowB
  }
}

exports.traverse = function (start, distance) {
  if (distance.row === 0)
    return {row: start.row, column: start.column + distance.column}
  else {
    return {row: start.row + distance.row, column: distance.column}
  }
}

exports.traversal = function (end, start) {
  if (end.row === start.row) {
    return {row: 0, column: end.column - start.column}
  } else {
    return {row: end.row - start.row, column: end.column}
  }
}

exports.extentForText = function (text) {
  let row = 0
  let column = 0
  let index = 0
  while (index < text.length) {
    const char = text[index]
    if (char === '\n') {
      column = 0
      row++
    } else {
      column++
    }
    index++
  }

  return {row, column}
}

exports.characterIndexForPosition = function (text, target) {
  // Previously we instantiated a point object here and mutated its fields, so
  // that we could use the `compare` function we already export. However, this
  // seems to trigger a weird optimization bug on v8 5.6.326.50 which causes
  // this function to return unpredictable results, so we use primitive-valued
  // variables instead.
  let row = 0
  let column = 0
  let index = 0
  while (primitiveCompare(row, column, target.row, target.column) < 0 && index <= text.length) {
    if (text[index] === '\n') {
      row++
      column = 0
    } else {
      column++
    }

    index++
  }

  assert(primitiveCompare(row, column, target.row, target.column) <= 0, 'Target position should not exceed the extent of the given text')

  return index
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * common.js: Internal helper and utility functions for winston
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

const { format } = __webpack_require__(1);
const fs = __webpack_require__(23);
const StringDecoder = __webpack_require__(66).StringDecoder;
const Stream = __webpack_require__(3).Stream;

/**
 * @property {RegExp} formatRegExp
 * Captures the number of format (i.e. %s strings) in a given string.
 * Based on `util.format`, see Node.js source:
 * https://github.com/nodejs/node/blob/b1c8f15c5f169e021f7c46eb7b219de95fe97603/lib/util.js#L201-L230
 */
exports.formatRegExp = /%[sdjifoO%]/g;

/**
 * @property {RegExp} escapedPercent
 * Captures the number of escaped % signs in a format string (i.e. %s strings).
 */
exports.escapedPercent = /%%/g;

//
// ### function tailFile (options, iter)
// #### @options {Object} Options for tail.
// #### @iter {function} Iterator function to execute on every line.
// `tail -f` a file. Options must include file.
//
exports.tailFile = function (options, iter) {
  const buffer = new Buffer(64 * 1024);
  const decode = new StringDecoder('utf8');
  const stream = new Stream();
  let buff = '';
  let pos = 0;
  let row = 0;

  if (options.start === -1) {
    delete options.start;
  }

  stream.readable = true;
  stream.destroy = function () {
    stream.destroyed = true;
    stream.emit('end');
    stream.emit('close');
  };

  fs.open(options.file, 'a+', '0644', function (err, fd) {
    if (err) {
      if (!iter) {
        stream.emit('error', err);
      } else {
        iter(err);
      }
      stream.destroy();
      return;
    }

    (function read() {
      if (stream.destroyed) {
        fs.close(fd);
        return;
      }

      return fs.read(fd, buffer, 0, buffer.length, pos, function (err, bytes) {
        if (err) {
          if (!iter) {
            stream.emit('error', err);
          } else {
            iter(err);
          }
          stream.destroy();
          return;
        }

        if (!bytes) {
          if (buff) {
            // eslint-disable-next-line eqeqeq
            if (options.start == null || row > options.start) {
              if (!iter) {
                stream.emit('line', buff);
              } else {
                iter(null, buff);
              }
            }
            row++;
            buff = '';
          }
          return setTimeout(read, 1000);
        }

        var data = decode.write(buffer.slice(0, bytes));
        if (!iter) {
          stream.emit('data', data);
        }

        data = (buff + data).split(/\n+/);

        const l = data.length - 1;
        let i = 0;

        for (; i < l; i++) {
          // eslint-disable-next-line eqeqeq
          if (options.start == null || row > options.start) {
            if (!iter) {
              stream.emit('line', data[i]);
            } else {
              iter(null, data[i]);
            }
          }
          row++;
        }

        buff = data[l];
        pos += bytes;
        return read();
      });
    }());
  });

  if (!iter) {
    return stream;
  }

  return stream.destroy;
};

/**
 * @property {Object} warn
 * Set of simple deprecation notices and a way
 * to expose them for a set of properties.
 *
 * @api private
 */
exports.warn = {
  deprecated: function warnDeprecated(prop) {
    return function () {
      throw new Error(format('{ %s } was removed in winston@3.0.0.', prop));
    };
  },
  useFormat: function warnFormat(prop) {
    return function () {
      throw new Error([
        format('{ %s } was removed in winston@3.0.0.', prop),
        'Use a custom winston.format = winston.format(function) instead.'
      ].join('\n'));
    };
  },
  forFunctions: function (obj, type, props) {
    props.forEach(function (prop) {
      obj[prop] = exports.warn[type](prop);
    });
  },
  moved: function (obj, movedTo, prop) {
    function movedNotice() {
      return function () {
        throw new Error([
          format('winston.%s was moved in winston@3.0.0.', prop),
          format('Use a winston.%s instead.', movedTo)
        ].join('\n'));
      };
    }

    Object.defineProperty(obj, prop, {
      get: movedNotice,
      set: movedNotice
    });
  },
  forProperties: function (obj, type, props) {
    props.forEach(function (prop) {
      var notice = exports.warn[type](prop);
      Object.defineProperty(obj, prop, {
        get: notice,
        set: notice
      });
    });
  }
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];

        var iter = _keyIterator(object);
        var key, completed = 0;

        while ((key = iter()) != null) {
            completed += 1;
            iterator(object[key], key, only_once(done));
        }

        if (completed === 0) callback(null);

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            }
            // Check key is null in case iterator isn't exhausted
            // and done resolved synchronously.
            else if (key === null && completed <= 0) {
                callback(null);
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        arr = arr || [];
        var results = _isArrayLike(arr) ? [] : {};
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    async.transform = function (arr, memo, iterator, callback) {
        if (arguments.length === 3) {
            callback = iterator;
            iterator = memo;
            memo = _isArray(arr) ? [] : {};
        }

        async.eachOf(arr, function(v, k, cb) {
            iterator(memo, v, k, cb);
        }, function(err) {
            callback(err, memo);
        });
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, concurrency, callback) {
        if (typeof arguments[1] === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = remainingTasks;
        }

        var results = {};
        var runningTasks = 0;

        var hasError = false;

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            if (hasError) return;
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    hasError = true;

                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return runningTasks < concurrency && _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                runningTasks++;
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    runningTasks++;
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;

                var removed = false;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    _arrayEach(workersList, function (worker, index) {
                        if (worker === task && !removed) {
                            workersList.splice(index, 1);
                            removed = true;
                        }
                    });

                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var workersList = [];
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                while(!q.paused && workers < q.concurrency && q.tasks.length){

                    var tasks = q.payload ?
                        q.tasks.splice(0, q.payload) :
                        q.tasks.splice(0, q.tasks.length);

                    var data = _map(tasks, function (task) {
                        return task.data;
                    });

                    if (q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);
                    var cb = only_once(_next(q, tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        var has = Object.prototype.hasOwnProperty;
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (has.call(memo, key)) {   
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (has.call(queues, key)) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return async;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorspace = __webpack_require__(73)
  , enabled = __webpack_require__(80)
  , kuler = __webpack_require__(82)
  , util = __webpack_require__(1);

/**
 * Check if the terminal we're using allows the use of colors.
 *
 * @type {Boolean}
 * @private
 */
var tty = __webpack_require__(85).isatty(1);

/**
 * The default stream instance we should be writing against.
 *
 * @type {Stream}
 * @public
 */
var stream = process.stdout;

/**
 * A simple environment based logger.
 *
 * Options:
 *
 * - colors: Force the use of colors or forcefully disable them. If this option
 *   is not supplied the colors will be based on your terminal.
 * - stream: The Stream instance we should write our logs to, defaults to
 *   process.stdout but can be anything you like.
 *
 * @param {String} name The namespace of your log function.
 * @param {Object} options Logger configuration.
 * @returns {Function} Configured logging method.
 * @api public
 */
function factory(name, options) {
  if (!enabled(name)) return function diagnopes() {};

  options = options || {};
  options.colors = 'colors' in options ? options.colors : tty;
  options.ansi = options.colors ? kuler(name, colorspace(name)) : name;
  options.stream = options.stream || stream;

  //
  // Allow multiple streams, so make sure it's an array which makes iteration
  // easier.
  //
  if (!Array.isArray(options.stream)) {
    options.stream = [options.stream];
  }

  //
  // The actual debug function which does the logging magic.
  //
  return function debug(line) {
    //
    // Better formatting for error instances.
    //
    if (line instanceof Error) line = line.stack || line.message || line;

    line = [
      //
      // Add the colorized namespace.
      //
      options.ansi,

      //
      // The total time we took to execute the next debug statement.
      //
      ' ',
      line
    ].join('');

    //
    // Use util.format so we can follow the same API as console.log.
    //
    line = util.format.apply(this, [line].concat(
        Array.prototype.slice.call(arguments, 1)
    )) + '\n';

    options.stream.forEach(function each(stream) {
      stream.write(line);
    });
  };
}

/**
 * Override the "default" stream that we write to. This allows you to globally
 * configure the steams.
 *
 * @param {Stream} output
 * @returns {function} Factory
 * @api private
 */
factory.to = function to(output) {
  stream = output;
  return factory;
};

//
// Expose the module.
//
module.exports = factory;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * index.js: Default settings for all levels that winston knows about
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

const logform = __webpack_require__(2);

//
// Export config sets
//
exports.cli    = logform.levels(__webpack_require__(104));
exports.npm    = logform.levels(__webpack_require__(105));
exports.syslog = logform.levels(__webpack_require__(106));

//
// Hoist addColors from logform where it was refactored
// into in winston@3.
//
exports.addColors = logform.levels;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Colorizer = __webpack_require__(8).Colorizer;

/*
 * Simple method to register colors with a simpler require
 * path within the module.
 */
module.exports = function (config) {
  Colorizer.addColors(config.colors || config);
  return config;
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint no-unused-vars: 0 */


const format = __webpack_require__(0);

/*
 * function padLevels (info)
 * Returns a new instance of the padLevels Format which pads
 * levels to be the same length. This was previously exposed as
 * { padLevels: true } to transports in `winston < 3.0.0`.
 */
module.exports = format(function (info, opts) {

});


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const format = __webpack_require__(0);
const MESSAGE = Symbol.for('message');

/*
 * function json (info)
 * Returns a new instance of the JSON format that turns a log `info`
 * object into pure JSON. This was previously exposed as { json: true }
 * to transports in `winston < 3.0.0`.
 */
module.exports = format(function (info, opts) {
  info[MESSAGE] = JSON.stringify(info, opts.replacer || replacer, opts.space);
  return info;
});

/*
 * function replacer (key, value)
 * Handles proper stringification of Buffer output.
 */
function replacer(key, value) {
  return value instanceof Buffer
    ? value.toString('base64')
    : value;
}


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var v1 = __webpack_require__(46);
var v4 = __webpack_require__(48);

var uuid = v4;
uuid.v1 = v1;
uuid.v4 = v4;

module.exports = uuid;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// Unique ID creation requires a high quality random # generator.  In node.js
// this is pretty straight-forward - we use the crypto API.

var rb = __webpack_require__(47).randomBytes;

function rng() {
  return rb(16);
}

module.exports = rng;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] + '-' +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]] +
          bth[buf[i++]] + bth[buf[i++]];
}

module.exports = bytesToUuid;


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports =
class SplayTree {
  splayNode (node) {
    if (!node) return

    while (true) {
      if (this.isNodeLeftChild(this.getParent(node)) && this.isNodeRightChild(node)) { // zig-zag
        this.rotateNodeLeft(node)
        this.rotateNodeRight(node)
      } else if (this.isNodeRightChild(this.getParent(node)) && this.isNodeLeftChild(node)) { // zig-zag
        this.rotateNodeRight(node)
        this.rotateNodeLeft(node)
      } else if (this.isNodeLeftChild(this.getParent(node)) && this.isNodeLeftChild(node)) { // zig-zig
        this.rotateNodeRight(this.getParent(node))
        this.rotateNodeRight(node)
      } else if (this.isNodeRightChild(this.getParent(node)) && this.isNodeRightChild(node)) { // zig-zig
        this.rotateNodeLeft(this.getParent(node))
        this.rotateNodeLeft(node)
      } else { // zig
        if (this.isNodeLeftChild(node)) {
          this.rotateNodeRight(node)
        } else if (this.isNodeRightChild(node)) {
          this.rotateNodeLeft(node)
        }

        return
      }
    }
  }

  rotateNodeLeft (pivot) {
    const root = this.getParent(pivot)
    if (this.getParent(root)) {
      if (root === this.getLeft(this.getParent(root))) {
        this.setLeft(this.getParent(root), pivot)
      } else {
        this.setRight(this.getParent(root), pivot)
      }
    } else {
      this.root = pivot
    }
    this.setParent(pivot, this.getParent(root))

    this.setRight(root, this.getLeft(pivot))
    if (this.getRight(root)) this.setParent(this.getRight(root), root)

    this.setLeft(pivot, root)
    this.setParent(this.getLeft(pivot), pivot)

    this.updateSubtreeExtent(root)
    this.updateSubtreeExtent(pivot)
  }

  rotateNodeRight (pivot) {
    const root = this.getParent(pivot)
    if (this.getParent(root)) {
      if (root === this.getLeft(this.getParent(root))) {
        this.setLeft(this.getParent(root), pivot)
      } else {
        this.setRight(this.getParent(root), pivot)
      }
    } else {
      this.root = pivot
    }
    this.setParent(pivot, this.getParent(root))

    this.setLeft(root, this.getRight(pivot))
    if (this.getLeft(root)) this.setParent(this.getLeft(root), root)

    this.setRight(pivot, root)
    this.setParent(this.getRight(pivot), pivot)

    this.updateSubtreeExtent(root)
    this.updateSubtreeExtent(pivot)
  }

  isNodeLeftChild (node) {
    return node != null && this.getParent(node) != null && this.getLeft(this.getParent(node)) === node
  }

  isNodeRightChild (node) {
    return node != null && this.getParent(node) != null && this.getRight(this.getParent(node)) === node
  }

  getSuccessor (node) {
    if (this.getRight(node)) {
      node = this.getRight(node)
      while (this.getLeft(node)) {
        node = this.getLeft(node)
      }
    } else {
      while (this.getParent(node) && this.getRight(this.getParent(node)) === node) {
        node = this.getParent(node)
      }
      node = this.getParent(node)
    }
    return node
  }
}


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var stream = __webpack_require__(3)


function isStream (obj) {
  return obj instanceof stream.Stream
}


function isReadable (obj) {
  return isStream(obj) && typeof obj._read == 'function' && typeof obj._readableState == 'object'
}


function isWritable (obj) {
  return isStream(obj) && typeof obj._write == 'function' && typeof obj._writableState == 'object'
}


function isDuplex (obj) {
  return isReadable(obj) && isWritable(obj)
}


module.exports            = isStream
module.exports.isReadable = isReadable
module.exports.isWritable = isWritable
module.exports.isDuplex   = isDuplex


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

//
// Remark: Requiring this file will use the "safe" colors API which will not touch String.prototype
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
var colors = __webpack_require__(7);
module['exports'] = colors;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const format = __webpack_require__(0);

/*
 * function align (info)
 * Returns a new instance of the align Format which adds a `\t`
 * delimiter before the message to properly align it in the same place.
 * It was previously { align: true } in winston < 3.0.0
 */
module.exports = format(function (info) {
  info.message = '\t' + info.message;
  return info;
});


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const format = __webpack_require__(0);
const colorize = __webpack_require__(8);
const padLevels = __webpack_require__(16);

/*
 * function cli (info)
 * Returns a new instance of the CLI format that turns a log
 * `info` object into the same format previously available
 * in `winston.cli()` in `winston < 3.0.0`.
 */
module.exports = format(
  colorize(),
  padLevels()
);


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const format = __webpack_require__(0);

/*
 * function combine (info)
 * Returns a new instance of the combine Format which combines the specified
 * formats into a new format. This is similar to a pipe-chain in transform streams.
 * We choose to combine the prototypes this way because there is no back pressure in
 * an in-memory transform chain.
 */
module.exports = function combined(...formats) {
  const combined = format(cascade(formats));
  const instance = combined();
  instance.Format = combined.Format;
  return instance;
};

/*
 * function cascade(formats)
 * Returns a function that invokes the `._format` function in-order
 * for the specified set of `formats`. In this manner we say that Formats
 * are "pipe-like", but not a pure pumpify implementation. Since there is no back
 * pressure we can remove all of the "readable" plumbing in Node streams.
 */
function cascade(formats) {
  if (!formats.every(isValidFormat)) {
    return;
  }

  return function cascaded(info) {
    let obj = info;
    for (var i = 0; i < formats.length; i++) {
      obj = formats[i].transform(obj, formats[i].options);
      if (!obj) {
        return false;
      }
    }


    return info;
  };
}

/*
 * function isValidFormat(format)
 * If the format does not define a `transform` function throw an error
 * with more detailed usage.
 */
function isValidFormat(format) {
  if (typeof format.transform !== 'function') {
    throw new Error([
      'No tranform function found on format. Did you create a format instance?',
      'const myFormat = format(formatFn);',
      'const instance = myFormat();'
    ].join('\n'));
  }

  return true;
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const { format } = __webpack_require__(2);
const { combine, timestamp, label } = format;

const labelTimestamp = combine(
  label({ label: 'right meow!' }),
  timestamp()
);

const info = labelTimestamp.transform({
  level: 'info',
  message: 'What time is the testing at?'
});

console.dir(info);


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint no-unused-vars: 0 */

const { format } = __webpack_require__(2);
const { combine, timestamp, label } = format;

const ignorePrivate = format((info, opts) => {
  if (info.private) { return false; }
  return info;
})();

console.dir(ignorePrivate.transform({
  level: 'error',
  message: 'Public error to share'
}));

console.dir(ignorePrivate.transform({
  level: 'error',
  private: true,
  message: 'This is super secret - hide it.'
}));

const willNeverThrow = format.combine(
  format(info => { return false; })(), // Ignores everything
  format(info => { throw new Error('Never reached'); })()
);

console.dir(willNeverThrow.transform({
  level: 'info',
  message: 'wow such testing'
}));


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* eslint no-unused-vars: 0 */
const { format } = __webpack_require__(2);

const invalid = format(function invalid(just, too, many, args) {
  return just;
});


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const { format } = __webpack_require__(2);

const volume = format((info, opts) => {
  if (opts.yell) {
    info.message = info.message.toUpperCase();
  } else if (opts.whisper) {
    info.message = info.message.toLowerCase();
  }

  return info;
});

// `volume` is now a function that returns instances of the format.
const scream = volume({ yell: true });
console.dir(scream.transform({
  level: 'info',
  message: `sorry for making you YELL in your head!`
}, scream.options));

// `volume` can be used multiple times to create different formats.
const whisper = volume({ whisper: true });
console.dir(whisper.transform({
  level: 'info',
  message: `WHY ARE THEY MAKING US YELL SO MUCH!`
}, whisper.options));


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const format = __webpack_require__(0);

/*
 * function label (info)
 * Returns a new instance of the label Format which adds the specified
 * `opts.label` before the message. This was previously exposed as
 * { label: 'my label' } to transports in `winston < 3.0.0`.
 */
module.exports = format(function (info, opts) {
  if (opts.message) {
    info.message = '[' + opts.label + '] ' + info.message;
    return info;
  }

  info.label = opts.label;
  return info;
});


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const format = __webpack_require__(0);
const MESSAGE = Symbol.for('message');

/*
 * function logstash (info)
 * Returns a new instance of the LogStash Format that turns a
 * log `info` object into pure JSON with the appropriate logstash
 * options. This was previously exposed as { logstash: true }
 * to transports in `winston < 3.0.0`.
 */
module.exports = format(function (info) {
  const logstash = {};
  if (info.message) {
    logstash['@message'] = info.message;
    delete info.message;
  }

  if (info.timestamp) {
    logstash['@timestamp'] = info.timestamp;
    delete info.timestamp;
  }

  logstash['@fields'] = info;
  info[MESSAGE] = JSON.stringify(logstash);
  return info;
});


/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = {"_args":[["logform@1.2.2","/Users/sameer/Documents/development/tandem/crdt"]],"_from":"logform@1.2.2","_id":"logform@1.2.2","_inBundle":false,"_integrity":"sha512-a0TCbuqQWYhVdLie9f0tEP33bMxniAuw2StG1c5KhiTANm+RBRNpbSiGrNGpaiTZeoCiVWVsL+V5F0fpy7Q2Og==","_location":"/logform","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"logform@1.2.2","name":"logform","escapedName":"logform","rawSpec":"1.2.2","saveSpec":null,"fetchSpec":"1.2.2"},"_requiredBy":["/winston"],"_resolved":"https://registry.npmjs.org/logform/-/logform-1.2.2.tgz","_spec":"1.2.2","_where":"/Users/sameer/Documents/development/tandem/crdt","author":{"name":"Charlie Robbins","email":"charlie.robbins@gmail.com"},"bugs":{"url":"https://github.com/winstonjs/logform/issues"},"dependencies":{"colors":"^1.1.2","fecha":"^2.3.2"},"description":"An mutable object-based log format designed for chaining & objectMode streams.","devDependencies":{"assume":"^1.5.1","eslint-config-populist":"^4.1.0","mocha":"^3.5.3","nyc":"^11.2.1"},"homepage":"https://github.com/winstonjs/logform#readme","keywords":["winston","logging","format","winstonjs"],"license":"MIT","main":"index.js","name":"logform","repository":{"type":"git","url":"git+https://github.com/winstonjs/logform.git"},"scripts":{"lint":"populist *.js test/*.js examples/*.js","pretest":"npm run lint","test":"nyc mocha test/*.test.js"},"version":"1.2.2"}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const inspect = __webpack_require__(1).inspect;
const format = __webpack_require__(0);
const MESSAGE = Symbol.for('message');

/*
 * function prettyPrint (info)
 * Returns a new instance of the prettyPrint Format that "prettyPrint"
 * serializes `info` objects. This was previously exposed as
 * { prettyPrint: true } to transports in `winston < 3.0.0`.
 */
module.exports = format(function (info, opts) {
  info[MESSAGE] = inspect(info, false, opts.depth || null, opts.colorize);
  return info;
});


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const MESSAGE = Symbol.for('message');

/*
 * function printf (templateFn)
 * Returns a new instance of the printf Format that creates an
 * intermediate prototype to store the
 * level colors to `info` objects. This was previously exposed
 * as { colorize: true } to transports in `winston < 3.0.0`.
 */
module.exports = function createPrintf(templateFn) {
  function Printf() {}
  Printf.prototype.template = templateFn;
  Printf.prototype.transform = function (info) {
    info[MESSAGE] = this.template(info);
    return info;
  };

  const format = new Printf();
  format.Format = Printf;
  return format;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint no-undefined: 0 */


const format = __webpack_require__(0);
const MESSAGE = Symbol.for('message');

/*
 * function simple (info)
 * Returns a new instance of the simple format TransformStream
 * which writes a simple representation of logs.
 *
 *    const { level, message, ...rest } = info;
 *    ${level}: ${message} ${JSON.stringify(rest)}
 */
module.exports = format(function (info) {
  info[MESSAGE] = info.level + ': ' + info.message + ' ' + JSON.stringify(
    Object.assign({}, info, {
      level: undefined,
      message: undefined,
      splat: undefined
    })
  );

  return info;
});


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const format = __webpack_require__(0);
const util = __webpack_require__(1);

/*
 * function splat (info)
 * Returns a new instance of the splat format TransformStream
 * which performs string interpolation from `info` objects. This was
 * previously exposed implicitly in `winston < 3.0.0`.
 */
module.exports = format(function (info) {
  if (info.splat) {
    info.message = util.format(info.message, ...info.splat);
  }

  return info;
});


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const fecha = __webpack_require__(103);
const format = __webpack_require__(0);

/*
 * function timestamp (info)
 * Returns a new instance of the timestamp Format which adds a timestamp
 * to the info. It was previously available in winston < 3.0.0 as:
 *
 * - { timestamp: true }             // `new Date.toISOString()`
 * - { timestamp: function:String }  // Value returned by `timestamp()`
 */
module.exports = format(function (info, opts) {
  if (opts.format) {
    info.timestamp = typeof opts.format === 'function'
      ? opts.format()
      : fecha.format(new Date(), opts.format);
  }

  if (!info.timestamp) {
    info.timestamp = new Date().toISOString();
  }

  if (opts.alias) {
    info[opts.alias] = info.timestamp;
  }

  return info;
});


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const colors = __webpack_require__(25);
const format = __webpack_require__(0);
const MESSAGE = Symbol.for('message');

/*
 * function uncolorize (info)
 * Returns a new instance of the uncolorize Format that strips colors
 * from `info` objects. This was previously exposed as { stripColors: true }
 * to transports in `winston < 3.0.0`.
 */
module.exports = format(function (info, opts) {
  if (opts.level !== false) {
    info.level = colors.strip(info.level);
  }

  if (opts.message !== false) {
    info.message = colors.strip(info.message);
  }

  if (opts.raw !== false && info[MESSAGE]) {
    info[MESSAGE] = colors.strip(info[MESSAGE]);
  }

  return info;
});


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(1);
const { LEVEL } = __webpack_require__(6);
const config = __webpack_require__(14);
const Logger = __webpack_require__(107);
const debug = __webpack_require__(13)('winston:create-logger');

//
// ### function createLogger (opts)
// #### @opts {Object} Options for the created logger.
// Create a new instance of a winston Logger. Creates a new
// prototype for each instance.
//
module.exports = function (opts) {
  opts = opts || {};
  opts.levels = opts.levels || config.npm.levels;

  //
  // Create a new prototypal derived logger for which the levels
  // can be attached to the prototype of. This is a V8 optimization
  // that is well know to increase performance of prototype functions.
  //
  function DerivedLogger(options) { Logger.call(this, options); }
  util.inherits(DerivedLogger, Logger);

  Object.keys(opts.levels).forEach(function (level) {
    debug('Define prototype method for "%s"', level);
    if (level === 'log') {
      console.warn('Level "log" not defined: conflicts with the method "log". Use a different level name.');
      return;
    }

    //
    // Define prototype methods for each log level
    // e.g. logger.log('info', msg) <––> logger.info(msg)
    //
    DerivedLogger.prototype[level] = function (msg) {
      //
      // Optimize the hot-path which is the single object.
      //
      if (arguments.length === 1) {
        const info = msg.message && msg || { message: msg };
        info.level = info[LEVEL] = level;
        this.write(info);
        return this;
      }

      //
      // Otherwise build argument list which could potentially conform to either
      // 1. v3 API: log(obj)
      // 2. v1/v2 API: log(level, msg, ... [string interpolate], [{metadata}], [callback])
      //
      this.log.apply(this, [level].concat(Array.prototype.slice.call(arguments)));
    };
  });

  return new DerivedLogger(opts);
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 * exception-handler.js: Object for handling uncaughtException events.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */



const os = __webpack_require__(11);
const async = __webpack_require__(12);
const debug = __webpack_require__(13)('winston:exception');
const once = __webpack_require__(108);
const stackTrace = __webpack_require__(109);
const ExceptionStream = __webpack_require__(110);

var ExceptionHandler = module.exports = function (logger) {
  if (!logger) {
    throw new Error('Logger is required to handle exceptions');
  }

  this.logger = logger;
  this.handlers = new Map();
};

/*
 * function handle ([tr0, tr1...] || tr0, tr1, ...)
 * Handles `uncaughtException` events for the current process by
 * ADDING any handlers passed in.
 */
ExceptionHandler.prototype.handle = function () {
  const self = this;
  const args = Array.prototype.slice.call(arguments);

  //
  // Helper function
  //
  function add(handler) {
    var wrapper;
    if (!self.handlers.has(handler)) {
      handler.handleExceptions = true;
      wrapper = new ExceptionStream(handler);
      self.handlers.set(handler, wrapper);
      self.logger.pipe(wrapper);
    }
  }

  args.forEach(function (arg) {
    if (Array.isArray(arg)) {
      return arg.forEach(add);
    }

    add(arg);
  });

  if (!this.catcher) {
    this.catcher = this._uncaughtException.bind(this);
    process.on('uncaughtException', this.catcher);
  }
};

/*
 * function unhandle ()
 *
 * Removes any handlers to `uncaughtException` events
 * for the current process. This DOES NOT modify the
 * state of the `this.handlers` Set.
 */
ExceptionHandler.prototype.unhandle = function () {
  var self = this;
  if (this.catcher) {
    process.removeListener('uncaughtException', this.catcher);
    this.catcher = false;

    Array.from(this.handlers.values()).forEach(function (wrapper) {
      self.logger.unpipe(wrapper);
    });
  }
};

/*
 * function getAllInfo (err)
 * @param {Error} err Error to get information about.
 */
ExceptionHandler.prototype.getAllInfo = function (err) {
  var message = err.message;
  if (!message && typeof err === 'string') {
    message = err;
  }

  return {
    error: err,
    //
    // TODO (indexzero): how do we configure this?
    //
    level: 'error',
    message: [
      'uncaughtException: ' + (message || '(no error message)'),
      err.stack || '  No stack trace'
    ].join('\n'),
    stack: err.stack,
    exception: true,
    date: new Date().toString(),
    process: this.getProcessInfo(),
    os: this.getOsInfo(),
    trace: this.getTrace(err)
  };
};

/*
 * function getProcessInfo()
 * Gets all relevant process information for the currently
 * running process.
 */
ExceptionHandler.prototype.getProcessInfo = function () {
  return {
    pid: process.pid,
    uid: process.getuid ? process.getuid() : null,
    gid: process.getgid ? process.getgid() : null,
    cwd: process.cwd(),
    execPath: process.execPath,
    version: process.version,
    argv: process.argv,
    memoryUsage: process.memoryUsage()
  };
};

/*
 * function getOsInfo()
 * Gets all relevant OS information for the currently
 * running process.
 */
ExceptionHandler.prototype.getOsInfo = function () {
  return {
    loadavg: os.loadavg(),
    uptime: os.uptime()
  };
};

/*
 * function getTrace(err)
 * Gets a stack trace for the specified error.
 */
ExceptionHandler.prototype.getTrace = function (err) {
  var trace = err ? stackTrace.parse(err) : stackTrace.get();
  return trace.map(function (site) {
    return {
      column: site.getColumnNumber(),
      file: site.getFileName(),
      function: site.getFunctionName(),
      line: site.getLineNumber(),
      method: site.getMethodName(),
      native: site.isNative()
    };
  });
};

/*
 * function _uncaughtException (err)
 * @param {Error} err Error to handle
 *
 * Logs all relevant information around the `err` and
 * exits the current process.
 *
 * @api private
 */
ExceptionHandler.prototype._uncaughtException = function (err) {
  const info = this.getAllInfo(err);
  const handlers = this._getExceptionHandlers();
  let timeout;
  let doExit;

  //
  // Calculate if we should exit on this error
  //
  doExit = typeof this.logger.exitOnError === 'function'
    ? this.logger.exitOnError(err)
    : this.logger.exitOnError;

  if (!handlers.length && doExit) {
    console.warn('winston: exitOnError cannot be false with no exception handlers.');
    console.warn('winston: exiting process.');
    doExit = false;
  }

  function gracefulExit() {
    debug('doExit', doExit);
    debug('process._exiting', process._exiting);

    if (doExit && !process._exiting) {
      //
      // Remark: Currently ignoring any exceptions from transports
      // when catching uncaught exceptions.
      //
      if (timeout) { clearTimeout(timeout); }
      process.exit(1);
    }
  }

  if (!handlers || handlers.length === 0) {
    return process.nextTick(gracefulExit);
  }

  //
  // Log to all transports attempting to listen
  // for when they are completed.
  //
  async.forEach(handlers, function awaitLog(handler, next) {
    //
    // TODO: Change these to the correct WritableStream events
    // so that we wait until exit.
    //
    var done = once(next);
    var transport = handler.transport || handler;

    //
    // Debug wrapping so that we can inspect what's going on
    // under the covers.
    //
    function onDone(event) {
      return function () {
        debug(event);
        done();
      };
    }

    transport.once('logged', onDone('logged'));
    transport.once('error', onDone('error'));
  }, gracefulExit);

  this.logger.log(info);

  //
  // If exitOnError is true, then only allow the logging of
  // exceptions to take up to `3000ms`.
  //
  if (doExit) {
    timeout = setTimeout(gracefulExit, 3000);
  }
};

/*
 * function _getExceptionHandlers ()
 *
 * Returns the list of transports and exceptionHandlers
 * for this instance.
 *
 * @api private
 */
ExceptionHandler.prototype._getExceptionHandlers = function () {
  //
  // Remark (indexzero): since `logger.transports` returns all of the pipes
  // from the _readableState of the stream we actually get the join of the
  // explicit handlers and the implicit transports with `handleExceptions: true`
  //
  return this.logger.transports.filter(function (wrap) {
    var transport = wrap.transport || wrap;
    return transport.handleExceptions;
  });
};


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(45);


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_uuid__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__atom_teletype_crdt__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__atom_teletype_crdt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__atom_teletype_crdt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stores_document__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__io__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_logger__ = __webpack_require__(64);







const localDocument = new __WEBPACK_IMPORTED_MODULE_1__atom_teletype_crdt__["Document"]({ siteId: __WEBPACK_IMPORTED_MODULE_0_uuid___default()(), text: '' });
__WEBPACK_IMPORTED_MODULE_2__stores_document__["a" /* default */].setDocument(localDocument);

const processPayload = payload => {
    try {
        __WEBPACK_IMPORTED_MODULE_5__utils_logger__["a" /* default */].debug(`Processing payload: ${payload}`);
        const { function: fcn, parameters: params = [] } = JSON.parse(payload);

        __WEBPACK_IMPORTED_MODULE_5__utils_logger__["a" /* default */].debug(`Calling api function: ${JSON.stringify(fcn)}, with parameters: ${JSON.stringify(params)}`);
        const res = { value: __WEBPACK_IMPORTED_MODULE_3__api__["a" /* default */][fcn](...params) };
        const result = JSON.stringify(res);

        __WEBPACK_IMPORTED_MODULE_5__utils_logger__["a" /* default */].debug(`Finished processing, with result: ${result}`);
        __WEBPACK_IMPORTED_MODULE_4__io__["a" /* default */].write(result);
    } catch (error) {
        __WEBPACK_IMPORTED_MODULE_5__utils_logger__["a" /* default */].error(`There has been an error in processing payload: ${payload}`);
        __WEBPACK_IMPORTED_MODULE_5__utils_logger__["a" /* default */].error(`Error: ${JSON.stringify(error)}`);
    }
};

__WEBPACK_IMPORTED_MODULE_4__io__["a" /* default */].addIoHandler(processPayload);

__WEBPACK_IMPORTED_MODULE_5__utils_logger__["a" /* default */].info('Tandem-CRDT is up and running');

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(19);
var bytesToUuid = __webpack_require__(20);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

// random #'s we need to init node and clockseq
var _seedBytes = rng();

// Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
var _nodeId = [
  _seedBytes[0] | 0x01,
  _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
];

// Per 4.2.2, randomize (14 bit) clockseq
var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

// Previous uuid creation time
var _lastMSecs = 0, _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};

  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  var node = options.node || _nodeId;
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(19);
var bytesToUuid = __webpack_require__(20);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

const Document = __webpack_require__(50)
const {
  serializeOperation, deserializeOperation,
  serializeRemotePosition, deserializeRemotePosition
} = __webpack_require__(53)

module.exports = {
  Document,
  serializeOperation, deserializeOperation,
  serializeRemotePosition, deserializeRemotePosition
}


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const assert = __webpack_require__(21)
const DocumentTree = __webpack_require__(51)
const SplitTree = __webpack_require__(52)
const {ZERO_POINT, compare, traverse, traversal, characterIndexForPosition, extentForText} = __webpack_require__(9)

module.exports =
class Document {
  constructor ({siteId, text, history}) {
    assert(siteId !== 0, 'siteId 0 is reserved')
    this.siteId = siteId
    this.nextSequenceNumber = 1
    this.splitTreesBySpliceId = new Map()
    this.deletionsBySpliceId = new Map()
    this.undoCountsBySpliceId = new Map()
    this.markerLayersBySiteId = new Map([[this.siteId, new Map()]])
    this.deferredOperationsByDependencyId = new Map()
    this.deferredResolutionsByDependencyId = new Map()
    this.deferredMarkerUpdates = new Map()
    this.deferredMarkerUpdatesByDependencyId = new Map()
    this.maxSeqsBySite = {}
    this.operations = []
    this.undoStack = []
    this.redoStack = []
    this.nextCheckpointId = 1

    const firstSegment = {spliceId: {site: 0, seq: 0}, offset: ZERO_POINT, text: '', extent: ZERO_POINT, nextSplit: null, deletions: new Set()}
    this.splitTreesBySpliceId.set(spliceIdToString(firstSegment.spliceId), new SplitTree(firstSegment))

    const lastSegment = {spliceId: {site: 0, seq: 1}, offset: ZERO_POINT, text: '', extent: ZERO_POINT, nextSplit: null, deletions: new Set()}
    this.splitTreesBySpliceId.set(spliceIdToString(lastSegment.spliceId), new SplitTree(lastSegment))

    this.documentTree = new DocumentTree(
      firstSegment,
      lastSegment,
      this.isSegmentVisible.bind(this)
    )

    if (text) {
      this.setTextInRange(ZERO_POINT, ZERO_POINT, text)
      this.undoStack.length = 0
    } else if (history) {
      this.populateHistory(history)
    }
  }

  populateHistory ({baseText, nextCheckpointId, undoStack, redoStack}) {
    this.setTextInRange(ZERO_POINT, ZERO_POINT, baseText)
    this.nextCheckpointId = nextCheckpointId

    const newUndoStack = []
    const allEntries = undoStack.concat(redoStack.slice().reverse())
    for (let i = 0; i < allEntries.length; i++) {
      const {type, changes, markersBefore, markersAfter, id, markers} = allEntries[i]
      if (type === 'transaction') {
        const operations = []
        const markersSnapshotBefore = this.snapshotFromMarkers(markersBefore)
        for (let j = changes.length - 1; j >= 0; j--) {
          const {oldStart, oldEnd, newText} = changes[j]
          operations.push(...this.setTextInRange(oldStart, oldEnd, newText))
        }
        const markersSnapshotAfter = this.snapshotFromMarkers(markersAfter)
        newUndoStack.push(new Transaction(0, operations, markersSnapshotBefore, markersSnapshotAfter))
      } else if (type === 'checkpoint') {
        newUndoStack.push(new Checkpoint(id, false, this.snapshotFromMarkers(markers)))
      } else {
        throw new Error(`Unknown entry type '${type}'`)
      }
    }

    this.undoStack = newUndoStack
    for (let i = 0; i < redoStack.length; i++) {
      if (redoStack[i].type === 'transaction') this.undo()
    }
  }

  replicate (siteId) {
    const replica = new Document({siteId})
    replica.integrateOperations(this.getOperations())
    return replica
  }

  getOperations () {
    const markerOperations = []
    this.markerLayersBySiteId.forEach((layersById, siteId) => {
      const siteMarkerLayers = {}
      layersById.forEach((markersById, layerId) => {
        const layer = {}
        markersById.forEach((marker, markerId) => {
          layer[markerId] = marker
        })
        siteMarkerLayers[layerId] = layer
      })

      markerOperations.push({
        type: 'markers-update',
        updates: siteMarkerLayers,
        siteId
      })
    })

    return this.operations.concat(markerOperations)
  }

  setTextInRange (start, end, text, options) {
    const spliceId = {site: this.siteId, seq: this.nextSequenceNumber}
    const operation = {type: 'splice', spliceId}

    if (compare(end, start) > 0) {
      operation.deletion = this.delete(spliceId, start, end)
    }
    if (text && text.length > 0) {
      operation.insertion = this.insert(spliceId, start, text)
    }
    this.updateMaxSeqsBySite(spliceId)

    this.undoStack.push(new Transaction(this.getNow(), [operation]))
    this.clearRedoStack()

    this.operations.push(operation)
    return [operation]
  }

  getMarkers () {
    const result = {}
    this.markerLayersBySiteId.forEach((layersById, siteId) => {
      if (layersById.size > 0) {
        result[siteId] = {}
        layersById.forEach((markersById, layerId) => {
          result[siteId][layerId] = {}
          markersById.forEach((marker, markerId) => {
            const resultMarker = Object.assign({}, marker)
            resultMarker.range = this.resolveLogicalRange(marker.range, marker.exclusive)

            result[siteId][layerId][markerId] = resultMarker
          })
        })
      }
    })
    return result
  }

  updateMarkers (layerUpdatesById) {
    const operation = {
      type: 'markers-update',
      siteId: this.siteId,
      updates: {}
    }

    const layers = this.markerLayersBySiteId.get(this.siteId)
    for (let layerId in layerUpdatesById) {
      const layerUpdate = layerUpdatesById[layerId]
      layerId = parseInt(layerId)
      let layer = layers.get(layerId)

      if (layerUpdate === null) {
        if (layer) {
          layers.delete(layerId)
          operation.updates[layerId] = null
        }
      } else {
        if (!layer) {
          layer = new Map()
          layers.set(layerId, layer)
        }

        operation.updates[layerId] = {}
        for (let markerId in layerUpdate) {
          const markerUpdate = layerUpdate[markerId]
          markerId = parseInt(markerId)
          let marker = layer.get(markerId)

          if (markerUpdate) {
            if (marker) {
              marker = Object.assign({}, marker)
            } else {
              marker = {exclusive: false, reversed: false, tailed: true}
            }

            const updatingExclusive = marker.exclusive !== markerUpdate.exclusive
            Object.assign(marker, markerUpdate)
            if (markerUpdate.range || updatingExclusive) {
              marker.range = this.getLogicalRange(markerUpdate.range || marker.range, marker.exclusive)
            }
            Object.freeze(marker)
            layer.set(markerId, marker)
            operation.updates[layerId][markerId] = marker
          } else {
            layer.delete(markerId)
            operation.updates[layerId][markerId] = null
          }
        }
      }
    }

    return [operation]
  }

  undo () {
    let spliceIndex = null
    let operationsToUndo = []
    let markersSnapshot
    for (let i = this.undoStack.length - 1; i >=0; i--) {
      const stackEntry = this.undoStack[i]
      if (stackEntry instanceof Transaction) {
        operationsToUndo = stackEntry.operations
        markersSnapshot = stackEntry.markersSnapshotBefore
        spliceIndex = i
        break
      } else if (stackEntry instanceof Checkpoint && stackEntry.isBarrier) {
        return null
      }
    }

    if (spliceIndex != null) {
      this.redoStack.push(...this.undoStack.splice(spliceIndex).reverse())
      const {operations, textUpdates} = this.undoOrRedoOperations(operationsToUndo)
      let markers = this.markersFromSnapshot(markersSnapshot)
      return {operations, textUpdates, markers}
    } else {
      return null
    }
  }

  redo () {
    let spliceIndex = null
    let operationsToRedo = []
    let markersSnapshot
    for (let i = this.redoStack.length - 1; i >= 0; i--) {
      const stackEntry = this.redoStack[i]
      if (stackEntry instanceof Transaction) {
        operationsToRedo = stackEntry.operations
        markersSnapshot = stackEntry.markersSnapshotAfter
        spliceIndex = i
        break
      }
    }

    while (this.redoStack[spliceIndex - 1] instanceof Checkpoint) {
      spliceIndex--
    }

    if (spliceIndex != null) {
      this.undoStack.push(...this.redoStack.splice(spliceIndex).reverse())
      const {operations, textUpdates} = this.undoOrRedoOperations(operationsToRedo)
      const markers = markersSnapshot ? this.markersFromSnapshot(markersSnapshot) : null
      return {operations, textUpdates, markers}
    } else {
      return null
    }
  }

  clearUndoStack () {
    this.undoStack.length = 0
  }

  clearRedoStack () {
    this.redoStack.length = 0
  }

  applyGroupingInterval (groupingInterval) {
    const topEntry = this.undoStack[this.undoStack.length - 1]
    const previousEntry = this.undoStack[this.undoStack.length - 2]

    if (topEntry instanceof Transaction) {
      topEntry.groupingInterval = groupingInterval
    } else {
      return
    }

    if (previousEntry instanceof Transaction) {
      const timeBetweenEntries = topEntry.timestamp - previousEntry.timestamp
      const minGroupingInterval = Math.min(groupingInterval, previousEntry.groupingInterval || Infinity)
      if (timeBetweenEntries < minGroupingInterval) {
        this.undoStack.pop()
        previousEntry.timestamp = topEntry.timestamp
        previousEntry.groupingInterval = groupingInterval
        previousEntry.operations.push(...topEntry.operations)
        previousEntry.markersSnapshotAfter = topEntry.markersSnapshotAfter
      }
    }
  }

  getNow () {
    return Date.now()
  }

  createCheckpoint (options) {
    const checkpoint = new Checkpoint(
      this.nextCheckpointId++,
      options && options.isBarrier,
      options && this.snapshotFromMarkers(options.markers)
    )
    this.undoStack.push(checkpoint)
    return checkpoint.id
  }

  isBarrierPresentBeforeCheckpoint (checkpointId) {
    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      const stackEntry = this.undoStack[i]
      if (stackEntry instanceof Checkpoint) {
        if (stackEntry.id == checkpointId) return false
        if (stackEntry.isBarrier) return true
      }
    }

    return false
  }

  groupChangesSinceCheckpoint (checkpointId, options) {
    if (this.isBarrierPresentBeforeCheckpoint(checkpointId)) return false

    const result = this.collectOperationsSinceCheckpoint(checkpointId, true, options && options.deleteCheckpoint)
    if (result) {
      const {operations, markersSnapshot}  = result
      if (operations.length > 0) {
        this.undoStack.push(new Transaction(
          this.getNow(),
          operations,
          markersSnapshot,
          options && this.snapshotFromMarkers(options.markers)
        ))
        return this.textUpdatesForOperations(operations)
      } else {
        return []
      }
    } else {
      return false
    }
  }

  revertToCheckpoint (checkpointId, options) {
    if (this.isBarrierPresentBeforeCheckpoint(checkpointId)) return false

    const collectResult = this.collectOperationsSinceCheckpoint(checkpointId, true, options && options.deleteCheckpoint)
    if (collectResult) {
      const {operations, textUpdates} = this.undoOrRedoOperations(collectResult.operations)
      const markers = this.markersFromSnapshot(collectResult.markersSnapshot)
      return {operations, textUpdates, markers}
    } else {
      return false
    }
  }

  getChangesSinceCheckpoint (checkpointId) {
    const result = this.collectOperationsSinceCheckpoint(checkpointId, false, false)
    if (result) {
      return this.textUpdatesForOperations(result.operations)
    } else {
      return false
    }
  }

  collectOperationsSinceCheckpoint (checkpointId, deleteOperations, deleteCheckpoint) {
    let checkpointIndex = -1
    const operations = []
    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      const stackEntry = this.undoStack[i]
      if (stackEntry instanceof Checkpoint) {
        if (stackEntry.id === checkpointId) {
          checkpointIndex = i
          break
        }
      } else if (stackEntry instanceof Transaction) {
        operations.push(...stackEntry.operations)
      } else {
        throw new Error('Unknown stack entry ' + stackEntry.constructor.name)
      }
    }

    if (checkpointIndex === -1) {
      return null
    } else {
      const {markersSnapshot} = this.undoStack[checkpointIndex]
      if (deleteOperations) {
        if (!deleteCheckpoint) checkpointIndex++
        this.undoStack.splice(checkpointIndex)
      }
      return {operations, markersSnapshot}
    }
  }

  getHistory (maxEntries) {
    const originalUndoCounts = new Map(this.undoCountsBySpliceId)

    const redoStack = []
    for (let i = this.redoStack.length - 1; i >= 0; i--) {
      const entry = this.redoStack[i]
      if (entry instanceof Transaction) {
        const markersBefore = this.markersFromSnapshot(entry.markersSnapshotBefore)
        const changes = this.undoOrRedoOperations(entry.operations).textUpdates
        const markersAfter = this.markersFromSnapshot(entry.markersSnapshotAfter)
        redoStack.push({type: 'transaction', changes, markersBefore, markersAfter})
      } else {
        redoStack.push({
          type: 'checkpoint',
          id: entry.id,
          markers: this.markersFromSnapshot(entry.markersSnapshot)
        })
      }
      if (redoStack.length === maxEntries) break
    }
    redoStack.reverse()

    // Undo operations we redid above while computing changes
    for (let i = this.redoStack.length - 1; i >= this.redoStack.length - redoStack.length; i--) {
      const entry = this.redoStack[i]
      if (entry instanceof Transaction) {
        this.undoOrRedoOperations(entry.operations)
      }
    }

    const undoStack = []
    for (let i = this.undoStack.length - 1; i >= 0; i--) {
      const entry = this.undoStack[i]
      if (entry instanceof Transaction) {
        const markersAfter = this.markersFromSnapshot(entry.markersSnapshotAfter)
        const changes = invertTextUpdates(this.undoOrRedoOperations(entry.operations).textUpdates)
        const markersBefore = this.markersFromSnapshot(entry.markersSnapshotBefore)
        undoStack.push({type: 'transaction', changes, markersBefore, markersAfter})
      } else {
        undoStack.push({
          type: 'checkpoint',
          id: entry.id,
          markers: this.markersFromSnapshot(entry.markersSnapshot)
        })
      }
      if (undoStack.length === maxEntries) break
    }
    undoStack.reverse()

    // Redo operations we undid above while computing changes
    for (let i = this.undoStack.length - 1; i >= this.undoStack.length - undoStack.length; i--) {
      const entry = this.undoStack[i]
      if (entry instanceof Transaction) {
        this.undoOrRedoOperations(entry.operations)
      }
    }

    this.undoCountsBySpliceId = originalUndoCounts

    return {
      nextCheckpointId: this.nextCheckpointId,
      undoStack,
      redoStack
    }
  }

  delete (spliceId, start, end) {
    const spliceIdString = spliceIdToString(spliceId)

    const left = this.findLocalSegmentBoundary(start)[1]
    const right = this.findLocalSegmentBoundary(end)[0]

    const maxSeqsBySite = {}
    let segment = left
    while (true) {
      const maxSeq = maxSeqsBySite[segment.spliceId.site]
      if (maxSeq == null || segment.spliceId.seq > maxSeq) {
        maxSeqsBySite[segment.spliceId.site] = segment.spliceId.seq
      }

      segment.deletions.add(spliceIdString)
      this.documentTree.splayNode(segment)
      this.documentTree.updateSubtreeExtent(segment)
      if (segment === right) break
      segment = this.documentTree.getSuccessor(segment)
    }

    const deletion = {
      spliceId,
      leftDependencyId: left.spliceId,
      offsetInLeftDependency: left.offset,
      rightDependencyId: right.spliceId,
      offsetInRightDependency: traverse(right.offset, right.extent),
      maxSeqsBySite
    }
    this.deletionsBySpliceId.set(spliceIdString, deletion)
    return deletion
  }

  insert (spliceId, position, text) {
    const [left, right] = this.findLocalSegmentBoundary(position)
    const newSegment = {
      spliceId,
      text,
      extent: extentForText(text),
      offset: ZERO_POINT,
      leftDependency: left,
      rightDependency: right,
      nextSplit: null,
      deletions: new Set()
    }
    this.documentTree.insertBetween(left, right, newSegment)
    this.splitTreesBySpliceId.set(spliceIdToString(spliceId), new SplitTree(newSegment))

    return {
      text,
      leftDependencyId: left.spliceId,
      offsetInLeftDependency: traverse(left.offset, left.extent),
      rightDependencyId: right.spliceId,
      offsetInRightDependency: right.offset
    }
  }

  undoOrRedoOperations (operationsToUndo) {
    const undoOperations = []
    const oldUndoCounts = new Map()

    for (var i = 0; i < operationsToUndo.length; i++) {
      const {spliceId} = operationsToUndo[i]
      const newUndoCount = (this.undoCountsBySpliceId.get(spliceIdToString(spliceId)) || 0) + 1
      this.updateUndoCount(spliceId, newUndoCount, oldUndoCounts)
      const operation = {type: 'undo', spliceId, undoCount: newUndoCount}
      undoOperations.push(operation)
      this.operations.push(operation)
    }

    return {
      operations: undoOperations,
      textUpdates: this.textUpdatesForOperations(undoOperations, oldUndoCounts)
    }
  }

  isSpliceUndone ({spliceId}) {
    const undoCount = this.undoCountsBySpliceId.get(spliceIdToString(spliceId))
    return undoCount != null && (undoCount & 1 === 1)
  }

  canIntegrateOperation (op) {
    switch (op.type) {
      case 'splice': {
        const {spliceId, deletion, insertion} = op

        if ((this.maxSeqsBySite[spliceId.site] || 0) !== spliceId.seq - 1) {
          return false
        }

        if (deletion) {
          const hasLeftAndRightDependencies = (
            this.splitTreesBySpliceId.has(spliceIdToString(deletion.leftDependencyId)) &&
            this.splitTreesBySpliceId.has(spliceIdToString(deletion.rightDependencyId))
          )
          if (!hasLeftAndRightDependencies) return false

          for (const site in deletion.maxSeqsBySite) {
            if (deletion.maxSeqsBySite[site] > (this.maxSeqsBySite[site] || 0)) {
              return false
            }
          }
        }

        if (insertion) {
          const hasLeftAndRightDependencies = (
            this.splitTreesBySpliceId.has(spliceIdToString(insertion.leftDependencyId)) &&
            this.splitTreesBySpliceId.has(spliceIdToString(insertion.rightDependencyId))
          )
          if (!hasLeftAndRightDependencies) return false
        }

        return true
      }
      case 'undo': {
        const spliceIdString = spliceIdToString(op.spliceId)
        return (
          this.splitTreesBySpliceId.has(spliceIdString) ||
          this.deletionsBySpliceId.has(spliceIdString)
        )
      }
      case 'markers-update':
        return true
      default:
        throw new Error('Unknown operation type')
    }
  }

  integrateOperations (operations) {
    const integratedOperations = []
    let oldUndoCounts
    let i = 0
    while (i < operations.length) {
      const operation = operations[i++]
      if (operation.type !== 'markers-update') this.operations.push(operation)

      if (this.canIntegrateOperation(operation)) {
        integratedOperations.push(operation)
        switch (operation.type) {
          case 'splice':
            if (operation.deletion) this.integrateDeletion(operation.spliceId, operation.deletion)
            if (operation.insertion) this.integrateInsertion(operation.spliceId, operation.insertion)
            this.updateMaxSeqsBySite(operation.spliceId)
            break
          case 'undo':
            if (!oldUndoCounts) oldUndoCounts = new Map()
            this.integrateUndo(operation, oldUndoCounts)
            break
        }
        this.collectDeferredOperations(operation, operations)
      } else {
        this.deferOperation(operation)
      }
    }

    const textUpdates = this.textUpdatesForOperations(integratedOperations, oldUndoCounts)
    const markerUpdates = this.updateMarkersForOperations(integratedOperations)

    return {textUpdates, markerUpdates}
  }

  collectDeferredOperations ({spliceId}, operations) {
    if (spliceId) {
      const spliceIdString = spliceIdToString(spliceId)
      const dependentOps = this.deferredOperationsByDependencyId.get(spliceIdString)
      if (dependentOps) {
        dependentOps.forEach((dependentOp) => {
          if (this.canIntegrateOperation(dependentOp)) {
            operations.push(dependentOp)
          }
        })
        this.deferredOperationsByDependencyId.delete(spliceIdString)
      }
    }
  }

  deferOperation (op) {
    if (op.type === 'splice') {
      const {spliceId, deletion, insertion} = op
      this.addOperationDependency(this.deferredOperationsByDependencyId, {site: spliceId.site, seq: spliceId.seq - 1}, op)

      if (deletion) {
        this.addOperationDependency(this.deferredOperationsByDependencyId, deletion.leftDependencyId, op)
        this.addOperationDependency(this.deferredOperationsByDependencyId, deletion.rightDependencyId, op)
        for (const site in deletion.maxSeqsBySite) {
          const seq = deletion.maxSeqsBySite[site]
          this.addOperationDependency(this.deferredOperationsByDependencyId, {site, seq}, op)
        }
      }

      if (insertion) {
        this.addOperationDependency(this.deferredOperationsByDependencyId, insertion.leftDependencyId, op)
        this.addOperationDependency(this.deferredOperationsByDependencyId, insertion.rightDependencyId, op)
      }
    } else if (op.type === 'undo') {
      this.addOperationDependency(this.deferredOperationsByDependencyId, op.spliceId, op)
    } else {
      throw new Error('Unknown operation type: ' + op.type)
    }
  }

  addOperationDependency (map, dependencyId, op) {
    const dependencyIdString = spliceIdToString(dependencyId)
    if (!this.hasAppliedSplice(dependencyId)) {
      let deferredOps = map.get(dependencyIdString)
      if (!deferredOps) {
        deferredOps = new Set()
        map.set(dependencyIdString, deferredOps)
      }
      deferredOps.add(op)
    }
  }

  hasAppliedSplice (spliceId) {
    const spliceIdString = spliceIdToString(spliceId)
    return (
      this.splitTreesBySpliceId.has(spliceIdString) ||
      this.deletionsBySpliceId.has(spliceIdString)
    )
  }

  integrateInsertion (spliceId, operation) {
    const {text, leftDependencyId, offsetInLeftDependency, rightDependencyId, offsetInRightDependency} = operation

    const originalRightDependency = this.findSegmentStart(rightDependencyId, offsetInRightDependency)
    const originalLeftDependency = this.findSegmentEnd(leftDependencyId, offsetInLeftDependency)

    this.documentTree.splayNode(originalLeftDependency)
    this.documentTree.splayNode(originalRightDependency)

    let currentSegment = this.documentTree.getSuccessor(originalLeftDependency)
    let leftDependency = originalLeftDependency
    let rightDependency = originalRightDependency
    while (currentSegment !== rightDependency) {
      const leftDependencyIndex = this.documentTree.getSegmentIndex(leftDependency)
      const rightDependencyIndex = this.documentTree.getSegmentIndex(rightDependency)
      const currentSegmentLeftDependencyIndex = this.documentTree.getSegmentIndex(currentSegment.leftDependency)
      const currentSegmentRightDependencyIndex = this.documentTree.getSegmentIndex(currentSegment.rightDependency)

      if (currentSegmentLeftDependencyIndex <= leftDependencyIndex && currentSegmentRightDependencyIndex >= rightDependencyIndex) {
        if (spliceId.site < currentSegment.spliceId.site) {
          rightDependency = currentSegment
        } else {
          leftDependency = currentSegment
        }

        currentSegment = this.documentTree.getSuccessor(leftDependency)
      } else {
        currentSegment = this.documentTree.getSuccessor(currentSegment)
      }
    }

    const newSegment = {
      spliceId,
      offset: ZERO_POINT,
      text,
      extent: extentForText(text),
      leftDependency: originalLeftDependency,
      rightDependency: originalRightDependency,
      nextSplit: null,
      deletions: new Set()
    }
    this.documentTree.insertBetween(leftDependency, rightDependency, newSegment)
    this.splitTreesBySpliceId.set(spliceIdToString(spliceId), new SplitTree(newSegment))
  }

  integrateDeletion (spliceId, deletion) {
    const {
      leftDependencyId, offsetInLeftDependency,
      rightDependencyId, offsetInRightDependency,
      maxSeqsBySite
    } = deletion

    const spliceIdString = spliceIdToString(spliceId)
    this.deletionsBySpliceId.set(spliceIdString, deletion)

    const left = this.findSegmentStart(leftDependencyId, offsetInLeftDependency)
    const right = this.findSegmentEnd(rightDependencyId, offsetInRightDependency)
    let segment = left
    while (true) {
      const maxSeq = maxSeqsBySite[segment.spliceId.site] || 0
      if (segment.spliceId.seq <= maxSeq) {
        this.documentTree.splayNode(segment)
        segment.deletions.add(spliceIdString)
        this.documentTree.updateSubtreeExtent(segment)
      }

      if (segment === right) break
      segment = this.documentTree.getSuccessor(segment)
    }
  }

  integrateUndo ({spliceId, undoCount}, oldUndoCounts) {
    return this.updateUndoCount(spliceId, undoCount, oldUndoCounts)
  }

  getMarkerLayersForSiteId (siteId) {
    let layers = this.markerLayersBySiteId.get(siteId)
    if (!layers) {
      layers = new Map()
      this.markerLayersBySiteId.set(siteId, layers)
    }
    return layers
  }

  deferMarkerUpdate (siteId, layerId, markerId, markerUpdate) {
    const {range} = markerUpdate
    const deferredMarkerUpdate = {siteId, layerId, markerId}
    this.addOperationDependency(this.deferredMarkerUpdatesByDependencyId, range.startDependencyId, deferredMarkerUpdate)
    this.addOperationDependency(this.deferredMarkerUpdatesByDependencyId, range.endDependencyId, deferredMarkerUpdate)

    let deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId)
    if (!deferredUpdatesByLayerId) {
      deferredUpdatesByLayerId = new Map()
      this.deferredMarkerUpdates.set(siteId, deferredUpdatesByLayerId)
    }
    let deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId)
    if (!deferredUpdatesByMarkerId) {
      deferredUpdatesByMarkerId = new Map()
      deferredUpdatesByLayerId.set(layerId, deferredUpdatesByMarkerId)
    }
    deferredUpdatesByMarkerId.set(markerId, markerUpdate)
  }

  updateMarkersForOperations (operations) {
    const markerUpdates = {}

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      if (operation.type === 'markers-update') {
        this.integrateMarkerUpdates(markerUpdates, operation)
      } else if (operation.type === 'splice') {
        this.integrateDeferredMarkerUpdates(markerUpdates, operation)
      }
    }

    return markerUpdates
  }

  integrateMarkerUpdates (markerUpdates, {siteId, updates}) {
    const layers = this.getMarkerLayersForSiteId(siteId)
    if (!markerUpdates[siteId]) markerUpdates[siteId] = {}

    for (let layerId in updates) {
      const updatesByMarkerId = updates[layerId]
      layerId = parseInt(layerId)

      let layer = layers.get(layerId)
      if (updatesByMarkerId) {
        if (!layer) {
          layer = new Map()
          layers.set(layerId, layer)
        }

        if (!markerUpdates[siteId][layerId]) markerUpdates[siteId][layerId] = {}

        for (let markerId in updatesByMarkerId) {
          const markerUpdate = updatesByMarkerId[markerId]
          markerId = parseInt(markerId)

          if (markerUpdate) {
            if (markerUpdate.range && !this.canResolveLogicalRange(markerUpdate.range)) {
              this.deferMarkerUpdate(siteId, layerId, markerId, markerUpdate)
            } else {
              this.integrateMarkerUpdate(markerUpdates, siteId, layerId, markerId, markerUpdate)
            }
          } else {
            if (layer.has(markerId)) {
              layer.delete(markerId)
              markerUpdates[siteId][layerId][markerId] = null
            }

            const deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId)
            if (deferredUpdatesByLayerId) {
              const deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId)
              if (deferredUpdatesByMarkerId) {
                deferredUpdatesByMarkerId.delete(markerId)
              }
            }
          }
        }
      } else {
        if (layer) {
          markerUpdates[siteId][layerId] = null
          layers.delete(layerId)
        }

        const deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId)
        if (deferredUpdatesByLayerId) {
          deferredUpdatesByLayerId.delete(layerId)
        }
      }
    }
  }

  integrateDeferredMarkerUpdates (markerUpdates, {spliceId}) {
    const spliceIdString = spliceIdToString(spliceId)
    const dependentMarkerUpdates = this.deferredMarkerUpdatesByDependencyId.get(spliceIdString)
    if (dependentMarkerUpdates) {
      dependentMarkerUpdates.forEach(({siteId, layerId, markerId}) => {
        const deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId)
        if (deferredUpdatesByLayerId) {
          const deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId)
          if (deferredUpdatesByMarkerId) {
            const deferredUpdate = deferredUpdatesByMarkerId.get(markerId)
            if (deferredUpdate && this.canResolveLogicalRange(deferredUpdate.range)) {
              this.integrateMarkerUpdate(markerUpdates, siteId, layerId, markerId, deferredUpdate)
            }
          }
        }
      })
      this.deferredMarkerUpdatesByDependencyId.delete(spliceIdString)
    }
  }

  integrateMarkerUpdate (markerUpdates, siteId, layerId, markerId, update) {
    let layer = this.markerLayersBySiteId.get(siteId).get(layerId)
    if (!layer) {
      layer = new Map()
      this.markerLayersBySiteId.get(siteId).set(layerId, layer)
    }

    let marker = layer.get(markerId)
    marker = marker ? Object.assign({}, marker) : {}
    Object.assign(marker, update)
    Object.freeze(marker)
    layer.set(markerId, marker)

    if (!markerUpdates[siteId]) markerUpdates[siteId] = {}
    if (!markerUpdates[siteId][layerId]) markerUpdates[siteId][layerId] = {}
    markerUpdates[siteId][layerId][markerId] = Object.assign({}, marker)
    markerUpdates[siteId][layerId][markerId].range = this.resolveLogicalRange(marker.range, marker.exclusive)

    const deferredUpdatesByLayerId = this.deferredMarkerUpdates.get(siteId)
    if (deferredUpdatesByLayerId) {
      const deferredUpdatesByMarkerId = deferredUpdatesByLayerId.get(layerId)
      if (deferredUpdatesByMarkerId) {
        if (deferredUpdatesByMarkerId.has(markerId)) {
          deferredUpdatesByMarkerId.delete(markerId)
          if (deferredUpdatesByMarkerId.size === 0) {
            deferredUpdatesByLayerId.delete(layerId)
            if (deferredUpdatesByLayerId.size === 0) {
              this.deferredMarkerUpdates.delete(siteId)
            }
          }
        }
      }
    }
  }

  snapshotFromMarkers (layersById) {
    if (!layersById) return layersById

    const snapshot = {}
    for (const layerId in layersById) {
      const layerSnapshot = {}
      const markersById = layersById[layerId]
      for (const markerId in markersById) {
        const markerSnapshot = Object.assign({}, markersById[markerId])
        markerSnapshot.range = this.getLogicalRange(markerSnapshot.range, markerSnapshot.exclusive)
        layerSnapshot[markerId] = markerSnapshot
      }
      snapshot[layerId] = layerSnapshot
    }
    return snapshot
  }

  markersFromSnapshot (snapshot) {
    if (!snapshot) return snapshot

    const layersById = {}
    for (const layerId in snapshot) {
      const markersById = {}
      const layerSnapshot = snapshot[layerId]
      for (const markerId in layerSnapshot) {
        const marker = Object.assign({}, layerSnapshot[markerId])
        marker.range = this.resolveLogicalRange(marker.range)
        markersById[markerId] = marker
      }
      layersById[layerId] = markersById
    }
    return layersById
  }

  updateUndoCount (spliceId, newUndoCount, oldUndoCounts) {
    const spliceIdString = spliceIdToString(spliceId)
    const previousUndoCount = this.undoCountsBySpliceId.get(spliceIdString) || 0
    if (newUndoCount <= previousUndoCount) return

    oldUndoCounts.set(spliceIdString, previousUndoCount)
    this.undoCountsBySpliceId.set(spliceIdString, newUndoCount)

    const segmentsToUpdate = new Set()
    this.collectSegments(spliceIdString, segmentsToUpdate)

    segmentsToUpdate.forEach((segment) => {
      const wasVisible = this.isSegmentVisible(segment, oldUndoCounts)
      const isVisible = this.isSegmentVisible(segment)
      if (isVisible !== wasVisible) {
        this.documentTree.splayNode(segment, oldUndoCounts)
        this.documentTree.updateSubtreeExtent(segment)
      }
    })
  }

  textUpdatesForOperations (operations, oldUndoCounts) {
    const newSpliceIds = new Set()
    const segmentStartPositions = new Map()
    const segmentIndices = new Map()

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i]
      const {type, spliceId, deletion, insertion} = operation
      if (spliceId) {
        const spliceIdString = spliceIdToString(spliceId)
        if (type === 'splice') newSpliceIds.add(spliceIdString)
        this.collectSegments(spliceIdString, null, segmentIndices, segmentStartPositions)
      }
    }

    return this.computeChangesForSegments(segmentIndices, segmentStartPositions, oldUndoCounts, newSpliceIds)
  }

  canResolveLogicalRange ({startDependencyId, endDependencyId}) {
    return (
      this.hasAppliedSplice(startDependencyId) &&
      this.hasAppliedSplice(endDependencyId)
    )
  }

  getLogicalRange ({start, end}, exclusive) {
    const {segment: startDependency, offset: offsetInStartDependency} = this.findSegment(start, exclusive)
    const {segment: endDependency, offset: offsetInEndDependency} = this.findSegment(end, !exclusive || compare(start, end) === 0)

    return {
      startDependencyId: startDependency.spliceId,
      offsetInStartDependency,
      endDependencyId: endDependency.spliceId,
      offsetInEndDependency
    }
  }

  resolveLogicalRange (logicalRange, exclusive) {
    const {
      startDependencyId, offsetInStartDependency,
      endDependencyId, offsetInEndDependency
    } = logicalRange
    return {
      start: this.resolveLogicalPosition(startDependencyId, offsetInStartDependency, exclusive),
      end: this.resolveLogicalPosition(endDependencyId, offsetInEndDependency, !exclusive || isEmptyLogicalRange(logicalRange))
    }
  }

  resolveLogicalPosition (spliceId, offset, preferStart) {
    const splitTree = this.splitTreesBySpliceId.get(spliceIdToString(spliceId))
    let segment = splitTree.findSegmentContainingOffset(offset)
    const nextSegmentOffset = traverse(segment.offset, segment.extent)
    if (preferStart && compare(offset, nextSegmentOffset) === 0) {
      segment = splitTree.getSuccessor(segment) || segment
    }
    const segmentStart = this.documentTree.getSegmentPosition(segment)

    if (this.isSegmentVisible(segment)) {
      return traverse(segmentStart, traversal(offset, segment.offset))
    } else {
      return segmentStart
    }
  }

  findLocalSegmentBoundary (position) {
    const {segment, start, end} = this.documentTree.findSegmentContainingPosition(position)
    if (compare(position, end) < 0) {
      const splitTree = this.splitTreesBySpliceId.get(spliceIdToString(segment.spliceId))
      return this.splitSegment(splitTree, segment, traversal(position, start))
    } else {
      return [segment, this.documentTree.getSuccessor(segment)]
    }
  }

  splitSegment (splitTree, segment, offset) {
    const suffix = splitTree.splitSegment(segment, offset)
    this.documentTree.splitSegment(segment, suffix)
    return [segment, suffix]
  }

  findSegment (position, preferStart) {
    let {segment, start, end} = this.documentTree.findSegmentContainingPosition(position)
    let offset = traverse(segment.offset, traversal(position, start))
    if (preferStart && compare(position, end) === 0) {
      segment = this.documentTree.getSuccessor(segment)
      offset = segment.offset
    }
    return {segment, offset}
  }

  findSegmentStart (spliceId, offset) {
    const splitTree = this.splitTreesBySpliceId.get(spliceIdToString(spliceId))
    const segment = splitTree.findSegmentContainingOffset(offset)
    const segmentEndOffset = traverse(segment.offset, segment.extent)
    if (compare(segment.offset, offset) === 0) {
      return segment
    } else if (compare(segmentEndOffset, offset) === 0) {
      return segment.nextSplit
    } else {
      const [prefix, suffix] = this.splitSegment(splitTree, segment, traversal(offset, segment.offset))
      return suffix
    }
  }

  findSegmentEnd (spliceId, offset) {
    const splitTree = this.splitTreesBySpliceId.get(spliceIdToString(spliceId))
    const segment = splitTree.findSegmentContainingOffset(offset)
    const segmentEndOffset = traverse(segment.offset, segment.extent)
    if (compare(segmentEndOffset, offset) === 0) {
      return segment
    } else {
      const [prefix, suffix] = this.splitSegment(splitTree, segment, traversal(offset, segment.offset))
      return prefix
    }
  }

  getText () {
    let text = ''
    const segments = this.documentTree.getSegments()
    for (var i = 0; i < segments.length; i++) {
      const segment = segments[i]
      if (this.isSegmentVisible(segment)) text += segment.text
    }
    return text
  }

  collectSegments (spliceIdString, segments, segmentIndices, segmentStartPositions) {
    const insertionSplitTree = this.splitTreesBySpliceId.get(spliceIdString)
    if (insertionSplitTree) {
      let segment = insertionSplitTree.getStart()
      while (segment) {
        if (segments) {
          segments.add(segment)
        } else {
          segmentStartPositions.set(segment, this.documentTree.getSegmentPosition(segment))
          segmentIndices.set(segment, this.documentTree.getSegmentIndex(segment))
        }
        segment = insertionSplitTree.getSuccessor(segment)
      }
    }

    const deletion = this.deletionsBySpliceId.get(spliceIdString)
    if (deletion) {
      const {
        leftDependencyId, offsetInLeftDependency,
        rightDependencyId, offsetInRightDependency,
        maxSeqsBySite
      } = deletion

      const left = this.findSegmentStart(leftDependencyId, offsetInLeftDependency)
      const right = this.findSegmentEnd(rightDependencyId, offsetInRightDependency)
      let segment = left
      while (true) {
        const maxSeq = maxSeqsBySite[segment.spliceId.site] || 0
        if (segment.spliceId.seq <= maxSeq) {
          if (segments) {
            segments.add(segment)
          } else {
            segmentStartPositions.set(segment, this.documentTree.getSegmentPosition(segment))
            segmentIndices.set(segment, this.documentTree.getSegmentIndex(segment))
          }
        }

        if (segment === right) break
        segment = this.documentTree.getSuccessor(segment)
      }
    }
  }

  computeChangesForSegments (segmentIndices, segmentStartPositions, oldUndoCounts, newOperations) {
    const orderedSegments = Array.from(segmentIndices.keys()).sort((s1, s2) => {
      return segmentIndices.get(s1) - segmentIndices.get(s2)
    })

    const changes = []

    let lastChange
    for (let i = 0; i < orderedSegments.length; i++) {
      const segment = orderedSegments[i]
      const visibleBefore = this.isSegmentVisible(segment, oldUndoCounts, newOperations)
      const visibleAfter = this.isSegmentVisible(segment)

      if (visibleBefore !== visibleAfter) {
        const segmentNewStart = segmentStartPositions.get(segment)
        const segmentOldStart =
          lastChange
          ? traverse(lastChange.oldEnd, traversal(segmentNewStart, lastChange.newEnd))
          : segmentNewStart

        if (visibleBefore) {
          if (changes.length > 0 && compare(lastChange.newEnd, segmentNewStart) === 0) {
            lastChange.oldEnd = traverse(lastChange.oldEnd, segment.extent)
            lastChange.oldText += segment.text
          } else {
            lastChange = {
              oldStart: segmentOldStart,
              oldEnd: traverse(segmentOldStart, segment.extent),
              oldText: segment.text,
              newStart: segmentNewStart,
              newEnd: segmentNewStart,
              newText: ''
            }
            changes.push(lastChange)
          }
        } else {
          if (lastChange && compare(lastChange.newEnd, segmentNewStart) === 0) {
            lastChange.newEnd = traverse(lastChange.newEnd, segment.extent)
            lastChange.newText += segment.text
          } else {
            lastChange = {
              oldStart: segmentOldStart,
              oldEnd: segmentOldStart,
              oldText: '',
              newStart: segmentNewStart,
              newEnd: traverse(segmentNewStart, segment.extent),
              newText: segment.text
            }
            changes.push(lastChange)
          }
        }
      }
    }

    return changes
  }

  isSegmentVisible (segment, undoCountOverrides, operationsToIgnore) {
    const spliceIdString = spliceIdToString(segment.spliceId)

    if (operationsToIgnore && operationsToIgnore.has(spliceIdString)) {
      return false
    }

    let undoCount
    if (undoCountOverrides) {
      undoCount = undoCountOverrides.get(spliceIdString)
    }
    if (undoCount == null) {
      undoCount = this.undoCountsBySpliceId.get(spliceIdString) || 0
    }

    return (
      (undoCount & 1) === 0 &&
      !this.isSegmentDeleted(segment, undoCountOverrides, operationsToIgnore)
    )
  }

  isSegmentDeleted (segment, undoCountOverrides, operationsToIgnore) {
    for (const deletionSpliceIdString of segment.deletions) {
      if (operationsToIgnore && operationsToIgnore.has(deletionSpliceIdString)) {
        continue
      }

      let deletionUndoCount
      if (undoCountOverrides) {
        deletionUndoCount = undoCountOverrides.get(deletionSpliceIdString)
      }
      if (deletionUndoCount == null) {
        deletionUndoCount = this.undoCountsBySpliceId.get(deletionSpliceIdString) || 0
      }

      if ((deletionUndoCount & 1) === 0) return true
    }
    return false
  }

  updateMaxSeqsBySite ({site, seq}) {
    const previousSeq = this.maxSeqsBySite[site] || 0
    assert.equal(previousSeq, seq - 1, 'Operations from a given site must be applied in order.')
    this.maxSeqsBySite[site] = seq
    if (this.siteId === site) this.nextSequenceNumber = seq + 1
  }
}

function spliceIdToString ({site, seq}) {
  return site + '.' + seq
}

function isEmptyLogicalRange ({startDependencyId, offsetInStartDependency, endDependencyId, offsetInEndDependency}) {
  return (
    spliceIdsEqual(startDependencyId, endDependencyId) &&
    compare(offsetInStartDependency, offsetInEndDependency) === 0
  )
}

function markersEqual (a, b) {
  return (
    logicalRangesEqual(a.range, b.range) &&
    a.exclusive === b.exclusive &&
    a.reversed === b.reversed &&
    a.tailed === b.tailed
  )
}

function logicalRangesEqual (a, b) {
  return (
    spliceIdsEqual(a.startDependencyId, b.startDependencyId) &&
    compare(a.offsetInStartDependency, b.offsetInStartDependency) === 0 &&
    spliceIdsEqual(a.endDependencyId, b.endDependencyId) &&
    compare(a.offsetInEndDependency, b.offsetInEndDependency) === 0
  )
}

function spliceIdsEqual (a, b) {
  return a.site === b.site && a.seq === b.seq
}

function invertTextUpdates (textUpdates) {
  const invertedTextUpdates = []
  for (let i = 0; i < textUpdates.length; i++) {
    const {oldStart, oldEnd, oldText, newStart, newEnd, newText} = textUpdates[i]
    invertedTextUpdates.push({
      oldStart: newStart,
      oldEnd: newEnd,
      oldText: newText,
      newStart: oldStart,
      newEnd: oldEnd,
      newText: oldText
    })
  }
  return invertedTextUpdates
}

class Checkpoint {
  constructor (id, isBarrier, markersSnapshot) {
    this.id = id
    this.isBarrier = isBarrier
    this.markersSnapshot = markersSnapshot
  }
}

class Transaction {
  constructor (timestamp, operations, markersSnapshotBefore, markersSnapshotAfter) {
    this.timestamp = timestamp
    this.operations = operations
    this.markersSnapshotBefore = markersSnapshotBefore
    this.markersSnapshotAfter = markersSnapshotAfter
  }
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

const SplayTree = __webpack_require__(22)
const {ZERO_POINT, compare, traverse} = __webpack_require__(9)

module.exports =
class DocumentTree extends SplayTree {
  constructor (firstSegment, lastSegment, isSegmentVisible) {
    super()
    this.firstSegment = firstSegment
    this.firstSegment.documentRight = lastSegment
    this.firstSegment.documentRight.documentParent = this.firstSegment
    this.firstSegment.documentLeft = null
    this.firstSegment.documentSubtreeExtent = ZERO_POINT
    lastSegment.documentSubtreeExtent = ZERO_POINT
    this.root = this.firstSegment
    this.isSegmentVisible = isSegmentVisible
  }

  getSegmentIndex (segment) {
    let index = segment.documentLeft ? segment.documentLeft.documentSubtreeSize : 0

    while (segment.documentParent) {
      if (segment.documentParent.documentRight === segment) {
        index++
        if (segment.documentParent.documentLeft) {
          index += segment.documentParent.documentLeft.documentSubtreeSize
        }
      }
      segment = segment.documentParent
    }

    return index
  }

  getParent (node) {
    return node.documentParent
  }

  setParent (node, value) {
    node.documentParent = value
  }

  getLeft (node) {
    return node.documentLeft
  }

  setLeft (node, value) {
    node.documentLeft = value
  }

  getRight (node) {
    return node.documentRight
  }

  setRight (node, value) {
    node.documentRight = value
  }

  findSegmentContainingPosition (position) {
    let segment = this.root
    let leftAncestorEnd = ZERO_POINT
    while (segment) {
      let start = leftAncestorEnd
      if (segment.documentLeft) start = traverse(start, segment.documentLeft.documentSubtreeExtent)
      let end = start
      if (this.isSegmentVisible(segment)) end = traverse(end, segment.extent)

      if (compare(position, start) <= 0 && segment !== this.firstSegment) {
        segment = segment.documentLeft
      } else if (compare(position, end) > 0) {
        leftAncestorEnd = end
        segment = segment.documentRight
      } else {
        return {segment, start, end}
      }
    }

    throw new Error('No segment found')
  }

  insertBetween (prev, next, newSegment) {
    this.splayNode(prev)
    this.splayNode(next)
    this.root = newSegment
    newSegment.documentLeft = prev
    prev.documentParent = newSegment
    newSegment.documentRight = next
    next.documentParent = newSegment
    next.documentLeft = null
    this.updateSubtreeExtent(next)
    this.updateSubtreeExtent(newSegment)
  }

  splitSegment (prefix, suffix) {
    this.splayNode(prefix)

    this.root = suffix
    suffix.documentParent = null
    suffix.documentLeft = prefix
    prefix.documentParent = suffix
    suffix.documentRight = prefix.documentRight
    if (suffix.documentRight) suffix.documentRight.documentParent = suffix
    prefix.documentRight = null

    this.updateSubtreeExtent(prefix)
    this.updateSubtreeExtent(suffix)
  }

  updateSubtreeExtent (node, undoCountOverrides) {
    node.documentSubtreeExtent = ZERO_POINT
    node.documentSubtreeSize = 1
    if (node.documentLeft) {
      node.documentSubtreeExtent = traverse(node.documentSubtreeExtent, node.documentLeft.documentSubtreeExtent)
      node.documentSubtreeSize += node.documentLeft.documentSubtreeSize
    }
    if (this.isSegmentVisible(node, undoCountOverrides)) {
      node.documentSubtreeExtent = traverse(node.documentSubtreeExtent, node.extent)
    }
    if (node.documentRight) {
      node.documentSubtreeExtent = traverse(node.documentSubtreeExtent, node.documentRight.documentSubtreeExtent)
      node.documentSubtreeSize += node.documentRight.documentSubtreeSize
    }
  }

  getSegmentPosition (segment) {
    this.splayNode(segment)
    if (segment.documentLeft) {
      return segment.documentLeft.documentSubtreeExtent
    } else {
      return ZERO_POINT
    }
  }

  getSegments () {
    const treeSegments = []
    function visitTreeInOrder (node) {
      if (node.documentLeft) visitTreeInOrder(node.documentLeft)
      treeSegments.push(node)
      if (node.documentRight) visitTreeInOrder(node.documentRight)
    }
    visitTreeInOrder(this.root)
    return treeSegments
  }
}


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

const SplayTree = __webpack_require__(22)
const {ZERO_POINT, compare, traverse, traversal, characterIndexForPosition, extentForText} = __webpack_require__(9)

module.exports =
class SplitTree extends SplayTree {
  constructor (segment) {
    super()
    this.startSegment = segment
    this.startSegment.splitLeft = null
    this.startSegment.splitRight = null
    this.startSegment.splitParent = null
    this.startSegment.splitSubtreeExtent = this.startSegment.extent
    this.root = this.startSegment
  }

  getStart () {
    return this.startSegment
  }

  getParent (node) {
    return node.splitParent
  }

  setParent (node, value) {
    node.splitParent = value
  }

  getLeft (node) {
    return node.splitLeft
  }

  setLeft (node, value) {
    node.splitLeft = value
  }

  getRight (node) {
    return node.splitRight
  }

  setRight (node, value) {
    node.splitRight = value
  }

  updateSubtreeExtent (node) {
    node.splitSubtreeExtent = ZERO_POINT
    if (node.splitLeft) node.splitSubtreeExtent = traverse(node.splitSubtreeExtent, node.splitLeft.splitSubtreeExtent)
    node.splitSubtreeExtent = traverse(node.splitSubtreeExtent, node.extent)
    if (node.splitRight) node.splitSubtreeExtent = traverse(node.splitSubtreeExtent, node.splitRight.splitSubtreeExtent)
  }

  findSegmentContainingOffset (offset) {
    let segment = this.root
    let leftAncestorEnd = ZERO_POINT
    while (segment) {
      let start = leftAncestorEnd
      if (segment.splitLeft) start = traverse(start, segment.splitLeft.splitSubtreeExtent)
      const end = traverse(start, segment.extent)

      if (compare(offset, start) <= 0 && segment.splitLeft) {
        segment = segment.splitLeft
      } else if (compare(offset, end) > 0) {
        leftAncestorEnd = end
        segment = segment.splitRight
      } else {
        this.splayNode(segment)
        return segment
      }
    }

    throw new Error('No segment found')
  }

  splitSegment (segment, offset) {
    const splitIndex = characterIndexForPosition(segment.text, offset)

    this.splayNode(segment)
    const suffix = Object.assign({}, segment)
    suffix.text = segment.text.slice(splitIndex)
    suffix.extent = traversal(segment.extent, offset)

    suffix.spliceId = Object.assign({}, segment.spliceId)
    suffix.offset = traverse(suffix.offset, offset)
    suffix.deletions = new Set(suffix.deletions)
    segment.text = segment.text.slice(0, splitIndex)
    segment.extent = offset
    segment.nextSplit = suffix

    this.root = suffix
    suffix.splitParent = null
    suffix.splitLeft = segment
    segment.splitParent = suffix
    suffix.splitRight = segment.splitRight
    if (suffix.splitRight) suffix.splitRight.splitParent = suffix
    segment.splitRight = null

    this.updateSubtreeExtent(segment)
    this.updateSubtreeExtent(suffix)

    return suffix
  }

  getSuccessor (segment) {
    return segment.nextSplit
  }

  getSegments () {
    const segments = []
    let segment = this.getStart()
    while (segment) {
      segments.push(segment)
      segment = segment.nextSplit
    }
    return segments
  }
}


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

const {Operation} = __webpack_require__(54)

function serializeOperation (op) {
  const operationMessage = new Operation()
  switch (op.type) {
    case 'splice':
      operationMessage.setSplice(serializeSplice(op))
      break
    case 'undo':
      operationMessage.setUndo(serializeUndo(op))
      break
    case 'markers-update':
      operationMessage.setMarkersUpdate(serializeMarkersUpdate(op))
      break
    default:
      throw new Error('Unknown operation type: ' + op.type)
  }
  return operationMessage
}

function serializeOperationBinary (op) {
  return serializeOperation(op).serializeBinary()
}

function serializeSplice (splice) {
  const spliceMessage = new Operation.Splice()
  spliceMessage.setSpliceId(serializeSpliceId(splice.spliceId))
  if (splice.insertion) {
    spliceMessage.setInsertion(serializeInsertion(splice.insertion))
  }
  if (splice.deletion) {
    spliceMessage.setDeletion(serializeDeletion(splice.deletion))
  }
  return spliceMessage
}

function serializeInsertion (insertion) {
  const insertionMessage = new Operation.Splice.Insertion()
  insertionMessage.setText(insertion.text)
  insertionMessage.setLeftDependencyId(serializeSpliceId(insertion.leftDependencyId))
  insertionMessage.setOffsetInLeftDependency(serializePoint(insertion.offsetInLeftDependency))
  insertionMessage.setRightDependencyId(serializeSpliceId(insertion.rightDependencyId))
  insertionMessage.setOffsetInRightDependency(serializePoint(insertion.offsetInRightDependency))
  return insertionMessage
}

function serializeDeletion (deletion) {
  const deletionMessage = new Operation.Splice.Deletion()
  deletionMessage.setLeftDependencyId(serializeSpliceId(deletion.leftDependencyId))
  deletionMessage.setOffsetInLeftDependency(serializePoint(deletion.offsetInLeftDependency))
  deletionMessage.setRightDependencyId(serializeSpliceId(deletion.rightDependencyId))
  deletionMessage.setOffsetInRightDependency(serializePoint(deletion.offsetInRightDependency))
  const maxSeqsBySiteMessage = deletionMessage.getMaxSeqsBySiteMap()
  for (const site in deletion.maxSeqsBySite) {
    maxSeqsBySiteMessage.set(site, deletion.maxSeqsBySite[site])
  }
  return deletionMessage
}

function serializeUndo (undo) {
  const undoMessage = new Operation.Undo()
  undoMessage.setSpliceId(serializeSpliceId(undo.spliceId))
  undoMessage.setUndoCount(undo.undoCount)
  return undoMessage
}

function serializeMarkersUpdate ({siteId, updates}) {
  const markersUpdateMessage = new Operation.MarkersUpdate()
  markersUpdateMessage.setSiteId(siteId)
  const layerOperationsMessage = markersUpdateMessage.getLayerOperationsMap()
  for (const layerId in updates) {
    const markerUpdates = updates[layerId]
    const layerOperationMessage = new Operation.MarkersUpdate.LayerOperation()
    if (markerUpdates) {
      layerOperationMessage.setIsDeletion(false)
      const markerOperationsMessage = layerOperationMessage.getMarkerOperationsMap()
      for (const markerId in markerUpdates) {
        const markerUpdate = markerUpdates[markerId]
        const markerOperationMessage = new Operation.MarkersUpdate.MarkerOperation()
        if (markerUpdate) {
          markerOperationMessage.setIsDeletion(false)
          const {range, exclusive, reversed, tailed} = markerUpdate
          const markerUpdateMessage = new Operation.MarkersUpdate.MarkerUpdate()
          const logicalRangeMessage = new Operation.MarkersUpdate.LogicalRange()
          logicalRangeMessage.setStartDependencyId(serializeSpliceId(range.startDependencyId))
          logicalRangeMessage.setOffsetInStartDependency(serializePoint(range.offsetInStartDependency))
          logicalRangeMessage.setEndDependencyId(serializeSpliceId(range.endDependencyId))
          logicalRangeMessage.setOffsetInEndDependency(serializePoint(range.offsetInEndDependency))
          markerUpdateMessage.setRange(logicalRangeMessage)
          markerUpdateMessage.setExclusive(exclusive)
          markerUpdateMessage.setReversed(reversed)
          markerUpdateMessage.setTailed(tailed)
          markerOperationMessage.setMarkerUpdate(markerUpdateMessage)
        } else {
          markerOperationMessage.setIsDeletion(true)
        }
        markerOperationsMessage.set(markerId, markerOperationMessage)
      }
    } else {
      layerOperationMessage.setIsDeletion(true)
    }
    layerOperationsMessage.set(layerId, layerOperationMessage)
  }
  return markersUpdateMessage
}

function serializeSpliceId ({site, seq}) {
  const spliceIdMessage = new Operation.SpliceId()
  spliceIdMessage.setSite(site)
  spliceIdMessage.setSeq(seq)
  return spliceIdMessage
}

function serializePoint ({row, column}) {
  const pointMessage = new Operation.Point()
  pointMessage.setRow(row)
  pointMessage.setColumn(column)
  return pointMessage
}

function deserializeOperation (operationMessage) {
  if (operationMessage.hasSplice()) {
    return deserializeSplice(operationMessage.getSplice())
  } else if (operationMessage.hasUndo()) {
    return deserializeUndo(operationMessage.getUndo())
  } else if (operationMessage.hasMarkersUpdate()) {
    return deserializeMarkersUpdate(operationMessage.getMarkersUpdate())
  } else {
    throw new Error('Unknown operation type')
  }
}

function deserializeOperationBinary (data) {
  return deserializeOperation(Operation.deserializeBinary(data))
}

function deserializeSplice (spliceMessage) {
  const insertionMessage = spliceMessage.getInsertion()
  const deletionMessage = spliceMessage.getDeletion()
  return {
    type: 'splice',
    spliceId: deserializeSpliceId(spliceMessage.getSpliceId()),
    insertion: insertionMessage ? deserializeInsertion(insertionMessage) : null,
    deletion: deletionMessage ? deserializeDeletion(deletionMessage) : null
  }
}

function deserializeInsertion (insertionMessage) {
  return {
    text: insertionMessage.getText(),
    leftDependencyId: deserializeSpliceId(insertionMessage.getLeftDependencyId()),
    offsetInLeftDependency: deserializePoint(insertionMessage.getOffsetInLeftDependency()),
    rightDependencyId: deserializeSpliceId(insertionMessage.getRightDependencyId()),
    offsetInRightDependency: deserializePoint(insertionMessage.getOffsetInRightDependency())
  }
}

function deserializeDeletion (deletionMessage) {
  const maxSeqsBySite = {}
  deletionMessage.getMaxSeqsBySiteMap().forEach((seq, site) => {
    maxSeqsBySite[site] = seq
  })
  return {
    leftDependencyId: deserializeSpliceId(deletionMessage.getLeftDependencyId()),
    offsetInLeftDependency: deserializePoint(deletionMessage.getOffsetInLeftDependency()),
    rightDependencyId: deserializeSpliceId(deletionMessage.getRightDependencyId()),
    offsetInRightDependency: deserializePoint(deletionMessage.getOffsetInRightDependency()),
    maxSeqsBySite
  }
}

function deserializeUndo (undoMessage) {
  return {
    type: 'undo',
    spliceId: deserializeSpliceId(undoMessage.getSpliceId()),
    undoCount: undoMessage.getUndoCount()
  }
}

function deserializeMarkersUpdate (markersUpdateMessage) {
  const updates = {}

  markersUpdateMessage.getLayerOperationsMap().forEach((layerOperation, layerId) => {
    if (layerOperation.getIsDeletion()) {
      updates[layerId] = null
    } else {
      const markerUpdates = {}

      layerOperation.getMarkerOperationsMap().forEach((markerOperation, markerId) => {
        if (markerOperation.getIsDeletion()) {
          markerUpdates[markerId] = null
        } else {
          const markerUpdateMessage = markerOperation.getMarkerUpdate()
          const rangeMessage = markerUpdateMessage.getRange()
          const range = {
            startDependencyId: deserializeSpliceId(rangeMessage.getStartDependencyId()),
            offsetInStartDependency: deserializePoint(rangeMessage.getOffsetInStartDependency()),
            endDependencyId: deserializeSpliceId(rangeMessage.getEndDependencyId()),
            offsetInEndDependency: deserializePoint(rangeMessage.getOffsetInEndDependency())
          }

          markerUpdates[markerId] = {
            range,
            exclusive: markerUpdateMessage.getExclusive(),
            reversed: markerUpdateMessage.getReversed(),
            tailed: markerUpdateMessage.getTailed()
          }
        }
      })

      updates[layerId] = markerUpdates
    }
  })

  return {
    type: 'markers-update',
    siteId: markersUpdateMessage.getSiteId(),
    updates
  }
}

function deserializeSpliceId (spliceIdMessage) {
  return {
    site: spliceIdMessage.getSite(),
    seq: spliceIdMessage.getSeq()
  }
}

function deserializePoint (pointMessage) {
  return {
    row: pointMessage.getRow(),
    column: pointMessage.getColumn()
  }
}

module.exports = {
  serializeOperation, deserializeOperation,
  serializeOperationBinary, deserializeOperationBinary,
}


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = __webpack_require__(55);
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.Operation', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.LayerOperation', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.LogicalRange', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.MarkerOperation', null, global);
goog.exportSymbol('proto.Operation.MarkersUpdate.MarkerUpdate', null, global);
goog.exportSymbol('proto.Operation.Point', null, global);
goog.exportSymbol('proto.Operation.Splice', null, global);
goog.exportSymbol('proto.Operation.Splice.Deletion', null, global);
goog.exportSymbol('proto.Operation.Splice.Insertion', null, global);
goog.exportSymbol('proto.Operation.SpliceId', null, global);
goog.exportSymbol('proto.Operation.Undo', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.Operation.oneofGroups_);
};
goog.inherits(proto.Operation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.displayName = 'proto.Operation';
}
/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.Operation.oneofGroups_ = [[1,2,3]];

/**
 * @enum {number}
 */
proto.Operation.VariantCase = {
  VARIANT_NOT_SET: 0,
  SPLICE: 1,
  UNDO: 2,
  MARKERS_UPDATE: 3
};

/**
 * @return {proto.Operation.VariantCase}
 */
proto.Operation.prototype.getVariantCase = function() {
  return /** @type {proto.Operation.VariantCase} */(jspb.Message.computeOneofCase(this, proto.Operation.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.toObject = function(includeInstance, msg) {
  var f, obj = {
    splice: (f = msg.getSplice()) && proto.Operation.Splice.toObject(includeInstance, f),
    undo: (f = msg.getUndo()) && proto.Operation.Undo.toObject(includeInstance, f),
    markersUpdate: (f = msg.getMarkersUpdate()) && proto.Operation.MarkersUpdate.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation}
 */
proto.Operation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation;
  return proto.Operation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation}
 */
proto.Operation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Operation.Splice;
      reader.readMessage(value,proto.Operation.Splice.deserializeBinaryFromReader);
      msg.setSplice(value);
      break;
    case 2:
      var value = new proto.Operation.Undo;
      reader.readMessage(value,proto.Operation.Undo.deserializeBinaryFromReader);
      msg.setUndo(value);
      break;
    case 3:
      var value = new proto.Operation.MarkersUpdate;
      reader.readMessage(value,proto.Operation.MarkersUpdate.deserializeBinaryFromReader);
      msg.setMarkersUpdate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSplice();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Operation.Splice.serializeBinaryToWriter
    );
  }
  f = message.getUndo();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.Operation.Undo.serializeBinaryToWriter
    );
  }
  f = message.getMarkersUpdate();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.Operation.MarkersUpdate.serializeBinaryToWriter
    );
  }
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.Splice = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.Splice, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.Splice.displayName = 'proto.Operation.Splice';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.Splice.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.Splice.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.Splice} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Splice.toObject = function(includeInstance, msg) {
  var f, obj = {
    spliceId: (f = msg.getSpliceId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    insertion: (f = msg.getInsertion()) && proto.Operation.Splice.Insertion.toObject(includeInstance, f),
    deletion: (f = msg.getDeletion()) && proto.Operation.Splice.Deletion.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Splice}
 */
proto.Operation.Splice.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Splice;
  return proto.Operation.Splice.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Splice} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Splice}
 */
proto.Operation.Splice.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setSpliceId(value);
      break;
    case 2:
      var value = new proto.Operation.Splice.Insertion;
      reader.readMessage(value,proto.Operation.Splice.Insertion.deserializeBinaryFromReader);
      msg.setInsertion(value);
      break;
    case 3:
      var value = new proto.Operation.Splice.Deletion;
      reader.readMessage(value,proto.Operation.Splice.Deletion.deserializeBinaryFromReader);
      msg.setDeletion(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.Splice.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Splice.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Splice} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Splice.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSpliceId();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getInsertion();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.Operation.Splice.Insertion.serializeBinaryToWriter
    );
  }
  f = message.getDeletion();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.Operation.Splice.Deletion.serializeBinaryToWriter
    );
  }
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.Splice.Insertion = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.Splice.Insertion, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.Splice.Insertion.displayName = 'proto.Operation.Splice.Insertion';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.Splice.Insertion.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.Splice.Insertion.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.Splice.Insertion} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Splice.Insertion.toObject = function(includeInstance, msg) {
  var f, obj = {
    text: jspb.Message.getFieldWithDefault(msg, 2, ""),
    leftDependencyId: (f = msg.getLeftDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    offsetInLeftDependency: (f = msg.getOffsetInLeftDependency()) && proto.Operation.Point.toObject(includeInstance, f),
    rightDependencyId: (f = msg.getRightDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    offsetInRightDependency: (f = msg.getOffsetInRightDependency()) && proto.Operation.Point.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Splice.Insertion}
 */
proto.Operation.Splice.Insertion.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Splice.Insertion;
  return proto.Operation.Splice.Insertion.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Splice.Insertion} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Splice.Insertion}
 */
proto.Operation.Splice.Insertion.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setText(value);
      break;
    case 3:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setLeftDependencyId(value);
      break;
    case 4:
      var value = new proto.Operation.Point;
      reader.readMessage(value,proto.Operation.Point.deserializeBinaryFromReader);
      msg.setOffsetInLeftDependency(value);
      break;
    case 5:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setRightDependencyId(value);
      break;
    case 6:
      var value = new proto.Operation.Point;
      reader.readMessage(value,proto.Operation.Point.deserializeBinaryFromReader);
      msg.setOffsetInRightDependency(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.Splice.Insertion.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Splice.Insertion.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Splice.Insertion} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Splice.Insertion.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getText();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getLeftDependencyId();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getOffsetInLeftDependency();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.Operation.Point.serializeBinaryToWriter
    );
  }
  f = message.getRightDependencyId();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getOffsetInRightDependency();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.Operation.Point.serializeBinaryToWriter
    );
  }
};


/**
 * optional string text = 2;
 * @return {string}
 */
proto.Operation.Splice.Insertion.prototype.getText = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/** @param {string} value */
proto.Operation.Splice.Insertion.prototype.setText = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional SpliceId left_dependency_id = 3;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.Splice.Insertion.prototype.getLeftDependencyId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 3));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.Splice.Insertion.prototype.setLeftDependencyId = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.Operation.Splice.Insertion.prototype.clearLeftDependencyId = function() {
  this.setLeftDependencyId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Insertion.prototype.hasLeftDependencyId = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional Point offset_in_left_dependency = 4;
 * @return {?proto.Operation.Point}
 */
proto.Operation.Splice.Insertion.prototype.getOffsetInLeftDependency = function() {
  return /** @type{?proto.Operation.Point} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Point, 4));
};


/** @param {?proto.Operation.Point|undefined} value */
proto.Operation.Splice.Insertion.prototype.setOffsetInLeftDependency = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.Operation.Splice.Insertion.prototype.clearOffsetInLeftDependency = function() {
  this.setOffsetInLeftDependency(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Insertion.prototype.hasOffsetInLeftDependency = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional SpliceId right_dependency_id = 5;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.Splice.Insertion.prototype.getRightDependencyId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 5));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.Splice.Insertion.prototype.setRightDependencyId = function(value) {
  jspb.Message.setWrapperField(this, 5, value);
};


proto.Operation.Splice.Insertion.prototype.clearRightDependencyId = function() {
  this.setRightDependencyId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Insertion.prototype.hasRightDependencyId = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional Point offset_in_right_dependency = 6;
 * @return {?proto.Operation.Point}
 */
proto.Operation.Splice.Insertion.prototype.getOffsetInRightDependency = function() {
  return /** @type{?proto.Operation.Point} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Point, 6));
};


/** @param {?proto.Operation.Point|undefined} value */
proto.Operation.Splice.Insertion.prototype.setOffsetInRightDependency = function(value) {
  jspb.Message.setWrapperField(this, 6, value);
};


proto.Operation.Splice.Insertion.prototype.clearOffsetInRightDependency = function() {
  this.setOffsetInRightDependency(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Insertion.prototype.hasOffsetInRightDependency = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.Splice.Deletion = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.Splice.Deletion, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.Splice.Deletion.displayName = 'proto.Operation.Splice.Deletion';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.Splice.Deletion.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.Splice.Deletion.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.Splice.Deletion} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Splice.Deletion.toObject = function(includeInstance, msg) {
  var f, obj = {
    leftDependencyId: (f = msg.getLeftDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    offsetInLeftDependency: (f = msg.getOffsetInLeftDependency()) && proto.Operation.Point.toObject(includeInstance, f),
    rightDependencyId: (f = msg.getRightDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    offsetInRightDependency: (f = msg.getOffsetInRightDependency()) && proto.Operation.Point.toObject(includeInstance, f),
    maxSeqsBySiteMap: (f = msg.getMaxSeqsBySiteMap()) ? f.toObject(includeInstance, undefined) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Splice.Deletion}
 */
proto.Operation.Splice.Deletion.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Splice.Deletion;
  return proto.Operation.Splice.Deletion.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Splice.Deletion} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Splice.Deletion}
 */
proto.Operation.Splice.Deletion.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 2:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setLeftDependencyId(value);
      break;
    case 3:
      var value = new proto.Operation.Point;
      reader.readMessage(value,proto.Operation.Point.deserializeBinaryFromReader);
      msg.setOffsetInLeftDependency(value);
      break;
    case 4:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setRightDependencyId(value);
      break;
    case 5:
      var value = new proto.Operation.Point;
      reader.readMessage(value,proto.Operation.Point.deserializeBinaryFromReader);
      msg.setOffsetInRightDependency(value);
      break;
    case 6:
      var value = msg.getMaxSeqsBySiteMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readUint32);
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.Splice.Deletion.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Splice.Deletion.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Splice.Deletion} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Splice.Deletion.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLeftDependencyId();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getOffsetInLeftDependency();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.Operation.Point.serializeBinaryToWriter
    );
  }
  f = message.getRightDependencyId();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getOffsetInRightDependency();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.Operation.Point.serializeBinaryToWriter
    );
  }
  f = message.getMaxSeqsBySiteMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(6, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeUint32);
  }
};


/**
 * optional SpliceId left_dependency_id = 2;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.Splice.Deletion.prototype.getLeftDependencyId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 2));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.Splice.Deletion.prototype.setLeftDependencyId = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.Operation.Splice.Deletion.prototype.clearLeftDependencyId = function() {
  this.setLeftDependencyId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Deletion.prototype.hasLeftDependencyId = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Point offset_in_left_dependency = 3;
 * @return {?proto.Operation.Point}
 */
proto.Operation.Splice.Deletion.prototype.getOffsetInLeftDependency = function() {
  return /** @type{?proto.Operation.Point} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Point, 3));
};


/** @param {?proto.Operation.Point|undefined} value */
proto.Operation.Splice.Deletion.prototype.setOffsetInLeftDependency = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.Operation.Splice.Deletion.prototype.clearOffsetInLeftDependency = function() {
  this.setOffsetInLeftDependency(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Deletion.prototype.hasOffsetInLeftDependency = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional SpliceId right_dependency_id = 4;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.Splice.Deletion.prototype.getRightDependencyId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 4));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.Splice.Deletion.prototype.setRightDependencyId = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.Operation.Splice.Deletion.prototype.clearRightDependencyId = function() {
  this.setRightDependencyId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Deletion.prototype.hasRightDependencyId = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional Point offset_in_right_dependency = 5;
 * @return {?proto.Operation.Point}
 */
proto.Operation.Splice.Deletion.prototype.getOffsetInRightDependency = function() {
  return /** @type{?proto.Operation.Point} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Point, 5));
};


/** @param {?proto.Operation.Point|undefined} value */
proto.Operation.Splice.Deletion.prototype.setOffsetInRightDependency = function(value) {
  jspb.Message.setWrapperField(this, 5, value);
};


proto.Operation.Splice.Deletion.prototype.clearOffsetInRightDependency = function() {
  this.setOffsetInRightDependency(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.Deletion.prototype.hasOffsetInRightDependency = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * map<uint32, uint32> max_seqs_by_site = 6;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,number>}
 */
proto.Operation.Splice.Deletion.prototype.getMaxSeqsBySiteMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,number>} */ (
      jspb.Message.getMapField(this, 6, opt_noLazyCreate,
      null));
};


proto.Operation.Splice.Deletion.prototype.clearMaxSeqsBySiteMap = function() {
  this.getMaxSeqsBySiteMap().clear();
};


/**
 * optional SpliceId splice_id = 1;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.Splice.prototype.getSpliceId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 1));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.Splice.prototype.setSpliceId = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.Operation.Splice.prototype.clearSpliceId = function() {
  this.setSpliceId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.prototype.hasSpliceId = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Insertion insertion = 2;
 * @return {?proto.Operation.Splice.Insertion}
 */
proto.Operation.Splice.prototype.getInsertion = function() {
  return /** @type{?proto.Operation.Splice.Insertion} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Splice.Insertion, 2));
};


/** @param {?proto.Operation.Splice.Insertion|undefined} value */
proto.Operation.Splice.prototype.setInsertion = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.Operation.Splice.prototype.clearInsertion = function() {
  this.setInsertion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.prototype.hasInsertion = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional Deletion deletion = 3;
 * @return {?proto.Operation.Splice.Deletion}
 */
proto.Operation.Splice.prototype.getDeletion = function() {
  return /** @type{?proto.Operation.Splice.Deletion} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Splice.Deletion, 3));
};


/** @param {?proto.Operation.Splice.Deletion|undefined} value */
proto.Operation.Splice.prototype.setDeletion = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.Operation.Splice.prototype.clearDeletion = function() {
  this.setDeletion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Splice.prototype.hasDeletion = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.Undo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.Undo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.Undo.displayName = 'proto.Operation.Undo';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.Undo.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.Undo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.Undo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Undo.toObject = function(includeInstance, msg) {
  var f, obj = {
    spliceId: (f = msg.getSpliceId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    undoCount: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Undo}
 */
proto.Operation.Undo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Undo;
  return proto.Operation.Undo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Undo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Undo}
 */
proto.Operation.Undo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setSpliceId(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setUndoCount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.Undo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Undo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Undo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Undo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSpliceId();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getUndoCount();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * optional SpliceId splice_id = 1;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.Undo.prototype.getSpliceId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 1));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.Undo.prototype.setSpliceId = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.Operation.Undo.prototype.clearSpliceId = function() {
  this.setSpliceId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.Undo.prototype.hasSpliceId = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional uint32 undo_count = 2;
 * @return {number}
 */
proto.Operation.Undo.prototype.getUndoCount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.Operation.Undo.prototype.setUndoCount = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.MarkersUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.MarkersUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.displayName = 'proto.Operation.MarkersUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.MarkersUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.MarkersUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.MarkersUpdate} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    siteId: jspb.Message.getFieldWithDefault(msg, 1, 0),
    layerOperationsMap: (f = msg.getLayerOperationsMap()) ? f.toObject(includeInstance, proto.Operation.MarkersUpdate.LayerOperation.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate}
 */
proto.Operation.MarkersUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate;
  return proto.Operation.MarkersUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate}
 */
proto.Operation.MarkersUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSiteId(value);
      break;
    case 2:
      var value = msg.getLayerOperationsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.Operation.MarkersUpdate.LayerOperation.deserializeBinaryFromReader);
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.MarkersUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSiteId();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getLayerOperationsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.Operation.MarkersUpdate.LayerOperation.serializeBinaryToWriter);
  }
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.MarkersUpdate.LayerOperation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.MarkersUpdate.LayerOperation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.LayerOperation.displayName = 'proto.Operation.MarkersUpdate.LayerOperation';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.MarkersUpdate.LayerOperation.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.MarkersUpdate.LayerOperation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.MarkersUpdate.LayerOperation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.LayerOperation.toObject = function(includeInstance, msg) {
  var f, obj = {
    isDeletion: jspb.Message.getFieldWithDefault(msg, 1, false),
    markerOperationsMap: (f = msg.getMarkerOperationsMap()) ? f.toObject(includeInstance, proto.Operation.MarkersUpdate.MarkerOperation.toObject) : []
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.LayerOperation}
 */
proto.Operation.MarkersUpdate.LayerOperation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.LayerOperation;
  return proto.Operation.MarkersUpdate.LayerOperation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.LayerOperation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.LayerOperation}
 */
proto.Operation.MarkersUpdate.LayerOperation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsDeletion(value);
      break;
    case 2:
      var value = msg.getMarkerOperationsMap();
      reader.readMessage(value, function(message, reader) {
        jspb.Map.deserializeBinary(message, reader, jspb.BinaryReader.prototype.readUint32, jspb.BinaryReader.prototype.readMessage, proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinaryFromReader);
         });
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.MarkersUpdate.LayerOperation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.LayerOperation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.LayerOperation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.LayerOperation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIsDeletion();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMarkerOperationsMap(true);
  if (f && f.getLength() > 0) {
    f.serializeBinary(2, writer, jspb.BinaryWriter.prototype.writeUint32, jspb.BinaryWriter.prototype.writeMessage, proto.Operation.MarkersUpdate.MarkerOperation.serializeBinaryToWriter);
  }
};


/**
 * optional bool is_deletion = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.Operation.MarkersUpdate.LayerOperation.prototype.getIsDeletion = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.Operation.MarkersUpdate.LayerOperation.prototype.setIsDeletion = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * map<uint32, MarkerOperation> marker_operations = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.Operation.MarkersUpdate.MarkerOperation>}
 */
proto.Operation.MarkersUpdate.LayerOperation.prototype.getMarkerOperationsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,!proto.Operation.MarkersUpdate.MarkerOperation>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.Operation.MarkersUpdate.MarkerOperation));
};


proto.Operation.MarkersUpdate.LayerOperation.prototype.clearMarkerOperationsMap = function() {
  this.getMarkerOperationsMap().clear();
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.MarkersUpdate.MarkerOperation = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.MarkersUpdate.MarkerOperation, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.MarkerOperation.displayName = 'proto.Operation.MarkersUpdate.MarkerOperation';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.MarkersUpdate.MarkerOperation.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.MarkersUpdate.MarkerOperation.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.MarkersUpdate.MarkerOperation} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.MarkerOperation.toObject = function(includeInstance, msg) {
  var f, obj = {
    isDeletion: jspb.Message.getFieldWithDefault(msg, 1, false),
    markerUpdate: (f = msg.getMarkerUpdate()) && proto.Operation.MarkersUpdate.MarkerUpdate.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.MarkerOperation}
 */
proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.MarkerOperation;
  return proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.MarkerOperation} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.MarkerOperation}
 */
proto.Operation.MarkersUpdate.MarkerOperation.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsDeletion(value);
      break;
    case 2:
      var value = new proto.Operation.MarkersUpdate.MarkerUpdate;
      reader.readMessage(value,proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinaryFromReader);
      msg.setMarkerUpdate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.MarkersUpdate.MarkerOperation.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.MarkerOperation.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.MarkerOperation} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.MarkerOperation.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getIsDeletion();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getMarkerUpdate();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.Operation.MarkersUpdate.MarkerUpdate.serializeBinaryToWriter
    );
  }
};


/**
 * optional bool is_deletion = 1;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.Operation.MarkersUpdate.MarkerOperation.prototype.getIsDeletion = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 1, false));
};


/** @param {boolean} value */
proto.Operation.MarkersUpdate.MarkerOperation.prototype.setIsDeletion = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional MarkerUpdate marker_update = 2;
 * @return {?proto.Operation.MarkersUpdate.MarkerUpdate}
 */
proto.Operation.MarkersUpdate.MarkerOperation.prototype.getMarkerUpdate = function() {
  return /** @type{?proto.Operation.MarkersUpdate.MarkerUpdate} */ (
    jspb.Message.getWrapperField(this, proto.Operation.MarkersUpdate.MarkerUpdate, 2));
};


/** @param {?proto.Operation.MarkersUpdate.MarkerUpdate|undefined} value */
proto.Operation.MarkersUpdate.MarkerOperation.prototype.setMarkerUpdate = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.Operation.MarkersUpdate.MarkerOperation.prototype.clearMarkerUpdate = function() {
  this.setMarkerUpdate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.MarkersUpdate.MarkerOperation.prototype.hasMarkerUpdate = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.MarkersUpdate.MarkerUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.MarkersUpdate.MarkerUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.MarkerUpdate.displayName = 'proto.Operation.MarkersUpdate.MarkerUpdate';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.MarkersUpdate.MarkerUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.MarkersUpdate.MarkerUpdate} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.MarkerUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    range: (f = msg.getRange()) && proto.Operation.MarkersUpdate.LogicalRange.toObject(includeInstance, f),
    exclusive: jspb.Message.getFieldWithDefault(msg, 2, false),
    reversed: jspb.Message.getFieldWithDefault(msg, 3, false),
    tailed: jspb.Message.getFieldWithDefault(msg, 4, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.MarkerUpdate}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.MarkerUpdate;
  return proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.MarkerUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.MarkerUpdate}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Operation.MarkersUpdate.LogicalRange;
      reader.readMessage(value,proto.Operation.MarkersUpdate.LogicalRange.deserializeBinaryFromReader);
      msg.setRange(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setExclusive(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setReversed(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setTailed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.MarkerUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.MarkerUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.MarkerUpdate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRange();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Operation.MarkersUpdate.LogicalRange.serializeBinaryToWriter
    );
  }
  f = message.getExclusive();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = message.getReversed();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getTailed();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
};


/**
 * optional LogicalRange range = 1;
 * @return {?proto.Operation.MarkersUpdate.LogicalRange}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getRange = function() {
  return /** @type{?proto.Operation.MarkersUpdate.LogicalRange} */ (
    jspb.Message.getWrapperField(this, proto.Operation.MarkersUpdate.LogicalRange, 1));
};


/** @param {?proto.Operation.MarkersUpdate.LogicalRange|undefined} value */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setRange = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.Operation.MarkersUpdate.MarkerUpdate.prototype.clearRange = function() {
  this.setRange(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.hasRange = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional bool exclusive = 2;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getExclusive = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 2, false));
};


/** @param {boolean} value */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setExclusive = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional bool reversed = 3;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getReversed = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 3, false));
};


/** @param {boolean} value */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setReversed = function(value) {
  jspb.Message.setField(this, 3, value);
};


/**
 * optional bool tailed = 4;
 * Note that Boolean fields may be set to 0/1 when serialized from a Java server.
 * You should avoid comparisons like {@code val === true/false} in those cases.
 * @return {boolean}
 */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.getTailed = function() {
  return /** @type {boolean} */ (jspb.Message.getFieldWithDefault(this, 4, false));
};


/** @param {boolean} value */
proto.Operation.MarkersUpdate.MarkerUpdate.prototype.setTailed = function(value) {
  jspb.Message.setField(this, 4, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.MarkersUpdate.LogicalRange = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.MarkersUpdate.LogicalRange, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.MarkersUpdate.LogicalRange.displayName = 'proto.Operation.MarkersUpdate.LogicalRange';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.MarkersUpdate.LogicalRange.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.MarkersUpdate.LogicalRange} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.LogicalRange.toObject = function(includeInstance, msg) {
  var f, obj = {
    startDependencyId: (f = msg.getStartDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    offsetInStartDependency: (f = msg.getOffsetInStartDependency()) && proto.Operation.Point.toObject(includeInstance, f),
    endDependencyId: (f = msg.getEndDependencyId()) && proto.Operation.SpliceId.toObject(includeInstance, f),
    offsetInEndDependency: (f = msg.getOffsetInEndDependency()) && proto.Operation.Point.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.MarkersUpdate.LogicalRange}
 */
proto.Operation.MarkersUpdate.LogicalRange.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.MarkersUpdate.LogicalRange;
  return proto.Operation.MarkersUpdate.LogicalRange.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.MarkersUpdate.LogicalRange} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.MarkersUpdate.LogicalRange}
 */
proto.Operation.MarkersUpdate.LogicalRange.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setStartDependencyId(value);
      break;
    case 2:
      var value = new proto.Operation.Point;
      reader.readMessage(value,proto.Operation.Point.deserializeBinaryFromReader);
      msg.setOffsetInStartDependency(value);
      break;
    case 3:
      var value = new proto.Operation.SpliceId;
      reader.readMessage(value,proto.Operation.SpliceId.deserializeBinaryFromReader);
      msg.setEndDependencyId(value);
      break;
    case 4:
      var value = new proto.Operation.Point;
      reader.readMessage(value,proto.Operation.Point.deserializeBinaryFromReader);
      msg.setOffsetInEndDependency(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.MarkersUpdate.LogicalRange.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.MarkersUpdate.LogicalRange} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.MarkersUpdate.LogicalRange.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStartDependencyId();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getOffsetInStartDependency();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.Operation.Point.serializeBinaryToWriter
    );
  }
  f = message.getEndDependencyId();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.Operation.SpliceId.serializeBinaryToWriter
    );
  }
  f = message.getOffsetInEndDependency();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.Operation.Point.serializeBinaryToWriter
    );
  }
};


/**
 * optional SpliceId start_dependency_id = 1;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.getStartDependencyId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 1));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.MarkersUpdate.LogicalRange.prototype.setStartDependencyId = function(value) {
  jspb.Message.setWrapperField(this, 1, value);
};


proto.Operation.MarkersUpdate.LogicalRange.prototype.clearStartDependencyId = function() {
  this.setStartDependencyId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.hasStartDependencyId = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Point offset_in_start_dependency = 2;
 * @return {?proto.Operation.Point}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.getOffsetInStartDependency = function() {
  return /** @type{?proto.Operation.Point} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Point, 2));
};


/** @param {?proto.Operation.Point|undefined} value */
proto.Operation.MarkersUpdate.LogicalRange.prototype.setOffsetInStartDependency = function(value) {
  jspb.Message.setWrapperField(this, 2, value);
};


proto.Operation.MarkersUpdate.LogicalRange.prototype.clearOffsetInStartDependency = function() {
  this.setOffsetInStartDependency(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.hasOffsetInStartDependency = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional SpliceId end_dependency_id = 3;
 * @return {?proto.Operation.SpliceId}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.getEndDependencyId = function() {
  return /** @type{?proto.Operation.SpliceId} */ (
    jspb.Message.getWrapperField(this, proto.Operation.SpliceId, 3));
};


/** @param {?proto.Operation.SpliceId|undefined} value */
proto.Operation.MarkersUpdate.LogicalRange.prototype.setEndDependencyId = function(value) {
  jspb.Message.setWrapperField(this, 3, value);
};


proto.Operation.MarkersUpdate.LogicalRange.prototype.clearEndDependencyId = function() {
  this.setEndDependencyId(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.hasEndDependencyId = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional Point offset_in_end_dependency = 4;
 * @return {?proto.Operation.Point}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.getOffsetInEndDependency = function() {
  return /** @type{?proto.Operation.Point} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Point, 4));
};


/** @param {?proto.Operation.Point|undefined} value */
proto.Operation.MarkersUpdate.LogicalRange.prototype.setOffsetInEndDependency = function(value) {
  jspb.Message.setWrapperField(this, 4, value);
};


proto.Operation.MarkersUpdate.LogicalRange.prototype.clearOffsetInEndDependency = function() {
  this.setOffsetInEndDependency(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.MarkersUpdate.LogicalRange.prototype.hasOffsetInEndDependency = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional uint32 site_id = 1;
 * @return {number}
 */
proto.Operation.MarkersUpdate.prototype.getSiteId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.Operation.MarkersUpdate.prototype.setSiteId = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * map<uint32, LayerOperation> layer_operations = 2;
 * @param {boolean=} opt_noLazyCreate Do not create the map if
 * empty, instead returning `undefined`
 * @return {!jspb.Map<number,!proto.Operation.MarkersUpdate.LayerOperation>}
 */
proto.Operation.MarkersUpdate.prototype.getLayerOperationsMap = function(opt_noLazyCreate) {
  return /** @type {!jspb.Map<number,!proto.Operation.MarkersUpdate.LayerOperation>} */ (
      jspb.Message.getMapField(this, 2, opt_noLazyCreate,
      proto.Operation.MarkersUpdate.LayerOperation));
};


proto.Operation.MarkersUpdate.prototype.clearLayerOperationsMap = function() {
  this.getLayerOperationsMap().clear();
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.SpliceId = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.SpliceId, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.SpliceId.displayName = 'proto.Operation.SpliceId';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.SpliceId.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.SpliceId.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.SpliceId} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.SpliceId.toObject = function(includeInstance, msg) {
  var f, obj = {
    site: jspb.Message.getFieldWithDefault(msg, 1, 0),
    seq: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.SpliceId}
 */
proto.Operation.SpliceId.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.SpliceId;
  return proto.Operation.SpliceId.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.SpliceId} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.SpliceId}
 */
proto.Operation.SpliceId.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSite(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSeq(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.SpliceId.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.SpliceId.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.SpliceId} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.SpliceId.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSite();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getSeq();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * optional uint32 site = 1;
 * @return {number}
 */
proto.Operation.SpliceId.prototype.getSite = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.Operation.SpliceId.prototype.setSite = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint32 seq = 2;
 * @return {number}
 */
proto.Operation.SpliceId.prototype.getSeq = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.Operation.SpliceId.prototype.setSeq = function(value) {
  jspb.Message.setField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.Operation.Point = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Operation.Point, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.Operation.Point.displayName = 'proto.Operation.Point';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.Operation.Point.prototype.toObject = function(opt_includeInstance) {
  return proto.Operation.Point.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.Operation.Point} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Point.toObject = function(includeInstance, msg) {
  var f, obj = {
    row: jspb.Message.getFieldWithDefault(msg, 1, 0),
    column: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.Operation.Point}
 */
proto.Operation.Point.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Operation.Point;
  return proto.Operation.Point.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.Operation.Point} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.Operation.Point}
 */
proto.Operation.Point.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setRow(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setColumn(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.Operation.Point.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Operation.Point.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.Operation.Point} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.Operation.Point.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRow();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getColumn();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * optional uint32 row = 1;
 * @return {number}
 */
proto.Operation.Point.prototype.getRow = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.Operation.Point.prototype.setRow = function(value) {
  jspb.Message.setField(this, 1, value);
};


/**
 * optional uint32 column = 2;
 * @return {number}
 */
proto.Operation.Point.prototype.getColumn = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.Operation.Point.prototype.setColumn = function(value) {
  jspb.Message.setField(this, 2, value);
};


/**
 * optional Splice splice = 1;
 * @return {?proto.Operation.Splice}
 */
proto.Operation.prototype.getSplice = function() {
  return /** @type{?proto.Operation.Splice} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Splice, 1));
};


/** @param {?proto.Operation.Splice|undefined} value */
proto.Operation.prototype.setSplice = function(value) {
  jspb.Message.setOneofWrapperField(this, 1, proto.Operation.oneofGroups_[0], value);
};


proto.Operation.prototype.clearSplice = function() {
  this.setSplice(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.prototype.hasSplice = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional Undo undo = 2;
 * @return {?proto.Operation.Undo}
 */
proto.Operation.prototype.getUndo = function() {
  return /** @type{?proto.Operation.Undo} */ (
    jspb.Message.getWrapperField(this, proto.Operation.Undo, 2));
};


/** @param {?proto.Operation.Undo|undefined} value */
proto.Operation.prototype.setUndo = function(value) {
  jspb.Message.setOneofWrapperField(this, 2, proto.Operation.oneofGroups_[0], value);
};


proto.Operation.prototype.clearUndo = function() {
  this.setUndo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.prototype.hasUndo = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional MarkersUpdate markers_update = 3;
 * @return {?proto.Operation.MarkersUpdate}
 */
proto.Operation.prototype.getMarkersUpdate = function() {
  return /** @type{?proto.Operation.MarkersUpdate} */ (
    jspb.Message.getWrapperField(this, proto.Operation.MarkersUpdate, 3));
};


/** @param {?proto.Operation.MarkersUpdate|undefined} value */
proto.Operation.prototype.setMarkersUpdate = function(value) {
  jspb.Message.setOneofWrapperField(this, 3, proto.Operation.oneofGroups_[0], value);
};


proto.Operation.prototype.clearMarkersUpdate = function() {
  this.setMarkersUpdate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.Operation.prototype.hasMarkersUpdate = function() {
  return jspb.Message.getField(this, 3) != null;
};


goog.object.extend(exports, proto);


/***/ }),
/* 55 */
/***/ (function(module, exports) {

var $jscomp={scope:{},getGlobal:function(a){return"undefined"!=typeof window&&window===a?a:"undefined"!=typeof global?global:a}};$jscomp.global=$jscomp.getGlobal(this);$jscomp.initSymbol=function(){$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol);$jscomp.initSymbol=function(){}};$jscomp.symbolCounter_=0;$jscomp.Symbol=function(a){return"jscomp_symbol_"+a+$jscomp.symbolCounter_++};
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();$jscomp.global.Symbol.iterator||($jscomp.global.Symbol.iterator=$jscomp.global.Symbol("iterator"));$jscomp.initSymbolIterator=function(){}};$jscomp.makeIterator=function(a){$jscomp.initSymbolIterator();$jscomp.initSymbol();$jscomp.initSymbolIterator();var b=a[Symbol.iterator];if(b)return b.call(a);var c=0;return{next:function(){return c<a.length?{done:!1,value:a[c++]}:{done:!0}}}};
$jscomp.arrayFromIterator=function(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c};$jscomp.arrayFromIterable=function(a){return a instanceof Array?a:$jscomp.arrayFromIterator($jscomp.makeIterator(a))};$jscomp.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.prototype=new c;a.prototype.constructor=a;for(var d in b)if(Object.defineProperties){var e=Object.getOwnPropertyDescriptor(b,d);e&&Object.defineProperty(a,d,e)}else a[d]=b[d]};$jscomp.array=$jscomp.array||{};
$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};$jscomp.initSymbol();$jscomp.initSymbolIterator();d[Symbol.iterator]=function(){return d};return d};
$jscomp.findInternal=function(a,b,c){a instanceof String&&(a=String(a));for(var d=a.length,e=0;e<d;e++){var f=a[e];if(b.call(c,f,e,a))return{i:e,v:f}}return{i:-1,v:void 0}};
$jscomp.array.from=function(a,b,c){$jscomp.initSymbolIterator();b=null!=b?b:function(a){return a};var d=[];$jscomp.initSymbol();$jscomp.initSymbolIterator();var e=a[Symbol.iterator];"function"==typeof e&&(a=e.call(a));if("function"==typeof a.next)for(;!(e=a.next()).done;)d.push(b.call(c,e.value));else for(var e=a.length,f=0;f<e;f++)d.push(b.call(c,a[f]));return d};$jscomp.array.of=function(a){return $jscomp.array.from(arguments)};
$jscomp.array.entries=function(){return $jscomp.iteratorFromArray(this,function(a,b){return[a,b]})};$jscomp.array.installHelper_=function(a,b){!Array.prototype[a]&&Object.defineProperties&&Object.defineProperty&&Object.defineProperty(Array.prototype,a,{configurable:!0,enumerable:!1,writable:!0,value:b})};$jscomp.array.entries$install=function(){$jscomp.array.installHelper_("entries",$jscomp.array.entries)};$jscomp.array.keys=function(){return $jscomp.iteratorFromArray(this,function(a){return a})};
$jscomp.array.keys$install=function(){$jscomp.array.installHelper_("keys",$jscomp.array.keys)};$jscomp.array.values=function(){return $jscomp.iteratorFromArray(this,function(a,b){return b})};$jscomp.array.values$install=function(){$jscomp.array.installHelper_("values",$jscomp.array.values)};
$jscomp.array.copyWithin=function(a,b,c){var d=this.length;a=Number(a);b=Number(b);c=Number(null!=c?c:d);if(a<b)for(c=Math.min(c,d);b<c;)b in this?this[a++]=this[b++]:(delete this[a++],b++);else for(c=Math.min(c,d+b-a),a+=c-b;c>b;)--c in this?this[--a]=this[c]:delete this[a];return this};$jscomp.array.copyWithin$install=function(){$jscomp.array.installHelper_("copyWithin",$jscomp.array.copyWithin)};
$jscomp.array.fill=function(a,b,c){var d=this.length||0;0>b&&(b=Math.max(0,d+b));if(null==c||c>d)c=d;c=Number(c);0>c&&(c=Math.max(0,d+c));for(b=Number(b||0);b<c;b++)this[b]=a;return this};$jscomp.array.fill$install=function(){$jscomp.array.installHelper_("fill",$jscomp.array.fill)};$jscomp.array.find=function(a,b){return $jscomp.findInternal(this,a,b).v};$jscomp.array.find$install=function(){$jscomp.array.installHelper_("find",$jscomp.array.find)};
$jscomp.array.findIndex=function(a,b){return $jscomp.findInternal(this,a,b).i};$jscomp.array.findIndex$install=function(){$jscomp.array.installHelper_("findIndex",$jscomp.array.findIndex)};$jscomp.ASSUME_NO_NATIVE_MAP=!1;
$jscomp.Map$isConformant=function(){if($jscomp.ASSUME_NO_NATIVE_MAP)return!1;var a=$jscomp.global.Map;if(!a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var b=Object.seal({x:4}),c=new a($jscomp.makeIterator([[b,"s"]]));if("s"!=c.get(b)||1!=c.size||c.get({x:4})||c.set({x:4},"t")!=c||2!=c.size)return!1;var d=c.entries(),e=d.next();if(e.done||e.value[0]!=b||"s"!=e.value[1])return!1;e=d.next();return e.done||4!=e.value[0].x||"t"!=e.value[1]||!d.next().done?!1:!0}catch(f){return!1}};
$jscomp.Map=function(a){this.data_={};this.head_=$jscomp.Map.createHead();this.size=0;if(a){a=$jscomp.makeIterator(a);for(var b;!(b=a.next()).done;)b=b.value,this.set(b[0],b[1])}};
$jscomp.Map.prototype.set=function(a,b){var c=$jscomp.Map.maybeGetEntry(this,a);c.list||(c.list=this.data_[c.id]=[]);c.entry?c.entry.value=b:(c.entry={next:this.head_,previous:this.head_.previous,head:this.head_,key:a,value:b},c.list.push(c.entry),this.head_.previous.next=c.entry,this.head_.previous=c.entry,this.size++);return this};
$jscomp.Map.prototype["delete"]=function(a){a=$jscomp.Map.maybeGetEntry(this,a);return a.entry&&a.list?(a.list.splice(a.index,1),a.list.length||delete this.data_[a.id],a.entry.previous.next=a.entry.next,a.entry.next.previous=a.entry.previous,a.entry.head=null,this.size--,!0):!1};$jscomp.Map.prototype.clear=function(){this.data_={};this.head_=this.head_.previous=$jscomp.Map.createHead();this.size=0};$jscomp.Map.prototype.has=function(a){return!!$jscomp.Map.maybeGetEntry(this,a).entry};
$jscomp.Map.prototype.get=function(a){return(a=$jscomp.Map.maybeGetEntry(this,a).entry)&&a.value};$jscomp.Map.prototype.entries=function(){return $jscomp.Map.makeIterator_(this,function(a){return[a.key,a.value]})};$jscomp.Map.prototype.keys=function(){return $jscomp.Map.makeIterator_(this,function(a){return a.key})};$jscomp.Map.prototype.values=function(){return $jscomp.Map.makeIterator_(this,function(a){return a.value})};
$jscomp.Map.prototype.forEach=function(a,b){for(var c=this.entries(),d;!(d=c.next()).done;)d=d.value,a.call(b,d[1],d[0],this)};$jscomp.Map.maybeGetEntry=function(a,b){var c=$jscomp.Map.getId(b),d=a.data_[c];if(d&&Object.prototype.hasOwnProperty.call(a.data_,c))for(var e=0;e<d.length;e++){var f=d[e];if(b!==b&&f.key!==f.key||b===f.key)return{id:c,list:d,index:e,entry:f}}return{id:c,list:d,index:-1,entry:void 0}};
$jscomp.Map.makeIterator_=function(a,b){var c=a.head_,d={next:function(){if(c){for(;c.head!=a.head_;)c=c.previous;for(;c.next!=c.head;)return c=c.next,{done:!1,value:b(c)};c=null}return{done:!0,value:void 0}}};$jscomp.initSymbol();$jscomp.initSymbolIterator();d[Symbol.iterator]=function(){return d};return d};$jscomp.Map.mapIndex_=0;$jscomp.Map.createHead=function(){var a={};return a.previous=a.next=a.head=a};
$jscomp.Map.getId=function(a){if(!(a instanceof Object))return"p_"+a;if(!($jscomp.Map.idKey in a))try{$jscomp.Map.defineProperty(a,$jscomp.Map.idKey,{value:++$jscomp.Map.mapIndex_})}catch(b){}return $jscomp.Map.idKey in a?a[$jscomp.Map.idKey]:"o_ "+a};$jscomp.Map.defineProperty=Object.defineProperty?function(a,b,c){Object.defineProperty(a,b,{value:String(c)})}:function(a,b,c){a[b]=String(c)};$jscomp.Map.Entry=function(){};
$jscomp.Map$install=function(){$jscomp.initSymbol();$jscomp.initSymbolIterator();$jscomp.Map$isConformant()?$jscomp.Map=$jscomp.global.Map:($jscomp.initSymbol(),$jscomp.initSymbolIterator(),$jscomp.Map.prototype[Symbol.iterator]=$jscomp.Map.prototype.entries,$jscomp.initSymbol(),$jscomp.Map.idKey=Symbol("map-id-key"),$jscomp.Map$install=function(){})};$jscomp.math=$jscomp.math||{};
$jscomp.math.clz32=function(a){a=Number(a)>>>0;if(0===a)return 32;var b=0;0===(a&4294901760)&&(a<<=16,b+=16);0===(a&4278190080)&&(a<<=8,b+=8);0===(a&4026531840)&&(a<<=4,b+=4);0===(a&3221225472)&&(a<<=2,b+=2);0===(a&2147483648)&&b++;return b};$jscomp.math.imul=function(a,b){a=Number(a);b=Number(b);var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};$jscomp.math.sign=function(a){a=Number(a);return 0===a||isNaN(a)?a:0<a?1:-1};
$jscomp.math.log10=function(a){return Math.log(a)/Math.LN10};$jscomp.math.log2=function(a){return Math.log(a)/Math.LN2};$jscomp.math.log1p=function(a){a=Number(a);if(.25>a&&-.25<a){for(var b=a,c=1,d=a,e=0,f=1;e!=d;)b*=a,f*=-1,d=(e=d)+f*b/++c;return d}return Math.log(1+a)};$jscomp.math.expm1=function(a){a=Number(a);if(.25>a&&-.25<a){for(var b=a,c=1,d=a,e=0;e!=d;)b*=a/++c,d=(e=d)+b;return d}return Math.exp(a)-1};$jscomp.math.cosh=function(a){a=Number(a);return(Math.exp(a)+Math.exp(-a))/2};
$jscomp.math.sinh=function(a){a=Number(a);return 0===a?a:(Math.exp(a)-Math.exp(-a))/2};$jscomp.math.tanh=function(a){a=Number(a);if(0===a)return a;var b=Math.exp(-2*Math.abs(a)),b=(1-b)/(1+b);return 0>a?-b:b};$jscomp.math.acosh=function(a){a=Number(a);return Math.log(a+Math.sqrt(a*a-1))};$jscomp.math.asinh=function(a){a=Number(a);if(0===a)return a;var b=Math.log(Math.abs(a)+Math.sqrt(a*a+1));return 0>a?-b:b};
$jscomp.math.atanh=function(a){a=Number(a);return($jscomp.math.log1p(a)-$jscomp.math.log1p(-a))/2};$jscomp.math.hypot=function(a,b,c){a=Number(a);b=Number(b);var d,e,f,g=Math.max(Math.abs(a),Math.abs(b));for(d=2;d<arguments.length;d++)g=Math.max(g,Math.abs(arguments[d]));if(1E100<g||1E-100>g){a/=g;b/=g;f=a*a+b*b;for(d=2;d<arguments.length;d++)e=Number(arguments[d])/g,f+=e*e;return Math.sqrt(f)*g}f=a*a+b*b;for(d=2;d<arguments.length;d++)e=Number(arguments[d]),f+=e*e;return Math.sqrt(f)};
$jscomp.math.trunc=function(a){a=Number(a);if(isNaN(a)||Infinity===a||-Infinity===a||0===a)return a;var b=Math.floor(Math.abs(a));return 0>a?-b:b};$jscomp.math.cbrt=function(a){if(0===a)return a;a=Number(a);var b=Math.pow(Math.abs(a),1/3);return 0>a?-b:b};$jscomp.number=$jscomp.number||{};$jscomp.number.isFinite=function(a){return"number"!==typeof a?!1:!isNaN(a)&&Infinity!==a&&-Infinity!==a};$jscomp.number.isInteger=function(a){return $jscomp.number.isFinite(a)?a===Math.floor(a):!1};
$jscomp.number.isNaN=function(a){return"number"===typeof a&&isNaN(a)};$jscomp.number.isSafeInteger=function(a){return $jscomp.number.isInteger(a)&&Math.abs(a)<=$jscomp.number.MAX_SAFE_INTEGER};$jscomp.number.EPSILON=function(){return Math.pow(2,-52)}();$jscomp.number.MAX_SAFE_INTEGER=function(){return 9007199254740991}();$jscomp.number.MIN_SAFE_INTEGER=function(){return-9007199254740991}();$jscomp.object=$jscomp.object||{};
$jscomp.object.assign=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(d)for(var e in d)Object.prototype.hasOwnProperty.call(d,e)&&(a[e]=d[e])}return a};$jscomp.object.is=function(a,b){return a===b?0!==a||1/a===1/b:a!==a&&b!==b};$jscomp.ASSUME_NO_NATIVE_SET=!1;
$jscomp.Set$isConformant=function(){if($jscomp.ASSUME_NO_NATIVE_SET)return!1;var a=$jscomp.global.Set;if(!a||!a.prototype.entries||"function"!=typeof Object.seal)return!1;try{var b=Object.seal({x:4}),c=new a($jscomp.makeIterator([b]));if(!c.has(b)||1!=c.size||c.add(b)!=c||1!=c.size||c.add({x:4})!=c||2!=c.size)return!1;var d=c.entries(),e=d.next();if(e.done||e.value[0]!=b||e.value[1]!=b)return!1;e=d.next();return e.done||e.value[0]==b||4!=e.value[0].x||e.value[1]!=e.value[0]?!1:d.next().done}catch(f){return!1}};
$jscomp.Set=function(a){this.map_=new $jscomp.Map;if(a){a=$jscomp.makeIterator(a);for(var b;!(b=a.next()).done;)this.add(b.value)}this.size=this.map_.size};$jscomp.Set.prototype.add=function(a){this.map_.set(a,a);this.size=this.map_.size;return this};$jscomp.Set.prototype["delete"]=function(a){a=this.map_["delete"](a);this.size=this.map_.size;return a};$jscomp.Set.prototype.clear=function(){this.map_.clear();this.size=0};$jscomp.Set.prototype.has=function(a){return this.map_.has(a)};
$jscomp.Set.prototype.entries=function(){return this.map_.entries()};$jscomp.Set.prototype.values=function(){return this.map_.values()};$jscomp.Set.prototype.forEach=function(a,b){var c=this;this.map_.forEach(function(d){return a.call(b,d,d,c)})};$jscomp.Set$install=function(){$jscomp.Map$install();$jscomp.Set$isConformant()?$jscomp.Set=$jscomp.global.Set:($jscomp.initSymbol(),$jscomp.initSymbolIterator(),$jscomp.Set.prototype[Symbol.iterator]=$jscomp.Set.prototype.values,$jscomp.Set$install=function(){})};
$jscomp.string=$jscomp.string||{};$jscomp.checkStringArgs=function(a,b,c){if(null==a)throw new TypeError("The 'this' value for String.prototype."+c+" must not be null or undefined");if(b instanceof RegExp)throw new TypeError("First argument to String.prototype."+c+" must not be a regular expression");return a+""};
$jscomp.string.fromCodePoint=function(a){for(var b="",c=0;c<arguments.length;c++){var d=Number(arguments[c]);if(0>d||1114111<d||d!==Math.floor(d))throw new RangeError("invalid_code_point "+d);65535>=d?b+=String.fromCharCode(d):(d-=65536,b+=String.fromCharCode(d>>>10&1023|55296),b+=String.fromCharCode(d&1023|56320))}return b};
$jscomp.string.repeat=function(a){var b=$jscomp.checkStringArgs(this,null,"repeat");if(0>a||1342177279<a)throw new RangeError("Invalid count value");a|=0;for(var c="";a;)if(a&1&&(c+=b),a>>>=1)b+=b;return c};$jscomp.string.repeat$install=function(){String.prototype.repeat||(String.prototype.repeat=$jscomp.string.repeat)};
$jscomp.string.codePointAt=function(a){var b=$jscomp.checkStringArgs(this,null,"codePointAt"),c=b.length;a=Number(a)||0;if(0<=a&&a<c){a|=0;var d=b.charCodeAt(a);if(55296>d||56319<d||a+1===c)return d;a=b.charCodeAt(a+1);return 56320>a||57343<a?d:1024*(d-55296)+a+9216}};$jscomp.string.codePointAt$install=function(){String.prototype.codePointAt||(String.prototype.codePointAt=$jscomp.string.codePointAt)};
$jscomp.string.includes=function(a,b){return-1!==$jscomp.checkStringArgs(this,a,"includes").indexOf(a,b||0)};$jscomp.string.includes$install=function(){String.prototype.includes||(String.prototype.includes=$jscomp.string.includes)};$jscomp.string.startsWith=function(a,b){var c=$jscomp.checkStringArgs(this,a,"startsWith");a+="";for(var d=c.length,e=a.length,f=Math.max(0,Math.min(b|0,c.length)),g=0;g<e&&f<d;)if(c[f++]!=a[g++])return!1;return g>=e};
$jscomp.string.startsWith$install=function(){String.prototype.startsWith||(String.prototype.startsWith=$jscomp.string.startsWith)};$jscomp.string.endsWith=function(a,b){var c=$jscomp.checkStringArgs(this,a,"endsWith");a+="";void 0===b&&(b=c.length);for(var d=Math.max(0,Math.min(b|0,c.length)),e=a.length;0<e&&0<d;)if(c[--d]!=a[--e])return!1;return 0>=e};$jscomp.string.endsWith$install=function(){String.prototype.endsWith||(String.prototype.endsWith=$jscomp.string.endsWith)};
var COMPILED=!0,goog=goog||{};goog.global=this;goog.isDef=function(a){return void 0!==a};goog.exportPath_=function(a,b,c){a=a.split(".");c=c||goog.global;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&goog.isDef(b)?c[d]=b:c=c[d]?c[d]:c[d]={}};
goog.define=function(a,b){var c=b;COMPILED||(goog.global.CLOSURE_UNCOMPILED_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_UNCOMPILED_DEFINES,a)?c=goog.global.CLOSURE_UNCOMPILED_DEFINES[a]:goog.global.CLOSURE_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES,a)&&(c=goog.global.CLOSURE_DEFINES[a]));goog.exportPath_(a,c)};goog.DEBUG=!0;goog.LOCALE="en";goog.TRUSTED_SITE=!0;goog.STRICT_MODE_COMPATIBLE=!1;goog.DISALLOW_TEST_ONLY_CODE=COMPILED&&!goog.DEBUG;
goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING=!1;goog.provide=function(a){if(!COMPILED&&goog.isProvided_(a))throw Error('Namespace "'+a+'" already declared.');goog.constructNamespace_(a)};goog.constructNamespace_=function(a,b){if(!COMPILED){delete goog.implicitNamespaces_[a];for(var c=a;(c=c.substring(0,c.lastIndexOf(".")))&&!goog.getObjectByName(c);)goog.implicitNamespaces_[c]=!0}goog.exportPath_(a,b)};goog.VALID_MODULE_RE_=/^[a-zA-Z_$][a-zA-Z0-9._$]*$/;
goog.module=function(a){if(!goog.isString(a)||!a||-1==a.search(goog.VALID_MODULE_RE_))throw Error("Invalid module identifier");if(!goog.isInModuleLoader_())throw Error("Module "+a+" has been loaded incorrectly.");if(goog.moduleLoaderState_.moduleName)throw Error("goog.module may only be called once per module.");goog.moduleLoaderState_.moduleName=a;if(!COMPILED){if(goog.isProvided_(a))throw Error('Namespace "'+a+'" already declared.');delete goog.implicitNamespaces_[a]}};goog.module.get=function(a){return goog.module.getInternal_(a)};
goog.module.getInternal_=function(a){if(!COMPILED)return goog.isProvided_(a)?a in goog.loadedModules_?goog.loadedModules_[a]:goog.getObjectByName(a):null};goog.moduleLoaderState_=null;goog.isInModuleLoader_=function(){return null!=goog.moduleLoaderState_};
goog.module.declareLegacyNamespace=function(){if(!COMPILED&&!goog.isInModuleLoader_())throw Error("goog.module.declareLegacyNamespace must be called from within a goog.module");if(!COMPILED&&!goog.moduleLoaderState_.moduleName)throw Error("goog.module must be called prior to goog.module.declareLegacyNamespace.");goog.moduleLoaderState_.declareLegacyNamespace=!0};
goog.setTestOnly=function(a){if(goog.DISALLOW_TEST_ONLY_CODE)throw a=a||"",Error("Importing test-only code into non-debug environment"+(a?": "+a:"."));};goog.forwardDeclare=function(a){};COMPILED||(goog.isProvided_=function(a){return a in goog.loadedModules_||!goog.implicitNamespaces_[a]&&goog.isDefAndNotNull(goog.getObjectByName(a))},goog.implicitNamespaces_={"goog.module":!0});
goog.getObjectByName=function(a,b){for(var c=a.split("."),d=b||goog.global,e;e=c.shift();)if(goog.isDefAndNotNull(d[e]))d=d[e];else return null;return d};goog.globalize=function(a,b){var c=b||goog.global,d;for(d in a)c[d]=a[d]};goog.addDependency=function(a,b,c,d){if(goog.DEPENDENCIES_ENABLED){var e;a=a.replace(/\\/g,"/");for(var f=goog.dependencies_,g=0;e=b[g];g++)f.nameToPath[e]=a,f.pathIsModule[a]=!!d;for(d=0;b=c[d];d++)a in f.requires||(f.requires[a]={}),f.requires[a][b]=!0}};
goog.ENABLE_DEBUG_LOADER=!0;goog.logToConsole_=function(a){goog.global.console&&goog.global.console.error(a)};goog.require=function(a){if(!COMPILED){goog.ENABLE_DEBUG_LOADER&&goog.IS_OLD_IE_&&goog.maybeProcessDeferredDep_(a);if(goog.isProvided_(a))return goog.isInModuleLoader_()?goog.module.getInternal_(a):null;if(goog.ENABLE_DEBUG_LOADER){var b=goog.getPathFromDeps_(a);if(b)return goog.writeScripts_(b),null}a="goog.require could not find: "+a;goog.logToConsole_(a);throw Error(a);}};
goog.basePath="";goog.nullFunction=function(){};goog.abstractMethod=function(){throw Error("unimplemented abstract method");};goog.addSingletonGetter=function(a){a.getInstance=function(){if(a.instance_)return a.instance_;goog.DEBUG&&(goog.instantiatedSingletons_[goog.instantiatedSingletons_.length]=a);return a.instance_=new a}};goog.instantiatedSingletons_=[];goog.LOAD_MODULE_USING_EVAL=!0;goog.SEAL_MODULE_EXPORTS=goog.DEBUG;goog.loadedModules_={};goog.DEPENDENCIES_ENABLED=!COMPILED&&goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED&&(goog.dependencies_={pathIsModule:{},nameToPath:{},requires:{},visited:{},written:{},deferred:{}},goog.inHtmlDocument_=function(){var a=goog.global.document;return null!=a&&"write"in a},goog.findBasePath_=function(){if(goog.isDef(goog.global.CLOSURE_BASE_PATH))goog.basePath=goog.global.CLOSURE_BASE_PATH;else if(goog.inHtmlDocument_())for(var a=goog.global.document.getElementsByTagName("SCRIPT"),b=a.length-1;0<=b;--b){var c=a[b].src,d=c.lastIndexOf("?"),d=-1==d?c.length:
d;if("base.js"==c.substr(d-7,7)){goog.basePath=c.substr(0,d-7);break}}},goog.importScript_=function(a,b){(goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_)(a,b)&&(goog.dependencies_.written[a]=!0)},goog.IS_OLD_IE_=!(goog.global.atob||!goog.global.document||!goog.global.document.all),goog.importModule_=function(a){goog.importScript_("",'goog.retrieveAndExecModule_("'+a+'");')&&(goog.dependencies_.written[a]=!0)},goog.queuedModules_=[],goog.wrapModule_=function(a,b){return goog.LOAD_MODULE_USING_EVAL&&
goog.isDef(goog.global.JSON)?"goog.loadModule("+goog.global.JSON.stringify(b+"\n//# sourceURL="+a+"\n")+");":'goog.loadModule(function(exports) {"use strict";'+b+"\n;return exports});\n//# sourceURL="+a+"\n"},goog.loadQueuedModules_=function(){var a=goog.queuedModules_.length;if(0<a){var b=goog.queuedModules_;goog.queuedModules_=[];for(var c=0;c<a;c++)goog.maybeProcessDeferredPath_(b[c])}},goog.maybeProcessDeferredDep_=function(a){goog.isDeferredModule_(a)&&goog.allDepsAreAvailable_(a)&&(a=goog.getPathFromDeps_(a),
goog.maybeProcessDeferredPath_(goog.basePath+a))},goog.isDeferredModule_=function(a){return(a=goog.getPathFromDeps_(a))&&goog.dependencies_.pathIsModule[a]?goog.basePath+a in goog.dependencies_.deferred:!1},goog.allDepsAreAvailable_=function(a){if((a=goog.getPathFromDeps_(a))&&a in goog.dependencies_.requires)for(var b in goog.dependencies_.requires[a])if(!goog.isProvided_(b)&&!goog.isDeferredModule_(b))return!1;return!0},goog.maybeProcessDeferredPath_=function(a){if(a in goog.dependencies_.deferred){var b=
goog.dependencies_.deferred[a];delete goog.dependencies_.deferred[a];goog.globalEval(b)}},goog.loadModuleFromUrl=function(a){goog.retrieveAndExecModule_(a)},goog.loadModule=function(a){var b=goog.moduleLoaderState_;try{goog.moduleLoaderState_={moduleName:void 0,declareLegacyNamespace:!1};var c;if(goog.isFunction(a))c=a.call(goog.global,{});else if(goog.isString(a))c=goog.loadModuleFromSource_.call(goog.global,a);else throw Error("Invalid module definition");var d=goog.moduleLoaderState_.moduleName;
if(!goog.isString(d)||!d)throw Error('Invalid module name "'+d+'"');goog.moduleLoaderState_.declareLegacyNamespace?goog.constructNamespace_(d,c):goog.SEAL_MODULE_EXPORTS&&Object.seal&&Object.seal(c);goog.loadedModules_[d]=c}finally{goog.moduleLoaderState_=b}},goog.loadModuleFromSource_=function(a){eval(a);return{}},goog.writeScriptSrcNode_=function(a){goog.global.document.write('<script type="text/javascript" src="'+a+'">\x3c/script>')},goog.appendScriptSrcNode_=function(a){var b=goog.global.document,
c=b.createElement("script");c.type="text/javascript";c.src=a;c.defer=!1;c.async=!1;b.head.appendChild(c)},goog.writeScriptTag_=function(a,b){if(goog.inHtmlDocument_()){var c=goog.global.document;if(!goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING&&"complete"==c.readyState){if(/\bdeps.js$/.test(a))return!1;throw Error('Cannot write "'+a+'" after document load');}var d=goog.IS_OLD_IE_;void 0===b?d?(d=" onreadystatechange='goog.onScriptLoad_(this, "+ ++goog.lastNonModuleScriptIndex_+")' ",c.write('<script type="text/javascript" src="'+
a+'"'+d+">\x3c/script>")):goog.ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING?goog.appendScriptSrcNode_(a):goog.writeScriptSrcNode_(a):c.write('<script type="text/javascript">'+b+"\x3c/script>");return!0}return!1},goog.lastNonModuleScriptIndex_=0,goog.onScriptLoad_=function(a,b){"complete"==a.readyState&&goog.lastNonModuleScriptIndex_==b&&goog.loadQueuedModules_();return!0},goog.writeScripts_=function(a){function b(a){if(!(a in e.written||a in e.visited)){e.visited[a]=!0;if(a in e.requires)for(var f in e.requires[a])if(!goog.isProvided_(f))if(f in
e.nameToPath)b(e.nameToPath[f]);else throw Error("Undefined nameToPath for "+f);a in d||(d[a]=!0,c.push(a))}}var c=[],d={},e=goog.dependencies_;b(a);for(a=0;a<c.length;a++){var f=c[a];goog.dependencies_.written[f]=!0}var g=goog.moduleLoaderState_;goog.moduleLoaderState_=null;for(a=0;a<c.length;a++)if(f=c[a])e.pathIsModule[f]?goog.importModule_(goog.basePath+f):goog.importScript_(goog.basePath+f);else throw goog.moduleLoaderState_=g,Error("Undefined script input");goog.moduleLoaderState_=g},goog.getPathFromDeps_=
function(a){return a in goog.dependencies_.nameToPath?goog.dependencies_.nameToPath[a]:null},goog.findBasePath_(),goog.global.CLOSURE_NO_DEPS||goog.importScript_(goog.basePath+"deps.js"));goog.normalizePath_=function(a){a=a.split("/");for(var b=0;b<a.length;)"."==a[b]?a.splice(b,1):b&&".."==a[b]&&a[b-1]&&".."!=a[b-1]?a.splice(--b,2):b++;return a.join("/")};
goog.loadFileSync_=function(a){if(goog.global.CLOSURE_LOAD_FILE_SYNC)return goog.global.CLOSURE_LOAD_FILE_SYNC(a);var b=new goog.global.XMLHttpRequest;b.open("get",a,!1);b.send();return b.responseText};
goog.retrieveAndExecModule_=function(a){if(!COMPILED){var b=a;a=goog.normalizePath_(a);var c=goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_,d=goog.loadFileSync_(a);if(null!=d)d=goog.wrapModule_(a,d),goog.IS_OLD_IE_?(goog.dependencies_.deferred[b]=d,goog.queuedModules_.push(b)):c(a,d);else throw Error("load of "+a+"failed");}};
goog.typeOf=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b};goog.isNull=function(a){return null===a};goog.isDefAndNotNull=function(a){return null!=a};goog.isArray=function(a){return"array"==goog.typeOf(a)};goog.isArrayLike=function(a){var b=goog.typeOf(a);return"array"==b||"object"==b&&"number"==typeof a.length};goog.isDateLike=function(a){return goog.isObject(a)&&"function"==typeof a.getFullYear};goog.isString=function(a){return"string"==typeof a};
goog.isBoolean=function(a){return"boolean"==typeof a};goog.isNumber=function(a){return"number"==typeof a};goog.isFunction=function(a){return"function"==goog.typeOf(a)};goog.isObject=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b};goog.getUid=function(a){return a[goog.UID_PROPERTY_]||(a[goog.UID_PROPERTY_]=++goog.uidCounter_)};goog.hasUid=function(a){return!!a[goog.UID_PROPERTY_]};
goog.removeUid=function(a){null!==a&&"removeAttribute"in a&&a.removeAttribute(goog.UID_PROPERTY_);try{delete a[goog.UID_PROPERTY_]}catch(b){}};goog.UID_PROPERTY_="closure_uid_"+(1E9*Math.random()>>>0);goog.uidCounter_=0;goog.getHashCode=goog.getUid;goog.removeHashCode=goog.removeUid;goog.cloneObject=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(a.clone)return a.clone();var b="array"==b?[]:{},c;for(c in a)b[c]=goog.cloneObject(a[c]);return b}return a};
goog.bindNative_=function(a,b,c){return a.call.apply(a.bind,arguments)};goog.bindJs_=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}};
goog.bind=function(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?goog.bind=goog.bindNative_:goog.bind=goog.bindJs_;return goog.bind.apply(null,arguments)};goog.partial=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}};goog.mixin=function(a,b){for(var c in b)a[c]=b[c]};goog.now=goog.TRUSTED_SITE&&Date.now||function(){return+new Date};
goog.globalEval=function(a){if(goog.global.execScript)goog.global.execScript(a,"JavaScript");else if(goog.global.eval){if(null==goog.evalWorksForGlobals_)if(goog.global.eval("var _evalTest_ = 1;"),"undefined"!=typeof goog.global._evalTest_){try{delete goog.global._evalTest_}catch(d){}goog.evalWorksForGlobals_=!0}else goog.evalWorksForGlobals_=!1;if(goog.evalWorksForGlobals_)goog.global.eval(a);else{var b=goog.global.document,c=b.createElement("SCRIPT");c.type="text/javascript";c.defer=!1;c.appendChild(b.createTextNode(a));
b.body.appendChild(c);b.body.removeChild(c)}}else throw Error("goog.globalEval not available");};goog.evalWorksForGlobals_=null;goog.getCssName=function(a,b){var c=function(a){return goog.cssNameMapping_[a]||a},d=function(a){a=a.split("-");for(var b=[],d=0;d<a.length;d++)b.push(c(a[d]));return b.join("-")},d=goog.cssNameMapping_?"BY_WHOLE"==goog.cssNameMappingStyle_?c:d:function(a){return a};return b?a+"-"+d(b):d(a)};
goog.setCssNameMapping=function(a,b){goog.cssNameMapping_=a;goog.cssNameMappingStyle_=b};!COMPILED&&goog.global.CLOSURE_CSS_NAME_MAPPING&&(goog.cssNameMapping_=goog.global.CLOSURE_CSS_NAME_MAPPING);goog.getMsg=function(a,b){b&&(a=a.replace(/\{\$([^}]+)}/g,function(a,d){return null!=b&&d in b?b[d]:a}));return a};goog.getMsgWithFallback=function(a,b){return a};goog.exportSymbol=function(a,b,c){goog.exportPath_(a,b,c)};goog.exportProperty=function(a,b,c){a[b]=c};
goog.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.superClass_=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.base=function(a,c,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[c].apply(a,g)}};
goog.base=function(a,b,c){var d=arguments.callee.caller;if(goog.STRICT_MODE_COMPATIBLE||goog.DEBUG&&!d)throw Error("arguments.caller not defined.  goog.base() cannot be used with strict mode code. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");if(d.superClass_){for(var e=Array(arguments.length-1),f=1;f<arguments.length;f++)e[f-1]=arguments[f];return d.superClass_.constructor.apply(a,e)}e=Array(arguments.length-2);for(f=2;f<arguments.length;f++)e[f-2]=arguments[f];for(var f=!1,g=a.constructor;g;g=
g.superClass_&&g.superClass_.constructor)if(g.prototype[b]===d)f=!0;else if(f)return g.prototype[b].apply(a,e);if(a[b]===d)return a.constructor.prototype[b].apply(a,e);throw Error("goog.base called from a method of one name to a method of a different name");};goog.scope=function(a){a.call(goog.global)};COMPILED||(goog.global.COMPILED=COMPILED);
goog.defineClass=function(a,b){var c=b.constructor,d=b.statics;c&&c!=Object.prototype.constructor||(c=function(){throw Error("cannot instantiate an interface (no constructor defined).");});c=goog.defineClass.createSealingConstructor_(c,a);a&&goog.inherits(c,a);delete b.constructor;delete b.statics;goog.defineClass.applyProperties_(c.prototype,b);null!=d&&(d instanceof Function?d(c):goog.defineClass.applyProperties_(c,d));return c};goog.defineClass.SEAL_CLASS_INSTANCES=goog.DEBUG;
goog.defineClass.createSealingConstructor_=function(a,b){if(goog.defineClass.SEAL_CLASS_INSTANCES&&Object.seal instanceof Function){if(b&&b.prototype&&b.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_])return a;var c=function(){var b=a.apply(this,arguments)||this;b[goog.UID_PROPERTY_]=b[goog.UID_PROPERTY_];this.constructor===c&&Object.seal(b);return b};return c}return a};goog.defineClass.OBJECT_PROTOTYPE_FIELDS_="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.defineClass.applyProperties_=function(a,b){for(var c in b)Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c]);for(var d=0;d<goog.defineClass.OBJECT_PROTOTYPE_FIELDS_.length;d++)c=goog.defineClass.OBJECT_PROTOTYPE_FIELDS_[d],Object.prototype.hasOwnProperty.call(b,c)&&(a[c]=b[c])};goog.tagUnsealableClass=function(a){!COMPILED&&goog.defineClass.SEAL_CLASS_INSTANCES&&(a.prototype[goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_]=!0)};goog.UNSEALABLE_CONSTRUCTOR_PROPERTY_="goog_defineClass_legacy_unsealable";goog.dom={};goog.dom.NodeType={ELEMENT:1,ATTRIBUTE:2,TEXT:3,CDATA_SECTION:4,ENTITY_REFERENCE:5,ENTITY:6,PROCESSING_INSTRUCTION:7,COMMENT:8,DOCUMENT:9,DOCUMENT_TYPE:10,DOCUMENT_FRAGMENT:11,NOTATION:12};goog.debug={};goog.debug.Error=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,goog.debug.Error);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a));this.reportErrorToServer=!0};goog.inherits(goog.debug.Error,Error);goog.debug.Error.prototype.name="CustomError";goog.string={};goog.string.DETECT_DOUBLE_ESCAPING=!1;goog.string.FORCE_NON_DOM_HTML_UNESCAPING=!1;goog.string.Unicode={NBSP:"\u00a0"};goog.string.startsWith=function(a,b){return 0==a.lastIndexOf(b,0)};goog.string.endsWith=function(a,b){var c=a.length-b.length;return 0<=c&&a.indexOf(b,c)==c};goog.string.caseInsensitiveStartsWith=function(a,b){return 0==goog.string.caseInsensitiveCompare(b,a.substr(0,b.length))};
goog.string.caseInsensitiveEndsWith=function(a,b){return 0==goog.string.caseInsensitiveCompare(b,a.substr(a.length-b.length,b.length))};goog.string.caseInsensitiveEquals=function(a,b){return a.toLowerCase()==b.toLowerCase()};goog.string.subs=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")};goog.string.collapseWhitespace=function(a){return a.replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")};
goog.string.isEmptyOrWhitespace=function(a){return/^[\s\xa0]*$/.test(a)};goog.string.isEmptyString=function(a){return 0==a.length};goog.string.isEmpty=goog.string.isEmptyOrWhitespace;goog.string.isEmptyOrWhitespaceSafe=function(a){return goog.string.isEmptyOrWhitespace(goog.string.makeSafe(a))};goog.string.isEmptySafe=goog.string.isEmptyOrWhitespaceSafe;goog.string.isBreakingWhitespace=function(a){return!/[^\t\n\r ]/.test(a)};goog.string.isAlpha=function(a){return!/[^a-zA-Z]/.test(a)};
goog.string.isNumeric=function(a){return!/[^0-9]/.test(a)};goog.string.isAlphaNumeric=function(a){return!/[^a-zA-Z0-9]/.test(a)};goog.string.isSpace=function(a){return" "==a};goog.string.isUnicodeChar=function(a){return 1==a.length&&" "<=a&&"~">=a||"\u0080"<=a&&"\ufffd">=a};goog.string.stripNewlines=function(a){return a.replace(/(\r\n|\r|\n)+/g," ")};goog.string.canonicalizeNewlines=function(a){return a.replace(/(\r\n|\r|\n)/g,"\n")};
goog.string.normalizeWhitespace=function(a){return a.replace(/\xa0|\s/g," ")};goog.string.normalizeSpaces=function(a){return a.replace(/\xa0|[ \t]+/g," ")};goog.string.collapseBreakingSpaces=function(a){return a.replace(/[\t\r\n ]+/g," ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,"")};goog.string.trim=goog.TRUSTED_SITE&&String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};goog.string.trimLeft=function(a){return a.replace(/^[\s\xa0]+/,"")};
goog.string.trimRight=function(a){return a.replace(/[\s\xa0]+$/,"")};goog.string.caseInsensitiveCompare=function(a,b){var c=String(a).toLowerCase(),d=String(b).toLowerCase();return c<d?-1:c==d?0:1};
goog.string.numberAwareCompare_=function(a,b,c){if(a==b)return 0;if(!a)return-1;if(!b)return 1;for(var d=a.toLowerCase().match(c),e=b.toLowerCase().match(c),f=Math.min(d.length,e.length),g=0;g<f;g++){c=d[g];var h=e[g];if(c!=h)return a=parseInt(c,10),!isNaN(a)&&(b=parseInt(h,10),!isNaN(b)&&a-b)?a-b:c<h?-1:1}return d.length!=e.length?d.length-e.length:a<b?-1:1};goog.string.intAwareCompare=function(a,b){return goog.string.numberAwareCompare_(a,b,/\d+|\D+/g)};
goog.string.floatAwareCompare=function(a,b){return goog.string.numberAwareCompare_(a,b,/\d+|\.\d+|\D+/g)};goog.string.numerateCompare=goog.string.floatAwareCompare;goog.string.urlEncode=function(a){return encodeURIComponent(String(a))};goog.string.urlDecode=function(a){return decodeURIComponent(a.replace(/\+/g," "))};goog.string.newLineToBr=function(a,b){return a.replace(/(\r\n|\r|\n)/g,b?"<br />":"<br>")};
goog.string.htmlEscape=function(a,b){if(b)a=a.replace(goog.string.AMP_RE_,"&amp;").replace(goog.string.LT_RE_,"&lt;").replace(goog.string.GT_RE_,"&gt;").replace(goog.string.QUOT_RE_,"&quot;").replace(goog.string.SINGLE_QUOTE_RE_,"&#39;").replace(goog.string.NULL_RE_,"&#0;"),goog.string.DETECT_DOUBLE_ESCAPING&&(a=a.replace(goog.string.E_RE_,"&#101;"));else{if(!goog.string.ALL_RE_.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(goog.string.AMP_RE_,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(goog.string.LT_RE_,
"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(goog.string.GT_RE_,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(goog.string.QUOT_RE_,"&quot;"));-1!=a.indexOf("'")&&(a=a.replace(goog.string.SINGLE_QUOTE_RE_,"&#39;"));-1!=a.indexOf("\x00")&&(a=a.replace(goog.string.NULL_RE_,"&#0;"));goog.string.DETECT_DOUBLE_ESCAPING&&-1!=a.indexOf("e")&&(a=a.replace(goog.string.E_RE_,"&#101;"))}return a};goog.string.AMP_RE_=/&/g;goog.string.LT_RE_=/</g;goog.string.GT_RE_=/>/g;goog.string.QUOT_RE_=/"/g;
goog.string.SINGLE_QUOTE_RE_=/'/g;goog.string.NULL_RE_=/\x00/g;goog.string.E_RE_=/e/g;goog.string.ALL_RE_=goog.string.DETECT_DOUBLE_ESCAPING?/[\x00&<>"'e]/:/[\x00&<>"']/;goog.string.unescapeEntities=function(a){return goog.string.contains(a,"&")?!goog.string.FORCE_NON_DOM_HTML_UNESCAPING&&"document"in goog.global?goog.string.unescapeEntitiesUsingDom_(a):goog.string.unescapePureXmlEntities_(a):a};
goog.string.unescapeEntitiesWithDocument=function(a,b){return goog.string.contains(a,"&")?goog.string.unescapeEntitiesUsingDom_(a,b):a};
goog.string.unescapeEntitiesUsingDom_=function(a,b){var c={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'},d;d=b?b.createElement("div"):goog.global.document.createElement("div");return a.replace(goog.string.HTML_ENTITY_PATTERN_,function(a,b){var g=c[a];if(g)return g;if("#"==b.charAt(0)){var h=Number("0"+b.substr(1));isNaN(h)||(g=String.fromCharCode(h))}g||(d.innerHTML=a+" ",g=d.firstChild.nodeValue.slice(0,-1));return c[a]=g})};
goog.string.unescapePureXmlEntities_=function(a){return a.replace(/&([^;]+);/g,function(a,c){switch(c){case "amp":return"&";case "lt":return"<";case "gt":return">";case "quot":return'"';default:if("#"==c.charAt(0)){var d=Number("0"+c.substr(1));if(!isNaN(d))return String.fromCharCode(d)}return a}})};goog.string.HTML_ENTITY_PATTERN_=/&([^;\s<&]+);?/g;goog.string.whitespaceEscape=function(a,b){return goog.string.newLineToBr(a.replace(/  /g," &#160;"),b)};
goog.string.preserveSpaces=function(a){return a.replace(/(^|[\n ]) /g,"$1"+goog.string.Unicode.NBSP)};goog.string.stripQuotes=function(a,b){for(var c=b.length,d=0;d<c;d++){var e=1==c?b:b.charAt(d);if(a.charAt(0)==e&&a.charAt(a.length-1)==e)return a.substring(1,a.length-1)}return a};goog.string.truncate=function(a,b,c){c&&(a=goog.string.unescapeEntities(a));a.length>b&&(a=a.substring(0,b-3)+"...");c&&(a=goog.string.htmlEscape(a));return a};
goog.string.truncateMiddle=function(a,b,c,d){c&&(a=goog.string.unescapeEntities(a));if(d&&a.length>b){d>b&&(d=b);var e=a.length-d;a=a.substring(0,b-d)+"..."+a.substring(e)}else a.length>b&&(d=Math.floor(b/2),e=a.length-d,a=a.substring(0,d+b%2)+"..."+a.substring(e));c&&(a=goog.string.htmlEscape(a));return a};goog.string.specialEscapeChars_={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\","<":"<"};goog.string.jsEscapeCache_={"'":"\\'"};
goog.string.quote=function(a){a=String(a);for(var b=['"'],c=0;c<a.length;c++){var d=a.charAt(c),e=d.charCodeAt(0);b[c+1]=goog.string.specialEscapeChars_[d]||(31<e&&127>e?d:goog.string.escapeChar(d))}b.push('"');return b.join("")};goog.string.escapeString=function(a){for(var b=[],c=0;c<a.length;c++)b[c]=goog.string.escapeChar(a.charAt(c));return b.join("")};
goog.string.escapeChar=function(a){if(a in goog.string.jsEscapeCache_)return goog.string.jsEscapeCache_[a];if(a in goog.string.specialEscapeChars_)return goog.string.jsEscapeCache_[a]=goog.string.specialEscapeChars_[a];var b,c=a.charCodeAt(0);if(31<c&&127>c)b=a;else{if(256>c){if(b="\\x",16>c||256<c)b+="0"}else b="\\u",4096>c&&(b+="0");b+=c.toString(16).toUpperCase()}return goog.string.jsEscapeCache_[a]=b};goog.string.contains=function(a,b){return-1!=a.indexOf(b)};
goog.string.caseInsensitiveContains=function(a,b){return goog.string.contains(a.toLowerCase(),b.toLowerCase())};goog.string.countOf=function(a,b){return a&&b?a.split(b).length-1:0};goog.string.removeAt=function(a,b,c){var d=a;0<=b&&b<a.length&&0<c&&(d=a.substr(0,b)+a.substr(b+c,a.length-b-c));return d};goog.string.remove=function(a,b){var c=new RegExp(goog.string.regExpEscape(b),"");return a.replace(c,"")};
goog.string.removeAll=function(a,b){var c=new RegExp(goog.string.regExpEscape(b),"g");return a.replace(c,"")};goog.string.regExpEscape=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};goog.string.repeat=String.prototype.repeat?function(a,b){return a.repeat(b)}:function(a,b){return Array(b+1).join(a)};
goog.string.padNumber=function(a,b,c){a=goog.isDef(c)?a.toFixed(c):String(a);c=a.indexOf(".");-1==c&&(c=a.length);return goog.string.repeat("0",Math.max(0,b-c))+a};goog.string.makeSafe=function(a){return null==a?"":String(a)};goog.string.buildString=function(a){return Array.prototype.join.call(arguments,"")};goog.string.getRandomString=function(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^goog.now()).toString(36)};
goog.string.compareVersions=function(a,b){for(var c=0,d=goog.string.trim(String(a)).split("."),e=goog.string.trim(String(b)).split("."),f=Math.max(d.length,e.length),g=0;0==c&&g<f;g++){var h=d[g]||"",k=e[g]||"",l=RegExp("(\\d*)(\\D*)","g"),p=RegExp("(\\d*)(\\D*)","g");do{var m=l.exec(h)||["","",""],n=p.exec(k)||["","",""];if(0==m[0].length&&0==n[0].length)break;var c=0==m[1].length?0:parseInt(m[1],10),q=0==n[1].length?0:parseInt(n[1],10),c=goog.string.compareElements_(c,q)||goog.string.compareElements_(0==
m[2].length,0==n[2].length)||goog.string.compareElements_(m[2],n[2])}while(0==c)}return c};goog.string.compareElements_=function(a,b){return a<b?-1:a>b?1:0};goog.string.hashCode=function(a){for(var b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c)>>>0;return b};goog.string.uniqueStringCounter_=2147483648*Math.random()|0;goog.string.createUniqueString=function(){return"goog_"+goog.string.uniqueStringCounter_++};
goog.string.toNumber=function(a){var b=Number(a);return 0==b&&goog.string.isEmptyOrWhitespace(a)?NaN:b};goog.string.isLowerCamelCase=function(a){return/^[a-z]+([A-Z][a-z]*)*$/.test(a)};goog.string.isUpperCamelCase=function(a){return/^([A-Z][a-z]*)+$/.test(a)};goog.string.toCamelCase=function(a){return String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()})};goog.string.toSelectorCase=function(a){return String(a).replace(/([A-Z])/g,"-$1").toLowerCase()};
goog.string.toTitleCase=function(a,b){var c=goog.isString(b)?goog.string.regExpEscape(b):"\\s";return a.replace(new RegExp("(^"+(c?"|["+c+"]+":"")+")([a-z])","g"),function(a,b,c){return b+c.toUpperCase()})};goog.string.capitalize=function(a){return String(a.charAt(0)).toUpperCase()+String(a.substr(1)).toLowerCase()};goog.string.parseInt=function(a){isFinite(a)&&(a=String(a));return goog.isString(a)?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN};
goog.string.splitLimit=function(a,b,c){a=a.split(b);for(var d=[];0<c&&a.length;)d.push(a.shift()),c--;a.length&&d.push(a.join(b));return d};goog.string.editDistance=function(a,b){var c=[],d=[];if(a==b)return 0;if(!a.length||!b.length)return Math.max(a.length,b.length);for(var e=0;e<b.length+1;e++)c[e]=e;for(e=0;e<a.length;e++){d[0]=e+1;for(var f=0;f<b.length;f++)d[f+1]=Math.min(d[f]+1,c[f+1]+1,c[f]+Number(a[e]!=b[f]));for(f=0;f<c.length;f++)c[f]=d[f]}return d[b.length]};goog.asserts={};goog.asserts.ENABLE_ASSERTS=goog.DEBUG;goog.asserts.AssertionError=function(a,b){b.unshift(a);goog.debug.Error.call(this,goog.string.subs.apply(null,b));b.shift();this.messagePattern=a};goog.inherits(goog.asserts.AssertionError,goog.debug.Error);goog.asserts.AssertionError.prototype.name="AssertionError";goog.asserts.DEFAULT_ERROR_HANDLER=function(a){throw a;};goog.asserts.errorHandler_=goog.asserts.DEFAULT_ERROR_HANDLER;
goog.asserts.doAssertFailure_=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);a=new goog.asserts.AssertionError(""+e,f||[]);goog.asserts.errorHandler_(a)};goog.asserts.setErrorHandler=function(a){goog.asserts.ENABLE_ASSERTS&&(goog.asserts.errorHandler_=a)};goog.asserts.assert=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!a&&goog.asserts.doAssertFailure_("",null,b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.fail=function(a,b){goog.asserts.ENABLE_ASSERTS&&goog.asserts.errorHandler_(new goog.asserts.AssertionError("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1)))};goog.asserts.assertNumber=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isNumber(a)&&goog.asserts.doAssertFailure_("Expected number but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertString=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isString(a)&&goog.asserts.doAssertFailure_("Expected string but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertFunction=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isFunction(a)&&goog.asserts.doAssertFailure_("Expected function but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertObject=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isObject(a)&&goog.asserts.doAssertFailure_("Expected object but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertArray=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isArray(a)&&goog.asserts.doAssertFailure_("Expected array but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertBoolean=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isBoolean(a)&&goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertElement=function(a,b,c){!goog.asserts.ENABLE_ASSERTS||goog.isObject(a)&&a.nodeType==goog.dom.NodeType.ELEMENT||goog.asserts.doAssertFailure_("Expected Element but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertInstanceof=function(a,b,c,d){!goog.asserts.ENABLE_ASSERTS||a instanceof b||goog.asserts.doAssertFailure_("Expected instanceof %s but got %s.",[goog.asserts.getType_(b),goog.asserts.getType_(a)],c,Array.prototype.slice.call(arguments,3));return a};goog.asserts.assertObjectPrototypeIsIntact=function(){for(var a in Object.prototype)goog.asserts.fail(a+" should not be enumerable in Object.prototype.")};
goog.asserts.getType_=function(a){return a instanceof Function?a.displayName||a.name||"unknown type name":a instanceof Object?a.constructor.displayName||a.constructor.name||Object.prototype.toString.call(a):null===a?"null":typeof a};var jspb={Map:function(a,b){this.arr_=a;this.valueCtor_=b;this.map_={};this.arrClean=!0;0<this.arr_.length&&this.loadFromArray_()}};jspb.Map.prototype.loadFromArray_=function(){for(var a=0;a<this.arr_.length;a++){var b=this.arr_[a],c=b[0];this.map_[c.toString()]=new jspb.Map.Entry_(c,b[1])}this.arrClean=!0};
jspb.Map.prototype.toArray=function(){if(this.arrClean){if(this.valueCtor_){var a=this.map_,b;for(b in a)if(Object.prototype.hasOwnProperty.call(a,b)){var c=a[b].valueWrapper;c&&c.toArray()}}}else{this.arr_.length=0;a=this.stringKeys_();a.sort();for(b=0;b<a.length;b++){var d=this.map_[a[b]];(c=d.valueWrapper)&&c.toArray();this.arr_.push([d.key,d.value])}this.arrClean=!0}return this.arr_};
jspb.Map.prototype.toObject=function(a,b){for(var c=this.toArray(),d=[],e=0;e<c.length;e++){var f=this.map_[c[e][0].toString()];this.wrapEntry_(f);var g=f.valueWrapper;g?(goog.asserts.assert(b),d.push([f.key,b(a,g)])):d.push([f.key,f.value])}return d};jspb.Map.fromObject=function(a,b,c){b=new jspb.Map([],b);for(var d=0;d<a.length;d++){var e=a[d][0],f=c(a[d][1]);b.set(e,f)}return b};jspb.Map.ArrayIteratorIterable_=function(a){this.idx_=0;this.arr_=a};
jspb.Map.ArrayIteratorIterable_.prototype.next=function(){return this.idx_<this.arr_.length?{done:!1,value:this.arr_[this.idx_++]}:{done:!0,value:void 0}};$jscomp.initSymbol();"undefined"!=typeof Symbol&&($jscomp.initSymbol(),$jscomp.initSymbolIterator(),jspb.Map.ArrayIteratorIterable_.prototype[Symbol.iterator]=function(){return this});jspb.Map.prototype.getLength=function(){return this.stringKeys_().length};jspb.Map.prototype.clear=function(){this.map_={};this.arrClean=!1};
jspb.Map.prototype.del=function(a){a=a.toString();var b=this.map_.hasOwnProperty(a);delete this.map_[a];this.arrClean=!1;return b};jspb.Map.prototype.getEntryList=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++){var d=this.map_[b[c]];a.push([d.key,d.value])}return a};jspb.Map.prototype.entries=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++){var d=this.map_[b[c]];a.push([d.key,this.wrapEntry_(d)])}return new jspb.Map.ArrayIteratorIterable_(a)};
jspb.Map.prototype.keys=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++)a.push(this.map_[b[c]].key);return new jspb.Map.ArrayIteratorIterable_(a)};jspb.Map.prototype.values=function(){var a=[],b=this.stringKeys_();b.sort();for(var c=0;c<b.length;c++)a.push(this.wrapEntry_(this.map_[b[c]]));return new jspb.Map.ArrayIteratorIterable_(a)};
jspb.Map.prototype.forEach=function(a,b){var c=this.stringKeys_();c.sort();for(var d=0;d<c.length;d++){var e=this.map_[c[d]];a.call(b,this.wrapEntry_(e),e.key,this)}};jspb.Map.prototype.set=function(a,b){var c=new jspb.Map.Entry_(a);this.valueCtor_?(c.valueWrapper=b,c.value=b.toArray()):c.value=b;this.map_[a.toString()]=c;this.arrClean=!1;return this};jspb.Map.prototype.wrapEntry_=function(a){return this.valueCtor_?(a.valueWrapper||(a.valueWrapper=new this.valueCtor_(a.value)),a.valueWrapper):a.value};
jspb.Map.prototype.get=function(a){if(a=this.map_[a.toString()])return this.wrapEntry_(a)};jspb.Map.prototype.has=function(a){return a.toString()in this.map_};jspb.Map.prototype.serializeBinary=function(a,b,c,d,e){var f=this.stringKeys_();f.sort();for(var g=0;g<f.length;g++){var h=this.map_[f[g]];b.beginSubMessage(a);c.call(b,1,h.key);this.valueCtor_?d.call(b,2,this.wrapEntry_(h),e):d.call(b,2,h.value);b.endSubMessage()}};
jspb.Map.deserializeBinary=function(a,b,c,d,e){for(var f=void 0,g=void 0;b.nextField()&&!b.isEndGroup();){var h=b.getFieldNumber();1==h?f=c.call(b):2==h&&(a.valueCtor_?(g=new a.valueCtor_,d.call(b,g,e)):g=d.call(b))}goog.asserts.assert(void 0!=f);goog.asserts.assert(void 0!=g);a.set(f,g)};jspb.Map.prototype.stringKeys_=function(){var a=this.map_,b=[],c;for(c in a)Object.prototype.hasOwnProperty.call(a,c)&&b.push(c);return b};
jspb.Map.Entry_=function(a,b){this.key=a;this.value=b;this.valueWrapper=void 0};goog.array={};goog.NATIVE_ARRAY_PROTOTYPES=goog.TRUSTED_SITE;goog.array.ASSUME_NATIVE_FUNCTIONS=!1;goog.array.peek=function(a){return a[a.length-1]};goog.array.last=goog.array.peek;
goog.array.indexOf=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.indexOf)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(goog.isString(a))return goog.isString(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};
goog.array.lastIndexOf=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.lastIndexOf)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.lastIndexOf.call(a,b,null==c?a.length-1:c)}:function(a,b,c){c=null==c?a.length-1:c;0>c&&(c=Math.max(0,a.length+c));if(goog.isString(a))return goog.isString(b)&&1==b.length?a.lastIndexOf(b,c):-1;for(;0<=c;c--)if(c in a&&a[c]===b)return c;return-1};
goog.array.forEach=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.forEach)?function(a,b,c){goog.asserts.assert(null!=a.length);Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};goog.array.forEachRight=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,d=d-1;0<=d;--d)d in e&&b.call(c,e[d],d,a)};
goog.array.filter=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.filter)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=goog.isString(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var k=g[h];b.call(c,k,h,a)&&(e[f++]=k)}return e};
goog.array.map=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.map)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=goog.isString(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e};
goog.array.reduce=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.reduce)?function(a,b,c,d){goog.asserts.assert(null!=a.length);d&&(b=goog.bind(b,d));return Array.prototype.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEach(a,function(c,g){e=b.call(d,e,c,g,a)});return e};
goog.array.reduceRight=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.reduceRight)?function(a,b,c,d){goog.asserts.assert(null!=a.length);goog.asserts.assert(null!=b);d&&(b=goog.bind(b,d));return Array.prototype.reduceRight.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEachRight(a,function(c,g){e=b.call(d,e,c,g,a)});return e};
goog.array.some=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.some)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1};
goog.array.every=goog.NATIVE_ARRAY_PROTOTYPES&&(goog.array.ASSUME_NATIVE_FUNCTIONS||Array.prototype.every)?function(a,b,c){goog.asserts.assert(null!=a.length);return Array.prototype.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};goog.array.count=function(a,b,c){var d=0;goog.array.forEach(a,function(a,f,g){b.call(c,a,f,g)&&++d},c);return d};
goog.array.find=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0>b?null:goog.isString(a)?a.charAt(b):a[b]};goog.array.findIndex=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1};goog.array.findRight=function(a,b,c){b=goog.array.findIndexRight(a,b,c);return 0>b?null:goog.isString(a)?a.charAt(b):a[b]};
goog.array.findIndexRight=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,d=d-1;0<=d;d--)if(d in e&&b.call(c,e[d],d,a))return d;return-1};goog.array.contains=function(a,b){return 0<=goog.array.indexOf(a,b)};goog.array.isEmpty=function(a){return 0==a.length};goog.array.clear=function(a){if(!goog.isArray(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0};goog.array.insert=function(a,b){goog.array.contains(a,b)||a.push(b)};
goog.array.insertAt=function(a,b,c){goog.array.splice(a,c,0,b)};goog.array.insertArrayAt=function(a,b,c){goog.partial(goog.array.splice,a,c,0).apply(null,b)};goog.array.insertBefore=function(a,b,c){var d;2==arguments.length||0>(d=goog.array.indexOf(a,c))?a.push(b):goog.array.insertAt(a,b,d)};goog.array.remove=function(a,b){var c=goog.array.indexOf(a,b),d;(d=0<=c)&&goog.array.removeAt(a,c);return d};
goog.array.removeAt=function(a,b){goog.asserts.assert(null!=a.length);return 1==Array.prototype.splice.call(a,b,1).length};goog.array.removeIf=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0<=b?(goog.array.removeAt(a,b),!0):!1};goog.array.removeAllIf=function(a,b,c){var d=0;goog.array.forEachRight(a,function(e,f){b.call(c,e,f,a)&&goog.array.removeAt(a,f)&&d++});return d};goog.array.concat=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)};
goog.array.join=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)};goog.array.toArray=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};goog.array.clone=goog.array.toArray;goog.array.extend=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(goog.isArrayLike(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g]}else a.push(d)}};
goog.array.splice=function(a,b,c,d){goog.asserts.assert(null!=a.length);return Array.prototype.splice.apply(a,goog.array.slice(arguments,1))};goog.array.slice=function(a,b,c){goog.asserts.assert(null!=a.length);return 2>=arguments.length?Array.prototype.slice.call(a,b):Array.prototype.slice.call(a,b,c)};
goog.array.removeDuplicates=function(a,b,c){b=b||a;var d=function(a){return goog.isObject(a)?"o"+goog.getUid(a):(typeof a).charAt(0)+a};c=c||d;for(var d={},e=0,f=0;f<a.length;){var g=a[f++],h=c(g);Object.prototype.hasOwnProperty.call(d,h)||(d[h]=!0,b[e++]=g)}b.length=e};goog.array.binarySearch=function(a,b,c){return goog.array.binarySearch_(a,c||goog.array.defaultCompare,!1,b)};goog.array.binarySelect=function(a,b,c){return goog.array.binarySearch_(a,b,!0,void 0,c)};
goog.array.binarySearch_=function(a,b,c,d,e){for(var f=0,g=a.length,h;f<g;){var k=f+g>>1,l;l=c?b.call(e,a[k],k,a):b(d,a[k]);0<l?f=k+1:(g=k,h=!l)}return h?f:~f};goog.array.sort=function(a,b){a.sort(b||goog.array.defaultCompare)};goog.array.stableSort=function(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||goog.array.defaultCompare;goog.array.sort(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value};
goog.array.sortByKey=function(a,b,c){var d=c||goog.array.defaultCompare;goog.array.sort(a,function(a,c){return d(b(a),b(c))})};goog.array.sortObjectsByKey=function(a,b,c){goog.array.sortByKey(a,function(a){return a[b]},c)};goog.array.isSorted=function(a,b,c){b=b||goog.array.defaultCompare;for(var d=1;d<a.length;d++){var e=b(a[d-1],a[d]);if(0<e||0==e&&c)return!1}return!0};
goog.array.equals=function(a,b,c){if(!goog.isArrayLike(a)||!goog.isArrayLike(b)||a.length!=b.length)return!1;var d=a.length;c=c||goog.array.defaultCompareEquality;for(var e=0;e<d;e++)if(!c(a[e],b[e]))return!1;return!0};goog.array.compare3=function(a,b,c){c=c||goog.array.defaultCompare;for(var d=Math.min(a.length,b.length),e=0;e<d;e++){var f=c(a[e],b[e]);if(0!=f)return f}return goog.array.defaultCompare(a.length,b.length)};goog.array.defaultCompare=function(a,b){return a>b?1:a<b?-1:0};
goog.array.inverseDefaultCompare=function(a,b){return-goog.array.defaultCompare(a,b)};goog.array.defaultCompareEquality=function(a,b){return a===b};goog.array.binaryInsert=function(a,b,c){c=goog.array.binarySearch(a,b,c);return 0>c?(goog.array.insertAt(a,b,-(c+1)),!0):!1};goog.array.binaryRemove=function(a,b,c){b=goog.array.binarySearch(a,b,c);return 0<=b?goog.array.removeAt(a,b):!1};
goog.array.bucket=function(a,b,c){for(var d={},e=0;e<a.length;e++){var f=a[e],g=b.call(c,f,e,a);goog.isDef(g)&&(d[g]||(d[g]=[])).push(f)}return d};goog.array.toObject=function(a,b,c){var d={};goog.array.forEach(a,function(e,f){d[b.call(c,e,f,a)]=e});return d};goog.array.range=function(a,b,c){var d=[],e=0,f=a;c=c||1;void 0!==b&&(e=a,f=b);if(0>c*(f-e))return[];if(0<c)for(a=e;a<f;a+=c)d.push(a);else for(a=e;a>f;a+=c)d.push(a);return d};
goog.array.repeat=function(a,b){for(var c=[],d=0;d<b;d++)c[d]=a;return c};goog.array.flatten=function(a){for(var b=[],c=0;c<arguments.length;c++){var d=arguments[c];if(goog.isArray(d))for(var e=0;e<d.length;e+=8192)for(var f=goog.array.slice(d,e,e+8192),f=goog.array.flatten.apply(null,f),g=0;g<f.length;g++)b.push(f[g]);else b.push(d)}return b};
goog.array.rotate=function(a,b){goog.asserts.assert(null!=a.length);a.length&&(b%=a.length,0<b?Array.prototype.unshift.apply(a,a.splice(-b,b)):0>b&&Array.prototype.push.apply(a,a.splice(0,-b)));return a};goog.array.moveItem=function(a,b,c){goog.asserts.assert(0<=b&&b<a.length);goog.asserts.assert(0<=c&&c<a.length);b=Array.prototype.splice.call(a,b,1);Array.prototype.splice.call(a,c,0,b[0])};
goog.array.zip=function(a){if(!arguments.length)return[];for(var b=[],c=arguments[0].length,d=1;d<arguments.length;d++)arguments[d].length<c&&(c=arguments[d].length);for(d=0;d<c;d++){for(var e=[],f=0;f<arguments.length;f++)e.push(arguments[f][d]);b.push(e)}return b};goog.array.shuffle=function(a,b){for(var c=b||Math.random,d=a.length-1;0<d;d--){var e=Math.floor(c()*(d+1)),f=a[d];a[d]=a[e];a[e]=f}};goog.array.copyByIndex=function(a,b){var c=[];goog.array.forEach(b,function(b){c.push(a[b])});return c};goog.crypt={};goog.crypt.stringToByteArray=function(a){for(var b=[],c=0,d=0;d<a.length;d++){for(var e=a.charCodeAt(d);255<e;)b[c++]=e&255,e>>=8;b[c++]=e}return b};goog.crypt.byteArrayToString=function(a){if(8192>=a.length)return String.fromCharCode.apply(null,a);for(var b="",c=0;c<a.length;c+=8192)var d=goog.array.slice(a,c,c+8192),b=b+String.fromCharCode.apply(null,d);return b};goog.crypt.byteArrayToHex=function(a){return goog.array.map(a,function(a){a=a.toString(16);return 1<a.length?a:"0"+a}).join("")};
goog.crypt.hexToByteArray=function(a){goog.asserts.assert(0==a.length%2,"Key string length must be multiple of 2");for(var b=[],c=0;c<a.length;c+=2)b.push(parseInt(a.substring(c,c+2),16));return b};
goog.crypt.stringToUtf8ByteArray=function(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(55296==(e&64512)&&d+1<a.length&&56320==(a.charCodeAt(d+1)&64512)?(e=65536+((e&1023)<<10)+(a.charCodeAt(++d)&1023),b[c++]=e>>18|240,b[c++]=e>>12&63|128):b[c++]=e>>12|224,b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b};
goog.crypt.utf8ByteArrayToString=function(a){for(var b=[],c=0,d=0;c<a.length;){var e=a[c++];if(128>e)b[d++]=String.fromCharCode(e);else if(191<e&&224>e){var f=a[c++];b[d++]=String.fromCharCode((e&31)<<6|f&63)}else if(239<e&&365>e){var f=a[c++],g=a[c++],h=a[c++],e=((e&7)<<18|(f&63)<<12|(g&63)<<6|h&63)-65536;b[d++]=String.fromCharCode(55296+(e>>10));b[d++]=String.fromCharCode(56320+(e&1023))}else f=a[c++],g=a[c++],b[d++]=String.fromCharCode((e&15)<<12|(f&63)<<6|g&63)}return b.join("")};
goog.crypt.xorByteArray=function(a,b){goog.asserts.assert(a.length==b.length,"XOR array lengths must match");for(var c=[],d=0;d<a.length;d++)c.push(a[d]^b[d]);return c};goog.labs={};goog.labs.userAgent={};goog.labs.userAgent.util={};goog.labs.userAgent.util.getNativeUserAgentString_=function(){var a=goog.labs.userAgent.util.getNavigator_();return a&&(a=a.userAgent)?a:""};goog.labs.userAgent.util.getNavigator_=function(){return goog.global.navigator};goog.labs.userAgent.util.userAgent_=goog.labs.userAgent.util.getNativeUserAgentString_();goog.labs.userAgent.util.setUserAgent=function(a){goog.labs.userAgent.util.userAgent_=a||goog.labs.userAgent.util.getNativeUserAgentString_()};
goog.labs.userAgent.util.getUserAgent=function(){return goog.labs.userAgent.util.userAgent_};goog.labs.userAgent.util.matchUserAgent=function(a){var b=goog.labs.userAgent.util.getUserAgent();return goog.string.contains(b,a)};goog.labs.userAgent.util.matchUserAgentIgnoreCase=function(a){var b=goog.labs.userAgent.util.getUserAgent();return goog.string.caseInsensitiveContains(b,a)};
goog.labs.userAgent.util.extractVersionTuples=function(a){for(var b=RegExp("(\\w[\\w ]+)/([^\\s]+)\\s*(?:\\((.*?)\\))?","g"),c=[],d;d=b.exec(a);)c.push([d[1],d[2],d[3]||void 0]);return c};goog.labs.userAgent.platform={};goog.labs.userAgent.platform.isAndroid=function(){return goog.labs.userAgent.util.matchUserAgent("Android")};goog.labs.userAgent.platform.isIpod=function(){return goog.labs.userAgent.util.matchUserAgent("iPod")};goog.labs.userAgent.platform.isIphone=function(){return goog.labs.userAgent.util.matchUserAgent("iPhone")&&!goog.labs.userAgent.util.matchUserAgent("iPod")&&!goog.labs.userAgent.util.matchUserAgent("iPad")};goog.labs.userAgent.platform.isIpad=function(){return goog.labs.userAgent.util.matchUserAgent("iPad")};
goog.labs.userAgent.platform.isIos=function(){return goog.labs.userAgent.platform.isIphone()||goog.labs.userAgent.platform.isIpad()||goog.labs.userAgent.platform.isIpod()};goog.labs.userAgent.platform.isMacintosh=function(){return goog.labs.userAgent.util.matchUserAgent("Macintosh")};goog.labs.userAgent.platform.isLinux=function(){return goog.labs.userAgent.util.matchUserAgent("Linux")};goog.labs.userAgent.platform.isWindows=function(){return goog.labs.userAgent.util.matchUserAgent("Windows")};
goog.labs.userAgent.platform.isChromeOS=function(){return goog.labs.userAgent.util.matchUserAgent("CrOS")};
goog.labs.userAgent.platform.getVersion=function(){var a=goog.labs.userAgent.util.getUserAgent(),b="";goog.labs.userAgent.platform.isWindows()?(b=/Windows (?:NT|Phone) ([0-9.]+)/,b=(a=b.exec(a))?a[1]:"0.0"):goog.labs.userAgent.platform.isIos()?(b=/(?:iPhone|iPod|iPad|CPU)\s+OS\s+(\S+)/,b=(a=b.exec(a))&&a[1].replace(/_/g,".")):goog.labs.userAgent.platform.isMacintosh()?(b=/Mac OS X ([0-9_.]+)/,b=(a=b.exec(a))?a[1].replace(/_/g,"."):"10"):goog.labs.userAgent.platform.isAndroid()?(b=/Android\s+([^\);]+)(\)|;)/,
b=(a=b.exec(a))&&a[1]):goog.labs.userAgent.platform.isChromeOS()&&(b=/(?:CrOS\s+(?:i686|x86_64)\s+([0-9.]+))/,b=(a=b.exec(a))&&a[1]);return b||""};goog.labs.userAgent.platform.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.platform.getVersion(),a)};goog.object={};goog.object.forEach=function(a,b,c){for(var d in a)b.call(c,a[d],d,a)};goog.object.filter=function(a,b,c){var d={},e;for(e in a)b.call(c,a[e],e,a)&&(d[e]=a[e]);return d};goog.object.map=function(a,b,c){var d={},e;for(e in a)d[e]=b.call(c,a[e],e,a);return d};goog.object.some=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return!0;return!1};goog.object.every=function(a,b,c){for(var d in a)if(!b.call(c,a[d],d,a))return!1;return!0};
goog.object.getCount=function(a){var b=0,c;for(c in a)b++;return b};goog.object.getAnyKey=function(a){for(var b in a)return b};goog.object.getAnyValue=function(a){for(var b in a)return a[b]};goog.object.contains=function(a,b){return goog.object.containsValue(a,b)};goog.object.getValues=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b};goog.object.getKeys=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b};
goog.object.getValueByKeys=function(a,b){for(var c=goog.isArrayLike(b),d=c?b:arguments,c=c?0:1;c<d.length&&(a=a[d[c]],goog.isDef(a));c++);return a};goog.object.containsKey=function(a,b){return null!==a&&b in a};goog.object.containsValue=function(a,b){for(var c in a)if(a[c]==b)return!0;return!1};goog.object.findKey=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d};goog.object.findValue=function(a,b,c){return(b=goog.object.findKey(a,b,c))&&a[b]};
goog.object.isEmpty=function(a){for(var b in a)return!1;return!0};goog.object.clear=function(a){for(var b in a)delete a[b]};goog.object.remove=function(a,b){var c;(c=b in a)&&delete a[b];return c};goog.object.add=function(a,b,c){if(null!==a&&b in a)throw Error('The object already contains the key "'+b+'"');goog.object.set(a,b,c)};goog.object.get=function(a,b,c){return null!==a&&b in a?a[b]:c};goog.object.set=function(a,b,c){a[b]=c};
goog.object.setIfUndefined=function(a,b,c){return b in a?a[b]:a[b]=c};goog.object.setWithReturnValueIfNotSet=function(a,b,c){if(b in a)return a[b];c=c();return a[b]=c};goog.object.equals=function(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(c in b)if(!(c in a))return!1;return!0};goog.object.clone=function(a){var b={},c;for(c in a)b[c]=a[c];return b};
goog.object.unsafeClone=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(goog.isFunction(a.clone))return a.clone();var b="array"==b?[]:{},c;for(c in a)b[c]=goog.object.unsafeClone(a[c]);return b}return a};goog.object.transpose=function(a){var b={},c;for(c in a)b[a[c]]=c;return b};goog.object.PROTOTYPE_FIELDS_="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<goog.object.PROTOTYPE_FIELDS_.length;f++)c=goog.object.PROTOTYPE_FIELDS_[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};
goog.object.create=function(a){var b=arguments.length;if(1==b&&goog.isArray(arguments[0]))return goog.object.create.apply(null,arguments[0]);if(b%2)throw Error("Uneven number of arguments");for(var c={},d=0;d<b;d+=2)c[arguments[d]]=arguments[d+1];return c};goog.object.createSet=function(a){var b=arguments.length;if(1==b&&goog.isArray(arguments[0]))return goog.object.createSet.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};
goog.object.createImmutableView=function(a){var b=a;Object.isFrozen&&!Object.isFrozen(a)&&(b=Object.create(a),Object.freeze(b));return b};goog.object.isImmutableView=function(a){return!!Object.isFrozen&&Object.isFrozen(a)};goog.labs.userAgent.browser={};goog.labs.userAgent.browser.matchOpera_=function(){return goog.labs.userAgent.util.matchUserAgent("Opera")||goog.labs.userAgent.util.matchUserAgent("OPR")};goog.labs.userAgent.browser.matchIE_=function(){return goog.labs.userAgent.util.matchUserAgent("Trident")||goog.labs.userAgent.util.matchUserAgent("MSIE")};goog.labs.userAgent.browser.matchEdge_=function(){return goog.labs.userAgent.util.matchUserAgent("Edge")};goog.labs.userAgent.browser.matchFirefox_=function(){return goog.labs.userAgent.util.matchUserAgent("Firefox")};
goog.labs.userAgent.browser.matchSafari_=function(){return goog.labs.userAgent.util.matchUserAgent("Safari")&&!(goog.labs.userAgent.browser.matchChrome_()||goog.labs.userAgent.browser.matchCoast_()||goog.labs.userAgent.browser.matchOpera_()||goog.labs.userAgent.browser.matchEdge_()||goog.labs.userAgent.browser.isSilk()||goog.labs.userAgent.util.matchUserAgent("Android"))};goog.labs.userAgent.browser.matchCoast_=function(){return goog.labs.userAgent.util.matchUserAgent("Coast")};
goog.labs.userAgent.browser.matchIosWebview_=function(){return(goog.labs.userAgent.util.matchUserAgent("iPad")||goog.labs.userAgent.util.matchUserAgent("iPhone"))&&!goog.labs.userAgent.browser.matchSafari_()&&!goog.labs.userAgent.browser.matchChrome_()&&!goog.labs.userAgent.browser.matchCoast_()&&goog.labs.userAgent.util.matchUserAgent("AppleWebKit")};
goog.labs.userAgent.browser.matchChrome_=function(){return(goog.labs.userAgent.util.matchUserAgent("Chrome")||goog.labs.userAgent.util.matchUserAgent("CriOS"))&&!goog.labs.userAgent.browser.matchOpera_()&&!goog.labs.userAgent.browser.matchEdge_()};goog.labs.userAgent.browser.matchAndroidBrowser_=function(){return goog.labs.userAgent.util.matchUserAgent("Android")&&!(goog.labs.userAgent.browser.isChrome()||goog.labs.userAgent.browser.isFirefox()||goog.labs.userAgent.browser.isOpera()||goog.labs.userAgent.browser.isSilk())};
goog.labs.userAgent.browser.isOpera=goog.labs.userAgent.browser.matchOpera_;goog.labs.userAgent.browser.isIE=goog.labs.userAgent.browser.matchIE_;goog.labs.userAgent.browser.isEdge=goog.labs.userAgent.browser.matchEdge_;goog.labs.userAgent.browser.isFirefox=goog.labs.userAgent.browser.matchFirefox_;goog.labs.userAgent.browser.isSafari=goog.labs.userAgent.browser.matchSafari_;goog.labs.userAgent.browser.isCoast=goog.labs.userAgent.browser.matchCoast_;goog.labs.userAgent.browser.isIosWebview=goog.labs.userAgent.browser.matchIosWebview_;
goog.labs.userAgent.browser.isChrome=goog.labs.userAgent.browser.matchChrome_;goog.labs.userAgent.browser.isAndroidBrowser=goog.labs.userAgent.browser.matchAndroidBrowser_;goog.labs.userAgent.browser.isSilk=function(){return goog.labs.userAgent.util.matchUserAgent("Silk")};
goog.labs.userAgent.browser.getVersion=function(){function a(a){a=goog.array.find(a,d);return c[a]||""}var b=goog.labs.userAgent.util.getUserAgent();if(goog.labs.userAgent.browser.isIE())return goog.labs.userAgent.browser.getIEVersion_(b);var b=goog.labs.userAgent.util.extractVersionTuples(b),c={};goog.array.forEach(b,function(a){c[a[0]]=a[1]});var d=goog.partial(goog.object.containsKey,c);return goog.labs.userAgent.browser.isOpera()?a(["Version","Opera","OPR"]):goog.labs.userAgent.browser.isEdge()?
a(["Edge"]):goog.labs.userAgent.browser.isChrome()?a(["Chrome","CriOS"]):(b=b[2])&&b[1]||""};goog.labs.userAgent.browser.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.browser.getVersion(),a)};
goog.labs.userAgent.browser.getIEVersion_=function(a){var b=/rv: *([\d\.]*)/.exec(a);if(b&&b[1])return b[1];var b="",c=/MSIE +([\d\.]+)/.exec(a);if(c&&c[1])if(a=/Trident\/(\d.\d)/.exec(a),"7.0"==c[1])if(a&&a[1])switch(a[1]){case "4.0":b="8.0";break;case "5.0":b="9.0";break;case "6.0":b="10.0";break;case "7.0":b="11.0"}else b="7.0";else b=c[1];return b};goog.labs.userAgent.engine={};goog.labs.userAgent.engine.isPresto=function(){return goog.labs.userAgent.util.matchUserAgent("Presto")};goog.labs.userAgent.engine.isTrident=function(){return goog.labs.userAgent.util.matchUserAgent("Trident")||goog.labs.userAgent.util.matchUserAgent("MSIE")};goog.labs.userAgent.engine.isEdge=function(){return goog.labs.userAgent.util.matchUserAgent("Edge")};
goog.labs.userAgent.engine.isWebKit=function(){return goog.labs.userAgent.util.matchUserAgentIgnoreCase("WebKit")&&!goog.labs.userAgent.engine.isEdge()};goog.labs.userAgent.engine.isGecko=function(){return goog.labs.userAgent.util.matchUserAgent("Gecko")&&!goog.labs.userAgent.engine.isWebKit()&&!goog.labs.userAgent.engine.isTrident()&&!goog.labs.userAgent.engine.isEdge()};
goog.labs.userAgent.engine.getVersion=function(){var a=goog.labs.userAgent.util.getUserAgent();if(a){var a=goog.labs.userAgent.util.extractVersionTuples(a),b=goog.labs.userAgent.engine.getEngineTuple_(a);if(b)return"Gecko"==b[0]?goog.labs.userAgent.engine.getVersionForKey_(a,"Firefox"):b[1];var a=a[0],c;if(a&&(c=a[2])&&(c=/Trident\/([^\s;]+)/.exec(c)))return c[1]}return""};
goog.labs.userAgent.engine.getEngineTuple_=function(a){if(!goog.labs.userAgent.engine.isEdge())return a[1];for(var b=0;b<a.length;b++){var c=a[b];if("Edge"==c[0])return c}};goog.labs.userAgent.engine.isVersionOrHigher=function(a){return 0<=goog.string.compareVersions(goog.labs.userAgent.engine.getVersion(),a)};goog.labs.userAgent.engine.getVersionForKey_=function(a,b){var c=goog.array.find(a,function(a){return b==a[0]});return c&&c[1]||""};goog.userAgent={};goog.userAgent.ASSUME_IE=!1;goog.userAgent.ASSUME_EDGE=!1;goog.userAgent.ASSUME_GECKO=!1;goog.userAgent.ASSUME_WEBKIT=!1;goog.userAgent.ASSUME_MOBILE_WEBKIT=!1;goog.userAgent.ASSUME_OPERA=!1;goog.userAgent.ASSUME_ANY_VERSION=!1;goog.userAgent.BROWSER_KNOWN_=goog.userAgent.ASSUME_IE||goog.userAgent.ASSUME_EDGE||goog.userAgent.ASSUME_GECKO||goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_OPERA;goog.userAgent.getUserAgentString=function(){return goog.labs.userAgent.util.getUserAgent()};
goog.userAgent.getNavigator=function(){return goog.global.navigator||null};goog.userAgent.OPERA=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_OPERA:goog.labs.userAgent.browser.isOpera();goog.userAgent.IE=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_IE:goog.labs.userAgent.browser.isIE();goog.userAgent.EDGE=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_EDGE:goog.labs.userAgent.engine.isEdge();goog.userAgent.EDGE_OR_IE=goog.userAgent.EDGE||goog.userAgent.IE;
goog.userAgent.GECKO=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_GECKO:goog.labs.userAgent.engine.isGecko();goog.userAgent.WEBKIT=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_MOBILE_WEBKIT:goog.labs.userAgent.engine.isWebKit();goog.userAgent.isMobile_=function(){return goog.userAgent.WEBKIT&&goog.labs.userAgent.util.matchUserAgent("Mobile")};goog.userAgent.MOBILE=goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.isMobile_();goog.userAgent.SAFARI=goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_=function(){var a=goog.userAgent.getNavigator();return a&&a.platform||""};goog.userAgent.PLATFORM=goog.userAgent.determinePlatform_();goog.userAgent.ASSUME_MAC=!1;goog.userAgent.ASSUME_WINDOWS=!1;goog.userAgent.ASSUME_LINUX=!1;goog.userAgent.ASSUME_X11=!1;goog.userAgent.ASSUME_ANDROID=!1;goog.userAgent.ASSUME_IPHONE=!1;goog.userAgent.ASSUME_IPAD=!1;
goog.userAgent.PLATFORM_KNOWN_=goog.userAgent.ASSUME_MAC||goog.userAgent.ASSUME_WINDOWS||goog.userAgent.ASSUME_LINUX||goog.userAgent.ASSUME_X11||goog.userAgent.ASSUME_ANDROID||goog.userAgent.ASSUME_IPHONE||goog.userAgent.ASSUME_IPAD;goog.userAgent.MAC=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_MAC:goog.labs.userAgent.platform.isMacintosh();goog.userAgent.WINDOWS=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_WINDOWS:goog.labs.userAgent.platform.isWindows();
goog.userAgent.isLegacyLinux_=function(){return goog.labs.userAgent.platform.isLinux()||goog.labs.userAgent.platform.isChromeOS()};goog.userAgent.LINUX=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_LINUX:goog.userAgent.isLegacyLinux_();goog.userAgent.isX11_=function(){var a=goog.userAgent.getNavigator();return!!a&&goog.string.contains(a.appVersion||"","X11")};goog.userAgent.X11=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_X11:goog.userAgent.isX11_();
goog.userAgent.ANDROID=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_ANDROID:goog.labs.userAgent.platform.isAndroid();goog.userAgent.IPHONE=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPHONE:goog.labs.userAgent.platform.isIphone();goog.userAgent.IPAD=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPAD:goog.labs.userAgent.platform.isIpad();goog.userAgent.operaVersion_=function(){var a=goog.global.opera.version;try{return a()}catch(b){return a}};
goog.userAgent.determineVersion_=function(){if(goog.userAgent.OPERA&&goog.global.opera)return goog.userAgent.operaVersion_();var a="",b=goog.userAgent.getVersionRegexResult_();b&&(a=b?b[1]:"");return goog.userAgent.IE&&(b=goog.userAgent.getDocumentMode_(),b>parseFloat(a))?String(b):a};
goog.userAgent.getVersionRegexResult_=function(){var a=goog.userAgent.getUserAgentString();if(goog.userAgent.GECKO)return/rv\:([^\);]+)(\)|;)/.exec(a);if(goog.userAgent.EDGE)return/Edge\/([\d\.]+)/.exec(a);if(goog.userAgent.IE)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(goog.userAgent.WEBKIT)return/WebKit\/(\S+)/.exec(a)};goog.userAgent.getDocumentMode_=function(){var a=goog.global.document;return a?a.documentMode:void 0};goog.userAgent.VERSION=goog.userAgent.determineVersion_();
goog.userAgent.compare=function(a,b){return goog.string.compareVersions(a,b)};goog.userAgent.isVersionOrHigherCache_={};goog.userAgent.isVersionOrHigher=function(a){return goog.userAgent.ASSUME_ANY_VERSION||goog.userAgent.isVersionOrHigherCache_[a]||(goog.userAgent.isVersionOrHigherCache_[a]=0<=goog.string.compareVersions(goog.userAgent.VERSION,a))};goog.userAgent.isVersion=goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher=function(a){return Number(goog.userAgent.DOCUMENT_MODE)>=a};goog.userAgent.isDocumentMode=goog.userAgent.isDocumentModeOrHigher;goog.userAgent.DOCUMENT_MODE=function(){var a=goog.global.document,b=goog.userAgent.getDocumentMode_();return a&&goog.userAgent.IE?b||("CSS1Compat"==a.compatMode?parseInt(goog.userAgent.VERSION,10):5):void 0}();goog.userAgent.product={};goog.userAgent.product.ASSUME_FIREFOX=!1;goog.userAgent.product.ASSUME_IPHONE=!1;goog.userAgent.product.ASSUME_IPAD=!1;goog.userAgent.product.ASSUME_ANDROID=!1;goog.userAgent.product.ASSUME_CHROME=!1;goog.userAgent.product.ASSUME_SAFARI=!1;
goog.userAgent.product.PRODUCT_KNOWN_=goog.userAgent.ASSUME_IE||goog.userAgent.ASSUME_EDGE||goog.userAgent.ASSUME_OPERA||goog.userAgent.product.ASSUME_FIREFOX||goog.userAgent.product.ASSUME_IPHONE||goog.userAgent.product.ASSUME_IPAD||goog.userAgent.product.ASSUME_ANDROID||goog.userAgent.product.ASSUME_CHROME||goog.userAgent.product.ASSUME_SAFARI;goog.userAgent.product.OPERA=goog.userAgent.OPERA;goog.userAgent.product.IE=goog.userAgent.IE;goog.userAgent.product.EDGE=goog.userAgent.EDGE;
goog.userAgent.product.FIREFOX=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_FIREFOX:goog.labs.userAgent.browser.isFirefox();goog.userAgent.product.isIphoneOrIpod_=function(){return goog.labs.userAgent.platform.isIphone()||goog.labs.userAgent.platform.isIpod()};goog.userAgent.product.IPHONE=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_IPHONE:goog.userAgent.product.isIphoneOrIpod_();
goog.userAgent.product.IPAD=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_IPAD:goog.labs.userAgent.platform.isIpad();goog.userAgent.product.ANDROID=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_ANDROID:goog.labs.userAgent.browser.isAndroidBrowser();goog.userAgent.product.CHROME=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_CHROME:goog.labs.userAgent.browser.isChrome();
goog.userAgent.product.isSafariDesktop_=function(){return goog.labs.userAgent.browser.isSafari()&&!goog.labs.userAgent.platform.isIos()};goog.userAgent.product.SAFARI=goog.userAgent.product.PRODUCT_KNOWN_?goog.userAgent.product.ASSUME_SAFARI:goog.userAgent.product.isSafariDesktop_();goog.crypt.base64={};goog.crypt.base64.byteToCharMap_=null;goog.crypt.base64.charToByteMap_=null;goog.crypt.base64.byteToCharMapWebSafe_=null;goog.crypt.base64.ENCODED_VALS_BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";goog.crypt.base64.ENCODED_VALS=goog.crypt.base64.ENCODED_VALS_BASE+"+/=";goog.crypt.base64.ENCODED_VALS_WEBSAFE=goog.crypt.base64.ENCODED_VALS_BASE+"-_.";
goog.crypt.base64.ASSUME_NATIVE_SUPPORT_=goog.userAgent.GECKO||goog.userAgent.WEBKIT&&!goog.userAgent.product.SAFARI||goog.userAgent.OPERA;goog.crypt.base64.HAS_NATIVE_ENCODE_=goog.crypt.base64.ASSUME_NATIVE_SUPPORT_||"function"==typeof goog.global.btoa;goog.crypt.base64.HAS_NATIVE_DECODE_=goog.crypt.base64.ASSUME_NATIVE_SUPPORT_||!goog.userAgent.product.SAFARI&&!goog.userAgent.IE&&"function"==typeof goog.global.atob;
goog.crypt.base64.encodeByteArray=function(a,b){goog.asserts.assert(goog.isArrayLike(a),"encodeByteArray takes an array as a parameter");goog.crypt.base64.init_();for(var c=b?goog.crypt.base64.byteToCharMapWebSafe_:goog.crypt.base64.byteToCharMap_,d=[],e=0;e<a.length;e+=3){var f=a[e],g=e+1<a.length,h=g?a[e+1]:0,k=e+2<a.length,l=k?a[e+2]:0,p=f>>2,f=(f&3)<<4|h>>4,h=(h&15)<<2|l>>6,l=l&63;k||(l=64,g||(h=64));d.push(c[p],c[f],c[h],c[l])}return d.join("")};
goog.crypt.base64.encodeString=function(a,b){return goog.crypt.base64.HAS_NATIVE_ENCODE_&&!b?goog.global.btoa(a):goog.crypt.base64.encodeByteArray(goog.crypt.stringToByteArray(a),b)};goog.crypt.base64.decodeString=function(a,b){if(goog.crypt.base64.HAS_NATIVE_DECODE_&&!b)return goog.global.atob(a);var c="";goog.crypt.base64.decodeStringInternal_(a,function(a){c+=String.fromCharCode(a)});return c};
goog.crypt.base64.decodeStringToByteArray=function(a,b){var c=[];goog.crypt.base64.decodeStringInternal_(a,function(a){c.push(a)});return c};goog.crypt.base64.decodeStringToUint8Array=function(a){goog.asserts.assert(!goog.userAgent.IE||goog.userAgent.isVersionOrHigher("10"),"Browser does not support typed arrays");var b=new Uint8Array(Math.ceil(3*a.length/4)),c=0;goog.crypt.base64.decodeStringInternal_(a,function(a){b[c++]=a});return b.subarray(0,c)};
goog.crypt.base64.decodeStringInternal_=function(a,b){function c(b){for(;d<a.length;){var c=a.charAt(d++),e=goog.crypt.base64.charToByteMap_[c];if(null!=e)return e;if(!goog.string.isEmptyOrWhitespace(c))throw Error("Unknown base64 encoding at char: "+c);}return b}goog.crypt.base64.init_();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),h=c(64);if(64===h&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=h&&b(g<<6&192|h))}};
goog.crypt.base64.init_=function(){if(!goog.crypt.base64.byteToCharMap_){goog.crypt.base64.byteToCharMap_={};goog.crypt.base64.charToByteMap_={};goog.crypt.base64.byteToCharMapWebSafe_={};for(var a=0;a<goog.crypt.base64.ENCODED_VALS.length;a++)goog.crypt.base64.byteToCharMap_[a]=goog.crypt.base64.ENCODED_VALS.charAt(a),goog.crypt.base64.charToByteMap_[goog.crypt.base64.byteToCharMap_[a]]=a,goog.crypt.base64.byteToCharMapWebSafe_[a]=goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(a),a>=goog.crypt.base64.ENCODED_VALS_BASE.length&&
(goog.crypt.base64.charToByteMap_[goog.crypt.base64.ENCODED_VALS_WEBSAFE.charAt(a)]=a)}};jspb.ExtensionFieldInfo=function(a,b,c,d,e){this.fieldIndex=a;this.fieldName=b;this.ctor=c;this.toObjectFn=d;this.isRepeated=e};jspb.ExtensionFieldBinaryInfo=function(a,b,c,d,e,f){this.fieldInfo=a;this.binaryReaderFn=b;this.binaryWriterFn=c;this.binaryMessageSerializeFn=d;this.binaryMessageDeserializeFn=e;this.isPacked=f};jspb.ExtensionFieldInfo.prototype.isMessageType=function(){return!!this.ctor};jspb.Message=function(){};jspb.Message.GENERATE_TO_OBJECT=!0;jspb.Message.GENERATE_FROM_OBJECT=!goog.DISALLOW_TEST_ONLY_CODE;
jspb.Message.GENERATE_TO_STRING=!0;jspb.Message.ASSUME_LOCAL_ARRAYS=!1;jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS=COMPILED;jspb.Message.SUPPORTS_UINT8ARRAY_="function"==typeof Uint8Array;jspb.Message.prototype.getJsPbMessageId=function(){return this.messageId_};jspb.Message.getIndex_=function(a,b){return b+a.arrayIndexOffset_};
jspb.Message.initialize=function(a,b,c,d,e,f){a.wrappers_=jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS?null:{};b||(b=c?[c]:[]);a.messageId_=c?String(c):void 0;a.arrayIndexOffset_=0===c?-1:0;a.array=b;jspb.Message.initPivotAndExtensionObject_(a,d);a.convertedFloatingPointFields_={};if(e)for(b=0;b<e.length;b++)c=e[b],c<a.pivot_?(c=jspb.Message.getIndex_(a,c),a.array[c]=a.array[c]||(jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS?jspb.Message.EMPTY_LIST_SENTINEL_:[])):(jspb.Message.maybeInitEmptyExtensionObject_(a),
a.extensionObject_[c]=a.extensionObject_[c]||(jspb.Message.MINIMIZE_MEMORY_ALLOCATIONS?jspb.Message.EMPTY_LIST_SENTINEL_:[]));f&&f.length&&goog.array.forEach(f,goog.partial(jspb.Message.computeOneofCase,a))};jspb.Message.EMPTY_LIST_SENTINEL_=goog.DEBUG&&Object.freeze?Object.freeze([]):[];jspb.Message.isArray_=function(a){return jspb.Message.ASSUME_LOCAL_ARRAYS?a instanceof Array:goog.isArray(a)};
jspb.Message.initPivotAndExtensionObject_=function(a,b){if(a.array.length){var c=a.array.length-1,d=a.array[c];if(d&&"object"==typeof d&&!jspb.Message.isArray_(d)&&!(jspb.Message.SUPPORTS_UINT8ARRAY_&&d instanceof Uint8Array)){a.pivot_=c-a.arrayIndexOffset_;a.extensionObject_=d;return}}-1<b?(a.pivot_=b,a.extensionObject_=null):a.pivot_=Number.MAX_VALUE};jspb.Message.maybeInitEmptyExtensionObject_=function(a){var b=jspb.Message.getIndex_(a,a.pivot_);a.array[b]||(a.extensionObject_=a.array[b]={})};
jspb.Message.toObjectList=function(a,b,c){for(var d=[],e=0;e<a.length;e++)d[e]=b.call(a[e],c,a[e]);return d};jspb.Message.toObjectExtension=function(a,b,c,d,e){for(var f in c){var g=c[f],h=d.call(a,g);if(null!=h){for(var k in g.fieldName)if(g.fieldName.hasOwnProperty(k))break;b[k]=g.toObjectFn?g.isRepeated?jspb.Message.toObjectList(h,g.toObjectFn,e):g.toObjectFn(e,h):h}}};
jspb.Message.serializeBinaryExtensions=function(a,b,c,d){for(var e in c){var f=c[e],g=f.fieldInfo;if(!f.binaryWriterFn)throw Error("Message extension present that was generated without binary serialization support");var h=d.call(a,g);if(null!=h)if(g.isMessageType())if(f.binaryMessageSerializeFn)f.binaryWriterFn.call(b,g.fieldIndex,h,f.binaryMessageSerializeFn);else throw Error("Message extension present holding submessage without binary support enabled, and message is being serialized to binary format");
else f.binaryWriterFn.call(b,g.fieldIndex,h)}};jspb.Message.readBinaryExtension=function(a,b,c,d,e){var f=c[b.getFieldNumber()];if(f){c=f.fieldInfo;if(!f.binaryReaderFn)throw Error("Deserializing extension whose generated code does not support binary format");var g;c.isMessageType()?(g=new c.ctor,f.binaryReaderFn.call(b,g,f.binaryMessageDeserializeFn)):g=f.binaryReaderFn.call(b);c.isRepeated&&!f.isPacked?(b=d.call(a,c))?b.push(g):e.call(a,c,[g]):e.call(a,c,g)}else b.skipField()};
jspb.Message.getField=function(a,b){if(b<a.pivot_){var c=jspb.Message.getIndex_(a,b),d=a.array[c];return d===jspb.Message.EMPTY_LIST_SENTINEL_?a.array[c]=[]:d}if(a.extensionObject_)return d=a.extensionObject_[b],d===jspb.Message.EMPTY_LIST_SENTINEL_?a.extensionObject_[b]=[]:d};
jspb.Message.getRepeatedField=function(a,b){if(b<a.pivot_){var c=jspb.Message.getIndex_(a,b),d=a.array[c];return d===jspb.Message.EMPTY_LIST_SENTINEL_?a.array[c]=[]:d}d=a.extensionObject_[b];return d===jspb.Message.EMPTY_LIST_SENTINEL_?a.extensionObject_[b]=[]:d};jspb.Message.getOptionalFloatingPointField=function(a,b){var c=jspb.Message.getField(a,b);return null==c?c:+c};
jspb.Message.getRepeatedFloatingPointField=function(a,b){var c=jspb.Message.getRepeatedField(a,b);a.convertedFloatingPointFields_||(a.convertedFloatingPointFields_={});if(!a.convertedFloatingPointFields_[b]){for(var d=0;d<c.length;d++)c[d]=+c[d];a.convertedFloatingPointFields_[b]=!0}return c};
jspb.Message.bytesAsB64=function(a){if(null==a||goog.isString(a))return a;if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a instanceof Uint8Array)return goog.crypt.base64.encodeByteArray(a);goog.asserts.fail("Cannot coerce to b64 string: "+goog.typeOf(a));return null};jspb.Message.bytesAsU8=function(a){if(null==a||a instanceof Uint8Array)return a;if(goog.isString(a))return goog.crypt.base64.decodeStringToUint8Array(a);goog.asserts.fail("Cannot coerce to Uint8Array: "+goog.typeOf(a));return null};
jspb.Message.bytesListAsB64=function(a){jspb.Message.assertConsistentTypes_(a);return!a.length||goog.isString(a[0])?a:goog.array.map(a,jspb.Message.bytesAsB64)};jspb.Message.bytesListAsU8=function(a){jspb.Message.assertConsistentTypes_(a);return!a.length||a[0]instanceof Uint8Array?a:goog.array.map(a,jspb.Message.bytesAsU8)};
jspb.Message.assertConsistentTypes_=function(a){if(goog.DEBUG&&a&&1<a.length){var b=goog.typeOf(a[0]);goog.array.forEach(a,function(a){goog.typeOf(a)!=b&&goog.asserts.fail("Inconsistent type in JSPB repeated field array. Got "+goog.typeOf(a)+" expected "+b)})}};jspb.Message.getFieldWithDefault=function(a,b,c){a=jspb.Message.getField(a,b);return null==a?c:a};jspb.Message.getFieldProto3=jspb.Message.getFieldWithDefault;
jspb.Message.getMapField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});if(b in a.wrappers_)return a.wrappers_[b];if(!c)return c=jspb.Message.getField(a,b),c||(c=[],jspb.Message.setField(a,b,c)),a.wrappers_[b]=new jspb.Map(c,d)};jspb.Message.setField=function(a,b,c){b<a.pivot_?a.array[jspb.Message.getIndex_(a,b)]=c:(jspb.Message.maybeInitEmptyExtensionObject_(a),a.extensionObject_[b]=c)};jspb.Message.setProto3IntField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};
jspb.Message.setProto3FloatField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};jspb.Message.setProto3BooleanField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,!1)};jspb.Message.setProto3StringField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,"")};jspb.Message.setProto3BytesField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,"")};jspb.Message.setProto3EnumField=function(a,b,c){jspb.Message.setFieldIgnoringDefault_(a,b,c,0)};
jspb.Message.setFieldIgnoringDefault_=function(a,b,c,d){c!=d?jspb.Message.setField(a,b,c):a.array[jspb.Message.getIndex_(a,b)]=null};jspb.Message.addToRepeatedField=function(a,b,c,d){a=jspb.Message.getRepeatedField(a,b);void 0!=d?a.splice(d,0,c):a.push(c)};jspb.Message.setOneofField=function(a,b,c,d){(c=jspb.Message.computeOneofCase(a,c))&&c!==b&&void 0!==d&&(a.wrappers_&&c in a.wrappers_&&(a.wrappers_[c]=void 0),jspb.Message.setField(a,c,void 0));jspb.Message.setField(a,b,d)};
jspb.Message.computeOneofCase=function(a,b){var c,d;goog.array.forEach(b,function(b){var f=jspb.Message.getField(a,b);goog.isDefAndNotNull(f)&&(c=b,d=f,jspb.Message.setField(a,b,void 0))});return c?(jspb.Message.setField(a,c,d),c):0};jspb.Message.getWrapperField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});if(!a.wrappers_[c]){var e=jspb.Message.getField(a,c);if(d||e)a.wrappers_[c]=new b(e)}return a.wrappers_[c]};
jspb.Message.getRepeatedWrapperField=function(a,b,c){jspb.Message.wrapRepeatedField_(a,b,c);b=a.wrappers_[c];b==jspb.Message.EMPTY_LIST_SENTINEL_&&(b=a.wrappers_[c]=[]);return b};jspb.Message.wrapRepeatedField_=function(a,b,c){a.wrappers_||(a.wrappers_={});if(!a.wrappers_[c]){for(var d=jspb.Message.getRepeatedField(a,c),e=[],f=0;f<d.length;f++)e[f]=new b(d[f]);a.wrappers_[c]=e}};
jspb.Message.setWrapperField=function(a,b,c){a.wrappers_||(a.wrappers_={});var d=c?c.toArray():c;a.wrappers_[b]=c;jspb.Message.setField(a,b,d)};jspb.Message.setOneofWrapperField=function(a,b,c,d){a.wrappers_||(a.wrappers_={});var e=d?d.toArray():d;a.wrappers_[b]=d;jspb.Message.setOneofField(a,b,c,e)};jspb.Message.setRepeatedWrapperField=function(a,b,c){a.wrappers_||(a.wrappers_={});c=c||[];for(var d=[],e=0;e<c.length;e++)d[e]=c[e].toArray();a.wrappers_[b]=c;jspb.Message.setField(a,b,d)};
jspb.Message.addToRepeatedWrapperField=function(a,b,c,d,e){jspb.Message.wrapRepeatedField_(a,d,b);var f=a.wrappers_[b];f||(f=a.wrappers_[b]=[]);c=c?c:new d;a=jspb.Message.getRepeatedField(a,b);void 0!=e?(f.splice(e,0,c),a.splice(e,0,c.toArray())):(f.push(c),a.push(c.toArray()));return c};jspb.Message.toMap=function(a,b,c,d){for(var e={},f=0;f<a.length;f++)e[b.call(a[f])]=c?c.call(a[f],d,a[f]):a[f];return e};
jspb.Message.prototype.syncMapFields_=function(){if(this.wrappers_)for(var a in this.wrappers_){var b=this.wrappers_[a];if(goog.isArray(b))for(var c=0;c<b.length;c++)b[c]&&b[c].toArray();else b&&b.toArray()}};jspb.Message.prototype.toArray=function(){this.syncMapFields_();return this.array};jspb.Message.GENERATE_TO_STRING&&(jspb.Message.prototype.toString=function(){this.syncMapFields_();return this.array.toString()});
jspb.Message.prototype.getExtension=function(a){if(this.extensionObject_){this.wrappers_||(this.wrappers_={});var b=a.fieldIndex;if(a.isRepeated){if(a.isMessageType())return this.wrappers_[b]||(this.wrappers_[b]=goog.array.map(this.extensionObject_[b]||[],function(b){return new a.ctor(b)})),this.wrappers_[b]}else if(a.isMessageType())return!this.wrappers_[b]&&this.extensionObject_[b]&&(this.wrappers_[b]=new a.ctor(this.extensionObject_[b])),this.wrappers_[b];return this.extensionObject_[b]}};
jspb.Message.prototype.setExtension=function(a,b){this.wrappers_||(this.wrappers_={});jspb.Message.maybeInitEmptyExtensionObject_(this);var c=a.fieldIndex;a.isRepeated?(b=b||[],a.isMessageType()?(this.wrappers_[c]=b,this.extensionObject_[c]=goog.array.map(b,function(a){return a.toArray()})):this.extensionObject_[c]=b):a.isMessageType()?(this.wrappers_[c]=b,this.extensionObject_[c]=b?b.toArray():b):this.extensionObject_[c]=b;return this};
jspb.Message.difference=function(a,b){if(!(a instanceof b.constructor))throw Error("Messages have different types.");var c=a.toArray(),d=b.toArray(),e=[],f=0,g=c.length>d.length?c.length:d.length;a.getJsPbMessageId()&&(e[0]=a.getJsPbMessageId(),f=1);for(;f<g;f++)jspb.Message.compareFields(c[f],d[f])||(e[f]=d[f]);return new a.constructor(e)};jspb.Message.equals=function(a,b){return a==b||!(!a||!b)&&a instanceof b.constructor&&jspb.Message.compareFields(a.toArray(),b.toArray())};
jspb.Message.compareExtensions=function(a,b){a=a||{};b=b||{};var c={},d;for(d in a)c[d]=0;for(d in b)c[d]=0;for(d in c)if(!jspb.Message.compareFields(a[d],b[d]))return!1;return!0};
jspb.Message.compareFields=function(a,b){if(a==b)return!0;if(!goog.isObject(a)||!goog.isObject(b)||a.constructor!=b.constructor)return!1;if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a.constructor===Uint8Array){if(a.length!=b.length)return!1;for(var c=0;c<a.length;c++)if(a[c]!=b[c])return!1;return!0}if(a.constructor===Array){for(var d=void 0,e=void 0,f=Math.max(a.length,b.length),c=0;c<f;c++){var g=a[c],h=b[c];g&&g.constructor==Object&&(goog.asserts.assert(void 0===d),goog.asserts.assert(c===a.length-1),
d=g,g=void 0);h&&h.constructor==Object&&(goog.asserts.assert(void 0===e),goog.asserts.assert(c===b.length-1),e=h,h=void 0);if(!jspb.Message.compareFields(g,h))return!1}return d||e?(d=d||{},e=e||{},jspb.Message.compareExtensions(d,e)):!0}if(a.constructor===Object)return jspb.Message.compareExtensions(a,b);throw Error("Invalid type in JSPB array");};jspb.Message.prototype.cloneMessage=function(){return jspb.Message.cloneMessage(this)};jspb.Message.prototype.clone=function(){return jspb.Message.cloneMessage(this)};
jspb.Message.clone=function(a){return jspb.Message.cloneMessage(a)};jspb.Message.cloneMessage=function(a){return new a.constructor(jspb.Message.clone_(a.toArray()))};
jspb.Message.copyInto=function(a,b){goog.asserts.assertInstanceof(a,jspb.Message);goog.asserts.assertInstanceof(b,jspb.Message);goog.asserts.assert(a.constructor==b.constructor,"Copy source and target message should have the same type.");for(var c=jspb.Message.clone(a),d=b.toArray(),e=c.toArray(),f=d.length=0;f<e.length;f++)d[f]=e[f];b.wrappers_=c.wrappers_;b.extensionObject_=c.extensionObject_};
jspb.Message.clone_=function(a){var b;if(goog.isArray(a)){for(var c=Array(a.length),d=0;d<a.length;d++)null!=(b=a[d])&&(c[d]="object"==typeof b?jspb.Message.clone_(b):b);return c}if(jspb.Message.SUPPORTS_UINT8ARRAY_&&a instanceof Uint8Array)return new Uint8Array(a);c={};for(d in a)null!=(b=a[d])&&(c[d]="object"==typeof b?jspb.Message.clone_(b):b);return c};jspb.Message.registerMessageType=function(a,b){jspb.Message.registry_[a]=b;b.messageId=a};jspb.Message.registry_={};
jspb.Message.messageSetExtensions={};jspb.Message.messageSetExtensionsBinary={};jspb.arith={};jspb.arith.UInt64=function(a,b){this.lo=a;this.hi=b};jspb.arith.UInt64.prototype.cmp=function(a){return this.hi<a.hi||this.hi==a.hi&&this.lo<a.lo?-1:this.hi==a.hi&&this.lo==a.lo?0:1};jspb.arith.UInt64.prototype.rightShift=function(){return new jspb.arith.UInt64((this.lo>>>1|(this.hi&1)<<31)>>>0,this.hi>>>1>>>0)};jspb.arith.UInt64.prototype.leftShift=function(){return new jspb.arith.UInt64(this.lo<<1>>>0,(this.hi<<1|this.lo>>>31)>>>0)};
jspb.arith.UInt64.prototype.msb=function(){return!!(this.hi&2147483648)};jspb.arith.UInt64.prototype.lsb=function(){return!!(this.lo&1)};jspb.arith.UInt64.prototype.zero=function(){return 0==this.lo&&0==this.hi};jspb.arith.UInt64.prototype.add=function(a){return new jspb.arith.UInt64((this.lo+a.lo&4294967295)>>>0>>>0,((this.hi+a.hi&4294967295)>>>0)+(4294967296<=this.lo+a.lo?1:0)>>>0)};
jspb.arith.UInt64.prototype.sub=function(a){return new jspb.arith.UInt64((this.lo-a.lo&4294967295)>>>0>>>0,((this.hi-a.hi&4294967295)>>>0)-(0>this.lo-a.lo?1:0)>>>0)};jspb.arith.UInt64.mul32x32=function(a,b){for(var c=a&65535,d=a>>>16,e=b&65535,f=b>>>16,g=c*e+65536*(c*f&65535)+65536*(d*e&65535),c=d*f+(c*f>>>16)+(d*e>>>16);4294967296<=g;)g-=4294967296,c+=1;return new jspb.arith.UInt64(g>>>0,c>>>0)};
jspb.arith.UInt64.prototype.mul=function(a){var b=jspb.arith.UInt64.mul32x32(this.lo,a);a=jspb.arith.UInt64.mul32x32(this.hi,a);a.hi=a.lo;a.lo=0;return b.add(a)};
jspb.arith.UInt64.prototype.div=function(a){if(0==a)return[];var b=new jspb.arith.UInt64(0,0),c=new jspb.arith.UInt64(this.lo,this.hi);a=new jspb.arith.UInt64(a,0);for(var d=new jspb.arith.UInt64(1,0);!a.msb();)a=a.leftShift(),d=d.leftShift();for(;!d.zero();)0>=a.cmp(c)&&(b=b.add(d),c=c.sub(a)),a=a.rightShift(),d=d.rightShift();return[b,c]};jspb.arith.UInt64.prototype.toString=function(){for(var a="",b=this;!b.zero();)var b=b.div(10),c=b[0],a=b[1].lo+a,b=c;""==a&&(a="0");return a};
jspb.arith.UInt64.fromString=function(a){for(var b=new jspb.arith.UInt64(0,0),c=new jspb.arith.UInt64(0,0),d=0;d<a.length;d++){if("0">a[d]||"9"<a[d])return null;var e=parseInt(a[d],10);c.lo=e;b=b.mul(10).add(c)}return b};jspb.arith.UInt64.prototype.clone=function(){return new jspb.arith.UInt64(this.lo,this.hi)};jspb.arith.Int64=function(a,b){this.lo=a;this.hi=b};
jspb.arith.Int64.prototype.add=function(a){return new jspb.arith.Int64((this.lo+a.lo&4294967295)>>>0>>>0,((this.hi+a.hi&4294967295)>>>0)+(4294967296<=this.lo+a.lo?1:0)>>>0)};jspb.arith.Int64.prototype.sub=function(a){return new jspb.arith.Int64((this.lo-a.lo&4294967295)>>>0>>>0,((this.hi-a.hi&4294967295)>>>0)-(0>this.lo-a.lo?1:0)>>>0)};jspb.arith.Int64.prototype.clone=function(){return new jspb.arith.Int64(this.lo,this.hi)};
jspb.arith.Int64.prototype.toString=function(){var a=0!=(this.hi&2147483648),b=new jspb.arith.UInt64(this.lo,this.hi);a&&(b=(new jspb.arith.UInt64(0,0)).sub(b));return(a?"-":"")+b.toString()};jspb.arith.Int64.fromString=function(a){var b=0<a.length&&"-"==a[0];b&&(a=a.substring(1));a=jspb.arith.UInt64.fromString(a);if(null===a)return null;b&&(a=(new jspb.arith.UInt64(0,0)).sub(a));return new jspb.arith.Int64(a.lo,a.hi)};jspb.BinaryConstants={};jspb.ConstBinaryMessage=function(){};jspb.BinaryMessage=function(){};jspb.BinaryConstants.FieldType={INVALID:-1,DOUBLE:1,FLOAT:2,INT64:3,UINT64:4,INT32:5,FIXED64:6,FIXED32:7,BOOL:8,STRING:9,GROUP:10,MESSAGE:11,BYTES:12,UINT32:13,ENUM:14,SFIXED32:15,SFIXED64:16,SINT32:17,SINT64:18,FHASH64:30,VHASH64:31};jspb.BinaryConstants.WireType={INVALID:-1,VARINT:0,FIXED64:1,DELIMITED:2,START_GROUP:3,END_GROUP:4,FIXED32:5};
jspb.BinaryConstants.FieldTypeToWireType=function(a){var b=jspb.BinaryConstants.FieldType,c=jspb.BinaryConstants.WireType;switch(a){case b.INT32:case b.INT64:case b.UINT32:case b.UINT64:case b.SINT32:case b.SINT64:case b.BOOL:case b.ENUM:case b.VHASH64:return c.VARINT;case b.DOUBLE:case b.FIXED64:case b.SFIXED64:case b.FHASH64:return c.FIXED64;case b.STRING:case b.MESSAGE:case b.BYTES:return c.DELIMITED;case b.FLOAT:case b.FIXED32:case b.SFIXED32:return c.FIXED32;default:return c.INVALID}};
jspb.BinaryConstants.INVALID_FIELD_NUMBER=-1;jspb.BinaryConstants.FLOAT32_EPS=1.401298464324817E-45;jspb.BinaryConstants.FLOAT32_MIN=1.1754943508222875E-38;jspb.BinaryConstants.FLOAT32_MAX=3.4028234663852886E38;jspb.BinaryConstants.FLOAT64_EPS=4.9E-324;jspb.BinaryConstants.FLOAT64_MIN=2.2250738585072014E-308;jspb.BinaryConstants.FLOAT64_MAX=1.7976931348623157E308;jspb.BinaryConstants.TWO_TO_20=1048576;jspb.BinaryConstants.TWO_TO_23=8388608;jspb.BinaryConstants.TWO_TO_31=2147483648;
jspb.BinaryConstants.TWO_TO_32=4294967296;jspb.BinaryConstants.TWO_TO_52=4503599627370496;jspb.BinaryConstants.TWO_TO_63=0x7fffffffffffffff;jspb.BinaryConstants.TWO_TO_64=1.8446744073709552E19;jspb.BinaryConstants.ZERO_HASH="\x00\x00\x00\x00\x00\x00\x00\x00";jspb.utils={};jspb.utils.split64Low=0;jspb.utils.split64High=0;jspb.utils.splitUint64=function(a){var b=a>>>0;a=Math.floor((a-b)/jspb.BinaryConstants.TWO_TO_32)>>>0;jspb.utils.split64Low=b;jspb.utils.split64High=a};jspb.utils.splitInt64=function(a){var b=0>a;a=Math.abs(a);var c=a>>>0;a=Math.floor((a-c)/jspb.BinaryConstants.TWO_TO_32);a>>>=0;b&&(a=~a>>>0,c=(~c>>>0)+1,4294967295<c&&(c=0,a++,4294967295<a&&(a=0)));jspb.utils.split64Low=c;jspb.utils.split64High=a};
jspb.utils.splitZigzag64=function(a){var b=0>a;a=2*Math.abs(a);jspb.utils.splitUint64(a);a=jspb.utils.split64Low;var c=jspb.utils.split64High;b&&(0==a?0==c?c=a=4294967295:(c--,a=4294967295):a--);jspb.utils.split64Low=a;jspb.utils.split64High=c};
jspb.utils.splitFloat32=function(a){var b=0>a?1:0;a=b?-a:a;var c;0===a?0<1/a?(jspb.utils.split64High=0,jspb.utils.split64Low=0):(jspb.utils.split64High=0,jspb.utils.split64Low=2147483648):isNaN(a)?(jspb.utils.split64High=0,jspb.utils.split64Low=2147483647):a>jspb.BinaryConstants.FLOAT32_MAX?(jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|2139095040)>>>0):a<jspb.BinaryConstants.FLOAT32_MIN?(a=Math.round(a/Math.pow(2,-149)),jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|a)>>>0):(c=Math.floor(Math.log(a)/
Math.LN2),a*=Math.pow(2,-c),a=Math.round(a*jspb.BinaryConstants.TWO_TO_23)&8388607,jspb.utils.split64High=0,jspb.utils.split64Low=(b<<31|c+127<<23|a)>>>0)};
jspb.utils.splitFloat64=function(a){var b=0>a?1:0;a=b?-a:a;if(0===a)jspb.utils.split64High=0<1/a?0:2147483648,jspb.utils.split64Low=0;else if(isNaN(a))jspb.utils.split64High=2147483647,jspb.utils.split64Low=4294967295;else if(a>jspb.BinaryConstants.FLOAT64_MAX)jspb.utils.split64High=(b<<31|2146435072)>>>0,jspb.utils.split64Low=0;else if(a<jspb.BinaryConstants.FLOAT64_MIN){var c=a/Math.pow(2,-1074);a=c/jspb.BinaryConstants.TWO_TO_32;jspb.utils.split64High=(b<<31|a)>>>0;jspb.utils.split64Low=c>>>0}else{var d=
Math.floor(Math.log(a)/Math.LN2);1024==d&&(d=1023);c=a*Math.pow(2,-d);a=c*jspb.BinaryConstants.TWO_TO_20&1048575;c=c*jspb.BinaryConstants.TWO_TO_52>>>0;jspb.utils.split64High=(b<<31|d+1023<<20|a)>>>0;jspb.utils.split64Low=c}};
jspb.utils.splitHash64=function(a){var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=a.charCodeAt(4),g=a.charCodeAt(5),h=a.charCodeAt(6);a=a.charCodeAt(7);jspb.utils.split64Low=b+(c<<8)+(d<<16)+(e<<24)>>>0;jspb.utils.split64High=f+(g<<8)+(h<<16)+(a<<24)>>>0};jspb.utils.joinUint64=function(a,b){return b*jspb.BinaryConstants.TWO_TO_32+a};
jspb.utils.joinInt64=function(a,b){var c=b&2147483648;c&&(a=~a+1>>>0,b=~b>>>0,0==a&&(b=b+1>>>0));var d=jspb.utils.joinUint64(a,b);return c?-d:d};jspb.utils.joinZigzag64=function(a,b){var c=a&1;a=(a>>>1|b<<31)>>>0;b>>>=1;c&&(a=a+1>>>0,0==a&&(b=b+1>>>0));var d=jspb.utils.joinUint64(a,b);return c?-d:d};jspb.utils.joinFloat32=function(a,b){var c=2*(a>>31)+1,d=a>>>23&255,e=a&8388607;return 255==d?e?NaN:Infinity*c:0==d?c*Math.pow(2,-149)*e:c*Math.pow(2,d-150)*(e+Math.pow(2,23))};
jspb.utils.joinFloat64=function(a,b){var c=2*(b>>31)+1,d=b>>>20&2047,e=jspb.BinaryConstants.TWO_TO_32*(b&1048575)+a;return 2047==d?e?NaN:Infinity*c:0==d?c*Math.pow(2,-1074)*e:c*Math.pow(2,d-1075)*(e+jspb.BinaryConstants.TWO_TO_52)};jspb.utils.joinHash64=function(a,b){return String.fromCharCode(a>>>0&255,a>>>8&255,a>>>16&255,a>>>24&255,b>>>0&255,b>>>8&255,b>>>16&255,b>>>24&255)};jspb.utils.DIGITS="0123456789abcdef".split("");
jspb.utils.joinUnsignedDecimalString=function(a,b){function c(a){for(var b=1E7,c=0;7>c;c++){var b=b/10,d=a/b%10>>>0;if(0!=d||h)h=!0,k+=g[d]}}if(2097151>=b)return""+(jspb.BinaryConstants.TWO_TO_32*b+a);var d=(a>>>24|b<<8)>>>0&16777215,e=b>>16&65535,f=(a&16777215)+6777216*d+6710656*e,d=d+8147497*e,e=2*e;1E7<=f&&(d+=Math.floor(f/1E7),f%=1E7);1E7<=d&&(e+=Math.floor(d/1E7),d%=1E7);var g=jspb.utils.DIGITS,h=!1,k="";(e||h)&&c(e);(d||h)&&c(d);(f||h)&&c(f);return k};
jspb.utils.joinSignedDecimalString=function(a,b){var c=b&2147483648;c&&(a=~a+1>>>0,b=~b+(0==a?1:0)>>>0);var d=jspb.utils.joinUnsignedDecimalString(a,b);return c?"-"+d:d};jspb.utils.hash64ToDecimalString=function(a,b){jspb.utils.splitHash64(a);var c=jspb.utils.split64Low,d=jspb.utils.split64High;return b?jspb.utils.joinSignedDecimalString(c,d):jspb.utils.joinUnsignedDecimalString(c,d)};
jspb.utils.hash64ArrayToDecimalStrings=function(a,b){for(var c=Array(a.length),d=0;d<a.length;d++)c[d]=jspb.utils.hash64ToDecimalString(a[d],b);return c};
jspb.utils.decimalStringToHash64=function(a){function b(a,b){for(var c=0;8>c&&(1!==a||0<b);c++){var d=a*e[c]+b;e[c]=d&255;b=d>>>8}}function c(){for(var a=0;8>a;a++)e[a]=~e[a]&255}goog.asserts.assert(0<a.length);var d=!1;"-"===a[0]&&(d=!0,a=a.slice(1));for(var e=[0,0,0,0,0,0,0,0],f=0;f<a.length;f++)b(10,jspb.utils.DIGITS.indexOf(a[f]));d&&(c(),b(1,1));return goog.crypt.byteArrayToString(e)};jspb.utils.splitDecimalString=function(a){jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(a))};
jspb.utils.hash64ToHexString=function(a){var b=Array(18);b[0]="0";b[1]="x";for(var c=0;8>c;c++){var d=a.charCodeAt(7-c);b[2*c+2]=jspb.utils.DIGITS[d>>4];b[2*c+3]=jspb.utils.DIGITS[d&15]}return b.join("")};jspb.utils.hexStringToHash64=function(a){a=a.toLowerCase();goog.asserts.assert(18==a.length);goog.asserts.assert("0"==a[0]);goog.asserts.assert("x"==a[1]);for(var b="",c=0;8>c;c++)var d=jspb.utils.DIGITS.indexOf(a[2*c+2]),e=jspb.utils.DIGITS.indexOf(a[2*c+3]),b=String.fromCharCode(16*d+e)+b;return b};
jspb.utils.hash64ToNumber=function(a,b){jspb.utils.splitHash64(a);var c=jspb.utils.split64Low,d=jspb.utils.split64High;return b?jspb.utils.joinInt64(c,d):jspb.utils.joinUint64(c,d)};jspb.utils.numberToHash64=function(a){jspb.utils.splitInt64(a);return jspb.utils.joinHash64(jspb.utils.split64Low,jspb.utils.split64High)};jspb.utils.countVarints=function(a,b,c){for(var d=0,e=b;e<c;e++)d+=a[e]>>7;return c-b-d};
jspb.utils.countVarintFields=function(a,b,c,d){var e=0;d=8*d+jspb.BinaryConstants.WireType.VARINT;if(128>d)for(;b<c&&a[b++]==d;)for(e++;;){var f=a[b++];if(0==(f&128))break}else for(;b<c;){for(f=d;128<f;){if(a[b]!=(f&127|128))return e;b++;f>>=7}if(a[b++]!=f)break;for(e++;f=a[b++],0!=(f&128););}return e};jspb.utils.countFixedFields_=function(a,b,c,d,e){var f=0;if(128>d)for(;b<c&&a[b++]==d;)f++,b+=e;else for(;b<c;){for(var g=d;128<g;){if(a[b++]!=(g&127|128))return f;g>>=7}if(a[b++]!=g)break;f++;b+=e}return f};
jspb.utils.countFixed32Fields=function(a,b,c,d){return jspb.utils.countFixedFields_(a,b,c,8*d+jspb.BinaryConstants.WireType.FIXED32,4)};jspb.utils.countFixed64Fields=function(a,b,c,d){return jspb.utils.countFixedFields_(a,b,c,8*d+jspb.BinaryConstants.WireType.FIXED64,8)};
jspb.utils.countDelimitedFields=function(a,b,c,d){var e=0;for(d=8*d+jspb.BinaryConstants.WireType.DELIMITED;b<c;){for(var f=d;128<f;){if(a[b++]!=(f&127|128))return e;f>>=7}if(a[b++]!=f)break;e++;for(var g=0,h=1;f=a[b++],g+=(f&127)*h,h*=128,0!=(f&128););b+=g}return e};jspb.utils.debugBytesToTextFormat=function(a){var b='"';if(a){a=jspb.utils.byteSourceToUint8Array(a);for(var c=0;c<a.length;c++)b+="\\x",16>a[c]&&(b+="0"),b+=a[c].toString(16)}return b+'"'};
jspb.utils.debugScalarToTextFormat=function(a){return goog.isString(a)?goog.string.quote(a):a.toString()};jspb.utils.stringToByteArray=function(a){for(var b=new Uint8Array(a.length),c=0;c<a.length;c++){var d=a.charCodeAt(c);if(255<d)throw Error("Conversion error: string contains codepoint outside of byte range");b[c]=d}return b};
jspb.utils.byteSourceToUint8Array=function(a){if(a.constructor===Uint8Array)return a;if(a.constructor===ArrayBuffer||a.constructor===Array)return new Uint8Array(a);if(a.constructor===String)return goog.crypt.base64.decodeStringToUint8Array(a);goog.asserts.fail("Type not convertible to Uint8Array.");return new Uint8Array(0)};jspb.BinaryEncoder=function(){this.buffer_=[]};jspb.BinaryEncoder.prototype.length=function(){return this.buffer_.length};jspb.BinaryEncoder.prototype.end=function(){var a=this.buffer_;this.buffer_=[];return a};
jspb.BinaryEncoder.prototype.writeSplitVarint64=function(a,b){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(b==Math.floor(b));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);for(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32);0<b||127<a;)this.buffer_.push(a&127|128),a=(a>>>7|b<<25)>>>0,b>>>=7;this.buffer_.push(a)};
jspb.BinaryEncoder.prototype.writeSplitFixed64=function(a,b){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(b==Math.floor(b));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32);this.writeUint32(a);this.writeUint32(b)};
jspb.BinaryEncoder.prototype.writeUnsignedVarint32=function(a){goog.asserts.assert(a==Math.floor(a));for(goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);127<a;)this.buffer_.push(a&127|128),a>>>=7;this.buffer_.push(a)};
jspb.BinaryEncoder.prototype.writeSignedVarint32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);if(0<=a)this.writeUnsignedVarint32(a);else{for(var b=0;9>b;b++)this.buffer_.push(a&127|128),a>>=7;this.buffer_.push(1)}};
jspb.BinaryEncoder.prototype.writeUnsignedVarint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_64);jspb.utils.splitInt64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeSignedVarint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitInt64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeZigzagVarint32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.writeUnsignedVarint32((a<<1^a>>31)>>>0)};jspb.BinaryEncoder.prototype.writeZigzagVarint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitZigzag64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeZigzagVarint64String=function(a){this.writeZigzagVarint64(parseInt(a,10))};jspb.BinaryEncoder.prototype.writeUint8=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&256>a);this.buffer_.push(a>>>0&255)};jspb.BinaryEncoder.prototype.writeUint16=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&65536>a);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255)};
jspb.BinaryEncoder.prototype.writeUint32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_32);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);this.buffer_.push(a>>>16&255);this.buffer_.push(a>>>24&255)};jspb.BinaryEncoder.prototype.writeUint64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(0<=a&&a<jspb.BinaryConstants.TWO_TO_64);jspb.utils.splitUint64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeInt8=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(-128<=a&&128>a);this.buffer_.push(a>>>0&255)};jspb.BinaryEncoder.prototype.writeInt16=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(-32768<=a&&32768>a);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255)};
jspb.BinaryEncoder.prototype.writeInt32=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.buffer_.push(a>>>0&255);this.buffer_.push(a>>>8&255);this.buffer_.push(a>>>16&255);this.buffer_.push(a>>>24&255)};
jspb.BinaryEncoder.prototype.writeInt64=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_63&&a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitInt64(a);this.writeSplitFixed64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeInt64String=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(+a>=-jspb.BinaryConstants.TWO_TO_63&&+a<jspb.BinaryConstants.TWO_TO_63);jspb.utils.splitHash64(jspb.utils.decimalStringToHash64(a));this.writeSplitFixed64(jspb.utils.split64Low,jspb.utils.split64High)};jspb.BinaryEncoder.prototype.writeFloat=function(a){goog.asserts.assert(a>=-jspb.BinaryConstants.FLOAT32_MAX&&a<=jspb.BinaryConstants.FLOAT32_MAX);jspb.utils.splitFloat32(a);this.writeUint32(jspb.utils.split64Low)};
jspb.BinaryEncoder.prototype.writeDouble=function(a){goog.asserts.assert(a>=-jspb.BinaryConstants.FLOAT64_MAX&&a<=jspb.BinaryConstants.FLOAT64_MAX);jspb.utils.splitFloat64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High)};jspb.BinaryEncoder.prototype.writeBool=function(a){goog.asserts.assert(goog.isBoolean(a)||goog.isNumber(a));this.buffer_.push(a?1:0)};
jspb.BinaryEncoder.prototype.writeEnum=function(a){goog.asserts.assert(a==Math.floor(a));goog.asserts.assert(a>=-jspb.BinaryConstants.TWO_TO_31&&a<jspb.BinaryConstants.TWO_TO_31);this.writeSignedVarint32(a)};jspb.BinaryEncoder.prototype.writeBytes=function(a){this.buffer_.push.apply(this.buffer_,a)};jspb.BinaryEncoder.prototype.writeVarintHash64=function(a){jspb.utils.splitHash64(a);this.writeSplitVarint64(jspb.utils.split64Low,jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeFixedHash64=function(a){jspb.utils.splitHash64(a);this.writeUint32(jspb.utils.split64Low);this.writeUint32(jspb.utils.split64High)};
jspb.BinaryEncoder.prototype.writeString=function(a){for(var b=this.buffer_.length,c=0;c<a.length;c++){var d=a.charCodeAt(c);if(128>d)this.buffer_.push(d);else if(2048>d)this.buffer_.push(d>>6|192),this.buffer_.push(d&63|128);else if(65536>d)if(55296<=d&&56319>=d&&c+1<a.length){var e=a.charCodeAt(c+1);56320<=e&&57343>=e&&(d=1024*(d-55296)+e-56320+65536,this.buffer_.push(d>>18|240),this.buffer_.push(d>>12&63|128),this.buffer_.push(d>>6&63|128),this.buffer_.push(d&63|128),c++)}else this.buffer_.push(d>>
12|224),this.buffer_.push(d>>6&63|128),this.buffer_.push(d&63|128)}return this.buffer_.length-b};jspb.BinaryWriter=function(){this.blocks_=[];this.totalLength_=0;this.encoder_=new jspb.BinaryEncoder;this.bookmarks_=[]};jspb.BinaryWriter.prototype.appendUint8Array_=function(a){var b=this.encoder_.end();this.blocks_.push(b);this.blocks_.push(a);this.totalLength_+=b.length+a.length};
jspb.BinaryWriter.prototype.beginDelimited_=function(a){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);a=this.encoder_.end();this.blocks_.push(a);this.totalLength_+=a.length;a.push(this.totalLength_);return a};jspb.BinaryWriter.prototype.endDelimited_=function(a){var b=a.pop(),b=this.totalLength_+this.encoder_.length()-b;for(goog.asserts.assert(0<=b);127<b;)a.push(b&127|128),b>>>=7,this.totalLength_++;a.push(b);this.totalLength_++};
jspb.BinaryWriter.prototype.writeSerializedMessage=function(a,b,c){this.appendUint8Array_(a.subarray(b,c))};jspb.BinaryWriter.prototype.maybeWriteSerializedMessage=function(a,b,c){null!=a&&null!=b&&null!=c&&this.writeSerializedMessage(a,b,c)};jspb.BinaryWriter.prototype.reset=function(){this.blocks_=[];this.encoder_.end();this.totalLength_=0;this.bookmarks_=[]};
jspb.BinaryWriter.prototype.getResultBuffer=function(){goog.asserts.assert(0==this.bookmarks_.length);for(var a=new Uint8Array(this.totalLength_+this.encoder_.length()),b=this.blocks_,c=b.length,d=0,e=0;e<c;e++){var f=b[e];a.set(f,d);d+=f.length}b=this.encoder_.end();a.set(b,d);d+=b.length;goog.asserts.assert(d==a.length);this.blocks_=[a];return a};jspb.BinaryWriter.prototype.getResultBase64String=function(){return goog.crypt.base64.encodeByteArray(this.getResultBuffer())};
jspb.BinaryWriter.prototype.beginSubMessage=function(a){this.bookmarks_.push(this.beginDelimited_(a))};jspb.BinaryWriter.prototype.endSubMessage=function(){goog.asserts.assert(0<=this.bookmarks_.length);this.endDelimited_(this.bookmarks_.pop())};jspb.BinaryWriter.prototype.writeFieldHeader_=function(a,b){goog.asserts.assert(1<=a&&a==Math.floor(a));this.encoder_.writeUnsignedVarint32(8*a+b)};
jspb.BinaryWriter.prototype.writeAny=function(a,b,c){var d=jspb.BinaryConstants.FieldType;switch(a){case d.DOUBLE:this.writeDouble(b,c);break;case d.FLOAT:this.writeFloat(b,c);break;case d.INT64:this.writeInt64(b,c);break;case d.UINT64:this.writeUint64(b,c);break;case d.INT32:this.writeInt32(b,c);break;case d.FIXED64:this.writeFixed64(b,c);break;case d.FIXED32:this.writeFixed32(b,c);break;case d.BOOL:this.writeBool(b,c);break;case d.STRING:this.writeString(b,c);break;case d.GROUP:goog.asserts.fail("Group field type not supported in writeAny()");
break;case d.MESSAGE:goog.asserts.fail("Message field type not supported in writeAny()");break;case d.BYTES:this.writeBytes(b,c);break;case d.UINT32:this.writeUint32(b,c);break;case d.ENUM:this.writeEnum(b,c);break;case d.SFIXED32:this.writeSfixed32(b,c);break;case d.SFIXED64:this.writeSfixed64(b,c);break;case d.SINT32:this.writeSint32(b,c);break;case d.SINT64:this.writeSint64(b,c);break;case d.FHASH64:this.writeFixedHash64(b,c);break;case d.VHASH64:this.writeVarintHash64(b,c);break;default:goog.asserts.fail("Invalid field type in writeAny()")}};
jspb.BinaryWriter.prototype.writeUnsignedVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeUnsignedVarint32(b))};jspb.BinaryWriter.prototype.writeSignedVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint32(b))};jspb.BinaryWriter.prototype.writeUnsignedVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeUnsignedVarint64(b))};
jspb.BinaryWriter.prototype.writeSignedVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint64(b))};jspb.BinaryWriter.prototype.writeZigzagVarint32_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint32(b))};jspb.BinaryWriter.prototype.writeZigzagVarint64_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint64(b))};
jspb.BinaryWriter.prototype.writeZigzagVarint64String_=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeZigzagVarint64String(b))};jspb.BinaryWriter.prototype.writeInt32=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeSignedVarint32_(a,b))};
jspb.BinaryWriter.prototype.writeInt32String=function(a,b){if(null!=b){var c=parseInt(b,10);goog.asserts.assert(c>=-jspb.BinaryConstants.TWO_TO_31&&c<jspb.BinaryConstants.TWO_TO_31);this.writeSignedVarint32_(a,c)}};jspb.BinaryWriter.prototype.writeInt64=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeSignedVarint64_(a,b))};
jspb.BinaryWriter.prototype.writeInt64String=function(a,b){if(null!=b){var c=jspb.arith.Int64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT);this.encoder_.writeSplitVarint64(c.lo,c.hi)}};jspb.BinaryWriter.prototype.writeUint32=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32),this.writeUnsignedVarint32_(a,b))};
jspb.BinaryWriter.prototype.writeUint32String=function(a,b){if(null!=b){var c=parseInt(b,10);goog.asserts.assert(0<=c&&c<jspb.BinaryConstants.TWO_TO_32);this.writeUnsignedVarint32_(a,c)}};jspb.BinaryWriter.prototype.writeUint64=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_64),this.writeUnsignedVarint64_(a,b))};
jspb.BinaryWriter.prototype.writeUint64String=function(a,b){if(null!=b){var c=jspb.arith.UInt64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT);this.encoder_.writeSplitVarint64(c.lo,c.hi)}};jspb.BinaryWriter.prototype.writeSint32=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeZigzagVarint32_(a,b))};
jspb.BinaryWriter.prototype.writeSint64=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeZigzagVarint64_(a,b))};jspb.BinaryWriter.prototype.writeSint64String=function(a,b){null!=b&&(goog.asserts.assert(+b>=-jspb.BinaryConstants.TWO_TO_63&&+b<jspb.BinaryConstants.TWO_TO_63),this.writeZigzagVarint64String_(a,b))};
jspb.BinaryWriter.prototype.writeFixed32=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_32),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeUint32(b))};jspb.BinaryWriter.prototype.writeFixed64=function(a,b){null!=b&&(goog.asserts.assert(0<=b&&b<jspb.BinaryConstants.TWO_TO_64),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeUint64(b))};
jspb.BinaryWriter.prototype.writeFixed64String=function(a,b){if(null!=b){var c=jspb.arith.UInt64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64);this.encoder_.writeSplitFixed64(c.lo,c.hi)}};jspb.BinaryWriter.prototype.writeSfixed32=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeInt32(b))};
jspb.BinaryWriter.prototype.writeSfixed64=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_63&&b<jspb.BinaryConstants.TWO_TO_63),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeInt64(b))};jspb.BinaryWriter.prototype.writeSfixed64String=function(a,b){if(null!=b){var c=jspb.arith.Int64.fromString(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64);this.encoder_.writeSplitFixed64(c.lo,c.hi)}};
jspb.BinaryWriter.prototype.writeFloat=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED32),this.encoder_.writeFloat(b))};jspb.BinaryWriter.prototype.writeDouble=function(a,b){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeDouble(b))};jspb.BinaryWriter.prototype.writeBool=function(a,b){null!=b&&(goog.asserts.assert(goog.isBoolean(b)||goog.isNumber(b)),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeBool(b))};
jspb.BinaryWriter.prototype.writeEnum=function(a,b){null!=b&&(goog.asserts.assert(b>=-jspb.BinaryConstants.TWO_TO_31&&b<jspb.BinaryConstants.TWO_TO_31),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeSignedVarint32(b))};jspb.BinaryWriter.prototype.writeString=function(a,b){if(null!=b){var c=this.beginDelimited_(a);this.encoder_.writeString(b);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writeBytes=function(a,b){if(null!=b){var c=jspb.utils.byteSourceToUint8Array(b);this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(c.length);this.appendUint8Array_(c)}};jspb.BinaryWriter.prototype.writeMessage=function(a,b,c){null!=b&&(a=this.beginDelimited_(a),c(b,this),this.endDelimited_(a))};
jspb.BinaryWriter.prototype.writeGroup=function(a,b,c){null!=b&&(this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.START_GROUP),c(b,this),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.END_GROUP))};jspb.BinaryWriter.prototype.writeFixedHash64=function(a,b){null!=b&&(goog.asserts.assert(8==b.length),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.FIXED64),this.encoder_.writeFixedHash64(b))};
jspb.BinaryWriter.prototype.writeVarintHash64=function(a,b){null!=b&&(goog.asserts.assert(8==b.length),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.VARINT),this.encoder_.writeVarintHash64(b))};jspb.BinaryWriter.prototype.writeRepeatedInt32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSignedVarint32_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedInt32String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeInt32String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedInt64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSignedVarint64_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedInt64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeInt64String(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedUint32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUnsignedVarint32_(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedUint32String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUint32String(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedUint64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUnsignedVarint64_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedUint64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeUint64String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedSint32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint32_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSint64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint64_(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSint64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeZigzagVarint64String_(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedFixed32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed32(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedFixed64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed64(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedFixed64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixed64String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedSfixed32=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed32(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSfixed64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed64(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedSfixed64String=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeSfixed64String(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedFloat=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFloat(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedDouble=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeDouble(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedBool=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeBool(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedEnum=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeEnum(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedString=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeString(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedBytes=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeBytes(a,b[c])};jspb.BinaryWriter.prototype.writeRepeatedMessage=function(a,b,c){if(null!=b)for(var d=0;d<b.length;d++){var e=this.beginDelimited_(a);c(b[d],this);this.endDelimited_(e)}};
jspb.BinaryWriter.prototype.writeRepeatedGroup=function(a,b,c){if(null!=b)for(var d=0;d<b.length;d++)this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.START_GROUP),c(b[d],this),this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.END_GROUP)};jspb.BinaryWriter.prototype.writeRepeatedFixedHash64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeFixedHash64(a,b[c])};
jspb.BinaryWriter.prototype.writeRepeatedVarintHash64=function(a,b){if(null!=b)for(var c=0;c<b.length;c++)this.writeVarintHash64(a,b[c])};jspb.BinaryWriter.prototype.writePackedInt32=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeSignedVarint32(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedInt32String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeSignedVarint32(parseInt(b[d],10));this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedInt64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeSignedVarint64(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedInt64String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++){var e=jspb.arith.Int64.fromString(b[d]);this.encoder_.writeSplitVarint64(e.lo,e.hi)}this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedUint32=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeUnsignedVarint32(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedUint32String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeUnsignedVarint32(parseInt(b[d],10));this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedUint64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeUnsignedVarint64(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedUint64String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++){var e=jspb.arith.UInt64.fromString(b[d]);this.encoder_.writeSplitVarint64(e.lo,e.hi)}this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedSint32=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeZigzagVarint32(b[d]);this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedSint64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeZigzagVarint64(b[d]);this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedSint64String=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeZigzagVarint64(parseInt(b[d],10));this.endDelimited_(c)}};
jspb.BinaryWriter.prototype.writePackedFixed32=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(4*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeUint32(b[c])}};jspb.BinaryWriter.prototype.writePackedFixed64=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeUint64(b[c])}};
jspb.BinaryWriter.prototype.writePackedFixed64String=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++){var d=jspb.arith.UInt64.fromString(b[c]);this.encoder_.writeSplitFixed64(d.lo,d.hi)}}};
jspb.BinaryWriter.prototype.writePackedSfixed32=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(4*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeInt32(b[c])}};jspb.BinaryWriter.prototype.writePackedSfixed64=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeInt64(b[c])}};
jspb.BinaryWriter.prototype.writePackedSfixed64String=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeInt64String(b[c])}};jspb.BinaryWriter.prototype.writePackedFloat=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(4*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeFloat(b[c])}};
jspb.BinaryWriter.prototype.writePackedDouble=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeDouble(b[c])}};jspb.BinaryWriter.prototype.writePackedBool=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(b.length);for(var c=0;c<b.length;c++)this.encoder_.writeBool(b[c])}};
jspb.BinaryWriter.prototype.writePackedEnum=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeEnum(b[d]);this.endDelimited_(c)}};jspb.BinaryWriter.prototype.writePackedFixedHash64=function(a,b){if(null!=b&&b.length){this.writeFieldHeader_(a,jspb.BinaryConstants.WireType.DELIMITED);this.encoder_.writeUnsignedVarint32(8*b.length);for(var c=0;c<b.length;c++)this.encoder_.writeFixedHash64(b[c])}};
jspb.BinaryWriter.prototype.writePackedVarintHash64=function(a,b){if(null!=b&&b.length){for(var c=this.beginDelimited_(a),d=0;d<b.length;d++)this.encoder_.writeVarintHash64(b[d]);this.endDelimited_(c)}};jspb.BinaryIterator=function(a,b,c){this.elements_=this.nextMethod_=this.decoder_=null;this.cursor_=0;this.nextValue_=null;this.atEnd_=!0;this.init_(a,b,c)};jspb.BinaryIterator.prototype.init_=function(a,b,c){a&&b&&(this.decoder_=a,this.nextMethod_=b);this.elements_=c||null;this.cursor_=0;this.nextValue_=null;this.atEnd_=!this.decoder_&&!this.elements_;this.next()};jspb.BinaryIterator.instanceCache_=[];
jspb.BinaryIterator.alloc=function(a,b,c){if(jspb.BinaryIterator.instanceCache_.length){var d=jspb.BinaryIterator.instanceCache_.pop();d.init_(a,b,c);return d}return new jspb.BinaryIterator(a,b,c)};jspb.BinaryIterator.prototype.free=function(){this.clear();100>jspb.BinaryIterator.instanceCache_.length&&jspb.BinaryIterator.instanceCache_.push(this)};
jspb.BinaryIterator.prototype.clear=function(){this.decoder_&&this.decoder_.free();this.elements_=this.nextMethod_=this.decoder_=null;this.cursor_=0;this.nextValue_=null;this.atEnd_=!0};jspb.BinaryIterator.prototype.get=function(){return this.nextValue_};jspb.BinaryIterator.prototype.atEnd=function(){return this.atEnd_};
jspb.BinaryIterator.prototype.next=function(){var a=this.nextValue_;this.decoder_?this.decoder_.atEnd()?(this.nextValue_=null,this.atEnd_=!0):this.nextValue_=this.nextMethod_.call(this.decoder_):this.elements_&&(this.cursor_==this.elements_.length?(this.nextValue_=null,this.atEnd_=!0):this.nextValue_=this.elements_[this.cursor_++]);return a};jspb.BinaryDecoder=function(a,b,c){this.bytes_=null;this.tempHigh_=this.tempLow_=this.cursor_=this.end_=this.start_=0;this.error_=!1;a&&this.setBlock(a,b,c)};
jspb.BinaryDecoder.instanceCache_=[];jspb.BinaryDecoder.alloc=function(a,b,c){if(jspb.BinaryDecoder.instanceCache_.length){var d=jspb.BinaryDecoder.instanceCache_.pop();a&&d.setBlock(a,b,c);return d}return new jspb.BinaryDecoder(a,b,c)};jspb.BinaryDecoder.prototype.free=function(){this.clear();100>jspb.BinaryDecoder.instanceCache_.length&&jspb.BinaryDecoder.instanceCache_.push(this)};jspb.BinaryDecoder.prototype.clone=function(){return jspb.BinaryDecoder.alloc(this.bytes_,this.start_,this.end_-this.start_)};
jspb.BinaryDecoder.prototype.clear=function(){this.bytes_=null;this.cursor_=this.end_=this.start_=0;this.error_=!1};jspb.BinaryDecoder.prototype.getBuffer=function(){return this.bytes_};jspb.BinaryDecoder.prototype.setBlock=function(a,b,c){this.bytes_=jspb.utils.byteSourceToUint8Array(a);this.start_=goog.isDef(b)?b:0;this.end_=goog.isDef(c)?this.start_+c:this.bytes_.length;this.cursor_=this.start_};jspb.BinaryDecoder.prototype.getEnd=function(){return this.end_};
jspb.BinaryDecoder.prototype.setEnd=function(a){this.end_=a};jspb.BinaryDecoder.prototype.reset=function(){this.cursor_=this.start_};jspb.BinaryDecoder.prototype.getCursor=function(){return this.cursor_};jspb.BinaryDecoder.prototype.setCursor=function(a){this.cursor_=a};jspb.BinaryDecoder.prototype.advance=function(a){this.cursor_+=a;goog.asserts.assert(this.cursor_<=this.end_)};jspb.BinaryDecoder.prototype.atEnd=function(){return this.cursor_==this.end_};
jspb.BinaryDecoder.prototype.pastEnd=function(){return this.cursor_>this.end_};jspb.BinaryDecoder.prototype.getError=function(){return this.error_||0>this.cursor_||this.cursor_>this.end_};
jspb.BinaryDecoder.prototype.readSplitVarint64_=function(){for(var a,b=0,c,d=0;4>d;d++)if(a=this.bytes_[this.cursor_++],b|=(a&127)<<7*d,128>a){this.tempLow_=b>>>0;this.tempHigh_=0;return}a=this.bytes_[this.cursor_++];b|=(a&127)<<28;c=0|(a&127)>>4;if(128>a)this.tempLow_=b>>>0,this.tempHigh_=c>>>0;else{for(d=0;5>d;d++)if(a=this.bytes_[this.cursor_++],c|=(a&127)<<7*d+3,128>a){this.tempLow_=b>>>0;this.tempHigh_=c>>>0;return}goog.asserts.fail("Failed to read varint, encoding is invalid.");this.error_=
!0}};jspb.BinaryDecoder.prototype.skipVarint=function(){for(;this.bytes_[this.cursor_]&128;)this.cursor_++;this.cursor_++};jspb.BinaryDecoder.prototype.unskipVarint=function(a){for(;128<a;)this.cursor_--,a>>>=7;this.cursor_--};
jspb.BinaryDecoder.prototype.readUnsignedVarint32=function(){var a,b=this.bytes_;a=b[this.cursor_+0];var c=a&127;if(128>a)return this.cursor_+=1,goog.asserts.assert(this.cursor_<=this.end_),c;a=b[this.cursor_+1];c|=(a&127)<<7;if(128>a)return this.cursor_+=2,goog.asserts.assert(this.cursor_<=this.end_),c;a=b[this.cursor_+2];c|=(a&127)<<14;if(128>a)return this.cursor_+=3,goog.asserts.assert(this.cursor_<=this.end_),c;a=b[this.cursor_+3];c|=(a&127)<<21;if(128>a)return this.cursor_+=4,goog.asserts.assert(this.cursor_<=
this.end_),c;a=b[this.cursor_+4];c|=(a&15)<<28;if(128>a)return this.cursor_+=5,goog.asserts.assert(this.cursor_<=this.end_),c>>>0;this.cursor_+=5;128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&128<=b[this.cursor_++]&&goog.asserts.assert(!1);goog.asserts.assert(this.cursor_<=this.end_);return c};jspb.BinaryDecoder.prototype.readSignedVarint32=jspb.BinaryDecoder.prototype.readUnsignedVarint32;jspb.BinaryDecoder.prototype.readUnsignedVarint32String=function(){return this.readUnsignedVarint32().toString()};
jspb.BinaryDecoder.prototype.readSignedVarint32String=function(){return this.readSignedVarint32().toString()};jspb.BinaryDecoder.prototype.readZigzagVarint32=function(){var a=this.readUnsignedVarint32();return a>>>1^-(a&1)};jspb.BinaryDecoder.prototype.readUnsignedVarint64=function(){this.readSplitVarint64_();return jspb.utils.joinUint64(this.tempLow_,this.tempHigh_)};
jspb.BinaryDecoder.prototype.readUnsignedVarint64String=function(){this.readSplitVarint64_();return jspb.utils.joinUnsignedDecimalString(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readSignedVarint64=function(){this.readSplitVarint64_();return jspb.utils.joinInt64(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readSignedVarint64String=function(){this.readSplitVarint64_();return jspb.utils.joinSignedDecimalString(this.tempLow_,this.tempHigh_)};
jspb.BinaryDecoder.prototype.readZigzagVarint64=function(){this.readSplitVarint64_();return jspb.utils.joinZigzag64(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readZigzagVarint64String=function(){return this.readZigzagVarint64().toString()};jspb.BinaryDecoder.prototype.readUint8=function(){var a=this.bytes_[this.cursor_+0];this.cursor_+=1;goog.asserts.assert(this.cursor_<=this.end_);return a};
jspb.BinaryDecoder.prototype.readUint16=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1];this.cursor_+=2;goog.asserts.assert(this.cursor_<=this.end_);return a<<0|b<<8};jspb.BinaryDecoder.prototype.readUint32=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1],c=this.bytes_[this.cursor_+2],d=this.bytes_[this.cursor_+3];this.cursor_+=4;goog.asserts.assert(this.cursor_<=this.end_);return(a<<0|b<<8|c<<16|d<<24)>>>0};
jspb.BinaryDecoder.prototype.readUint64=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinUint64(a,b)};jspb.BinaryDecoder.prototype.readUint64String=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinUnsignedDecimalString(a,b)};jspb.BinaryDecoder.prototype.readInt8=function(){var a=this.bytes_[this.cursor_+0];this.cursor_+=1;goog.asserts.assert(this.cursor_<=this.end_);return a<<24>>24};
jspb.BinaryDecoder.prototype.readInt16=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1];this.cursor_+=2;goog.asserts.assert(this.cursor_<=this.end_);return(a<<0|b<<8)<<16>>16};jspb.BinaryDecoder.prototype.readInt32=function(){var a=this.bytes_[this.cursor_+0],b=this.bytes_[this.cursor_+1],c=this.bytes_[this.cursor_+2],d=this.bytes_[this.cursor_+3];this.cursor_+=4;goog.asserts.assert(this.cursor_<=this.end_);return a<<0|b<<8|c<<16|d<<24};
jspb.BinaryDecoder.prototype.readInt64=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinInt64(a,b)};jspb.BinaryDecoder.prototype.readInt64String=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinSignedDecimalString(a,b)};jspb.BinaryDecoder.prototype.readFloat=function(){var a=this.readUint32();return jspb.utils.joinFloat32(a,0)};
jspb.BinaryDecoder.prototype.readDouble=function(){var a=this.readUint32(),b=this.readUint32();return jspb.utils.joinFloat64(a,b)};jspb.BinaryDecoder.prototype.readBool=function(){return!!this.bytes_[this.cursor_++]};jspb.BinaryDecoder.prototype.readEnum=function(){return this.readSignedVarint32()};
jspb.BinaryDecoder.prototype.readString=function(a){var b=this.bytes_,c=this.cursor_;a=c+a;for(var d=[],e="";c<a;){var f=b[c++];if(128>f)d.push(f);else if(192>f)continue;else if(224>f){var g=b[c++];d.push((f&31)<<6|g&63)}else if(240>f){var g=b[c++],h=b[c++];d.push((f&15)<<12|(g&63)<<6|h&63)}else if(248>f){var g=b[c++],h=b[c++],k=b[c++],f=(f&7)<<18|(g&63)<<12|(h&63)<<6|k&63,f=f-65536;d.push((f>>10&1023)+55296,(f&1023)+56320)}8192<=d.length&&(e+=String.fromCharCode.apply(null,d),d.length=0)}e+=goog.crypt.byteArrayToString(d);
this.cursor_=c;return e};jspb.BinaryDecoder.prototype.readStringWithLength=function(){var a=this.readUnsignedVarint32();return this.readString(a)};jspb.BinaryDecoder.prototype.readBytes=function(a){if(0>a||this.cursor_+a>this.bytes_.length)return this.error_=!0,goog.asserts.fail("Invalid byte length!"),new Uint8Array(0);var b=this.bytes_.subarray(this.cursor_,this.cursor_+a);this.cursor_+=a;goog.asserts.assert(this.cursor_<=this.end_);return b};
jspb.BinaryDecoder.prototype.readVarintHash64=function(){this.readSplitVarint64_();return jspb.utils.joinHash64(this.tempLow_,this.tempHigh_)};jspb.BinaryDecoder.prototype.readFixedHash64=function(){var a=this.bytes_,b=this.cursor_,c=a[b+0],d=a[b+1],e=a[b+2],f=a[b+3],g=a[b+4],h=a[b+5],k=a[b+6],a=a[b+7];this.cursor_+=8;return String.fromCharCode(c,d,e,f,g,h,k,a)};jspb.BinaryReader=function(a,b,c){this.decoder_=jspb.BinaryDecoder.alloc(a,b,c);this.fieldCursor_=this.decoder_.getCursor();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;this.error_=!1;this.readCallbacks_=null};jspb.BinaryReader.instanceCache_=[];
jspb.BinaryReader.alloc=function(a,b,c){if(jspb.BinaryReader.instanceCache_.length){var d=jspb.BinaryReader.instanceCache_.pop();a&&d.decoder_.setBlock(a,b,c);return d}return new jspb.BinaryReader(a,b,c)};jspb.BinaryReader.prototype.alloc=jspb.BinaryReader.alloc;
jspb.BinaryReader.prototype.free=function(){this.decoder_.clear();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID;this.error_=!1;this.readCallbacks_=null;100>jspb.BinaryReader.instanceCache_.length&&jspb.BinaryReader.instanceCache_.push(this)};jspb.BinaryReader.prototype.getFieldCursor=function(){return this.fieldCursor_};jspb.BinaryReader.prototype.getCursor=function(){return this.decoder_.getCursor()};
jspb.BinaryReader.prototype.getBuffer=function(){return this.decoder_.getBuffer()};jspb.BinaryReader.prototype.getFieldNumber=function(){return this.nextField_};jspb.BinaryReader.prototype.getWireType=function(){return this.nextWireType_};jspb.BinaryReader.prototype.isEndGroup=function(){return this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP};jspb.BinaryReader.prototype.getError=function(){return this.error_||this.decoder_.getError()};
jspb.BinaryReader.prototype.setBlock=function(a,b,c){this.decoder_.setBlock(a,b,c);this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID};jspb.BinaryReader.prototype.reset=function(){this.decoder_.reset();this.nextField_=jspb.BinaryConstants.INVALID_FIELD_NUMBER;this.nextWireType_=jspb.BinaryConstants.WireType.INVALID};jspb.BinaryReader.prototype.advance=function(a){this.decoder_.advance(a)};
jspb.BinaryReader.prototype.nextField=function(){if(this.decoder_.atEnd())return!1;if(this.getError())return goog.asserts.fail("Decoder hit an error"),!1;this.fieldCursor_=this.decoder_.getCursor();var a=this.decoder_.readUnsignedVarint32(),b=a>>>3,a=a&7;if(a!=jspb.BinaryConstants.WireType.VARINT&&a!=jspb.BinaryConstants.WireType.FIXED32&&a!=jspb.BinaryConstants.WireType.FIXED64&&a!=jspb.BinaryConstants.WireType.DELIMITED&&a!=jspb.BinaryConstants.WireType.START_GROUP&&a!=jspb.BinaryConstants.WireType.END_GROUP)return goog.asserts.fail("Invalid wire type"),
this.error_=!0,!1;this.nextField_=b;this.nextWireType_=a;return!0};jspb.BinaryReader.prototype.unskipHeader=function(){this.decoder_.unskipVarint(this.nextField_<<3|this.nextWireType_)};jspb.BinaryReader.prototype.skipMatchingFields=function(){var a=this.nextField_;for(this.unskipHeader();this.nextField()&&this.getFieldNumber()==a;)this.skipField();this.decoder_.atEnd()||this.unskipHeader()};
jspb.BinaryReader.prototype.skipVarintField=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.VARINT?(goog.asserts.fail("Invalid wire type for skipVarintField"),this.skipField()):this.decoder_.skipVarint()};jspb.BinaryReader.prototype.skipDelimitedField=function(){if(this.nextWireType_!=jspb.BinaryConstants.WireType.DELIMITED)goog.asserts.fail("Invalid wire type for skipDelimitedField"),this.skipField();else{var a=this.decoder_.readUnsignedVarint32();this.decoder_.advance(a)}};
jspb.BinaryReader.prototype.skipFixed32Field=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.FIXED32?(goog.asserts.fail("Invalid wire type for skipFixed32Field"),this.skipField()):this.decoder_.advance(4)};jspb.BinaryReader.prototype.skipFixed64Field=function(){this.nextWireType_!=jspb.BinaryConstants.WireType.FIXED64?(goog.asserts.fail("Invalid wire type for skipFixed64Field"),this.skipField()):this.decoder_.advance(8)};
jspb.BinaryReader.prototype.skipGroup=function(){var a=[this.nextField_];do{if(!this.nextField()){goog.asserts.fail("Unmatched start-group tag: stream EOF");this.error_=!0;break}if(this.nextWireType_==jspb.BinaryConstants.WireType.START_GROUP)a.push(this.nextField_);else if(this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP&&this.nextField_!=a.pop()){goog.asserts.fail("Unmatched end-group tag");this.error_=!0;break}}while(0<a.length)};
jspb.BinaryReader.prototype.skipField=function(){switch(this.nextWireType_){case jspb.BinaryConstants.WireType.VARINT:this.skipVarintField();break;case jspb.BinaryConstants.WireType.FIXED64:this.skipFixed64Field();break;case jspb.BinaryConstants.WireType.DELIMITED:this.skipDelimitedField();break;case jspb.BinaryConstants.WireType.FIXED32:this.skipFixed32Field();break;case jspb.BinaryConstants.WireType.START_GROUP:this.skipGroup();break;default:goog.asserts.fail("Invalid wire encoding for field.")}};
jspb.BinaryReader.prototype.registerReadCallback=function(a,b){goog.isNull(this.readCallbacks_)&&(this.readCallbacks_={});goog.asserts.assert(!this.readCallbacks_[a]);this.readCallbacks_[a]=b};jspb.BinaryReader.prototype.runReadCallback=function(a){goog.asserts.assert(!goog.isNull(this.readCallbacks_));a=this.readCallbacks_[a];goog.asserts.assert(a);return a(this)};
jspb.BinaryReader.prototype.readAny=function(a){this.nextWireType_=jspb.BinaryConstants.FieldTypeToWireType(a);var b=jspb.BinaryConstants.FieldType;switch(a){case b.DOUBLE:return this.readDouble();case b.FLOAT:return this.readFloat();case b.INT64:return this.readInt64();case b.UINT64:return this.readUint64();case b.INT32:return this.readInt32();case b.FIXED64:return this.readFixed64();case b.FIXED32:return this.readFixed32();case b.BOOL:return this.readBool();case b.STRING:return this.readString();
case b.GROUP:goog.asserts.fail("Group field type not supported in readAny()");case b.MESSAGE:goog.asserts.fail("Message field type not supported in readAny()");case b.BYTES:return this.readBytes();case b.UINT32:return this.readUint32();case b.ENUM:return this.readEnum();case b.SFIXED32:return this.readSfixed32();case b.SFIXED64:return this.readSfixed64();case b.SINT32:return this.readSint32();case b.SINT64:return this.readSint64();case b.FHASH64:return this.readFixedHash64();case b.VHASH64:return this.readVarintHash64();
default:goog.asserts.fail("Invalid field type in readAny()")}return 0};jspb.BinaryReader.prototype.readMessage=function(a,b){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var c=this.decoder_.getEnd(),d=this.decoder_.readUnsignedVarint32(),d=this.decoder_.getCursor()+d;this.decoder_.setEnd(d);b(a,this);this.decoder_.setCursor(d);this.decoder_.setEnd(c)};
jspb.BinaryReader.prototype.readGroup=function(a,b,c){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.START_GROUP);goog.asserts.assert(this.nextField_==a);c(b,this);this.error_||this.nextWireType_==jspb.BinaryConstants.WireType.END_GROUP||(goog.asserts.fail("Group submessage did not end with an END_GROUP tag"),this.error_=!0)};
jspb.BinaryReader.prototype.getFieldDecoder=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32(),b=this.decoder_.getCursor(),c=b+a,a=jspb.BinaryDecoder.alloc(this.decoder_.getBuffer(),b,a);this.decoder_.setCursor(c);return a};jspb.BinaryReader.prototype.readInt32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint32()};
jspb.BinaryReader.prototype.readInt32String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint32String()};jspb.BinaryReader.prototype.readInt64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64()};jspb.BinaryReader.prototype.readInt64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64String()};
jspb.BinaryReader.prototype.readUint32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint32()};jspb.BinaryReader.prototype.readUint32String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint32String()};jspb.BinaryReader.prototype.readUint64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint64()};
jspb.BinaryReader.prototype.readUint64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readUnsignedVarint64String()};jspb.BinaryReader.prototype.readSint32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint32()};jspb.BinaryReader.prototype.readSint64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint64()};
jspb.BinaryReader.prototype.readSint64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readZigzagVarint64String()};jspb.BinaryReader.prototype.readFixed32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readUint32()};jspb.BinaryReader.prototype.readFixed64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readUint64()};
jspb.BinaryReader.prototype.readFixed64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readUint64String()};jspb.BinaryReader.prototype.readSfixed32=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readInt32()};jspb.BinaryReader.prototype.readSfixed32String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readInt32().toString()};
jspb.BinaryReader.prototype.readSfixed64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readInt64()};jspb.BinaryReader.prototype.readSfixed64String=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readInt64String()};jspb.BinaryReader.prototype.readFloat=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED32);return this.decoder_.readFloat()};
jspb.BinaryReader.prototype.readDouble=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readDouble()};jspb.BinaryReader.prototype.readBool=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return!!this.decoder_.readUnsignedVarint32()};jspb.BinaryReader.prototype.readEnum=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readSignedVarint64()};
jspb.BinaryReader.prototype.readString=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32();return this.decoder_.readString(a)};jspb.BinaryReader.prototype.readBytes=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);var a=this.decoder_.readUnsignedVarint32();return this.decoder_.readBytes(a)};
jspb.BinaryReader.prototype.readVarintHash64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.VARINT);return this.decoder_.readVarintHash64()};jspb.BinaryReader.prototype.readFixedHash64=function(){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.FIXED64);return this.decoder_.readFixedHash64()};
jspb.BinaryReader.prototype.readPackedField_=function(a){goog.asserts.assert(this.nextWireType_==jspb.BinaryConstants.WireType.DELIMITED);for(var b=this.decoder_.readUnsignedVarint32(),b=this.decoder_.getCursor()+b,c=[];this.decoder_.getCursor()<b;)c.push(a.call(this.decoder_));return c};jspb.BinaryReader.prototype.readPackedInt32=function(){return this.readPackedField_(this.decoder_.readSignedVarint32)};jspb.BinaryReader.prototype.readPackedInt32String=function(){return this.readPackedField_(this.decoder_.readSignedVarint32String)};
jspb.BinaryReader.prototype.readPackedInt64=function(){return this.readPackedField_(this.decoder_.readSignedVarint64)};jspb.BinaryReader.prototype.readPackedInt64String=function(){return this.readPackedField_(this.decoder_.readSignedVarint64String)};jspb.BinaryReader.prototype.readPackedUint32=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint32)};jspb.BinaryReader.prototype.readPackedUint32String=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint32String)};
jspb.BinaryReader.prototype.readPackedUint64=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint64)};jspb.BinaryReader.prototype.readPackedUint64String=function(){return this.readPackedField_(this.decoder_.readUnsignedVarint64String)};jspb.BinaryReader.prototype.readPackedSint32=function(){return this.readPackedField_(this.decoder_.readZigzagVarint32)};jspb.BinaryReader.prototype.readPackedSint64=function(){return this.readPackedField_(this.decoder_.readZigzagVarint64)};
jspb.BinaryReader.prototype.readPackedSint64String=function(){return this.readPackedField_(this.decoder_.readZigzagVarint64String)};jspb.BinaryReader.prototype.readPackedFixed32=function(){return this.readPackedField_(this.decoder_.readUint32)};jspb.BinaryReader.prototype.readPackedFixed64=function(){return this.readPackedField_(this.decoder_.readUint64)};jspb.BinaryReader.prototype.readPackedFixed64String=function(){return this.readPackedField_(this.decoder_.readUint64String)};
jspb.BinaryReader.prototype.readPackedSfixed32=function(){return this.readPackedField_(this.decoder_.readInt32)};jspb.BinaryReader.prototype.readPackedSfixed64=function(){return this.readPackedField_(this.decoder_.readInt64)};jspb.BinaryReader.prototype.readPackedSfixed64String=function(){return this.readPackedField_(this.decoder_.readInt64String)};jspb.BinaryReader.prototype.readPackedFloat=function(){return this.readPackedField_(this.decoder_.readFloat)};
jspb.BinaryReader.prototype.readPackedDouble=function(){return this.readPackedField_(this.decoder_.readDouble)};jspb.BinaryReader.prototype.readPackedBool=function(){return this.readPackedField_(this.decoder_.readBool)};jspb.BinaryReader.prototype.readPackedEnum=function(){return this.readPackedField_(this.decoder_.readEnum)};jspb.BinaryReader.prototype.readPackedVarintHash64=function(){return this.readPackedField_(this.decoder_.readVarintHash64)};
jspb.BinaryReader.prototype.readPackedFixedHash64=function(){return this.readPackedField_(this.decoder_.readFixedHash64)};jspb.Export={};exports.Map=jspb.Map;exports.Message=jspb.Message;exports.BinaryReader=jspb.BinaryReader;exports.BinaryWriter=jspb.BinaryWriter;exports.ExtensionFieldInfo=jspb.ExtensionFieldInfo;exports.ExtensionFieldBinaryInfo=jspb.ExtensionFieldBinaryInfo;exports.exportSymbol=goog.exportSymbol;exports.inherits=goog.inherits;exports.object={extend:goog.object.extend};exports.typeOf=goog.typeOf;


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__apply_operations__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__get_document_text__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__get_document_operations__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__replicate_document__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__set_document__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__set_text_in_range__ = __webpack_require__(62);







/* harmony default export */ __webpack_exports__["a"] = ({
    applyOperations: __WEBPACK_IMPORTED_MODULE_0__apply_operations__["a" /* default */],
    getDocumentText: __WEBPACK_IMPORTED_MODULE_1__get_document_text__["a" /* default */],
    getDocumentOperations: __WEBPACK_IMPORTED_MODULE_2__get_document_operations__["a" /* default */],
    replicateDocument: __WEBPACK_IMPORTED_MODULE_3__replicate_document__["a" /* default */],
    setDocument: __WEBPACK_IMPORTED_MODULE_4__set_document__["a" /* default */],
    setTextInRange: __WEBPACK_IMPORTED_MODULE_5__set_text_in_range__["a" /* default */]
});

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stores_document__ = __webpack_require__(4);


/*
 * API Name: applyOperations
 * Returns: Plugin changes that need to be applied to show non-local changes
 * Used for applying CRDT operations to the local document
 */
/* harmony default export */ __webpack_exports__["a"] = (operations => {
  const { textUpdates } = __WEBPACK_IMPORTED_MODULE_0__stores_document__["a" /* default */].getDocument().integrateOperations(operations);
  return textUpdates;
});

/***/ }),
/* 58 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stores_document__ = __webpack_require__(4);


/*
 * API Name: getDocumentText
 * Returns: The text value of the document's contents
 * Used for retrieving the text contents of the document
 */
/* harmony default export */ __webpack_exports__["a"] = (() => __WEBPACK_IMPORTED_MODULE_0__stores_document__["a" /* default */].getDocument().getText());

/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stores_document__ = __webpack_require__(4);


/*
 * API Name: getDocumentOperations
 * Returns: An array of operations to get to where the document is currently
 * Used for setting up a new agent
 */
/* harmony default export */ __webpack_exports__["a"] = (() => __WEBPACK_IMPORTED_MODULE_0__stores_document__["a" /* default */].getDocument().getOperations());

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_uuid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_uuid__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stores_document__ = __webpack_require__(4);



/*
 * API Name: replicateDocument
 * Returns: A replica of the local document
 * Used for sending the local document to a new agent
 */
/* harmony default export */ __webpack_exports__["a"] = (() => __WEBPACK_IMPORTED_MODULE_1__stores_document__["a" /* default */].getDocument().replicate(__WEBPACK_IMPORTED_MODULE_0_uuid___default()()));

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stores_document__ = __webpack_require__(4);


/*
 * API Name: setDocument
 * Returns: null
 * Used for assigning the local document to a new document
 */
/* harmony default export */ __webpack_exports__["a"] = (newDocument => {
  __WEBPACK_IMPORTED_MODULE_0__stores_document__["a" /* default */].setDocument(newDocument);
});

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stores_document__ = __webpack_require__(4);


/*
 * API Name: setTextInRange
 * Returns: An array of CRDT operations to be broadcasted to the other documents
 * Used for applying the plugin changes to the CRDT document
 */
/* harmony default export */ __webpack_exports__["a"] = ((start, end, text, options) => __WEBPACK_IMPORTED_MODULE_0__stores_document__["a" /* default */].getDocument().setTextInRange(start, end, text, options));

/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const ioHandlers = [];
let currentPayload = '';

process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', data => {
    const payloadList = (currentPayload + data).split('\n');
    currentPayload = payloadList.pop();
    payloadList.forEach(payload => {
        ioHandlers.forEach(handler => setImmediate(() => handler(payload)));
    });
});

const addIoHandler = handler => ioHandlers.push(handler);
const write = outPayload => {
    process.stdout.write(outPayload, 'utf-8');
    process.stdout.write('\n');
};

/* harmony default export */ __webpack_exports__["a"] = ({
    addIoHandler,
    write
});

/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_winston__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_winston___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_winston__);


const prefix = Date.now();
const format = __WEBPACK_IMPORTED_MODULE_0_winston___default.a.format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`);

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_winston___default.a.createLogger({
    format: __WEBPACK_IMPORTED_MODULE_0_winston___default.a.format.combine(__WEBPACK_IMPORTED_MODULE_0_winston___default.a.format.label(), __WEBPACK_IMPORTED_MODULE_0_winston___default.a.format.timestamp(), format),
    transports: [new __WEBPACK_IMPORTED_MODULE_0_winston___default.a.transports.File({ filename: `/tmp/tandem-crdt-${prefix}.log` }), new __WEBPACK_IMPORTED_MODULE_0_winston___default.a.transports.File({ filename: `/tmp/tandem-crdt-debug-${prefix}.log`, level: 'debug' })]
}));

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * winston.js: Top-level include defining Winston.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

const common = __webpack_require__(10);
const warn = common.warn;

const winston = exports;

//
// Expose version. Use `require` method
// for `webpack` support.
//
winston.version = __webpack_require__(67).version;

//
// Include transports defined by default by winston
//
winston.transports = __webpack_require__(68);

//
// Expose utility methods
//
winston.config    = __webpack_require__(14);

//
// Hoist format-related functionality from logform.
//
const logform = __webpack_require__(2);
winston.addColors = logform.levels;
winston.format    = logform.format;

//
// Expose core Logging-related prototypes.
//
winston.createLogger     = __webpack_require__(42);
winston.ExceptionHandler = __webpack_require__(43);
winston.Container        = __webpack_require__(113).Container;
winston.Transport        = __webpack_require__(5);

//
// Throw a useful error when users attempt to run `new winston.Logger`.
//
warn.moved(winston, 'createLogger', 'Logger');

//
// We create and expose a default `Container` to `winston.loggers` so that the
// programmer may manage multiple `winston.Logger` instances without any additional overhead.
//
// ### some-file1.js
//
//     var logger = require('winston').loggers.get('something');
//
// ### some-file2.js
//
//     var logger = require('winston').loggers.get('something');
//
winston.loggers = new winston.Container();

//
// We create and expose a 'defaultLogger' so that the programmer may do the
// following without the need to create an instance of winston.Logger directly:
//
//     var winston = require('winston');
//     winston.log('info', 'some message');
//     winston.error('some error');
//
var defaultLogger = winston.createLogger();

//
// Pass through the target methods onto `winston.
//
Object.keys(winston.config.npm.levels).concat([
  'log',    'query', 'stream',  'add',
  'remove', 'clear', 'profile', 'startTimer',
  'handleExceptions', 'unhandleExceptions',
  'configure'
]).forEach(function (method) {
  winston[method] = function () {
    return defaultLogger[method].apply(defaultLogger, arguments);
  };
});

//
// Define getter / setter for the default logger level
// which need to be exposed by winston.
//
Object.defineProperty(winston, 'level', {
  get: function () {
    return defaultLogger.level;
  },
  set: function (val) {
    defaultLogger.level = val;
  }
});

//
// Define getter for `exceptions` which replaces
// `handleExceptions` and `unhandleExceptions`
//
Object.defineProperty(winston, 'exceptions', {
  get: function () { return defaultLogger.exceptions; }
});

//
// Have friendlier breakage notices for properties that
// were exposed by default on winston < 3.0
//
warn.deprecated(winston, 'setLevels');
warn.forFunctions(winston,  'useFormat',  ['cli']);
warn.forProperties(winston, 'useFormat',  ['padLevels', 'stripColors']);
warn.forFunctions(winston,  'deprecated', ['addRewriter', 'addFilter', 'clone', 'extend']);
warn.forProperties(winston, 'deprecated', ['emitErrs', 'levelLength']);

//
// Define getters / setters for appropriate properties of the
// default logger which need to be exposed by winston.
//
['paddings', 'exitOnError'].forEach(function (prop) {
  Object.defineProperty(winston, prop, {
    get: function () {
      return defaultLogger[prop];
    },
    set: function (val) {
      defaultLogger[prop] = val;
    }
  });
});

//
// @default {Object}
// The default transports and exceptionHandlers for
// the default winston logger.
//
Object.defineProperty(winston, 'default', {
  get: function () {
    return {
      exceptionHandlers: defaultLogger.exceptionHandlers,
      transports: defaultLogger.transports
    };
  }
});


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("string_decoder");

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = {"_args":[["winston@3.0.0-rc1","/Users/sameer/Documents/development/tandem/crdt"]],"_from":"winston@3.0.0-rc1","_id":"winston@3.0.0-rc1","_inBundle":false,"_integrity":"sha512-aNtKirnK2UEe5v56SK0TIEr5ylyYdXyjAaIJXZTk21UlNx7FQclTkVU2T1ZzMtdDM+Rk2b7vrI/e/4n8U84XaQ==","_location":"/winston","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"winston@3.0.0-rc1","name":"winston","escapedName":"winston","rawSpec":"3.0.0-rc1","saveSpec":null,"fetchSpec":"3.0.0-rc1"},"_requiredBy":["/"],"_resolved":"https://registry.npmjs.org/winston/-/winston-3.0.0-rc1.tgz","_spec":"3.0.0-rc1","_where":"/Users/sameer/Documents/development/tandem/crdt","author":{"name":"Charlie Robbins","email":"charlie.robbins@gmail.com"},"bugs":{"url":"https://github.com/winstonjs/winston/issues"},"dependencies":{"async":"^1.0.0","diagnostics":"^1.0.1","isstream":"0.1.x","logform":"^1.2.1","one-time":"0.0.4","stack-trace":"0.0.x","triple-beam":"^1.0.1","winston-transport":"^3.0.1"},"description":"A multi-transport async logging library for Node.js","devDependencies":{"abstract-winston-transport":">= 0.5.1","assume":"^1.5.1","colors":"~1.1.2","cross-spawn-async":"^2.0.0","eslint-config-populist":"^4.1.0","hock":"^1.3.2","mocha":"^3.2.0","nyc":"^11.2.1","split2":"^2.1.1","std-mocks":"^1.0.0","through2":"^2.0.0","winston-compat":"^0.0.1"},"engines":{"node":">= 4.2.2"},"homepage":"https://github.com/winstonjs/winston#readme","keywords":["winston","logging","sysadmin","tools"],"license":"MIT","main":"./lib/winston","maintainers":[{"name":"Jarrett Cruger","email":"jcrugzz@gmail.com"},{"name":"Alberto Pose","email":"albertopose@gmail.com"}],"name":"winston","repository":{"type":"git","url":"git+https://github.com/winstonjs/winston.git"},"scripts":{"lint":"populist lib/*.js lib/winston/*.js lib/winston/**/*.js","pretest":"npm run lint","report":"nyc report --reporter=lcov","test":"nyc mocha test/*.test.js test/**/*.test.js"},"version":"3.0.0-rc1"}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * transports.js: Set of all transports Winston knows about
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

Object.defineProperty(exports, 'Console', {
  configurable: true,
  enumerable: true,
  get: function () {
    return __webpack_require__(69);
  }
});

Object.defineProperty(exports, 'File', {
  configurable: true,
  enumerable: true,
  get: function () {
    return __webpack_require__(70);
  }
});

Object.defineProperty(exports, 'Http', {
  configurable: true,
  enumerable: true,
  get: function () {
    return __webpack_require__(86);
  }
});

Object.defineProperty(exports, 'Stream', {
  configurable: true,
  enumerable: true,
  get: function () {
    return __webpack_require__(89);
  }
});


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * console.js: Transport for outputting to the console
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

const os = __webpack_require__(11);
const util = __webpack_require__(1);
const { LEVEL, MESSAGE } = __webpack_require__(6);
const TransportStream = __webpack_require__(5);

//
// ### function Console (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Console transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var Console = module.exports = function (options) {
  options = options || {};
  TransportStream.call(this, options);

  this.stderrLevels = getStderrLevels(options.stderrLevels, options.debugStdout);
  this.eol = options.eol || os.EOL;

  //
  // Convert stderrLevels into an Object for faster key-lookup times than an Array.
  //
  // For backwards compatibility, stderrLevels defaults to ['error', 'debug']
  // or ['error'] depending on whether options.debugStdout is true.
  //
  function getStderrLevels(levels, debugStdout) {
    var defaultMsg = 'Cannot have non-string elements in stderrLevels Array';
    if (debugStdout) {
      if (levels) {
        //
        // Don't allow setting both debugStdout and stderrLevels together,
        // since this could cause behaviour a programmer might not expect.
        //
        throw new Error('Cannot set debugStdout and stderrLevels together');
      }

      return stringArrayToSet(['error'], defaultMsg);
    }

    if (!levels) {
      return stringArrayToSet(['error', 'debug'], defaultMsg);
    } else if (!(Array.isArray(levels))) {
      throw new Error('Cannot set stderrLevels to type other than Array');
    }

    return stringArrayToSet(levels, defaultMsg);
  }
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Console, TransportStream);

//
// Expose the name of this Transport on the prototype
//
Console.prototype.name = 'console';

//
// ### function log (info)
// #### @info {Object} **Optional** Additional metadata to attach
// Core logging method exposed to Winston.
//
Console.prototype.log = function (info, callback) {
  var self = this;
  setImmediate(function () {
    self.emit('logged', info);
  });

  //
  // Remark: what if there is no raw...?
  //
  if (this.stderrLevels[info[LEVEL]]) {
    process.stderr.write(info[MESSAGE] + this.eol);
    if (callback) { callback(); } // eslint-disable-line
    return;
  }

  process.stdout.write(info[MESSAGE] + this.eol);
  if (callback) { callback(); } // eslint-disable-line
};

//
// ### function stringArrayToSet (array)
// #### @strArray {Array} Array of Set-elements as strings.
// #### @errMsg {string} **Optional** Custom error message thrown on invalid input.
// Returns a Set-like object with strArray's elements as keys (each with the value true).
//
function stringArrayToSet(strArray, errMsg) {
  errMsg = errMsg || 'Cannot make set from Array with non-string elements';

  return strArray.reduce(function (set, el) {
    if (typeof el !== 'string') { throw new Error(errMsg); }
    set[el] = true;
    return set;
  }, {});
}


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * file.js: Transport for outputting to a local log file
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

const fs = __webpack_require__(23);
const path = __webpack_require__(71);
const util = __webpack_require__(1);
const async = __webpack_require__(12);
const zlib = __webpack_require__(72);
const { MESSAGE } = __webpack_require__(6);
const Stream = __webpack_require__(3).Stream;
const TransportStream = __webpack_require__(5);
const PassThrough = __webpack_require__(3).PassThrough;
const debug = __webpack_require__(13)('winston:file');
const os = __webpack_require__(11);
const common = __webpack_require__(10);

var noop = function () {};

//
// ### function File (options)
// #### @options {Object} Options for this instance.
// Constructor function for the File transport object responsible
// for persisting log messages and metadata to one or more files.
//
var File = module.exports = function (options) {
  options = options || {};
  TransportStream.call(this, options);

  //
  // Helper function which throws an `Error` in the event
  // that any of the rest of the arguments is present in `options`.
  //
  function throwIf(target /* , illegal... */) {
    Array.prototype.slice.call(arguments, 1).forEach(function (name) {
      if (options[name]) {
        throw new Error('Cannot set ' + name + ' and ' + target + 'together');
      }
    });
  }

  //
  // Setup the base stream that always gets piped to to handle buffering
  //
  this._stream = new PassThrough();

  //
  // Bind this context for listener functions
  //
  this._onDrain = this._onDrain.bind(this);
  this._onError = this._onError.bind(this);

  if (options.filename || options.dirname) {
    throwIf('filename or dirname', 'stream');
    this._basename = this.filename = options.filename
      ? path.basename(options.filename)
      : 'winston.log';

    this.dirname = options.dirname || path.dirname(options.filename);
    this.options = options.options || { flags: 'a' };
  } else if (options.stream) {
    console.warn('options.stream will be removed in winston@4. Use winston.transports.Stream');
    throwIf('stream', 'filename', 'maxsize');
    this._dest = this._stream.pipe(this._setupStream(options.stream));
    //
    // We need to listen for drain events when
    // write() returns false. This can make node
    // mad at times.
    //
  } else {
    throw new Error('Cannot log to file without filename or stream.');
  }

  this.maxsize     = options.maxsize     || null;
  this.rotationFormat = options.rotationFormat || false;
  this.zippedArchive = options.zippedArchive || false;
  this.maxFiles    = options.maxFiles    || null;
  this.eol         = options.eol || os.EOL;
  this.tailable    = options.tailable    || false;

  //
  // Internal state variables representing the number
  // of files this instance has created and the current
  // size (in bytes) of the current logfile.
  //
  this._size     = 0;
  this._created  = 0;
  this._drains   = 0;
  this._next     = noop;
  this._opening  = false;

  this.open();
};

//
// Inherit from `winston.Transport`.
//
util.inherits(File, TransportStream);

//
// Expose the name of this Transport on the prototype
//
File.prototype.name = 'file';

//
// function log (info)
// @param {Object} info All relevant log information
// Core logging method exposed to Winston. Metadata is optional.
//
File.prototype.log = function (info, callback) {
  callback = callback || noop;

  //
  // Remark: (jcrugzz) What is necessary about this callback(null, true) now
  // when thinking about 3.x? Should silent be handled in the base
  // TransportStream _write method?
  //
  if (this.silent) {
    callback();
    return true;
  }

  //
  // Grab the raw string and append the expected EOL
  //
  var self = this;
  var output = info[MESSAGE] + this.eol;

  //
  // This gets called too early and does not depict when data has been flushed
  // to disk like I want it to
  //
  function logged() {
    self._size += Buffer.byteLength(output);
    self.emit('logged', info);

    //
    // Check to see if we need to end the stream and create a new one
    //
    if (!self._needsNewFile()) { return; }

    //
    // End the current stream, ensure it flushes and create a new one.
    // TODO: This could probably be optimized to not run a stat call but its
    // the safest way since we are supporting `maxFiles`.
    // Remark: We could call `open` here but that would incur an extra unnecessary stat call
    //
    self._endStream(function () { self._nextFile(); });
  }

  var written = this._stream.write(output, logged);
  if (written === false) ++this._drains;
  if (!this._drains) callback(); // eslint-disable-line
  else this._next = callback;

  return written;
};

//
// ### function query (options, callback)
// #### @options {Object} Loggly-like query options for this instance.
// #### @callback {function} Continuation to respond to when complete.
// Query the transport. Options object is optional.
// TODO: Refactor me
//
File.prototype.query = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = this.normalizeQuery(options);
  const file = path.join(this.dirname, this.filename);
  let buff = '';
  let results = [];
  let row = 0;

  var stream = fs.createReadStream(file, {
    encoding: 'utf8'
  });

  stream.on('error', function (err) {
    if (stream.readable) {
      stream.destroy();
    }
    if (!callback) return;
    return err.code !== 'ENOENT'
      ? callback(err)
      : callback(null, results);
  });

  stream.on('data', function (data) {
    data = (buff + data).split(/\n+/);
    const l = data.length - 1;
    let i = 0;

    for (; i < l; i++) {
      if (!options.start || row >= options.start) {
        add(data[i]);
      }
      row++;
    }

    buff = data[l];
  });

  stream.on('close', function () {
    if (buff) add(buff, true);
    if (options.order === 'desc') {
      results = results.reverse();
    }

    // eslint-disable-next-line callback-return
    if (callback) callback(null, results);
  });

  function add(buff, attempt) {
    try {
      var log = JSON.parse(buff);
      if (check(log)) push(log);
    } catch (e) {
      if (!attempt) {
        stream.emit('error', e);
      }
    }
  }

  function push(log) {
    if (options.rows && results.length >= options.rows
        && options.order !== 'desc') {
      if (stream.readable) {
        stream.destroy();
      }
      return;
    }

    if (options.fields) {
      var obj = {};
      options.fields.forEach(function (key) {
        obj[key] = log[key];
      });
      log = obj;
    }

    if (options.order === 'desc') {
      if (results.length >= options.rows) {
        results.shift();
      }
    }
    results.push(log);
  }

  function check(log) {
    if (!log) return;

    if (typeof log !== 'object') return;

    var time = new Date(log.timestamp);
    if ((options.from && time < options.from)
        || (options.until && time > options.until)
        || (options.level && options.level !== log.level)) {
      return;
    }

    return true;
  }
};

//
// ### function stream (options)
// #### @options {Object} Stream options for this instance.
// Returns a log stream for this transport. Options object is optional.
// TODO: Refactor me
//
File.prototype.stream = function (options) {
  options = options || {};
  const file = path.join(this.dirname, this.filename);
  const stream = new Stream();

  const tail = {
    file: file,
    start: options.start
  };

  stream.destroy = common.tailFile(tail, function (err, line) {
    if (err) {
      return stream.emit('error', err);
    }

    try {
      stream.emit('data', line);
      line = JSON.parse(line);
      stream.emit('log', line);
    } catch (e) {
      stream.emit('error', e);
    }
  });

  return stream;
};

//
// ### function stat
// Checks to see the filesize of
//
File.prototype.open = function open() {
  var self = this;

  //
  // If we do not have a filename then we were passed a stream
  // and dont need to keep track of size
  //
  if (!this.filename) { return; }
  if (this.opening) { return; }
  this.opening = true;

  //
  // Stat the target file to get the size and create the stream
  //
  this.stat(function (err, size) {
    if (err) return self.emit('error', err);

    debug('stat done', self.filename);
    self._size = size;
    self._createStream();
    self.opening = false;
  });
};

//
// ### function stat
// Stat the file and assess information in order to create the proper stream
//
File.prototype.stat = function stat(callback) {
  var self = this;
  var target = this._getFile();
  var fullpath = path.join(this.dirname, target);

  fs.stat(fullpath, function (err, stat) {
    if (err && err.code === 'ENOENT') {
      debug('err ENOENT', fullpath);
      return callback(null, 0);
    }

    if (err) {
      debug('err ' + err.code, fullpath);
      return callback(err);
    }

    if (!stat || self._needsNewFile(stat.size)) {
      //
      // If `stats.size` is greater than the `maxsize` for
      // this instance then try again
      //
      return self._incFile(function () { self.stat(callback); });
    }
    //
    // Once we have figured out what the filename is, set it and return the
    // size
    //
    self.filename = target;
    callback(null, stat.size);
  });
};

//
// ### function close ()
// Closes the stream associated with this instance.
//
File.prototype.close = function (cb) {
  var self = this;

  if (!this._stream) return;

  this._stream.end(function () {
    // eslint-disable-next-line callback-return
    if (cb) cb();
    self.emit('flush');
    self.emit('closed');
  });
};

File.prototype._needsNewFile = function (size) {
  size = size || this._size;
  return this.maxsize && size >= this.maxsize;
};

File.prototype._onDrain = function onDrain() {
  if (--this._drains) return;
  var next = this._next;
  this._next = noop;
  next();
};

File.prototype._onError = function onError(err) {
  this.emit('error', err);
};

File.prototype._setupStream = function (stream) {
  stream.on('error', this._onError);
  stream.on('drain', this._onDrain);
  return stream;
};

File.prototype._cleanupStream = function (stream) {
  stream.removeListener('error', this._onError);
  stream.removeListener('drain', this._onDrain);
  return stream;
};

File.prototype._nextFile = function nextFile() {
  var self = this;
  return this._incFile(function () { self.open(); });
};

//
// ### @private function endStream
// #### @param {function} callback
// Unpipe from the stream that has been marked as FULL
// and end it so it flushes to disk
//
File.prototype._endStream = function endStream(callback) {
  var self = this;
  this._stream.unpipe(this._dest);

  this._dest.end(function () {
    self._cleanupStream(self._dest);
    callback();
  });
};

//
// ### @private function _createStream ()
//
File.prototype._createStream = function () {
  var self = this;
  var fullpath = path.join(this.dirname, this.filename);

  debug('create stream start', fullpath);
  this._dest = fs.createWriteStream(fullpath, this.options)
    .on('error', function (err) {
      // TODO: what should we do with errors here?
      debug(err);
    })
    .on('drain', this._onDrain)
    .on('open', function () {
      debug('file open ok', fullpath);
      self.emit('open');
      self._stream.pipe(self._dest);
    });

  debug('create stream ok', fullpath);
  if (this.zippedArchive) {
    var gzip = zlib.createGzip();
    gzip.pipe(this._dest);
    this._dest = gzip;
  }
};

File.prototype._incFile = function (callback) {
  const ext = path.extname(this._basename);
  const basename = path.basename(this._basename, ext);

  if (!this.tailable) {
    this._created += 1;
    this._checkMaxFilesIncrementing(ext, basename, callback);
  } else {
    this._checkMaxFilesTailable(ext, basename, callback);
  }
};

//
// ### @private function _getFile ()
// Gets the next filename to use for this instance
// in the case that log filesizes are being capped.
//
File.prototype._getFile = function () {
  const ext = path.extname(this._basename);
  const basename = path.basename(this._basename, ext);

  //
  // Caveat emptor (indexzero): rotationFormat() was broken by design
  // when combined with max files because the set of files to unlink
  // is never stored.
  //
  var target = !this.tailable && this._created
    ? basename + (this.rotationFormat ? this.rotationFormat() : this._created) + ext
    : basename + ext;

  return this.zippedArchive
    ? target + '.gz'
    : target;
};

//
// ### @private function _checkMaxFilesIncrementing ()
// Increment the number of files created or
// checked by this instance.
//
File.prototype._checkMaxFilesIncrementing = function (ext, basename, callback) {
  // Check for maxFiles option and delete file
  if (!this.maxFiles || this._created < this.maxFiles) {
    return callback();
  }

  const oldest = this._created - this.maxFiles;
  const target = path.join(this.dirname, basename + (oldest !== 0 ? oldest : '') + ext +
    (this.zippedArchive ? '.gz' : ''));

  fs.unlink(target, callback);
};

//
// ### @private function _checkMaxFilesTailable ()
//
// Roll files forward based on integer, up to maxFiles.
// e.g. if base if file.log and it becomes oversized, roll
//    to file1.log, and allow file.log to be re-used. If
//    file is oversized again, roll file1.log to file2.log,
//    roll file.log to file1.log, and so on.
File.prototype._checkMaxFilesTailable = function (ext, basename, callback) {
  const tasks = [];
  const self = this;

  if (!this.maxFiles) {
    return;
  }

  for (var x = this.maxFiles - 1; x > 0; x--) {
    tasks.push(function (i) {
      return function (cb) {
        var tmppath = path.join(self.dirname, basename + (i - 1) + ext +
          (self.zippedArchive ? '.gz' : ''));
        fs.exists(tmppath, function (exists) {
          if (!exists) {
            return cb(null);
          }

          fs.rename(tmppath, path.join(self.dirname, basename + i + ext +
            (self.zippedArchive ? '.gz' : '')), cb);
        });
      };
    }(x));
  }

  async.series(tasks, function (err) { // eslint-disable-line
    fs.rename(
      path.join(self.dirname, basename + ext),
      path.join(self.dirname, basename + 1 + ext),
      callback
    );
  });
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colorjs = __webpack_require__(74)
  , hex = __webpack_require__(79);

/**
 * Generate a color for a given name. But be reasonably smart about it by
 * understanding name spaces and coloring each namespace a bit lighter so they
 * still have the same base color as the root.
 *
 * @param {String} name The namespace
 * @returns {String} color
 * @api private
 */
module.exports = function colorspace(namespace, delimiter) {
  namespace = namespace.split(delimiter || ':');

  for (var base = hex(namespace[0]), i = 0, l = namespace.length - 1; i < l; i++) {
    base = colorjs(base).mix(colorjs(hex(namespace[i + 1]))).saturate(1).hexString();
  }

  return base;
};


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var convert = __webpack_require__(75),
    string = __webpack_require__(77);

var Color = function(obj) {
  if (obj instanceof Color) return obj;
  if (! (this instanceof Color)) return new Color(obj);

   this.values = {
      rgb: [0, 0, 0],
      hsl: [0, 0, 0],
      hsv: [0, 0, 0],
      hwb: [0, 0, 0],
      cmyk: [0, 0, 0, 0],
      alpha: 1
   }

   // parse Color() argument
   if (typeof obj == "string") {
      var vals = string.getRgba(obj);
      if (vals) {
         this.setValues("rgb", vals);
      }
      else if(vals = string.getHsla(obj)) {
         this.setValues("hsl", vals);
      }
      else if(vals = string.getHwb(obj)) {
         this.setValues("hwb", vals);
      }
      else {
        throw new Error("Unable to parse color from string \"" + obj + "\"");
      }
   }
   else if (typeof obj == "object") {
      var vals = obj;
      if(vals["r"] !== undefined || vals["red"] !== undefined) {
         this.setValues("rgb", vals)
      }
      else if(vals["l"] !== undefined || vals["lightness"] !== undefined) {
         this.setValues("hsl", vals)
      }
      else if(vals["v"] !== undefined || vals["value"] !== undefined) {
         this.setValues("hsv", vals)
      }
      else if(vals["w"] !== undefined || vals["whiteness"] !== undefined) {
         this.setValues("hwb", vals)
      }
      else if(vals["c"] !== undefined || vals["cyan"] !== undefined) {
         this.setValues("cmyk", vals)
      }
      else {
        throw new Error("Unable to parse color from object " + JSON.stringify(obj));
      }
   }
}

Color.prototype = {
   rgb: function (vals) {
      return this.setSpace("rgb", arguments);
   },
   hsl: function(vals) {
      return this.setSpace("hsl", arguments);
   },
   hsv: function(vals) {
      return this.setSpace("hsv", arguments);
   },
   hwb: function(vals) {
      return this.setSpace("hwb", arguments);
   },
   cmyk: function(vals) {
      return this.setSpace("cmyk", arguments);
   },

   rgbArray: function() {
      return this.values.rgb;
   },
   hslArray: function() {
      return this.values.hsl;
   },
   hsvArray: function() {
      return this.values.hsv;
   },
   hwbArray: function() {
      if (this.values.alpha !== 1) {
        return this.values.hwb.concat([this.values.alpha])
      }
      return this.values.hwb;
   },
   cmykArray: function() {
      return this.values.cmyk;
   },
   rgbaArray: function() {
      var rgb = this.values.rgb;
      return rgb.concat([this.values.alpha]);
   },
   hslaArray: function() {
      var hsl = this.values.hsl;
      return hsl.concat([this.values.alpha]);
   },
   alpha: function(val) {
      if (val === undefined) {
         return this.values.alpha;
      }
      this.setValues("alpha", val);
      return this;
   },

   red: function(val) {
      return this.setChannel("rgb", 0, val);
   },
   green: function(val) {
      return this.setChannel("rgb", 1, val);
   },
   blue: function(val) {
      return this.setChannel("rgb", 2, val);
   },
   hue: function(val) {
      return this.setChannel("hsl", 0, val);
   },
   saturation: function(val) {
      return this.setChannel("hsl", 1, val);
   },
   lightness: function(val) {
      return this.setChannel("hsl", 2, val);
   },
   saturationv: function(val) {
      return this.setChannel("hsv", 1, val);
   },
   whiteness: function(val) {
      return this.setChannel("hwb", 1, val);
   },
   blackness: function(val) {
      return this.setChannel("hwb", 2, val);
   },
   value: function(val) {
      return this.setChannel("hsv", 2, val);
   },
   cyan: function(val) {
      return this.setChannel("cmyk", 0, val);
   },
   magenta: function(val) {
      return this.setChannel("cmyk", 1, val);
   },
   yellow: function(val) {
      return this.setChannel("cmyk", 2, val);
   },
   black: function(val) {
      return this.setChannel("cmyk", 3, val);
   },

   hexString: function() {
      return string.hexString(this.values.rgb);
   },
   rgbString: function() {
      return string.rgbString(this.values.rgb, this.values.alpha);
   },
   rgbaString: function() {
      return string.rgbaString(this.values.rgb, this.values.alpha);
   },
   percentString: function() {
      return string.percentString(this.values.rgb, this.values.alpha);
   },
   hslString: function() {
      return string.hslString(this.values.hsl, this.values.alpha);
   },
   hslaString: function() {
      return string.hslaString(this.values.hsl, this.values.alpha);
   },
   hwbString: function() {
      return string.hwbString(this.values.hwb, this.values.alpha);
   },
   keyword: function() {
      return string.keyword(this.values.rgb, this.values.alpha);
   },

   rgbNumber: function() {
      return (this.values.rgb[0] << 16) | (this.values.rgb[1] << 8) | this.values.rgb[2];
   },

   luminosity: function() {
      // http://www.w3.org/TR/WCAG20/#relativeluminancedef
      var rgb = this.values.rgb;
      var lum = [];
      for (var i = 0; i < rgb.length; i++) {
         var chan = rgb[i] / 255;
         lum[i] = (chan <= 0.03928) ? chan / 12.92
                  : Math.pow(((chan + 0.055) / 1.055), 2.4)
      }
      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
   },

   contrast: function(color2) {
      // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
      var lum1 = this.luminosity();
      var lum2 = color2.luminosity();
      if (lum1 > lum2) {
         return (lum1 + 0.05) / (lum2 + 0.05)
      };
      return (lum2 + 0.05) / (lum1 + 0.05);
   },

   level: function(color2) {
     var contrastRatio = this.contrast(color2);
     return (contrastRatio >= 7.1)
       ? 'AAA'
       : (contrastRatio >= 4.5)
        ? 'AA'
        : '';
   },

   dark: function() {
      // YIQ equation from http://24ways.org/2010/calculating-color-contrast
      var rgb = this.values.rgb,
          yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
      return yiq < 128;
   },

   light: function() {
      return !this.dark();
   },

   negate: function() {
      var rgb = []
      for (var i = 0; i < 3; i++) {
         rgb[i] = 255 - this.values.rgb[i];
      }
      this.setValues("rgb", rgb);
      return this;
   },

   lighten: function(ratio) {
      this.values.hsl[2] += this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   darken: function(ratio) {
      this.values.hsl[2] -= this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   saturate: function(ratio) {
      this.values.hsl[1] += this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   desaturate: function(ratio) {
      this.values.hsl[1] -= this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   whiten: function(ratio) {
      this.values.hwb[1] += this.values.hwb[1] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
   },

   blacken: function(ratio) {
      this.values.hwb[2] += this.values.hwb[2] * ratio;
      this.setValues("hwb", this.values.hwb);
      return this;
   },

   greyscale: function() {
      var rgb = this.values.rgb;
      // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
      this.setValues("rgb", [val, val, val]);
      return this;
   },

   clearer: function(ratio) {
      this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio));
      return this;
   },

   opaquer: function(ratio) {
      this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio));
      return this;
   },

   rotate: function(degrees) {
      var hue = this.values.hsl[0];
      hue = (hue + degrees) % 360;
      hue = hue < 0 ? 360 + hue : hue;
      this.values.hsl[0] = hue;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   mix: function(color2, weight) {
      weight = 1 - (weight == null ? 0.5 : weight);

      // algorithm from Sass's mix(). Ratio of first color in mix is
      // determined by the alphas of both colors and the weight
      var t1 = weight * 2 - 1,
          d = this.alpha() - color2.alpha();

      var weight1 = (((t1 * d == -1) ? t1 : (t1 + d) / (1 + t1 * d)) + 1) / 2;
      var weight2 = 1 - weight1;

      var rgb = this.rgbArray();
      var rgb2 = color2.rgbArray();

      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = rgb[i] * weight1 + rgb2[i] * weight2;
      }
      this.setValues("rgb", rgb);

      var alpha = this.alpha() * weight + color2.alpha() * (1 - weight);
      this.setValues("alpha", alpha);

      return this;
   },

   toJSON: function() {
     return this.rgb();
   },

   clone: function() {
     return new Color(this.rgb());
   }
}


Color.prototype.getValues = function(space) {
   var vals = {};
   for (var i = 0; i < space.length; i++) {
      vals[space.charAt(i)] = this.values[space][i];
   }
   if (this.values.alpha != 1) {
      vals["a"] = this.values.alpha;
   }
   // {r: 255, g: 255, b: 255, a: 0.4}
   return vals;
}

Color.prototype.setValues = function(space, vals) {
   var spaces = {
      "rgb": ["red", "green", "blue"],
      "hsl": ["hue", "saturation", "lightness"],
      "hsv": ["hue", "saturation", "value"],
      "hwb": ["hue", "whiteness", "blackness"],
      "cmyk": ["cyan", "magenta", "yellow", "black"]
   };

   var maxes = {
      "rgb": [255, 255, 255],
      "hsl": [360, 100, 100],
      "hsv": [360, 100, 100],
      "hwb": [360, 100, 100],
      "cmyk": [100, 100, 100, 100]
   };

   var alpha = 1;
   if (space == "alpha") {
      alpha = vals;
   }
   else if (vals.length) {
      // [10, 10, 10]
      this.values[space] = vals.slice(0, space.length);
      alpha = vals[space.length];
   }
   else if (vals[space.charAt(0)] !== undefined) {
      // {r: 10, g: 10, b: 10}
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[space.charAt(i)];
      }
      alpha = vals.a;
   }
   else if (vals[spaces[space][0]] !== undefined) {
      // {red: 10, green: 10, blue: 10}
      var chans = spaces[space];
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[chans[i]];
      }
      alpha = vals.alpha;
   }
   this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha) ));
   if (space == "alpha") {
      return;
   }

   // cap values of the space prior converting all values
   for (var i = 0; i < space.length; i++) {
      var capped = Math.max(0, Math.min(maxes[space][i], this.values[space][i]));
      this.values[space][i] = Math.round(capped);
   }

   // convert to all the other color spaces
   for (var sname in spaces) {
      if (sname != space) {
         this.values[sname] = convert[space][sname](this.values[space])
      }

      // cap values
      for (var i = 0; i < sname.length; i++) {
         var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
         this.values[sname][i] = Math.round(capped);
      }
   }
   return true;
}

Color.prototype.setSpace = function(space, args) {
   var vals = args[0];
   if (vals === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof vals == "number") {
      vals = Array.prototype.slice.call(args);
   }
   this.setValues(space, vals);
   return this;
}

Color.prototype.setChannel = function(space, index, val) {
   if (val === undefined) {
      // color.red()
      return this.values[space][index];
   }
   // color.red(100)
   this.values[space][index] = val;
   this.setValues(space, this.values[space]);
   return this;
}

module.exports = Color;


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var conversions = __webpack_require__(76);

var convert = function() {
   return new Converter();
}

for (var func in conversions) {
  // export Raw versions
  convert[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  convert[from] = convert[from] || {};

  convert[from][to] = convert[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}


/* Converter does lazy conversion and caching */
var Converter = function() {
   this.convs = {};
};

/* Either get the values for a space or
  set the values for a space, depending on args */
Converter.prototype.routeSpace = function(space, args) {
   var values = args[0];
   if (values === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof values == "number") {
      values = Array.prototype.slice.call(args);        
   }

   return this.setValues(space, values);
};
  
/* Set the values for a space, invalidating cache */
Converter.prototype.setValues = function(space, values) {
   this.space = space;
   this.convs = {};
   this.convs[space] = values;
   return this;
};

/* Get the values for a space. If there's already
  a conversion for the space, fetch it, otherwise
  compute it */
Converter.prototype.getValues = function(space) {
   var vals = this.convs[space];
   if (!vals) {
      var fspace = this.space,
          from = this.convs[fspace];
      vals = convert[fspace][space](from);

      this.convs[space] = vals;
   }
  return vals;
};

["rgb", "hsl", "hsv", "cmyk", "keyword"].forEach(function(space) {
   Converter.prototype[space] = function(vals) {
      return this.routeSpace(space, arguments);
   }
});

module.exports = convert;

/***/ }),
/* 76 */
/***/ (function(module, exports) {

/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2hwb: rgb2hwb,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,
  rgb2lch: rgb2lch,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2hwb: hsl2hwb,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2hwb: hsv2hwb,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  hwb2rgb: hwb2rgb,
  hwb2hsl: hwb2hsl,
  hwb2hsv: hwb2hsv,
  hwb2cmyk: hwb2cmyk,
  hwb2keyword: hwb2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2hwb: cmyk2hwb,
  cmyk2keyword: cmyk2keyword,

  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2hwb: keyword2hwb,
  keyword2cmyk: keyword2cmyk,
  keyword2lab: keyword2lab,
  keyword2xyz: keyword2xyz,

  xyz2rgb: xyz2rgb,
  xyz2lab: xyz2lab,
  xyz2lch: xyz2lch,

  lab2xyz: lab2xyz,
  lab2rgb: lab2rgb,
  lab2lch: lab2lch,

  lch2lab: lch2lab,
  lch2xyz: lch2xyz,
  lch2rgb: lch2rgb
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max)
    h = (g - b) / delta;
  else if (g == max)
    h = 2 + (b - r) / delta;
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2hwb(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      h = rgb2hsl(rgb)[0],
      w = 1/255 * Math.min(r, Math.min(g, b)),
      b = 1 - 1/255 * Math.max(r, Math.max(g, b));

  return [h, w * 100, b * 100];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;

  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k) || 0;
  m = (1 - g - k) / (1 - k) || 0;
  y = (1 - b - k) / (1 - k) || 0;
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function rgb2lch(args) {
  return lab2lch(rgb2lab(args));
}

function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }

  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;

  if(l === 0) {
      // no need to do calc on black
      // also avoids divide by 0 error
      return [0, 0, 0];
  }

  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, sv * 100, v * 100];
}

function hsl2hwb(args) {
  return rgb2hwb(hsl2rgb(args));
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  sl = sl || 0;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2hwb(args) {
  return rgb2hwb(hsv2rgb(args))
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
function hwb2rgb(hwb) {
  var h = hwb[0] / 360,
      wh = hwb[1] / 100,
      bl = hwb[2] / 100,
      ratio = wh + bl,
      i, v, f, n;

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio;
    bl /= ratio;
  }

  i = Math.floor(6 * h);
  v = 1 - bl;
  f = 6 * h - i;
  if ((i & 0x01) != 0) {
    f = 1 - f;
  }
  n = wh + f * (v - wh);  // linear interpolation

  switch (i) {
    default:
    case 6:
    case 0: r = v; g = n; b = wh; break;
    case 1: r = n; g = v; b = wh; break;
    case 2: r = wh; g = v; b = n; break;
    case 3: r = wh; g = n; b = v; break;
    case 4: r = n; g = wh; b = v; break;
    case 5: r = v; g = wh; b = n; break;
  }

  return [r * 255, g * 255, b * 255];
}

function hwb2hsl(args) {
  return rgb2hsl(hwb2rgb(args));
}

function hwb2hsv(args) {
  return rgb2hsv(hwb2rgb(args));
}

function hwb2cmyk(args) {
  return rgb2cmyk(hwb2rgb(args));
}

function hwb2keyword(args) {
  return rgb2keyword(hwb2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2hwb(args) {
  return rgb2hwb(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);

  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return [r * 255, g * 255, b * 255];
}

function xyz2lab(xyz) {
  var x = xyz[0],
      y = xyz[1],
      z = xyz[2],
      l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);

  return [l, a, b];
}

function xyz2lch(args) {
  return lab2lch(xyz2lab(args));
}

function lab2xyz(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      x, y, z, y2;

  if (l <= 8) {
    y = (l * 100) / 903.3;
    y2 = (7.787 * (y / 100)) + (16 / 116);
  } else {
    y = 100 * Math.pow((l + 16) / 116, 3);
    y2 = Math.pow(y / 100, 1/3);
  }

  x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

  z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

  return [x, y, z];
}

function lab2lch(lab) {
  var l = lab[0],
      a = lab[1],
      b = lab[2],
      hr, h, c;

  hr = Math.atan2(b, a);
  h = hr * 360 / 2 / Math.PI;
  if (h < 0) {
    h += 360;
  }
  c = Math.sqrt(a * a + b * b);
  return [l, c, h];
}

function lab2rgb(args) {
  return xyz2rgb(lab2xyz(args));
}

function lch2lab(lch) {
  var l = lch[0],
      c = lch[1],
      h = lch[2],
      a, b, hr;

  hr = h / 360 * 2 * Math.PI;
  a = c * Math.cos(hr);
  b = c * Math.sin(hr);
  return [l, a, b];
}

function lch2xyz(args) {
  return lab2xyz(lch2lab(args));
}

function lch2rgb(args) {
  return lab2rgb(lch2lab(args));
}

function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2hwb(args) {
  return rgb2hwb(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

function keyword2lab(args) {
  return rgb2lab(keyword2rgb(args));
}

function keyword2xyz(args) {
  return rgb2xyz(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  rebeccapurple: [102, 51, 153],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

/* MIT license */
var colorNames = __webpack_require__(78);

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getHwb: getHwb,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   hwbString: hwbString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,
       keyword = /(\D+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = colorNames[match[1]];
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb[3] = a;
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
   }
}

function getHwb(string) {
   if (!string) {
      return;
   }
   var hwb = /^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/;
   var match = string.match(hwb);
   if (match) {
    var alpha = parseFloat(match[4]);
      var h = scale(parseInt(match[1]), 0, 360),
          w = scale(parseFloat(match[2]), 0, 100),
          b = scale(parseFloat(match[3]), 0, 100),
          a = scale(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
   }
}

function getRgb(string) {
   var rgba = getRgba(string);
   return rgba && rgba.slice(0, 3);
}

function getHsl(string) {
  var hsla = getHsla(string);
  return hsla && hsla.slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
   else if (vals = getHwb(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
function hwbString(hwb, alpha) {
   if (alpha === undefined) {
      alpha = (hwb[3] !== undefined ? hwb[3] : 1);
   }
   return "hwb(" + hwb[0] + ", " + hwb[1] + "%, " + hwb[2] + "%"
           + (alpha !== undefined && alpha !== 1 ? ", " + alpha : "") + ")";
}

function keyword(rgb) {
  return reverseNames[rgb.slice(0, 3)];
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}


//create a list of reverse color names
var reverseNames = {};
for (var name in colorNames) {
   reverseNames[colorNames[name]] = name;
}


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
	"aliceblue": [240, 248, 255],
	"antiquewhite": [250, 235, 215],
	"aqua": [0, 255, 255],
	"aquamarine": [127, 255, 212],
	"azure": [240, 255, 255],
	"beige": [245, 245, 220],
	"bisque": [255, 228, 196],
	"black": [0, 0, 0],
	"blanchedalmond": [255, 235, 205],
	"blue": [0, 0, 255],
	"blueviolet": [138, 43, 226],
	"brown": [165, 42, 42],
	"burlywood": [222, 184, 135],
	"cadetblue": [95, 158, 160],
	"chartreuse": [127, 255, 0],
	"chocolate": [210, 105, 30],
	"coral": [255, 127, 80],
	"cornflowerblue": [100, 149, 237],
	"cornsilk": [255, 248, 220],
	"crimson": [220, 20, 60],
	"cyan": [0, 255, 255],
	"darkblue": [0, 0, 139],
	"darkcyan": [0, 139, 139],
	"darkgoldenrod": [184, 134, 11],
	"darkgray": [169, 169, 169],
	"darkgreen": [0, 100, 0],
	"darkgrey": [169, 169, 169],
	"darkkhaki": [189, 183, 107],
	"darkmagenta": [139, 0, 139],
	"darkolivegreen": [85, 107, 47],
	"darkorange": [255, 140, 0],
	"darkorchid": [153, 50, 204],
	"darkred": [139, 0, 0],
	"darksalmon": [233, 150, 122],
	"darkseagreen": [143, 188, 143],
	"darkslateblue": [72, 61, 139],
	"darkslategray": [47, 79, 79],
	"darkslategrey": [47, 79, 79],
	"darkturquoise": [0, 206, 209],
	"darkviolet": [148, 0, 211],
	"deeppink": [255, 20, 147],
	"deepskyblue": [0, 191, 255],
	"dimgray": [105, 105, 105],
	"dimgrey": [105, 105, 105],
	"dodgerblue": [30, 144, 255],
	"firebrick": [178, 34, 34],
	"floralwhite": [255, 250, 240],
	"forestgreen": [34, 139, 34],
	"fuchsia": [255, 0, 255],
	"gainsboro": [220, 220, 220],
	"ghostwhite": [248, 248, 255],
	"gold": [255, 215, 0],
	"goldenrod": [218, 165, 32],
	"gray": [128, 128, 128],
	"green": [0, 128, 0],
	"greenyellow": [173, 255, 47],
	"grey": [128, 128, 128],
	"honeydew": [240, 255, 240],
	"hotpink": [255, 105, 180],
	"indianred": [205, 92, 92],
	"indigo": [75, 0, 130],
	"ivory": [255, 255, 240],
	"khaki": [240, 230, 140],
	"lavender": [230, 230, 250],
	"lavenderblush": [255, 240, 245],
	"lawngreen": [124, 252, 0],
	"lemonchiffon": [255, 250, 205],
	"lightblue": [173, 216, 230],
	"lightcoral": [240, 128, 128],
	"lightcyan": [224, 255, 255],
	"lightgoldenrodyellow": [250, 250, 210],
	"lightgray": [211, 211, 211],
	"lightgreen": [144, 238, 144],
	"lightgrey": [211, 211, 211],
	"lightpink": [255, 182, 193],
	"lightsalmon": [255, 160, 122],
	"lightseagreen": [32, 178, 170],
	"lightskyblue": [135, 206, 250],
	"lightslategray": [119, 136, 153],
	"lightslategrey": [119, 136, 153],
	"lightsteelblue": [176, 196, 222],
	"lightyellow": [255, 255, 224],
	"lime": [0, 255, 0],
	"limegreen": [50, 205, 50],
	"linen": [250, 240, 230],
	"magenta": [255, 0, 255],
	"maroon": [128, 0, 0],
	"mediumaquamarine": [102, 205, 170],
	"mediumblue": [0, 0, 205],
	"mediumorchid": [186, 85, 211],
	"mediumpurple": [147, 112, 219],
	"mediumseagreen": [60, 179, 113],
	"mediumslateblue": [123, 104, 238],
	"mediumspringgreen": [0, 250, 154],
	"mediumturquoise": [72, 209, 204],
	"mediumvioletred": [199, 21, 133],
	"midnightblue": [25, 25, 112],
	"mintcream": [245, 255, 250],
	"mistyrose": [255, 228, 225],
	"moccasin": [255, 228, 181],
	"navajowhite": [255, 222, 173],
	"navy": [0, 0, 128],
	"oldlace": [253, 245, 230],
	"olive": [128, 128, 0],
	"olivedrab": [107, 142, 35],
	"orange": [255, 165, 0],
	"orangered": [255, 69, 0],
	"orchid": [218, 112, 214],
	"palegoldenrod": [238, 232, 170],
	"palegreen": [152, 251, 152],
	"paleturquoise": [175, 238, 238],
	"palevioletred": [219, 112, 147],
	"papayawhip": [255, 239, 213],
	"peachpuff": [255, 218, 185],
	"peru": [205, 133, 63],
	"pink": [255, 192, 203],
	"plum": [221, 160, 221],
	"powderblue": [176, 224, 230],
	"purple": [128, 0, 128],
	"rebeccapurple": [102, 51, 153],
	"red": [255, 0, 0],
	"rosybrown": [188, 143, 143],
	"royalblue": [65, 105, 225],
	"saddlebrown": [139, 69, 19],
	"salmon": [250, 128, 114],
	"sandybrown": [244, 164, 96],
	"seagreen": [46, 139, 87],
	"seashell": [255, 245, 238],
	"sienna": [160, 82, 45],
	"silver": [192, 192, 192],
	"skyblue": [135, 206, 235],
	"slateblue": [106, 90, 205],
	"slategray": [112, 128, 144],
	"slategrey": [112, 128, 144],
	"snow": [255, 250, 250],
	"springgreen": [0, 255, 127],
	"steelblue": [70, 130, 180],
	"tan": [210, 180, 140],
	"teal": [0, 128, 128],
	"thistle": [216, 191, 216],
	"tomato": [255, 99, 71],
	"turquoise": [64, 224, 208],
	"violet": [238, 130, 238],
	"wheat": [245, 222, 179],
	"white": [255, 255, 255],
	"whitesmoke": [245, 245, 245],
	"yellow": [255, 255, 0],
	"yellowgreen": [154, 205, 50]
};


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***
 * Convert string to hex color.
 *
 * @param {String} str Text to hash and convert to hex.
 * @returns {String}
 * @api public
 */
module.exports = function hex(str) {
  for (
    var i = 0, hash = 0;
    i < str.length;
    hash = str.charCodeAt(i++) + ((hash << 5) - hash)
  );

  var color = Math.floor(
    Math.abs(
      (Math.sin(hash) * 10000) % 1 * 16777216
    )
  ).toString(16);

  return '#' + Array(6 - color.length + 1).join('0') + color;
};


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var env = __webpack_require__(81);

/**
 * Checks if a given namespace is allowed by the environment variables.
 *
 * @param {String} name namespace that should be included.
 * @param {Array} variables
 * @returns {Boolean}
 * @api public
 */
module.exports = function enabled(name, variables) {
  var envy = env()
    , variable
    , i = 0;

  variables = variables || ['diagnostics', 'debug'];

  for (; i < variables.length; i++) {
    if ((variable = envy[variables[i]])) break;
  }

  if (!variable) return false;

  variables = variable.split(/[\s,]+/);
  i = 0;

  for (; i < variables.length; i++) {
    variable = variables[i].replace('*', '.*?');

    if ('-' === variable.charAt(0)) {
      if ((new RegExp('^'+ variable.substr(1) +'$')).test(name)) {
        return false;
      }

      continue;
    }

    if ((new RegExp('^'+ variable +'$')).test(name)) {
      return true;
    }
  }

  return false;
};


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty;

/**
 * Gather environment variables from various locations.
 *
 * @param {Object} environment The default environment variables.
 * @returns {Object} environment.
 * @api public
 */
function env(environment) {
  environment = environment || {};

  if ('object' === typeof process && 'object' === typeof process.env) {
    env.merge(environment, process.env);
  }

  if ('undefined' !== typeof window) {
    if ('string' === window.name && window.name.length) {
      env.merge(environment, env.parse(window.name));
    }

    try { env.merge(environment, env.parse(window.localStorage.env || window.localStorage.debug)); }
    catch (e) {}

    if (
         'object' === typeof window.location
      && 'string' === typeof window.location.hash
      && window.location.hash.length
    ) {
      env.merge(environment, env.parse(window.location.hash.charAt(0) === '#'
        ? window.location.hash.slice(1)
        : window.location.hash
      ));
    }
  }

  //
  // Also add lower case variants to the object for easy access.
  //
  var key, lower;
  for (key in environment) {
    lower = key.toLowerCase();

    if (!(lower in environment)) {
      environment[lower] = environment[key];
    }
  }

  return environment;
}

/**
 * A poor man's merge utility.
 *
 * @param {Object} base Object where the add object is merged in.
 * @param {Object} add Object that needs to be added to the base object.
 * @returns {Object} base
 * @api private
 */
env.merge = function merge(base, add) {
  for (var key in add) {
    if (has.call(add, key)) {
      base[key] = add[key];
    }
  }

  return base;
};

/**
 * A poor man's query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object} Key value mapped query string.
 * @api private
 */
env.parse = function parse(query) {
  var parser = /([^=?&]+)=([^&]*)/g
    , result = {}
    , part;

  if (!query) return result;

  for (;
    part = parser.exec(query);
    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
  );

  return result.env || result;
};

//
// Expose the module
//
module.exports = env;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var colornames = __webpack_require__(83);

/**
 * Kuler: Color text using CSS colors
 *
 * @constructor
 * @param {String} text The text that needs to be styled
 * @param {String} color Optional color for alternate API.
 * @api public
 */
function Kuler(text, color) {
  if (color) return (new Kuler(text)).style(color);
  if (!(this instanceof Kuler)) return new Kuler(text);

  this.text = text;
}

/**
 * ANSI color codes.
 *
 * @type {String}
 * @private
 */
Kuler.prototype.prefix = '\x1b[';
Kuler.prototype.suffix = 'm';

/**
 * Parse a hex color string and parse it to it's RGB equiv.
 *
 * @param {String} color
 * @returns {Array}
 * @api private
 */
Kuler.prototype.hex = function hex(color) {
  color = color[0] === '#' ? color.substring(1) : color;

  //
  // Pre-parse for shorthand hex colors.
  //
  if (color.length === 3) {
    color = color.split('');

    color[5] = color[2]; // F60##0
    color[4] = color[2]; // F60#00
    color[3] = color[1]; // F60600
    color[2] = color[1]; // F66600
    color[1] = color[0]; // FF6600

    color = color.join('');
  }

  var r = color.substring(0, 2)
    , g = color.substring(2, 4)
    , b = color.substring(4, 6);

  return [ parseInt(r, 16), parseInt(g, 16), parseInt(b, 16) ];
};

/**
 * Transform a 255 RGB value to an RGV code.
 *
 * @param {Number} r Red color channel.
 * @param {Number} g Green color channel.
 * @param {Number} b Blue color channel.
 * @returns {String}
 * @api public
 */
Kuler.prototype.rgb = function rgb(r, g, b) {
  var red = r / 255 * 5
    , green = g / 255 * 5
    , blue = b / 255 * 5;

  return this.ansi(red, green, blue);
};

/**
 * Turns RGB 0-5 values into a single ANSI code.
 *
 * @param {Number} r Red color channel.
 * @param {Number} g Green color channel.
 * @param {Number} b Blue color channel.
 * @returns {String}
 * @api public
 */
Kuler.prototype.ansi = function ansi(r, g, b) {
  var red = Math.round(r)
    , green = Math.round(g)
    , blue = Math.round(b);

  return 16 + (red * 36) + (green * 6) + blue;
};

/**
 * Marks an end of color sequence.
 *
 * @returns {String} Reset sequence.
 * @api public
 */
Kuler.prototype.reset = function reset() {
  return this.prefix +'39;49'+ this.suffix;
};

/**
 * Colour the terminal using CSS.
 *
 * @param {String} color The HEX color code.
 * @returns {String} the escape code.
 * @api public
 */
Kuler.prototype.style = function style(color) {
  //
  // We've been supplied a CSS color name instead of a hex color format so we
  // need to transform it to proper CSS color and continue with our execution
  // flow.
  //
  if (!/^#?(?:[0-9a-fA-F]{3}){1,2}$/.test(color)) {
    color = colornames(color);
  }

  return this.prefix +'38;5;'+ this.rgb.apply(this, this.hex(color)) + this.suffix + this.text + this.reset();
};


//
// Expose the actual interface.
//
module.exports = Kuler;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies
 */
var colors = __webpack_require__(84)

var cssColors = colors.filter(function(color){
  return !! color.css
})

var vgaColors = colors.filter(function(color){
  return !! color.vga
})


/**
 * Get color value for a certain name.
 * @param name {String}
 * @return {String} Hex color value
 * @api public
 */

module.exports = function(name) {
  var color = module.exports.get(name)
  return color && color.value
}

/**
 * Get color object.
 *
 * @param name {String}
 * @return {Object} Color object
 * @api public
 */

module.exports.get = function(name) {
  name = name || ''
  name = name.trim()
  return colors.filter(function(color){
    return color.name === name
  }).pop()
}

/**
 * Get all color object.
 *
 * @return {Array}
 * @api public
 */

module.exports.all = module.exports.get.all = function() {
 return colors
}

/**
 * Get color object compatible with CSS.
 *
 * @return {Array}
 * @api public
 */

module.exports.get.css = function(name) {
  if (!name) return cssColors
  name = name || ''
  name = name.trim()
  return cssColors.filter(function(color){
    return color.name === name
  }).pop()
}



module.exports.get.vga = function(name) {
  if (!name) return vgaColors
  name = name || ''
  name = name.trim()
  return vgaColors.filter(function(color){
    return color.name === name
  }).pop()
}


/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = [
  {
    "value":"#B0171F",
    "name":"indian red"
  },
  {
    "value":"#DC143C",
    "css":true,
    "name":"crimson"
  },
  {
    "value":"#FFB6C1",
    "css":true,
    "name":"lightpink"
  },
  {
    "value":"#FFAEB9",
    "name":"lightpink 1"
  },
  {
    "value":"#EEA2AD",
    "name":"lightpink 2"
  },
  {
    "value":"#CD8C95",
    "name":"lightpink 3"
  },
  {
    "value":"#8B5F65",
    "name":"lightpink 4"
  },
  {
    "value":"#FFC0CB",
    "css":true,
    "name":"pink"
  },
  {
    "value":"#FFB5C5",
    "name":"pink 1"
  },
  {
    "value":"#EEA9B8",
    "name":"pink 2"
  },
  {
    "value":"#CD919E",
    "name":"pink 3"
  },
  {
    "value":"#8B636C",
    "name":"pink 4"
  },
  {
    "value":"#DB7093",
    "css":true,
    "name":"palevioletred"
  },
  {
    "value":"#FF82AB",
    "name":"palevioletred 1"
  },
  {
    "value":"#EE799F",
    "name":"palevioletred 2"
  },
  {
    "value":"#CD6889",
    "name":"palevioletred 3"
  },
  {
    "value":"#8B475D",
    "name":"palevioletred 4"
  },
  {
    "value":"#FFF0F5",
    "name":"lavenderblush 1"
  },
  {
    "value":"#FFF0F5",
    "css":true,
    "name":"lavenderblush"
  },
  {
    "value":"#EEE0E5",
    "name":"lavenderblush 2"
  },
  {
    "value":"#CDC1C5",
    "name":"lavenderblush 3"
  },
  {
    "value":"#8B8386",
    "name":"lavenderblush 4"
  },
  {
    "value":"#FF3E96",
    "name":"violetred 1"
  },
  {
    "value":"#EE3A8C",
    "name":"violetred 2"
  },
  {
    "value":"#CD3278",
    "name":"violetred 3"
  },
  {
    "value":"#8B2252",
    "name":"violetred 4"
  },
  {
    "value":"#FF69B4",
    "css":true,
    "name":"hotpink"
  },
  {
    "value":"#FF6EB4",
    "name":"hotpink 1"
  },
  {
    "value":"#EE6AA7",
    "name":"hotpink 2"
  },
  {
    "value":"#CD6090",
    "name":"hotpink 3"
  },
  {
    "value":"#8B3A62",
    "name":"hotpink 4"
  },
  {
    "value":"#872657",
    "name":"raspberry"
  },
  {
    "value":"#FF1493",
    "name":"deeppink 1"
  },
  {
    "value":"#FF1493",
    "css":true,
    "name":"deeppink"
  },
  {
    "value":"#EE1289",
    "name":"deeppink 2"
  },
  {
    "value":"#CD1076",
    "name":"deeppink 3"
  },
  {
    "value":"#8B0A50",
    "name":"deeppink 4"
  },
  {
    "value":"#FF34B3",
    "name":"maroon 1"
  },
  {
    "value":"#EE30A7",
    "name":"maroon 2"
  },
  {
    "value":"#CD2990",
    "name":"maroon 3"
  },
  {
    "value":"#8B1C62",
    "name":"maroon 4"
  },
  {
    "value":"#C71585",
    "css":true,
    "name":"mediumvioletred"
  },
  {
    "value":"#D02090",
    "name":"violetred"
  },
  {
    "value":"#DA70D6",
    "css":true,
    "name":"orchid"
  },
  {
    "value":"#FF83FA",
    "name":"orchid 1"
  },
  {
    "value":"#EE7AE9",
    "name":"orchid 2"
  },
  {
    "value":"#CD69C9",
    "name":"orchid 3"
  },
  {
    "value":"#8B4789",
    "name":"orchid 4"
  },
  {
    "value":"#D8BFD8",
    "css":true,
    "name":"thistle"
  },
  {
    "value":"#FFE1FF",
    "name":"thistle 1"
  },
  {
    "value":"#EED2EE",
    "name":"thistle 2"
  },
  {
    "value":"#CDB5CD",
    "name":"thistle 3"
  },
  {
    "value":"#8B7B8B",
    "name":"thistle 4"
  },
  {
    "value":"#FFBBFF",
    "name":"plum 1"
  },
  {
    "value":"#EEAEEE",
    "name":"plum 2"
  },
  {
    "value":"#CD96CD",
    "name":"plum 3"
  },
  {
    "value":"#8B668B",
    "name":"plum 4"
  },
  {
    "value":"#DDA0DD",
    "css":true,
    "name":"plum"
  },
  {
    "value":"#EE82EE",
    "css":true,
    "name":"violet"
  },
  {
    "value":"#FF00FF",
    "vga":true,
    "name":"magenta"
  },
  {
    "value":"#FF00FF",
    "vga":true,
    "css":true,
    "name":"fuchsia"
  },
  {
    "value":"#EE00EE",
    "name":"magenta 2"
  },
  {
    "value":"#CD00CD",
    "name":"magenta 3"
  },
  {
    "value":"#8B008B",
    "name":"magenta 4"
  },
  {
    "value":"#8B008B",
    "css":true,
    "name":"darkmagenta"
  },
  {
    "value":"#800080",
    "vga":true,
    "css":true,
    "name":"purple"
  },
  {
    "value":"#BA55D3",
    "css":true,
    "name":"mediumorchid"
  },
  {
    "value":"#E066FF",
    "name":"mediumorchid 1"
  },
  {
    "value":"#D15FEE",
    "name":"mediumorchid 2"
  },
  {
    "value":"#B452CD",
    "name":"mediumorchid 3"
  },
  {
    "value":"#7A378B",
    "name":"mediumorchid 4"
  },
  {
    "value":"#9400D3",
    "css":true,
    "name":"darkviolet"
  },
  {
    "value":"#9932CC",
    "css":true,
    "name":"darkorchid"
  },
  {
    "value":"#BF3EFF",
    "name":"darkorchid 1"
  },
  {
    "value":"#B23AEE",
    "name":"darkorchid 2"
  },
  {
    "value":"#9A32CD",
    "name":"darkorchid 3"
  },
  {
    "value":"#68228B",
    "name":"darkorchid 4"
  },
  {
    "value":"#4B0082",
    "css":true,
    "name":"indigo"
  },
  {
    "value":"#8A2BE2",
    "css":true,
    "name":"blueviolet"
  },
  {
    "value":"#9B30FF",
    "name":"purple 1"
  },
  {
    "value":"#912CEE",
    "name":"purple 2"
  },
  {
    "value":"#7D26CD",
    "name":"purple 3"
  },
  {
    "value":"#551A8B",
    "name":"purple 4"
  },
  {
    "value":"#9370DB",
    "css":true,
    "name":"mediumpurple"
  },
  {
    "value":"#AB82FF",
    "name":"mediumpurple 1"
  },
  {
    "value":"#9F79EE",
    "name":"mediumpurple 2"
  },
  {
    "value":"#8968CD",
    "name":"mediumpurple 3"
  },
  {
    "value":"#5D478B",
    "name":"mediumpurple 4"
  },
  {
    "value":"#483D8B",
    "css":true,
    "name":"darkslateblue"
  },
  {
    "value":"#8470FF",
    "name":"lightslateblue"
  },
  {
    "value":"#7B68EE",
    "css":true,
    "name":"mediumslateblue"
  },
  {
    "value":"#6A5ACD",
    "css":true,
    "name":"slateblue"
  },
  {
    "value":"#836FFF",
    "name":"slateblue 1"
  },
  {
    "value":"#7A67EE",
    "name":"slateblue 2"
  },
  {
    "value":"#6959CD",
    "name":"slateblue 3"
  },
  {
    "value":"#473C8B",
    "name":"slateblue 4"
  },
  {
    "value":"#F8F8FF",
    "css":true,
    "name":"ghostwhite"
  },
  {
    "value":"#E6E6FA",
    "css":true,
    "name":"lavender"
  },
  {
    "value":"#0000FF",
    "vga":true,
    "css":true,
    "name":"blue"
  },
  {
    "value":"#0000EE",
    "name":"blue 2"
  },
  {
    "value":"#0000CD",
    "name":"blue 3"
  },
  {
    "value":"#0000CD",
    "css":true,
    "name":"mediumblue"
  },
  {
    "value":"#00008B",
    "name":"blue 4"
  },
  {
    "value":"#00008B",
    "css":true,
    "name":"darkblue"
  },
  {
    "value":"#000080",
    "vga":true,
    "css":true,
    "name":"navy"
  },
  {
    "value":"#191970",
    "css":true,
    "name":"midnightblue"
  },
  {
    "value":"#3D59AB",
    "name":"cobalt"
  },
  {
    "value":"#4169E1",
    "css":true,
    "name":"royalblue"
  },
  {
    "value":"#4876FF",
    "name":"royalblue 1"
  },
  {
    "value":"#436EEE",
    "name":"royalblue 2"
  },
  {
    "value":"#3A5FCD",
    "name":"royalblue 3"
  },
  {
    "value":"#27408B",
    "name":"royalblue 4"
  },
  {
    "value":"#6495ED",
    "css":true,
    "name":"cornflowerblue"
  },
  {
    "value":"#B0C4DE",
    "css":true,
    "name":"lightsteelblue"
  },
  {
    "value":"#CAE1FF",
    "name":"lightsteelblue 1"
  },
  {
    "value":"#BCD2EE",
    "name":"lightsteelblue 2"
  },
  {
    "value":"#A2B5CD",
    "name":"lightsteelblue 3"
  },
  {
    "value":"#6E7B8B",
    "name":"lightsteelblue 4"
  },
  {
    "value":"#778899",
    "css":true,
    "name":"lightslategray"
  },
  {
    "value":"#708090",
    "css":true,
    "name":"slategray"
  },
  {
    "value":"#C6E2FF",
    "name":"slategray 1"
  },
  {
    "value":"#B9D3EE",
    "name":"slategray 2"
  },
  {
    "value":"#9FB6CD",
    "name":"slategray 3"
  },
  {
    "value":"#6C7B8B",
    "name":"slategray 4"
  },
  {
    "value":"#1E90FF",
    "name":"dodgerblue 1"
  },
  {
    "value":"#1E90FF",
    "css":true,
    "name":"dodgerblue"
  },
  {
    "value":"#1C86EE",
    "name":"dodgerblue 2"
  },
  {
    "value":"#1874CD",
    "name":"dodgerblue 3"
  },
  {
    "value":"#104E8B",
    "name":"dodgerblue 4"
  },
  {
    "value":"#F0F8FF",
    "css":true,
    "name":"aliceblue"
  },
  {
    "value":"#4682B4",
    "css":true,
    "name":"steelblue"
  },
  {
    "value":"#63B8FF",
    "name":"steelblue 1"
  },
  {
    "value":"#5CACEE",
    "name":"steelblue 2"
  },
  {
    "value":"#4F94CD",
    "name":"steelblue 3"
  },
  {
    "value":"#36648B",
    "name":"steelblue 4"
  },
  {
    "value":"#87CEFA",
    "css":true,
    "name":"lightskyblue"
  },
  {
    "value":"#B0E2FF",
    "name":"lightskyblue 1"
  },
  {
    "value":"#A4D3EE",
    "name":"lightskyblue 2"
  },
  {
    "value":"#8DB6CD",
    "name":"lightskyblue 3"
  },
  {
    "value":"#607B8B",
    "name":"lightskyblue 4"
  },
  {
    "value":"#87CEFF",
    "name":"skyblue 1"
  },
  {
    "value":"#7EC0EE",
    "name":"skyblue 2"
  },
  {
    "value":"#6CA6CD",
    "name":"skyblue 3"
  },
  {
    "value":"#4A708B",
    "name":"skyblue 4"
  },
  {
    "value":"#87CEEB",
    "css":true,
    "name":"skyblue"
  },
  {
    "value":"#00BFFF",
    "name":"deepskyblue 1"
  },
  {
    "value":"#00BFFF",
    "css":true,
    "name":"deepskyblue"
  },
  {
    "value":"#00B2EE",
    "name":"deepskyblue 2"
  },
  {
    "value":"#009ACD",
    "name":"deepskyblue 3"
  },
  {
    "value":"#00688B",
    "name":"deepskyblue 4"
  },
  {
    "value":"#33A1C9",
    "name":"peacock"
  },
  {
    "value":"#ADD8E6",
    "css":true,
    "name":"lightblue"
  },
  {
    "value":"#BFEFFF",
    "name":"lightblue 1"
  },
  {
    "value":"#B2DFEE",
    "name":"lightblue 2"
  },
  {
    "value":"#9AC0CD",
    "name":"lightblue 3"
  },
  {
    "value":"#68838B",
    "name":"lightblue 4"
  },
  {
    "value":"#B0E0E6",
    "css":true,
    "name":"powderblue"
  },
  {
    "value":"#98F5FF",
    "name":"cadetblue 1"
  },
  {
    "value":"#8EE5EE",
    "name":"cadetblue 2"
  },
  {
    "value":"#7AC5CD",
    "name":"cadetblue 3"
  },
  {
    "value":"#53868B",
    "name":"cadetblue 4"
  },
  {
    "value":"#00F5FF",
    "name":"turquoise 1"
  },
  {
    "value":"#00E5EE",
    "name":"turquoise 2"
  },
  {
    "value":"#00C5CD",
    "name":"turquoise 3"
  },
  {
    "value":"#00868B",
    "name":"turquoise 4"
  },
  {
    "value":"#5F9EA0",
    "css":true,
    "name":"cadetblue"
  },
  {
    "value":"#00CED1",
    "css":true,
    "name":"darkturquoise"
  },
  {
    "value":"#F0FFFF",
    "name":"azure 1"
  },
  {
    "value":"#F0FFFF",
    "css":true,
    "name":"azure"
  },
  {
    "value":"#E0EEEE",
    "name":"azure 2"
  },
  {
    "value":"#C1CDCD",
    "name":"azure 3"
  },
  {
    "value":"#838B8B",
    "name":"azure 4"
  },
  {
    "value":"#E0FFFF",
    "name":"lightcyan 1"
  },
  {
    "value":"#E0FFFF",
    "css":true,
    "name":"lightcyan"
  },
  {
    "value":"#D1EEEE",
    "name":"lightcyan 2"
  },
  {
    "value":"#B4CDCD",
    "name":"lightcyan 3"
  },
  {
    "value":"#7A8B8B",
    "name":"lightcyan 4"
  },
  {
    "value":"#BBFFFF",
    "name":"paleturquoise 1"
  },
  {
    "value":"#AEEEEE",
    "name":"paleturquoise 2"
  },
  {
    "value":"#AEEEEE",
    "css":true,
    "name":"paleturquoise"
  },
  {
    "value":"#96CDCD",
    "name":"paleturquoise 3"
  },
  {
    "value":"#668B8B",
    "name":"paleturquoise 4"
  },
  {
    "value":"#2F4F4F",
    "css":true,
    "name":"darkslategray"
  },
  {
    "value":"#97FFFF",
    "name":"darkslategray 1"
  },
  {
    "value":"#8DEEEE",
    "name":"darkslategray 2"
  },
  {
    "value":"#79CDCD",
    "name":"darkslategray 3"
  },
  {
    "value":"#528B8B",
    "name":"darkslategray 4"
  },
  {
    "value":"#00FFFF",
    "name":"cyan"
  },
  {
    "value":"#00FFFF",
    "css":true,
    "name":"aqua"
  },
  {
    "value":"#00EEEE",
    "name":"cyan 2"
  },
  {
    "value":"#00CDCD",
    "name":"cyan 3"
  },
  {
    "value":"#008B8B",
    "name":"cyan 4"
  },
  {
    "value":"#008B8B",
    "css":true,
    "name":"darkcyan"
  },
  {
    "value":"#008080",
    "vga":true,
    "css":true,
    "name":"teal"
  },
  {
    "value":"#48D1CC",
    "css":true,
    "name":"mediumturquoise"
  },
  {
    "value":"#20B2AA",
    "css":true,
    "name":"lightseagreen"
  },
  {
    "value":"#03A89E",
    "name":"manganeseblue"
  },
  {
    "value":"#40E0D0",
    "css":true,
    "name":"turquoise"
  },
  {
    "value":"#808A87",
    "name":"coldgrey"
  },
  {
    "value":"#00C78C",
    "name":"turquoiseblue"
  },
  {
    "value":"#7FFFD4",
    "name":"aquamarine 1"
  },
  {
    "value":"#7FFFD4",
    "css":true,
    "name":"aquamarine"
  },
  {
    "value":"#76EEC6",
    "name":"aquamarine 2"
  },
  {
    "value":"#66CDAA",
    "name":"aquamarine 3"
  },
  {
    "value":"#66CDAA",
    "css":true,
    "name":"mediumaquamarine"
  },
  {
    "value":"#458B74",
    "name":"aquamarine 4"
  },
  {
    "value":"#00FA9A",
    "css":true,
    "name":"mediumspringgreen"
  },
  {
    "value":"#F5FFFA",
    "css":true,
    "name":"mintcream"
  },
  {
    "value":"#00FF7F",
    "css":true,
    "name":"springgreen"
  },
  {
    "value":"#00EE76",
    "name":"springgreen 1"
  },
  {
    "value":"#00CD66",
    "name":"springgreen 2"
  },
  {
    "value":"#008B45",
    "name":"springgreen 3"
  },
  {
    "value":"#3CB371",
    "css":true,
    "name":"mediumseagreen"
  },
  {
    "value":"#54FF9F",
    "name":"seagreen 1"
  },
  {
    "value":"#4EEE94",
    "name":"seagreen 2"
  },
  {
    "value":"#43CD80",
    "name":"seagreen 3"
  },
  {
    "value":"#2E8B57",
    "name":"seagreen 4"
  },
  {
    "value":"#2E8B57",
    "css":true,
    "name":"seagreen"
  },
  {
    "value":"#00C957",
    "name":"emeraldgreen"
  },
  {
    "value":"#BDFCC9",
    "name":"mint"
  },
  {
    "value":"#3D9140",
    "name":"cobaltgreen"
  },
  {
    "value":"#F0FFF0",
    "name":"honeydew 1"
  },
  {
    "value":"#F0FFF0",
    "css":true,
    "name":"honeydew"
  },
  {
    "value":"#E0EEE0",
    "name":"honeydew 2"
  },
  {
    "value":"#C1CDC1",
    "name":"honeydew 3"
  },
  {
    "value":"#838B83",
    "name":"honeydew 4"
  },
  {
    "value":"#8FBC8F",
    "css":true,
    "name":"darkseagreen"
  },
  {
    "value":"#C1FFC1",
    "name":"darkseagreen 1"
  },
  {
    "value":"#B4EEB4",
    "name":"darkseagreen 2"
  },
  {
    "value":"#9BCD9B",
    "name":"darkseagreen 3"
  },
  {
    "value":"#698B69",
    "name":"darkseagreen 4"
  },
  {
    "value":"#98FB98",
    "css":true,
    "name":"palegreen"
  },
  {
    "value":"#9AFF9A",
    "name":"palegreen 1"
  },
  {
    "value":"#90EE90",
    "name":"palegreen 2"
  },
  {
    "value":"#90EE90",
    "css":true,
    "name":"lightgreen"
  },
  {
    "value":"#7CCD7C",
    "name":"palegreen 3"
  },
  {
    "value":"#548B54",
    "name":"palegreen 4"
  },
  {
    "value":"#32CD32",
    "css":true,
    "name":"limegreen"
  },
  {
    "value":"#228B22",
    "css":true,
    "name":"forestgreen"
  },
  {
    "value":"#00FF00",
    "vga":true,
    "name":"green 1"
  },
  {
    "value":"#00FF00",
    "vga":true,
    "css":true,
    "name":"lime"
  },
  {
    "value":"#00EE00",
    "name":"green 2"
  },
  {
    "value":"#00CD00",
    "name":"green 3"
  },
  {
    "value":"#008B00",
    "name":"green 4"
  },
  {
    "value":"#008000",
    "vga":true,
    "css":true,
    "name":"green"
  },
  {
    "value":"#006400",
    "css":true,
    "name":"darkgreen"
  },
  {
    "value":"#308014",
    "name":"sapgreen"
  },
  {
    "value":"#7CFC00",
    "css":true,
    "name":"lawngreen"
  },
  {
    "value":"#7FFF00",
    "name":"chartreuse 1"
  },
  {
    "value":"#7FFF00",
    "css":true,
    "name":"chartreuse"
  },
  {
    "value":"#76EE00",
    "name":"chartreuse 2"
  },
  {
    "value":"#66CD00",
    "name":"chartreuse 3"
  },
  {
    "value":"#458B00",
    "name":"chartreuse 4"
  },
  {
    "value":"#ADFF2F",
    "css":true,
    "name":"greenyellow"
  },
  {
    "value":"#CAFF70",
    "name":"darkolivegreen 1"
  },
  {
    "value":"#BCEE68",
    "name":"darkolivegreen 2"
  },
  {
    "value":"#A2CD5A",
    "name":"darkolivegreen 3"
  },
  {
    "value":"#6E8B3D",
    "name":"darkolivegreen 4"
  },
  {
    "value":"#556B2F",
    "css":true,
    "name":"darkolivegreen"
  },
  {
    "value":"#6B8E23",
    "css":true,
    "name":"olivedrab"
  },
  {
    "value":"#C0FF3E",
    "name":"olivedrab 1"
  },
  {
    "value":"#B3EE3A",
    "name":"olivedrab 2"
  },
  {
    "value":"#9ACD32",
    "name":"olivedrab 3"
  },
  {
    "value":"#9ACD32",
    "css":true,
    "name":"yellowgreen"
  },
  {
    "value":"#698B22",
    "name":"olivedrab 4"
  },
  {
    "value":"#FFFFF0",
    "name":"ivory 1"
  },
  {
    "value":"#FFFFF0",
    "css":true,
    "name":"ivory"
  },
  {
    "value":"#EEEEE0",
    "name":"ivory 2"
  },
  {
    "value":"#CDCDC1",
    "name":"ivory 3"
  },
  {
    "value":"#8B8B83",
    "name":"ivory 4"
  },
  {
    "value":"#F5F5DC",
    "css":true,
    "name":"beige"
  },
  {
    "value":"#FFFFE0",
    "name":"lightyellow 1"
  },
  {
    "value":"#FFFFE0",
    "css":true,
    "name":"lightyellow"
  },
  {
    "value":"#EEEED1",
    "name":"lightyellow 2"
  },
  {
    "value":"#CDCDB4",
    "name":"lightyellow 3"
  },
  {
    "value":"#8B8B7A",
    "name":"lightyellow 4"
  },
  {
    "value":"#FAFAD2",
    "css":true,
    "name":"lightgoldenrodyellow"
  },
  {
    "value":"#FFFF00",
    "vga":true,
    "name":"yellow 1"
  },
  {
    "value":"#FFFF00",
    "vga":true,
    "css":true,
    "name":"yellow"
  },
  {
    "value":"#EEEE00",
    "name":"yellow 2"
  },
  {
    "value":"#CDCD00",
    "name":"yellow 3"
  },
  {
    "value":"#8B8B00",
    "name":"yellow 4"
  },
  {
    "value":"#808069",
    "name":"warmgrey"
  },
  {
    "value":"#808000",
    "vga":true,
    "css":true,
    "name":"olive"
  },
  {
    "value":"#BDB76B",
    "css":true,
    "name":"darkkhaki"
  },
  {
    "value":"#FFF68F",
    "name":"khaki 1"
  },
  {
    "value":"#EEE685",
    "name":"khaki 2"
  },
  {
    "value":"#CDC673",
    "name":"khaki 3"
  },
  {
    "value":"#8B864E",
    "name":"khaki 4"
  },
  {
    "value":"#F0E68C",
    "css":true,
    "name":"khaki"
  },
  {
    "value":"#EEE8AA",
    "css":true,
    "name":"palegoldenrod"
  },
  {
    "value":"#FFFACD",
    "name":"lemonchiffon 1"
  },
  {
    "value":"#FFFACD",
    "css":true,
    "name":"lemonchiffon"
  },
  {
    "value":"#EEE9BF",
    "name":"lemonchiffon 2"
  },
  {
    "value":"#CDC9A5",
    "name":"lemonchiffon 3"
  },
  {
    "value":"#8B8970",
    "name":"lemonchiffon 4"
  },
  {
    "value":"#FFEC8B",
    "name":"lightgoldenrod 1"
  },
  {
    "value":"#EEDC82",
    "name":"lightgoldenrod 2"
  },
  {
    "value":"#CDBE70",
    "name":"lightgoldenrod 3"
  },
  {
    "value":"#8B814C",
    "name":"lightgoldenrod 4"
  },
  {
    "value":"#E3CF57",
    "name":"banana"
  },
  {
    "value":"#FFD700",
    "name":"gold 1"
  },
  {
    "value":"#FFD700",
    "css":true,
    "name":"gold"
  },
  {
    "value":"#EEC900",
    "name":"gold 2"
  },
  {
    "value":"#CDAD00",
    "name":"gold 3"
  },
  {
    "value":"#8B7500",
    "name":"gold 4"
  },
  {
    "value":"#FFF8DC",
    "name":"cornsilk 1"
  },
  {
    "value":"#FFF8DC",
    "css":true,
    "name":"cornsilk"
  },
  {
    "value":"#EEE8CD",
    "name":"cornsilk 2"
  },
  {
    "value":"#CDC8B1",
    "name":"cornsilk 3"
  },
  {
    "value":"#8B8878",
    "name":"cornsilk 4"
  },
  {
    "value":"#DAA520",
    "css":true,
    "name":"goldenrod"
  },
  {
    "value":"#FFC125",
    "name":"goldenrod 1"
  },
  {
    "value":"#EEB422",
    "name":"goldenrod 2"
  },
  {
    "value":"#CD9B1D",
    "name":"goldenrod 3"
  },
  {
    "value":"#8B6914",
    "name":"goldenrod 4"
  },
  {
    "value":"#B8860B",
    "css":true,
    "name":"darkgoldenrod"
  },
  {
    "value":"#FFB90F",
    "name":"darkgoldenrod 1"
  },
  {
    "value":"#EEAD0E",
    "name":"darkgoldenrod 2"
  },
  {
    "value":"#CD950C",
    "name":"darkgoldenrod 3"
  },
  {
    "value":"#8B6508",
    "name":"darkgoldenrod 4"
  },
  {
    "value":"#FFA500",
    "name":"orange 1"
  },
  {
    "value":"#FF8000",
    "css":true,
    "name":"orange"
  },
  {
    "value":"#EE9A00",
    "name":"orange 2"
  },
  {
    "value":"#CD8500",
    "name":"orange 3"
  },
  {
    "value":"#8B5A00",
    "name":"orange 4"
  },
  {
    "value":"#FFFAF0",
    "css":true,
    "name":"floralwhite"
  },
  {
    "value":"#FDF5E6",
    "css":true,
    "name":"oldlace"
  },
  {
    "value":"#F5DEB3",
    "css":true,
    "name":"wheat"
  },
  {
    "value":"#FFE7BA",
    "name":"wheat 1"
  },
  {
    "value":"#EED8AE",
    "name":"wheat 2"
  },
  {
    "value":"#CDBA96",
    "name":"wheat 3"
  },
  {
    "value":"#8B7E66",
    "name":"wheat 4"
  },
  {
    "value":"#FFE4B5",
    "css":true,
    "name":"moccasin"
  },
  {
    "value":"#FFEFD5",
    "css":true,
    "name":"papayawhip"
  },
  {
    "value":"#FFEBCD",
    "css":true,
    "name":"blanchedalmond"
  },
  {
    "value":"#FFDEAD",
    "name":"navajowhite 1"
  },
  {
    "value":"#FFDEAD",
    "css":true,
    "name":"navajowhite"
  },
  {
    "value":"#EECFA1",
    "name":"navajowhite 2"
  },
  {
    "value":"#CDB38B",
    "name":"navajowhite 3"
  },
  {
    "value":"#8B795E",
    "name":"navajowhite 4"
  },
  {
    "value":"#FCE6C9",
    "name":"eggshell"
  },
  {
    "value":"#D2B48C",
    "css":true,
    "name":"tan"
  },
  {
    "value":"#9C661F",
    "name":"brick"
  },
  {
    "value":"#FF9912",
    "name":"cadmiumyellow"
  },
  {
    "value":"#FAEBD7",
    "css":true,
    "name":"antiquewhite"
  },
  {
    "value":"#FFEFDB",
    "name":"antiquewhite 1"
  },
  {
    "value":"#EEDFCC",
    "name":"antiquewhite 2"
  },
  {
    "value":"#CDC0B0",
    "name":"antiquewhite 3"
  },
  {
    "value":"#8B8378",
    "name":"antiquewhite 4"
  },
  {
    "value":"#DEB887",
    "css":true,
    "name":"burlywood"
  },
  {
    "value":"#FFD39B",
    "name":"burlywood 1"
  },
  {
    "value":"#EEC591",
    "name":"burlywood 2"
  },
  {
    "value":"#CDAA7D",
    "name":"burlywood 3"
  },
  {
    "value":"#8B7355",
    "name":"burlywood 4"
  },
  {
    "value":"#FFE4C4",
    "name":"bisque 1"
  },
  {
    "value":"#FFE4C4",
    "css":true,
    "name":"bisque"
  },
  {
    "value":"#EED5B7",
    "name":"bisque 2"
  },
  {
    "value":"#CDB79E",
    "name":"bisque 3"
  },
  {
    "value":"#8B7D6B",
    "name":"bisque 4"
  },
  {
    "value":"#E3A869",
    "name":"melon"
  },
  {
    "value":"#ED9121",
    "name":"carrot"
  },
  {
    "value":"#FF8C00",
    "css":true,
    "name":"darkorange"
  },
  {
    "value":"#FF7F00",
    "name":"darkorange 1"
  },
  {
    "value":"#EE7600",
    "name":"darkorange 2"
  },
  {
    "value":"#CD6600",
    "name":"darkorange 3"
  },
  {
    "value":"#8B4500",
    "name":"darkorange 4"
  },
  {
    "value":"#FFA54F",
    "name":"tan 1"
  },
  {
    "value":"#EE9A49",
    "name":"tan 2"
  },
  {
    "value":"#CD853F",
    "name":"tan 3"
  },
  {
    "value":"#CD853F",
    "css":true,
    "name":"peru"
  },
  {
    "value":"#8B5A2B",
    "name":"tan 4"
  },
  {
    "value":"#FAF0E6",
    "css":true,
    "name":"linen"
  },
  {
    "value":"#FFDAB9",
    "name":"peachpuff 1"
  },
  {
    "value":"#FFDAB9",
    "css":true,
    "name":"peachpuff"
  },
  {
    "value":"#EECBAD",
    "name":"peachpuff 2"
  },
  {
    "value":"#CDAF95",
    "name":"peachpuff 3"
  },
  {
    "value":"#8B7765",
    "name":"peachpuff 4"
  },
  {
    "value":"#FFF5EE",
    "name":"seashell 1"
  },
  {
    "value":"#FFF5EE",
    "css":true,
    "name":"seashell"
  },
  {
    "value":"#EEE5DE",
    "name":"seashell 2"
  },
  {
    "value":"#CDC5BF",
    "name":"seashell 3"
  },
  {
    "value":"#8B8682",
    "name":"seashell 4"
  },
  {
    "value":"#F4A460",
    "css":true,
    "name":"sandybrown"
  },
  {
    "value":"#C76114",
    "name":"rawsienna"
  },
  {
    "value":"#D2691E",
    "css":true,
    "name":"chocolate"
  },
  {
    "value":"#FF7F24",
    "name":"chocolate 1"
  },
  {
    "value":"#EE7621",
    "name":"chocolate 2"
  },
  {
    "value":"#CD661D",
    "name":"chocolate 3"
  },
  {
    "value":"#8B4513",
    "name":"chocolate 4"
  },
  {
    "value":"#8B4513",
    "css":true,
    "name":"saddlebrown"
  },
  {
    "value":"#292421",
    "name":"ivoryblack"
  },
  {
    "value":"#FF7D40",
    "name":"flesh"
  },
  {
    "value":"#FF6103",
    "name":"cadmiumorange"
  },
  {
    "value":"#8A360F",
    "name":"burntsienna"
  },
  {
    "value":"#A0522D",
    "css":true,
    "name":"sienna"
  },
  {
    "value":"#FF8247",
    "name":"sienna 1"
  },
  {
    "value":"#EE7942",
    "name":"sienna 2"
  },
  {
    "value":"#CD6839",
    "name":"sienna 3"
  },
  {
    "value":"#8B4726",
    "name":"sienna 4"
  },
  {
    "value":"#FFA07A",
    "name":"lightsalmon 1"
  },
  {
    "value":"#FFA07A",
    "css":true,
    "name":"lightsalmon"
  },
  {
    "value":"#EE9572",
    "name":"lightsalmon 2"
  },
  {
    "value":"#CD8162",
    "name":"lightsalmon 3"
  },
  {
    "value":"#8B5742",
    "name":"lightsalmon 4"
  },
  {
    "value":"#FF7F50",
    "css":true,
    "name":"coral"
  },
  {
    "value":"#FF4500",
    "name":"orangered 1"
  },
  {
    "value":"#FF4500",
    "css":true,
    "name":"orangered"
  },
  {
    "value":"#EE4000",
    "name":"orangered 2"
  },
  {
    "value":"#CD3700",
    "name":"orangered 3"
  },
  {
    "value":"#8B2500",
    "name":"orangered 4"
  },
  {
    "value":"#5E2612",
    "name":"sepia"
  },
  {
    "value":"#E9967A",
    "css":true,
    "name":"darksalmon"
  },
  {
    "value":"#FF8C69",
    "name":"salmon 1"
  },
  {
    "value":"#EE8262",
    "name":"salmon 2"
  },
  {
    "value":"#CD7054",
    "name":"salmon 3"
  },
  {
    "value":"#8B4C39",
    "name":"salmon 4"
  },
  {
    "value":"#FF7256",
    "name":"coral 1"
  },
  {
    "value":"#EE6A50",
    "name":"coral 2"
  },
  {
    "value":"#CD5B45",
    "name":"coral 3"
  },
  {
    "value":"#8B3E2F",
    "name":"coral 4"
  },
  {
    "value":"#8A3324",
    "name":"burntumber"
  },
  {
    "value":"#FF6347",
    "name":"tomato 1"
  },
  {
    "value":"#FF6347",
    "css":true,
    "name":"tomato"
  },
  {
    "value":"#EE5C42",
    "name":"tomato 2"
  },
  {
    "value":"#CD4F39",
    "name":"tomato 3"
  },
  {
    "value":"#8B3626",
    "name":"tomato 4"
  },
  {
    "value":"#FA8072",
    "css":true,
    "name":"salmon"
  },
  {
    "value":"#FFE4E1",
    "name":"mistyrose 1"
  },
  {
    "value":"#FFE4E1",
    "css":true,
    "name":"mistyrose"
  },
  {
    "value":"#EED5D2",
    "name":"mistyrose 2"
  },
  {
    "value":"#CDB7B5",
    "name":"mistyrose 3"
  },
  {
    "value":"#8B7D7B",
    "name":"mistyrose 4"
  },
  {
    "value":"#FFFAFA",
    "name":"snow 1"
  },
  {
    "value":"#FFFAFA",
    "css":true,
    "name":"snow"
  },
  {
    "value":"#EEE9E9",
    "name":"snow 2"
  },
  {
    "value":"#CDC9C9",
    "name":"snow 3"
  },
  {
    "value":"#8B8989",
    "name":"snow 4"
  },
  {
    "value":"#BC8F8F",
    "css":true,
    "name":"rosybrown"
  },
  {
    "value":"#FFC1C1",
    "name":"rosybrown 1"
  },
  {
    "value":"#EEB4B4",
    "name":"rosybrown 2"
  },
  {
    "value":"#CD9B9B",
    "name":"rosybrown 3"
  },
  {
    "value":"#8B6969",
    "name":"rosybrown 4"
  },
  {
    "value":"#F08080",
    "css":true,
    "name":"lightcoral"
  },
  {
    "value":"#CD5C5C",
    "css":true,
    "name":"indianred"
  },
  {
    "value":"#FF6A6A",
    "name":"indianred 1"
  },
  {
    "value":"#EE6363",
    "name":"indianred 2"
  },
  {
    "value":"#8B3A3A",
    "name":"indianred 4"
  },
  {
    "value":"#CD5555",
    "name":"indianred 3"
  },
  {
    "value":"#A52A2A",
    "css":true,
    "name":"brown"
  },
  {
    "value":"#FF4040",
    "name":"brown 1"
  },
  {
    "value":"#EE3B3B",
    "name":"brown 2"
  },
  {
    "value":"#CD3333",
    "name":"brown 3"
  },
  {
    "value":"#8B2323",
    "name":"brown 4"
  },
  {
    "value":"#B22222",
    "css":true,
    "name":"firebrick"
  },
  {
    "value":"#FF3030",
    "name":"firebrick 1"
  },
  {
    "value":"#EE2C2C",
    "name":"firebrick 2"
  },
  {
    "value":"#CD2626",
    "name":"firebrick 3"
  },
  {
    "value":"#8B1A1A",
    "name":"firebrick 4"
  },
  {
    "value":"#FF0000",
    "vga":true,
    "name":"red 1"
  },
  {
    "value":"#FF0000",
    "vga":true,
    "css":true,
    "name":"red"
  },
  {
    "value":"#EE0000",
    "name":"red 2"
  },
  {
    "value":"#CD0000",
    "name":"red 3"
  },
  {
    "value":"#8B0000",
    "name":"red 4"
  },
  {
    "value":"#8B0000",
    "css":true,
    "name":"darkred"
  },
  {
    "value":"#800000",
    "vga":true,
    "css":true,
    "name":"maroon"
  },
  {
    "value":"#8E388E",
    "name":"sgi beet"
  },
  {
    "value":"#7171C6",
    "name":"sgi slateblue"
  },
  {
    "value":"#7D9EC0",
    "name":"sgi lightblue"
  },
  {
    "value":"#388E8E",
    "name":"sgi teal"
  },
  {
    "value":"#71C671",
    "name":"sgi chartreuse"
  },
  {
    "value":"#8E8E38",
    "name":"sgi olivedrab"
  },
  {
    "value":"#C5C1AA",
    "name":"sgi brightgray"
  },
  {
    "value":"#C67171",
    "name":"sgi salmon"
  },
  {
    "value":"#555555",
    "name":"sgi darkgray"
  },
  {
    "value":"#1E1E1E",
    "name":"sgi gray 12"
  },
  {
    "value":"#282828",
    "name":"sgi gray 16"
  },
  {
    "value":"#515151",
    "name":"sgi gray 32"
  },
  {
    "value":"#5B5B5B",
    "name":"sgi gray 36"
  },
  {
    "value":"#848484",
    "name":"sgi gray 52"
  },
  {
    "value":"#8E8E8E",
    "name":"sgi gray 56"
  },
  {
    "value":"#AAAAAA",
    "name":"sgi lightgray"
  },
  {
    "value":"#B7B7B7",
    "name":"sgi gray 72"
  },
  {
    "value":"#C1C1C1",
    "name":"sgi gray 76"
  },
  {
    "value":"#EAEAEA",
    "name":"sgi gray 92"
  },
  {
    "value":"#F4F4F4",
    "name":"sgi gray 96"
  },
  {
    "value":"#FFFFFF",
    "vga":true,
    "css":true,
    "name":"white"
  },
  {
    "value":"#F5F5F5",
    "name":"white smoke"
  },
  {
    "value":"#F5F5F5",
    "name":"gray 96"
  },
  {
    "value":"#DCDCDC",
    "css":true,
    "name":"gainsboro"
  },
  {
    "value":"#D3D3D3",
    "css":true,
    "name":"lightgrey"
  },
  {
    "value":"#C0C0C0",
    "vga":true,
    "css":true,
    "name":"silver"
  },
  {
    "value":"#A9A9A9",
    "css":true,
    "name":"darkgray"
  },
  {
    "value":"#808080",
    "vga":true,
    "css":true,
    "name":"gray"
  },
  {
    "value":"#696969",
    "css":true,
    "name":"dimgray"
  },
  {
    "value":"#696969",
    "name":"gray 42"
  },
  {
    "value":"#000000",
    "vga":true,
    "css":true,
    "name":"black"
  },
  {
    "value":"#FCFCFC",
    "name":"gray 99"
  },
  {
    "value":"#FAFAFA",
    "name":"gray 98"
  },
  {
    "value":"#F7F7F7",
    "name":"gray 97"
  },
  {
    "value":"#F2F2F2",
    "name":"gray 95"
  },
  {
    "value":"#F0F0F0",
    "name":"gray 94"
  },
  {
    "value":"#EDEDED",
    "name":"gray 93"
  },
  {
    "value":"#EBEBEB",
    "name":"gray 92"
  },
  {
    "value":"#E8E8E8",
    "name":"gray 91"
  },
  {
    "value":"#E5E5E5",
    "name":"gray 90"
  },
  {
    "value":"#E3E3E3",
    "name":"gray 89"
  },
  {
    "value":"#E0E0E0",
    "name":"gray 88"
  },
  {
    "value":"#DEDEDE",
    "name":"gray 87"
  },
  {
    "value":"#DBDBDB",
    "name":"gray 86"
  },
  {
    "value":"#D9D9D9",
    "name":"gray 85"
  },
  {
    "value":"#D6D6D6",
    "name":"gray 84"
  },
  {
    "value":"#D4D4D4",
    "name":"gray 83"
  },
  {
    "value":"#D1D1D1",
    "name":"gray 82"
  },
  {
    "value":"#CFCFCF",
    "name":"gray 81"
  },
  {
    "value":"#CCCCCC",
    "name":"gray 80"
  },
  {
    "value":"#C9C9C9",
    "name":"gray 79"
  },
  {
    "value":"#C7C7C7",
    "name":"gray 78"
  },
  {
    "value":"#C4C4C4",
    "name":"gray 77"
  },
  {
    "value":"#C2C2C2",
    "name":"gray 76"
  },
  {
    "value":"#BFBFBF",
    "name":"gray 75"
  },
  {
    "value":"#BDBDBD",
    "name":"gray 74"
  },
  {
    "value":"#BABABA",
    "name":"gray 73"
  },
  {
    "value":"#B8B8B8",
    "name":"gray 72"
  },
  {
    "value":"#B5B5B5",
    "name":"gray 71"
  },
  {
    "value":"#B3B3B3",
    "name":"gray 70"
  },
  {
    "value":"#B0B0B0",
    "name":"gray 69"
  },
  {
    "value":"#ADADAD",
    "name":"gray 68"
  },
  {
    "value":"#ABABAB",
    "name":"gray 67"
  },
  {
    "value":"#A8A8A8",
    "name":"gray 66"
  },
  {
    "value":"#A6A6A6",
    "name":"gray 65"
  },
  {
    "value":"#A3A3A3",
    "name":"gray 64"
  },
  {
    "value":"#A1A1A1",
    "name":"gray 63"
  },
  {
    "value":"#9E9E9E",
    "name":"gray 62"
  },
  {
    "value":"#9C9C9C",
    "name":"gray 61"
  },
  {
    "value":"#999999",
    "name":"gray 60"
  },
  {
    "value":"#969696",
    "name":"gray 59"
  },
  {
    "value":"#949494",
    "name":"gray 58"
  },
  {
    "value":"#919191",
    "name":"gray 57"
  },
  {
    "value":"#8F8F8F",
    "name":"gray 56"
  },
  {
    "value":"#8C8C8C",
    "name":"gray 55"
  },
  {
    "value":"#8A8A8A",
    "name":"gray 54"
  },
  {
    "value":"#878787",
    "name":"gray 53"
  },
  {
    "value":"#858585",
    "name":"gray 52"
  },
  {
    "value":"#828282",
    "name":"gray 51"
  },
  {
    "value":"#7F7F7F",
    "name":"gray 50"
  },
  {
    "value":"#7D7D7D",
    "name":"gray 49"
  },
  {
    "value":"#7A7A7A",
    "name":"gray 48"
  },
  {
    "value":"#787878",
    "name":"gray 47"
  },
  {
    "value":"#757575",
    "name":"gray 46"
  },
  {
    "value":"#737373",
    "name":"gray 45"
  },
  {
    "value":"#707070",
    "name":"gray 44"
  },
  {
    "value":"#6E6E6E",
    "name":"gray 43"
  },
  {
    "value":"#666666",
    "name":"gray 40"
  },
  {
    "value":"#636363",
    "name":"gray 39"
  },
  {
    "value":"#616161",
    "name":"gray 38"
  },
  {
    "value":"#5E5E5E",
    "name":"gray 37"
  },
  {
    "value":"#5C5C5C",
    "name":"gray 36"
  },
  {
    "value":"#595959",
    "name":"gray 35"
  },
  {
    "value":"#575757",
    "name":"gray 34"
  },
  {
    "value":"#545454",
    "name":"gray 33"
  },
  {
    "value":"#525252",
    "name":"gray 32"
  },
  {
    "value":"#4F4F4F",
    "name":"gray 31"
  },
  {
    "value":"#4D4D4D",
    "name":"gray 30"
  },
  {
    "value":"#4A4A4A",
    "name":"gray 29"
  },
  {
    "value":"#474747",
    "name":"gray 28"
  },
  {
    "value":"#454545",
    "name":"gray 27"
  },
  {
    "value":"#424242",
    "name":"gray 26"
  },
  {
    "value":"#404040",
    "name":"gray 25"
  },
  {
    "value":"#3D3D3D",
    "name":"gray 24"
  },
  {
    "value":"#3B3B3B",
    "name":"gray 23"
  },
  {
    "value":"#383838",
    "name":"gray 22"
  },
  {
    "value":"#363636",
    "name":"gray 21"
  },
  {
    "value":"#333333",
    "name":"gray 20"
  },
  {
    "value":"#303030",
    "name":"gray 19"
  },
  {
    "value":"#2E2E2E",
    "name":"gray 18"
  },
  {
    "value":"#2B2B2B",
    "name":"gray 17"
  },
  {
    "value":"#292929",
    "name":"gray 16"
  },
  {
    "value":"#262626",
    "name":"gray 15"
  },
  {
    "value":"#242424",
    "name":"gray 14"
  },
  {
    "value":"#212121",
    "name":"gray 13"
  },
  {
    "value":"#1F1F1F",
    "name":"gray 12"
  },
  {
    "value":"#1C1C1C",
    "name":"gray 11"
  },
  {
    "value":"#1A1A1A",
    "name":"gray 10"
  },
  {
    "value":"#171717",
    "name":"gray 9"
  },
  {
    "value":"#141414",
    "name":"gray 8"
  },
  {
    "value":"#121212",
    "name":"gray 7"
  },
  {
    "value":"#0F0F0F",
    "name":"gray 6"
  },
  {
    "value":"#0D0D0D",
    "name":"gray 5"
  },
  {
    "value":"#0A0A0A",
    "name":"gray 4"
  },
  {
    "value":"#080808",
    "name":"gray 3"
  },
  {
    "value":"#050505",
    "name":"gray 2"
  },
  {
    "value":"#030303",
    "name":"gray 1"
  },
  {
    "value":"#F5F5F5",
    "css":true,
    "name":"whitesmoke"
  }
]


/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(1);
const http = __webpack_require__(87);
const https = __webpack_require__(88);
const Stream = __webpack_require__(3).Stream;
const TransportStream = __webpack_require__(5);

//
// ### function Http (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Http transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var Http = module.exports = function (options) {
  TransportStream.call(this, options);
  options = options || {};

  this.name = 'http';
  this.ssl = !!options.ssl;
  this.host = options.host || 'localhost';
  this.port = options.port;
  this.auth = options.auth;
  this.path = options.path || '';
  this.agent = options.agent;
  this.headers = options.headers || {};
  this.headers['content-type'] = 'application/json';

  if (!this.port) {
    this.port = this.ssl ? 443 : 80;
  }
};

util.inherits(Http, TransportStream);

//
// Expose the name of this Transport on the prototype
//
Http.prototype.name = 'http';

//
// ### function log (meta)
// #### @meta {Object} **Optional** Additional metadata to attach
// Core logging method exposed to Winston.
//
Http.prototype.log = function (info, callback) {
  var self = this;

  this._request(info, function (err, res) {
    if (res && res.statusCode !== 200) {
      err = new Error('Invalid HTTP Status Code: ' + res.statusCode);
    }

    if (err) {
      self.emit('warn', err);
    } else {
      self.emit('logged', info);
    }
  });

  //
  // Remark: (jcrugzz) Fire and forget here so requests dont cause buffering
  // and block more requests from happening?
  //
  if (callback) {
    setImmediate(callback);
  }
};

//
// ### function query (options, callback)
// #### @options {Object} Loggly-like query options for this instance.
// #### @callback {function} Continuation to respond to when complete.
// Query the transport. Options object is optional.
//
Http.prototype.query = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = this.normalizeQuery(options);
  options = {
    method: 'query',
    params: options
  };

  if (options.params.path) {
    options.path = options.params.path;
    delete options.params.path;
  }

  if (options.params.auth) {
    options.auth = options.params.auth;
    delete options.params.auth;
  }

  this._request(options, function (err, res, body) {
    if (res && res.statusCode !== 200) {
      err = new Error('HTTP Status Code: ' + res.statusCode);
    }

    if (err) return callback(err);

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return callback(e);
      }
    }

    callback(null, body);
  });
};

//
// ### function stream (options)
// #### @options {Object} Stream options for this instance.
// Returns a log stream for this transport. Options object is optional.
//
Http.prototype.stream = function (options) {
  options = options || {};

  const stream = new Stream();

  options = {
    method: 'stream',
    params: options
  };

  if (options.params.path) {
    options.path = options.params.path;
    delete options.params.path;
  }

  if (options.params.auth) {
    options.auth = options.params.auth;
    delete options.params.auth;
  }

  let buff = '';
  const req = this._request(options);

  stream.destroy = function () {
    req.destroy();
  };

  req.on('data', function (data) {
    data = (buff + data).split(/\n+/);
    const l = data.length - 1;
    let i = 0;

    for (; i < l; i++) {
      try {
        stream.emit('log', JSON.parse(data[i]));
      } catch (e) {
        stream.emit('error', e);
      }
    }

    buff = data[l];
  });

  req.on('error', function (err) {
    stream.emit('error', err);
  });

  return stream;
};

//
// ### function _request (options, callback)
// #### @callback {function} Continuation to respond to when complete.
// Make a request to a winstond server or any http server which can
// handle json-rpc.
//
Http.prototype._request = function (options, callback) {
  options = options || {};

  const auth = options.auth || this.auth;
  const path = options.path || this.path || '';

  delete options.auth;
  delete options.path;

  // Prepare options for outgoing HTTP request
  const req = (this.ssl ? https : http).request({
    method: 'POST',
    host: this.host,
    port: this.port,
    path: '/' + path.replace(/^\//, ''),
    headers: this.headers,
    auth: auth ? (auth.username + ':' + auth.password) : '',
    agent: this.agent
  });

  req.on('error', callback);
  req.on('response', function (res) {
    res.on('end', function () {
      callback(null, res);
    }).resume();
  });

  req.end(new Buffer(JSON.stringify(options), 'utf8'));
};


/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * stream.js: Transport for outputting to any arbitrary stream
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

const util = __webpack_require__(1);
const isStream = __webpack_require__(24);
const { MESSAGE } = __webpack_require__(6);
const TransportStream = __webpack_require__(5);

//
// ### function Console (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Console transport object responsible
// for persisting log messages and metadata to a terminal or TTY.
//
var Stream = module.exports = function (options) {
  TransportStream.call(this, options);
  options = options || {};

  if (!options.stream || !isStream(options.stream)) {
    throw new Error('options.stream is required.');
  }

  //
  // We need to listen for drain events when
  // write() returns false. This can make node
  // mad at times.
  //
  this._stream = options.stream;
  this._stream.setMaxListeners(Infinity);
  this.isObjectMode = options.stream._writableState.objectMode;
};

//
// Inherit from `winston.Transport`.
//
util.inherits(Stream, TransportStream);

//
// ### function log (meta)
// #### @meta {Object} Additional metadata to attach
// Core logging method exposed to Winston.
//
Stream.prototype.log = function (info, callback) {
  var self = this;
  setImmediate(function () {
    self.emit('logged', info);
  });

  if (this.isObjectMode) {
    this._stream.write(info);
    if (callback) { callback(); } // eslint-disable-line
    return;
  }

  this._stream.write(info[MESSAGE]);
  if (callback) { callback(); } // eslint-disable-line
  return;
};


/***/ }),
/* 90 */
/***/ (function(module, exports) {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49]

};

Object.keys(codes).forEach(function (key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});

/***/ }),
/* 91 */
/***/ (function(module, exports) {

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var argv = process.argv;

module.exports = (function () {
  if (argv.indexOf('--no-color') !== -1 ||
    argv.indexOf('--color=false') !== -1) {
    return false;
  }

  if (argv.indexOf('--color') !== -1 ||
    argv.indexOf('--color=true') !== -1 ||
    argv.indexOf('--color=always') !== -1) {
    return true;
  }

  if (process.stdout && !process.stdout.isTTY) {
    return false;
  }

  if (process.platform === 'win32') {
    return true;
  }

  if ('COLORTERM' in process.env) {
    return true;
  }

  if (process.env.TERM === 'dumb') {
    return false;
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
    return true;
  }

  return false;
})();

/***/ }),
/* 92 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 92;

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module['exports'] = function runTheTrap (text, options) {
  var result = "";
  text = text || "Run the trap, drop the bass";
  text = text.split('');
  var trap = {
    a: ["\u0040", "\u0104", "\u023a", "\u0245", "\u0394", "\u039b", "\u0414"],
    b: ["\u00df", "\u0181", "\u0243", "\u026e", "\u03b2", "\u0e3f"],
    c: ["\u00a9", "\u023b", "\u03fe"],
    d: ["\u00d0", "\u018a", "\u0500" , "\u0501" ,"\u0502", "\u0503"],
    e: ["\u00cb", "\u0115", "\u018e", "\u0258", "\u03a3", "\u03be", "\u04bc", "\u0a6c"],
    f: ["\u04fa"],
    g: ["\u0262"],
    h: ["\u0126", "\u0195", "\u04a2", "\u04ba", "\u04c7", "\u050a"],
    i: ["\u0f0f"],
    j: ["\u0134"],
    k: ["\u0138", "\u04a0", "\u04c3", "\u051e"],
    l: ["\u0139"],
    m: ["\u028d", "\u04cd", "\u04ce", "\u0520", "\u0521", "\u0d69"],
    n: ["\u00d1", "\u014b", "\u019d", "\u0376", "\u03a0", "\u048a"],
    o: ["\u00d8", "\u00f5", "\u00f8", "\u01fe", "\u0298", "\u047a", "\u05dd", "\u06dd", "\u0e4f"],
    p: ["\u01f7", "\u048e"],
    q: ["\u09cd"],
    r: ["\u00ae", "\u01a6", "\u0210", "\u024c", "\u0280", "\u042f"],
    s: ["\u00a7", "\u03de", "\u03df", "\u03e8"],
    t: ["\u0141", "\u0166", "\u0373"],
    u: ["\u01b1", "\u054d"],
    v: ["\u05d8"],
    w: ["\u0428", "\u0460", "\u047c", "\u0d70"],
    x: ["\u04b2", "\u04fe", "\u04fc", "\u04fd"],
    y: ["\u00a5", "\u04b0", "\u04cb"],
    z: ["\u01b5", "\u0240"]
  }
  text.forEach(function(c){
    c = c.toLowerCase();
    var chars = trap[c] || [" "];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== "undefined") {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;

}


/***/ }),
/* 94 */
/***/ (function(module, exports) {

// please no
module['exports'] = function zalgo(text, options) {
  text = text || "   he is here   ";
  var soul = {
    "up" : [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚'
    ],
    "down" : [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣'
    ],
    "mid" : [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉'
    ]
  },
  all = [].concat(soul.up, soul.down, soul.mid),
  zalgo = {};

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function is_char(character) {
    var bool = false;
    all.filter(function (i) {
      bool = (i === character);
    });
    return bool;
  }
  

  function heComes(text, options) {
    var result = '', counts, l;
    options = options || {};
    options["up"] =   typeof options["up"]   !== 'undefined' ? options["up"]   : true;
    options["mid"] =  typeof options["mid"]  !== 'undefined' ? options["mid"]  : true;
    options["down"] = typeof options["down"] !== 'undefined' ? options["down"] : true;
    options["size"] = typeof options["size"] !== 'undefined' ? options["size"] : "maxi";
    text = text.split('');
    for (l in text) {
      if (is_char(l)) {
        continue;
      }
      result = result + text[l];
      counts = {"up" : 0, "down" : 0, "mid" : 0};
      switch (options.size) {
      case 'mini':
        counts.up = randomNumber(8);
        counts.mid = randomNumber(2);
        counts.down = randomNumber(8);
        break;
      case 'maxi':
        counts.up = randomNumber(16) + 3;
        counts.mid = randomNumber(4) + 1;
        counts.down = randomNumber(64) + 3;
        break;
      default:
        counts.up = randomNumber(8) + 1;
        counts.mid = randomNumber(6) / 2;
        counts.down = randomNumber(8) + 1;
        break;
      }

      var arr = ["up", "mid", "down"];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0 ; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
}


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(7);

module['exports'] = (function() {
  return function (letter, i, exploded) {
    if(letter === " ") return letter;
    switch(i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter)
      case 2: return colors.blue(letter)
    }
  }
})();

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(7);

module['exports'] = function (letter, i, exploded) {
  return i % 2 === 0 ? letter : colors.inverse(letter);
};

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(7);

module['exports'] = (function () {
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta']; //RoY G BiV
  return function (letter, i, exploded) {
    if (letter === " ") {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
})();



/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var colors = __webpack_require__(7);

module['exports'] = (function () {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green', 'blue', 'white', 'cyan', 'magenta'];
  return function(letter, i, exploded) {
    return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
  };
})();

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./": 2,
	"./CHANGELOG.md": 100,
	"./LICENSE": 101,
	"./README.md": 102,
	"./align": 26,
	"./align.js": 26,
	"./cli": 27,
	"./cli.js": 27,
	"./colorize": 8,
	"./colorize.js": 8,
	"./combine": 28,
	"./combine.js": 28,
	"./examples/combine": 29,
	"./examples/combine.js": 29,
	"./examples/filter": 30,
	"./examples/filter.js": 30,
	"./examples/invalid": 31,
	"./examples/invalid.js": 31,
	"./examples/volume": 32,
	"./examples/volume.js": 32,
	"./format": 0,
	"./format.js": 0,
	"./index": 2,
	"./index.js": 2,
	"./json": 17,
	"./json.js": 17,
	"./label": 33,
	"./label.js": 33,
	"./levels": 15,
	"./levels.js": 15,
	"./logstash": 34,
	"./logstash.js": 34,
	"./package": 35,
	"./package.json": 35,
	"./pad-levels": 16,
	"./pad-levels.js": 16,
	"./pretty-print": 36,
	"./pretty-print.js": 36,
	"./printf": 37,
	"./printf.js": 37,
	"./simple": 38,
	"./simple.js": 38,
	"./splat": 39,
	"./splat.js": 39,
	"./timestamp": 40,
	"./timestamp.js": 40,
	"./uncolorize": 41,
	"./uncolorize.js": 41
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 99;

/***/ }),
/* 100 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected character '#' (1:0)\nYou may need an appropriate loader to handle this file type.\n| # CHANGELOG\n| \n| ### 1.2.2");

/***/ }),
/* 101 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected token (1:4)\nYou may need an appropriate loader to handle this file type.\n| MIT License\n| \n| Copyright (c) 2017 Charlie Robbins & the Contributors.");

/***/ }),
/* 102 */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected character '#' (1:0)\nYou may need an appropriate loader to handle this file type.\n| # logform\n| \n| An mutable object-based log format designed for chaining & objectMode streams.");

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function (main) {
  'use strict';

  /**
   * Parse or format dates
   * @class fecha
   */
  var fecha = {};
  var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
  var twoDigits = /\d\d?/;
  var threeDigits = /\d{3}/;
  var fourDigits = /\d{4}/;
  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var literal = /\[([^]*?)\]/gm;
  var noop = function () {
  };

  function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  }

  function monthUpdate(arrName) {
    return function (d, v, i18n) {
      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
      if (~index) {
        d.month = index;
      }
    };
  }

  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthNamesShort = shorten(monthNames, 3);
  var dayNamesShort = shorten(dayNames, 3);
  fecha.i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
  };

  var formatFlags = {
    D: function(dateObj) {
      return dateObj.getDate();
    },
    DD: function(dateObj) {
      return pad(dateObj.getDate());
    },
    Do: function(dateObj, i18n) {
      return i18n.DoFn(dateObj.getDate());
    },
    d: function(dateObj) {
      return dateObj.getDay();
    },
    dd: function(dateObj) {
      return pad(dateObj.getDay());
    },
    ddd: function(dateObj, i18n) {
      return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function(dateObj, i18n) {
      return i18n.dayNames[dateObj.getDay()];
    },
    M: function(dateObj) {
      return dateObj.getMonth() + 1;
    },
    MM: function(dateObj) {
      return pad(dateObj.getMonth() + 1);
    },
    MMM: function(dateObj, i18n) {
      return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function(dateObj, i18n) {
      return i18n.monthNames[dateObj.getMonth()];
    },
    YY: function(dateObj) {
      return String(dateObj.getFullYear()).substr(2);
    },
    YYYY: function(dateObj) {
      return dateObj.getFullYear();
    },
    h: function(dateObj) {
      return dateObj.getHours() % 12 || 12;
    },
    hh: function(dateObj) {
      return pad(dateObj.getHours() % 12 || 12);
    },
    H: function(dateObj) {
      return dateObj.getHours();
    },
    HH: function(dateObj) {
      return pad(dateObj.getHours());
    },
    m: function(dateObj) {
      return dateObj.getMinutes();
    },
    mm: function(dateObj) {
      return pad(dateObj.getMinutes());
    },
    s: function(dateObj) {
      return dateObj.getSeconds();
    },
    ss: function(dateObj) {
      return pad(dateObj.getSeconds());
    },
    S: function(dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100);
    },
    SS: function(dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function(dateObj) {
      return pad(dateObj.getMilliseconds(), 3);
    },
    a: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    ZZ: function(dateObj) {
      var o = dateObj.getTimezoneOffset();
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
    }
  };

  var parseFlags = {
    D: [twoDigits, function (d, v) {
      d.day = v;
    }],
    Do: [new RegExp(twoDigits.source + word.source), function (d, v) {
      d.day = parseInt(v, 10);
    }],
    M: [twoDigits, function (d, v) {
      d.month = v - 1;
    }],
    YY: [twoDigits, function (d, v) {
      var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function (d, v) {
      d.hour = v;
    }],
    m: [twoDigits, function (d, v) {
      d.minute = v;
    }],
    s: [twoDigits, function (d, v) {
      d.second = v;
    }],
    YYYY: [fourDigits, function (d, v) {
      d.year = v;
    }],
    S: [/\d/, function (d, v) {
      d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function (d, v) {
      d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function (d, v) {
      d.millisecond = v;
    }],
    d: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function (d, v, i18n) {
      var val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    }],
    ZZ: [/([\+\-]\d\d:?\d\d|Z)/, function (d, v) {
      if (v === 'Z') v = '+00:00';
      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

      if (parts) {
        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    }]
  };
  parseFlags.dd = parseFlags.d;
  parseFlags.dddd = parseFlags.ddd;
  parseFlags.DD = parseFlags.D;
  parseFlags.mm = parseFlags.m;
  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
  parseFlags.MM = parseFlags.M;
  parseFlags.ss = parseFlags.s;
  parseFlags.A = parseFlags.a;


  // Some common format strings
  fecha.masks = {
    default: 'ddd MMM DD YYYY HH:mm:ss',
    shortDate: 'M/D/YY',
    mediumDate: 'MMM D, YYYY',
    longDate: 'MMMM D, YYYY',
    fullDate: 'dddd, MMMM D, YYYY',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  };

  /***
   * Format a date
   * @method format
   * @param {Date|number} dateObj
   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
   */
  fecha.format = function (dateObj, mask, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj);
    }

    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      throw new Error('Invalid Date in fecha.format');
    }

    mask = fecha.masks[mask] || mask || fecha.masks['default'];

    var literals = [];

    // Make literals inactive by replacing them with ??
    mask = mask.replace(literal, function($0, $1) {
      literals.push($1);
      return '??';
    });
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {
      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/\?\?/g, function() {
      return literals.shift();
    });
  };

  /**
   * Parse a date string into an object, changes - into /
   * @method parse
   * @param {string} dateStr Date string
   * @param {string} format Date parse format
   * @returns {Date|boolean}
   */
  fecha.parse = function (dateStr, format, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof format !== 'string') {
      throw new Error('Invalid format in fecha.parse');
    }

    format = fecha.masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
      return false;
    }

    var isValid = true;
    var dateInfo = {};
    format.replace(token, function ($0) {
      if (parseFlags[$0]) {
        var info = parseFlags[$0];
        var index = dateStr.search(info[0]);
        if (!~index) {
          isValid = false;
        } else {
          dateStr.replace(info[0], function (result) {
            info[1](dateInfo, result, i18n);
            dateStr = dateStr.substr(index + result.length);
            return result;
          });
        }
      }

      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });

    if (!isValid) {
      return false;
    }

    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }

    var date;
    if (dateInfo.timezoneOffset != null) {
      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
  };

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fecha;
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return fecha;
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    main.fecha = fecha;
  }
})(this);


/***/ }),
/* 104 */
/***/ (function(module, exports) {

/*
 * cli.js: Config that conform to commonly used CLI logging levels.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

exports.levels = {
  error: 0,
  warn: 1,
  help: 2,
  data: 3,
  info: 4,
  debug: 5,
  prompt: 6,
  verbose: 7,
  input: 8,
  silly: 9
};

exports.colors = {
  error: 'red',
  warn: 'yellow',
  help: 'cyan',
  data: 'grey',
  info: 'green',
  debug: 'blue',
  prompt: 'grey',
  verbose: 'cyan',
  input: 'grey',
  silly: 'magenta'
};


/***/ }),
/* 105 */
/***/ (function(module, exports) {

/*
 * npm.js: Config that conform to npm logging levels.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

exports.levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

exports.colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'green',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'magenta'
};


/***/ }),
/* 106 */
/***/ (function(module, exports) {

/*
 * syslog.js: Config that conform to syslog logging levels.
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

exports.levels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
};

exports.colors = {
  emerg: 'red',
  alert: 'yellow',
  crit: 'red',
  error: 'red',
  warning: 'red',
  notice: 'yellow',
  info: 'green',
  debug: 'blue'
};


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stream = __webpack_require__(3);
const util = __webpack_require__(1);
const async = __webpack_require__(12);
const { LEVEL } = __webpack_require__(6);
const isStream = __webpack_require__(24);
const ExceptionHandler = __webpack_require__(43);
const LegacyTransportStream = __webpack_require__(111);
const Profiler = __webpack_require__(112);
const common = __webpack_require__(10);
const config = __webpack_require__(14);

const formatRegExp = common.formatRegExp;

/*
 * Constructor function for the Logger object responsible
 * for persisting log messages and metadata to one or more transports.
 */
var Logger = module.exports = function Logger(options) {
  stream.Transform.call(this, { objectMode: true });
  this.configure(options);
};

//
// Inherit from `stream.Transform`.
//
util.inherits(Logger, stream.Transform);

/*
 * ### function configure (options)
 * This will wholesale reconfigure this instance by:
 * 1. Resetting all transports. Older transports will be removed implicitly.
 * 2. Set all other options including levels, colors, rewriters, filters,
 *    exceptionHandlers, etc.
 */
Logger.prototype.configure = function (options) {
  //
  // Reset transports if we already have them
  //
  if (this.transports.length) {
    this.clear();
  }

  options = options || {};
  this.format = options.format || this.format || __webpack_require__(17)();

  var levels = options.levels || this.levels || config.npm.levels;
  var maxLength = Math.max.apply(null, Object.keys(levels)
    .map(function (lev) { return lev.length; }));

  this.paddings = Object.keys(levels).reduce(function (acc, lev) {
    var pad = lev.length !== maxLength
      ? new Array(maxLength - lev.length + 1).join(' ')
      : '';

    acc[lev] = pad;
    return acc;
  }, {});

  //
  // Hoist other options onto this instance.
  //
  this.levels = levels;
  this.level = options.level || 'info';
  this.exceptions = new ExceptionHandler(this);
  this.profilers = {};
  this.exitOnError = typeof options.exitOnError !== 'undefined'
    ? options.exitOnError
    : true;

  //
  // Add all transports we have been provided.
  //
  if (options.transports) {
    options.transports = Array.isArray(options.transports)
      ? options.transports
      : [options.transports];

    options.transports.forEach(function (transport) {
      this.add(transport);
    }, this);
  }

  if (options.colors || options.emitErrs || options.formatters
    || options.padLevels || options.rewriters || options.stripColors) {
    throw new Error([
      '{ colors, emitErrs, formatters, padLevels, rewriters, stripColors } were removed in winston@3.0.0.',
      'Use a custom winston.format(function) instead.',
      'See: https://github.com/winstonjs/winston/tree/master/UPGRADING.md'
    ].join('\n'));
  }

  if (options.exceptionHandlers) {
    this.exceptions.handle(options.exceptionHandlers);
  }
};

/*
 * @property {Array} Represents the current readableState
 * pipe targets for this Logger instance.
 */
Object.defineProperty(Logger.prototype, 'transports', {
  configurable: false,
  enumerable: true,
  get: function () {
    var pipes = this._readableState.pipes;
    return !Array.isArray(pipes)
      ? [pipes].filter(Boolean)
      : pipes;
  }
});

/*
 * function log (level, msg, meta)
 * function log (info)
 * Ensure backwards compatibility with a `log` method
 *
 * Supports the existing API, which is now DEPRECATED:
 *
 *    logger.log('info', 'Hello world', { custom: true });
 *    logger.log('info', new Error('Yo, it's on fire'));
 *    logger.log('info', '%s %d%%', 'A string', 50, { thisIsMeta: true });
 *
 * And the new API with a single JSON literal:
 *
 *    logger.log({ level: 'info', message: 'Hello world', custom: true });
 *    logger.log({ level: 'info', message: new Error('Yo, it's on fire') });
 *    logger.log({
 *      level: 'info',
 *      message: '%s %d%%',
 *      splat: ['A string', 50],
 *      meta: { thisIsMeta: true }
 *    });
 *
 * @api public
 */
Logger.prototype.log = function log(level, msg, meta) {
  //
  // Optimize for the hotpath of logging JSON literals
  //
  if (arguments.length === 1) {
    //
    // Yo dawg, I heard you like levels ... seriously ...
    // In this context the LHS `level` here is actually
    // the `info` so read this as:
    // info[LEVEL] = info.level;
    //
    level[LEVEL] = level.level;
    this.write(level);
    return this;
  }

  //
  // Slightly less hotpath, but worth optimizing for.
  //
  if (arguments.length === 2) {
    this.write({ [LEVEL]: level, level, message: msg });
    return this;
  }

  //
  // Separation of the splat from { level, message, meta } must be done
  // at this point in the objectMode stream since we only ever write
  // a single object.
  //
  const tokens = msg && msg.match && msg.match(formatRegExp);
  if (tokens) {
    this._splat({ [LEVEL]: level, level, message: msg }, tokens, Array.prototype.slice.call(arguments, 2));
    return this;
  }

  const info = Object.assign({}, meta, { [LEVEL]: level, level, message: msg });
  this.write(info);
  return this;
};

/*
 * @private function _transform (obj)
 * Pushes data so that it can be picked up by all of
 * our pipe targets.
 */
Logger.prototype._transform = function _transform(info, enc, callback) {
  //
  // [LEVEL] is only soft guaranteed to be set here since we are a proper
  // stream. It is likely that `info` came in through `.log(info)` or
  // `.info(info)`. If it is not defined, however, define it.
  // This LEVEL symbol is provided by `triple-beam` and also used in:
  // - logform
  // - winston-transport
  // - abstract-winston-transport
  //
  if (!info[LEVEL]) {
    info[LEVEL] = info.level;
  }

  //
  // Remark: really not sure what to do here, but this has been
  // reported as very confusing by pre winston@2.0.0 users as
  // quite confusing when using custom levels.
  //
  if (!this.levels[info[LEVEL]] && this.levels[info[LEVEL]] !== 0) {
    console.error('[winston] Unknown logger level: %s', info[LEVEL]);
  }

  //
  // Remark: not sure if we should simply error here.
  //
  if (!this._readableState.pipes) {
    console.error('[winston] Attempt to write logs with no transports %j', info);
  }

  //
  // Here we write to the `format` pipe-chain, which
  // on `readable` above will push the formatted `info`
  // Object onto the buffer for this instance.
  //
  this.push(this.format.transform(info, this.format.options));
  callback();
};

/*
 * @private function _splat (info, tokens, splat)
 * Check to see if tokens <= splat.length, assign { splat, meta } into the `info`
 * accordingly, and write to this instance.
 */
Logger.prototype._splat = function _splat(info, tokens, splat) {
  const percents = info.message.match(common.escapedPercent);
  const escapes = percents && percents.length || 0;

  //
  // The expected splat is the number of tokens minus the number of escapes. e.g.
  //
  // - { expectedSplat: 3 } '%d %s %j'
  // - { expectedSplat: 5 } '[%s] %d%% %d%% %s %j'
  //
  // Any "meta" will be arugments in addition to the expected splat size
  // regardless of type. e.g.
  //
  // logger.log('info', '%d%% %s %j', 100, 'wow', { such: 'js' }, { thisIsMeta: true });
  // would result in splat of four (4), but only three (3) are expected. Therefore:
  //
  // extraSplat = 3 - 4 = -1
  // metas = [100, 'wow', { such: 'js' }, { thisIsMeta: true }].splice(-1, -1 * -1);
  // splat = [100, 'wow', { such: 'js' }]
  //
  const expectedSplat = tokens.length - escapes;
  const extraSplat = expectedSplat - splat.length;
  const metas = extraSplat < 0
    ? splat.splice(extraSplat, -1 * extraSplat)
    : [];

  //
  // Now that { splat } has been separated from any potential { meta }
  // we can assign this to the `info` object and write it to our format stream.
  //
  info.splat = splat;
  if (metas.length) {
    info.meta = metas[0];
  }

  this.write(info);
};

/*
 * function add (transport)
 * Adds the transport to this logger instance by
 * piping to it.
 */
Logger.prototype.add = function add(transport) {
  //
  // Support backwards compatibility with all existing
  // `winston@1.x.x` transport. All NEW transports should
  // inherit from `winston.TransportStream`.
  //
  var target = !isStream(transport)
    ? new LegacyTransportStream({ transport: transport })
    : transport;

  if (!target._writableState || !target._writableState.objectMode) {
    throw new Error('Transports must WritableStreams in objectMode. Set { objectMode: true }.');
  }

  //
  // Listen for the `error` event on the new Transport
  //
  this._onError(target);
  this.pipe(target);

  if (transport.handleExceptions) {
    this.exceptions.handle();
  }

  return this;
};

/*
 * function remove (transport)
 * Removes the transport from this logger instance by
 * unpiping from it.
 */
Logger.prototype.remove = function remove(transport) {
  var target = transport;
  if (!isStream(transport)) {
    target = this.transports.filter(function (match) {
      return match.transport === transport;
    })[0];
  }

  if (target) { this.unpipe(target); }
  return this;
};

/*
 * function clear (transport)
 * Removes all transports from this logger instance.
 */
Logger.prototype.clear = function clear() {
  this.unpipe();
  return this;
};

/*
 * ### function close ()
 * Cleans up resources (streams, event listeners) for all
 * transports associated with this instance (if necessary).
 */
Logger.prototype.close = function close() {
  this.clear();
  this.emit('close');
  return this;
};

/*
 * Sets the `target` levels specified on this instance.
 * @param {Object} Target levels to use on this instance.
 */
Logger.prototype.setLevels = common.warn.deprecated('setLevels');

//
// ### function query (options, callback)
// #### @options {Object} Query options for this instance.
// #### @callback {function} Continuation to respond to when complete.
// Queries the all transports for this instance with the specified `options`.
// This will aggregate each transport's results into one object containing
// a property per transport.
//
Logger.prototype.query = function query(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  const results = {};
  const query = common.clone(options.query) || {};

  //
  // Helper function to query a single transport
  //
  function queryTransport(transport, next) {
    if (options.query) {
      options.query = transport.formatQuery(query);
    }

    transport.query(options, function (err, results) {
      if (err) {
        return next(err);
      }

      next(null, transport.formatResults(results, options.format));
    });
  }

  //
  // Helper function to accumulate the results from
  // `queryTransport` into the `results`.
  //
  function addResults(transport, next) {
    queryTransport(transport, function (err, result) {
      //
      // queryTransport could potentially invoke the callback
      // multiple times since Transport code can be unpredictable.
      //
      if (next) {
        result = err || result;
        if (result) {
          results[transport.name] = result;
        }

        // eslint-disable-next-line callback-return
        next();
      }

      next = null;
    });
  }

  //
  // Iterate over the transports in parallel setting the
  // appropriate key in the `results`
  //
  async.forEach(this.transports.filter(function (transport) {
    return !!transport.query;
  }), addResults, function () {
    callback(null, results);
  });
};

//
// ### function stream (options)
// #### @options {Object} Stream options for this instance.
// Returns a log stream for all transports. Options object is optional.
//
Logger.prototype.stream = function stream(options) {
  options = options || {};

  const out = new stream.Stream();
  const streams = [];

  out._streams = streams;
  out.destroy = function () {
    var i = streams.length;
    while (i--) streams[i].destroy();
  };

  //
  // Create a list of all transports for this instance.
  //
  this.transports.filter(function (transport) {
    return !!transport.stream;
  }).forEach(function (transport) {
    var stream = transport.stream(options);
    if (!stream) return;

    streams.push(stream);

    stream.on('log', function (log) {
      log.transport = log.transport || [];
      log.transport.push(transport.name);
      out.emit('log', log);
    });

    stream.on('error', function (err) {
      err.transport = err.transport || [];
      err.transport.push(transport.name);
      out.emit('error', err);
    });
  });

  return out;
};

//
// ### function startTimer ()
// Returns an object corresponding to a specific timing. When done
// is called the timer will finish and log the duration. e.g.:
//
//    timer = winston.startTimer()
//    setTimeout(function(){
//      timer.done({ message: 'Logging message' });
//    }, 1000);
//
Logger.prototype.startTimer = function startTimer() {
  return new Profiler(this);
};

//
// ### function profile (id, [info])
// @param {string} id Unique id of the profiler
// Tracks the time inbetween subsequent calls to this method
// with the same `id` parameter. The second call to this method
// will log the difference in milliseconds along with the message.
//
Logger.prototype.profile = function profile(id) {
  const time = Date.now();
  let timeEnd;
  let info;
  let args;

  if (this.profilers[id]) {
    timeEnd = this.profilers[id];
    delete this.profilers[id];

    //
    // Attempt to be kind to users if they are still
    // using older APIs.
    //
    args = Array.prototype.slice.call(arguments, 1);
    if (typeof args[args.length - 1] === 'function') {
      console.warn('Callback function no longer supported as of winston@3.0.0');
      args.pop();
    }

    //
    // Set the duration property of the metadata
    //
    info = typeof args[args.length - 1] === 'object' ? args.pop() : {};
    info.level = info.level || 'info';
    info.durationMs = time - timeEnd;
    info.message = info.message || id;
    return this.write(info);
  }

  this.profilers[id] = time;
  return this;
};

/*
 * Backwards compatibility to `exceptions.handle`
 * in winston < 3.0.0.
 *
 * @api deprecated
 */
Logger.prototype.handleExceptions = function handleExceptions() {
  console.warn('Deprecated: .handleExceptions() will be removed in winston@4. Use .exceptions.handle()');
  var args = Array.prototype.slice.call(arguments);
  this.exceptions.handle.apply(this.exceptions, args);
};

/*
 * Backwards compatibility to `exceptions.handle`
 * in winston < 3.0.0.
 *
 * @api deprecated
 */
Logger.prototype.unhandleExceptions = function unhandleExceptions() {
  console.warn('Deprecated: .unhandleExceptions() will be removed in winston@4. Use .unexceptions.handle()');
  var args = Array.prototype.slice.call(arguments);
  this.exceptions.unhandle.apply(this.exceptions, args);
};

/*
 * Throw a more meaningful deprecation notice
 */
Logger.prototype.cli = function cli() {
  throw new Error([
    'Logger.cli() was removed in winston@3.0.0',
    'Use a custom winston.formats.cli() instead.',
    'See: https://github.com/winstonjs/winston/tree/master/UPGRADING.md'
  ].join('\n'));
};

//
// ### @private function _onError (transport)
// #### @transport {Object} Transport on which the error occured
// #### @err {Error} Error that occurred on the transport
// Bubbles the error, `err`, that occured on the specified `transport`
// up from this instance if `emitErrs` has been set.
//
Logger.prototype._onError = function _onError(transport) {
  var self = this;

  function transportError(err) {
    self.emit('error', err, transport);
  }

  if (!transport.__winstonError) {
    transport.__winstonError = transportError;
    transport.on('error', transport.__winstonError);
  }
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Wrap callbacks to prevent double execution.
 *
 * @param {Function} fn Function that should only be called once.
 * @returns {Function} A wrapped callback which prevents execution.
 * @api public
 */
module.exports = function one(fn) {
  var called = 0
    , value;

  /**
   * The function that prevents double execution.
   *
   * @api private
   */
  function onetime() {
    if (called) return value;

    called = 1;
    value = fn.apply(this, arguments);
    fn = null;

    return value;
  }

  //
  // To make debugging more easy we want to use the name of the supplied
  // function. So when you look at the functions that are assigned to event
  // listeners you don't see a load of `onetime` functions but actually the
  // names of the functions that this module will call.
  //
  onetime.displayName = fn.displayName || fn.name || onetime.displayName || onetime.name;
  return onetime;
};


/***/ }),
/* 109 */
/***/ (function(module, exports) {

exports.get = function(belowFn) {
  var oldLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;

  var dummyObject = {};

  var v8Handler = Error.prepareStackTrace;
  Error.prepareStackTrace = function(dummyObject, v8StackTrace) {
    return v8StackTrace;
  };
  Error.captureStackTrace(dummyObject, belowFn || exports.get);

  var v8StackTrace = dummyObject.stack;
  Error.prepareStackTrace = v8Handler;
  Error.stackTraceLimit = oldLimit;

  return v8StackTrace;
};

exports.parse = function(err) {
  if (!err.stack) {
    return [];
  }

  var self = this;
  var lines = err.stack.split('\n').slice(1);

  return lines
    .map(function(line) {
      if (line.match(/^\s*[-]{4,}$/)) {
        return self._createParsedCallSite({
          fileName: line,
          lineNumber: null,
          functionName: null,
          typeName: null,
          methodName: null,
          columnNumber: null,
          'native': null,
        });
      }

      var lineMatch = line.match(/at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/);
      if (!lineMatch) {
        return;
      }

      var object = null;
      var method = null;
      var functionName = null;
      var typeName = null;
      var methodName = null;
      var isNative = (lineMatch[5] === 'native');

      if (lineMatch[1]) {
        functionName = lineMatch[1];
        var methodStart = functionName.lastIndexOf('.');
        if (functionName[methodStart-1] == '.')
          methodStart--;
        if (methodStart > 0) {
          object = functionName.substr(0, methodStart);
          method = functionName.substr(methodStart + 1);
          var objectEnd = object.indexOf('.Module');
          if (objectEnd > 0) {
            functionName = functionName.substr(objectEnd + 1);
            object = object.substr(0, objectEnd);
          }
        }
        typeName = null;
      }

      if (method) {
        typeName = object;
        methodName = method;
      }

      if (method === '<anonymous>') {
        methodName = null;
        functionName = null;
      }

      var properties = {
        fileName: lineMatch[2] || null,
        lineNumber: parseInt(lineMatch[3], 10) || null,
        functionName: functionName,
        typeName: typeName,
        methodName: methodName,
        columnNumber: parseInt(lineMatch[4], 10) || null,
        'native': isNative,
      };

      return self._createParsedCallSite(properties);
    })
    .filter(function(callSite) {
      return !!callSite;
    });
};

function CallSite(properties) {
  for (var property in properties) {
    this[property] = properties[property];
  }
}

var strProperties = [
  'this',
  'typeName',
  'functionName',
  'methodName',
  'fileName',
  'lineNumber',
  'columnNumber',
  'function',
  'evalOrigin'
];
var boolProperties = [
  'topLevel',
  'eval',
  'native',
  'constructor'
];
strProperties.forEach(function (property) {
  CallSite.prototype[property] = null;
  CallSite.prototype['get' + property[0].toUpperCase() + property.substr(1)] = function () {
    return this[property];
  }
});
boolProperties.forEach(function (property) {
  CallSite.prototype[property] = false;
  CallSite.prototype['is' + property[0].toUpperCase() + property.substr(1)] = function () {
    return this[property];
  }
});

exports._createParsedCallSite = function(properties) {
  return new CallSite(properties);
};


/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const stream = __webpack_require__(3);
const util = __webpack_require__(1);

/*
 * Constructor function for the ExceptionStream responsible for wrapping
 * a TransportStream; only allowing writes of `info` objects with `info.exception`
 * set to true.
 *
 * @param  {TransportStream} Stream to filter to exceptions
 */
var ExceptionStream = module.exports = function ExceptionStream(transport) {
  if (!transport) {
    throw new Error('ExceptionStream requires a TransportStream instance.');
  }

  stream.Writable.call(this, { objectMode: true });

  //
  // Remark (indexzero): we set `handleExceptions` here because it's the
  // predicate checked in ExceptionHandler.prototype.__getExceptionHandlers
  //
  this.handleExceptions = true;
  this.transport = transport;
};

util.inherits(ExceptionStream, stream.Writable);

/*
 * @private function _write(info)
 * Writes the info object to our transport instance if (and only if)
 * the `exception` property is set on the info.
 */
ExceptionStream.prototype._write = function (info, enc, callback) {
  if (info.exception) {
    return this.transport.log(info, callback);
  }

  callback();
  return true;
};


/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(1);
const TransportStream = __webpack_require__(5);
const LEVEL = Symbol.for('level');

/**
 * Constructor function for the LegacyTransportStream. This is an internal wrapper
 * `winston >= 3` uses to wrap older transports implementing log(level, message, meta).
 *
 * @param  {Object} opts Options for this TransportStream instance.
 *   @param {Transpot} opts.transport winston@2 or older Transport to wrap.
 */
var LegacyTransportStream = module.exports = function LegacyTransportStream(opts) {
  opts = opts || {};
  if (!opts.transport || typeof opts.transport.log !== 'function') {
    throw new Error('Invalid transport, must be an object with a log method.');
  }

  TransportStream.call(this, opts);

  var self = this;
  this.transport = opts.transport;
  this.level = this.level || opts.transport.level;
  this.handleExceptions = this.handleExceptions || opts.transport.handleExceptions;

  // Display our deprecation notice.
  this._deprecated();

  //
  // Properly bubble up errors from the transport to the LegacyTransportStream
  // instance, but only once no matter how many times this transport is shared.
  //
  function transportError(err) {
    self.emit('error', err, self.transport);
  }

  if (!this.transport.__winstonError) {
    this.transport.__winstonError = transportError;
    this.transport.on('error', this.transport.__winstonError);
  }
};

util.inherits(LegacyTransportStream, TransportStream);

/*
 * @private function _write(info)
 * Writes the info object to our transport instance.
 */
LegacyTransportStream.prototype._write = function (info, enc, callback) {
  if (info.exception === true && !this.handleExceptions) {
    return callback(null);
  }

  //
  // Remark: This has to be handled in the base transport now because we cannot
  // conditionally write to our pipe targets as stream.
  //
  if (!this.level || this.levels[this.level] >= this.levels[info[LEVEL]]) {
    this.transport.log(info[LEVEL], info.message, info, this._nop);
  }

  callback(null);
};

/*
 * @private function _writev(chunks, callback)
 * Writes the batch of info objects (i.e. "object chunks") to our transport instance
 * after performing any necessary filtering.
 */
LegacyTransportStream.prototype._writev = function (chunks, callback) {
  const infos = chunks.filter(this._accept, this);
  for (var i = 0; i < infos.length; i++) {
    this.transport.log(infos[i].chunk[LEVEL], infos[i].chunk.message, infos[i].chunk, this._nop);
    infos[i].callback();
  }

  return callback(null);
};

/**
 * Displays a deprecation notice. Defined as a function so it can be overriden in tests.
 */
LegacyTransportStream.prototype._deprecated = function () {
  console.error([
    `${this.transport.name} is a legacy winston transport. Consider upgrading: `,
    '- Upgrade docs: https://github.com/winstonjs/winston/tree/master/UPGRADE.md'
  ].join('\n'));
};

/*
 * Clean up error handling state on the legacy transport associated
 * with this instance.
 */
LegacyTransportStream.prototype.close = function () {
  if (this.transport.close) {
    this.transport.close();
  }

  if (this.transport.__winstonError) {
    this.transport.removeListener('error', this.transport.__winstonError);
    this.transport.__winstonError = null;
  }
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//
// ### @private Profiler
// Constructor function for the Profiler instance used by
// `Logger.prototype.startTimer`. When done is called the timer
// will finish and log the duration.
//
var Profiler = module.exports = function Profiler(logger) {
  if (!logger) {
    throw new Error('Logger is required for profiling.');
  }

  this.logger = logger;
  this.start = Date.now();
};

//
// ### function done (info)
// Ends the current timer (i.e. Profiler) instance and
// logs the `msg` along with the duration since creation.
//
Profiler.prototype.done = function () {
  const args = Array.prototype.slice.call(arguments);
  let info;

  if (typeof args[args.length - 1] === 'function') {
    console.warn('Callback function no longer supported as of winston@3.0.0');
    args.pop();
  }

  info = typeof args[args.length - 1] === 'object' ? args.pop() : {};
  info.level = info.level || 'info';
  info.durationMs = (Date.now()) - this.start;

  return this.logger.write(info);
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * container.js: Inversion of control container for winston logger instances
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENCE
 *
 */

const createLogger = __webpack_require__(42);
const extend = __webpack_require__(1)._extend;

//
// ### function Container (options)
// #### @options {Object} Default pass-thru options for Loggers
// Constructor function for the Container object responsible for managing
// a set of `winston.Logger` instances based on string ids.
//
var Container = exports.Container = function (options) {
  this.loggers = {};
  this.options = options || {};
};

//
// ### function get / add (id, options)
// #### @id {string} Id of the Logger to get
// #### @options {Object} **Optional** Options for the Logger instance
// Retreives a `winston.Logger` instance for the specified `id`. If
// an instance does not exist, one is created.
//
Container.prototype.get = Container.prototype.add = function (id, options) {
  const self = this;
  let existing;

  if (!this.loggers[id]) {
    //
    // Remark: Simple shallow clone for configuration options in case we pass in
    // instantiated protoypal objects
    //
    options = extend({}, options || this.options);
    existing = options.transports || this.options.transports;

    //
    // Remark: Make sure if we have an array of transports we slice it to make copies
    // of those references.
    //
    options.transports = existing ? existing.slice() : [];

    this.loggers[id] = createLogger(options);
    this.loggers[id].on('close', function () {
      self._delete(id);
    });
  }

  return this.loggers[id];
};

//
// ### function close (id)
// #### @id {string} **Optional** Id of the Logger instance to find
// Returns a boolean value indicating if this instance
// has a logger with the specified `id`.
//
Container.prototype.has = function (id) {
  return !!this.loggers[id];
};

//
// ### function close (id)
// #### @id {string} **Optional** Id of the Logger instance to close
// Closes a `Logger` instance with the specified `id` if it exists.
// If no `id` is supplied then all Loggers are closed.
//
Container.prototype.close = function (id) {
  var self = this;

  function removeLogger(id) {
    if (!self.loggers[id]) {
      return;
    }

    self.loggers[id].close();
    self._delete(id);
  }

  if (id) {
    return removeLogger(id);
  }

  Object.keys(this.loggers).forEach(removeLogger);
};

//
// ### @private function _delete (id)
// #### @id {string} Id of the Logger instance to delete from container
// Deletes a `Logger` instance with the specified `id`.
//
Container.prototype._delete = function (id) {
  delete this.loggers[id];
};



/***/ })
/******/ ]);