/**
 *
 * @constructor
 */
VDRXMLApi = function () {};

/**
 * @type {Channels|null}
 */
VDRXMLApi.prototype.channels = null;

/**
 * @type {VDRHls|null}
 */
VDRXMLApi.prototype.hls = null;

/**
 * @type {Presets|null}
 */
VDRXMLApi.prototype.presets = null;

/**
 * initialize
 */
VDRXMLApi.prototype.init = function () {

    VDRXMLApi.prototype.hls = new VDRHls();
    VDRXMLApi.prototype.channels = new Channels();
    VDRXMLApi.prototype.presets = new Presets();
    this.presets.init();
    this.channels.init();
    this.hls.init();
};

/**
 * error levels
 * @type {{debugHls: number, debug: number, warn: number, info: number}}
 */
VDRXMLApi.prototype.errorLevels = {
    "debugHls" : 8,
    "debug" : 4,
    "warn" : 2,
    "info" : 1
};

/**
 * base url
 * @type {string}
 */
VDRXMLApi.prototype.baseUrl = null;

/**
 * log info
 */
VDRXMLApi.prototype.info = function () {

    var args = Array.prototype.slice.apply(arguments);
    if ("string" === typeof args[0]) {
        args.unshift('[' + this.className + '] ' + args.shift());
    }
    if (this.hasConsole() && this.hasErrorLevel('info')) {
        window.console.info.apply(window.console, args);
    }
};

/**
 * log warn
 */
VDRXMLApi.prototype.warn = function () {

    var args = Array.prototype.slice.apply(arguments);
    if ("string" === typeof args[0]) {
        args.unshift('[' + this.className + '] ' + args.shift());
    }
    if (this.hasConsole() && this.hasErrorLevel('warn')) {
        window.console.warn.apply(window.console, args);
    }
};

/**
 * log debug
 */
VDRXMLApi.prototype.debug = function () {

    var args = Array.prototype.slice.apply(arguments);
    if ("string" === typeof args[0]) {
        args.unshift('[' + this.className + '] ' + args.shift());
    }
    if (this.hasConsole() && this.hasErrorLevel('debug')) {
        window.console.debug.apply(window.console, args);
    }
};

/**
 * determine if a console is present
 * @return {boolean}
 */
VDRXMLApi.prototype.hasConsole = function () {

    return "undefined" !== typeof window.console;
};

/**
 * determine if given error level is configured for this instance
 * @param {string} errorLevel
 * @return {boolean}
 */
VDRXMLApi.prototype.hasErrorLevel = function (errorLevel) {

    return "undefined" !== typeof this.errorLevels[errorLevel]
        && (this.errorLevel & this.errorLevels[errorLevel]) > 0;
};

/**
 * load channels
 */
VDRXMLApi.prototype.load = function () {

    var xhr = new XMLHttpRequest();
    xhr.open(this.method, this.baseUrl + this.url);
    xhr.onreadystatechange = this.handleReadyState;
    xhr.send();
};