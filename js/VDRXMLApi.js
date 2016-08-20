VDRXMLApi = function () {};

VDRXMLApi.prototype.channels = null;

VDRXMLApi.prototype.init = function () {

    this.hls = new VDRHls(this);
    this.channels = new Channels(this);
};

VDRXMLApi.prototype.errorLevels = {
    "debugHls" : 8,
    "debug" : 4,
    "warn" : 2,
    "info" : 1
};

VDRXMLApi.prototype.baseUrl = 'http://192.168.3.99:10080/';

VDRXMLApi.prototype.info = function () {

    var args = Array.prototype.slice.apply(arguments);
    args.unshift('[' + this.className + ']');
    if (this.hasConsole() && this.hasErrorLevel('info')) {
        window.console.info.apply(window.console, args);
    }
};

VDRXMLApi.prototype.warn = function () {

    var args = Array.prototype.slice.apply(arguments);
    args.unshift('[' + this.className + ']');
    if (this.hasConsole() && this.hasErrorLevel('warn')) {
        window.console.warn.apply(window.console, args);
    }
};

VDRXMLApi.prototype.debug = function () {

    var args = Array.prototype.slice.apply(arguments);
    args.unshift('[' + this.className + ']');
    if (this.hasConsole() && this.hasErrorLevel('debug')) {
        window.console.debug.apply(window.console, args);
    }
};

VDRXMLApi.prototype.hasConsole = function () {

    return "undefined" !== typeof window.console;
};

VDRXMLApi.prototype.hasErrorLevel = function (errorLevel) {

    return "undefined" !== typeof this.errorLevels[errorLevel]
        && (this.errorLevel & this.errorLevels[errorLevel]) > 0;
};