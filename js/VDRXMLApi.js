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
 * @type {string|null}
 */
VDRXMLApi.prototype.username = null;

/**
 * @type {string|null}
 */
VDRXMLApi.prototype.password = null;

/**
 * @type {string|null}
 */
VDRXMLApi.prototype.auth = null;

/**
 * @type {string|null}
 */
VDRXMLApi.prototype.baseUrl = null;

/**
 * initialize
 */
VDRXMLApi.prototype.init = function () {

    VDRXMLApi.prototype.settings = new Settings();
    this.settings.init();
    this.getErrorLevel().getDefaultPreset();
    this.method = 'GET';
    this.url = 'version.xml';
    this.handleReadyState = function () {};
    if (Hls.isSupported()) {
        VDRXMLApi.prototype.hls = new VDRHls();
    } else {
        // assume ios client
        VDRXMLApi.prototype.hls = new IOSHls();
    }
    VDRXMLApi.prototype.presets = new Presets();
    VDRXMLApi.prototype.search = new Search();
    VDRXMLApi.prototype.channels = new Channels();
    VDRXMLApi.prototype.recordings = new Recordings();
    this.presets.init(function () {
        this.search.init();
        this.hls.init();
        this.channels.init();
        this.recordings.init();
        this.addObserver();
        this.toggleUpdateCookie();
    }.bind(this));
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

VDRXMLApi.prototype.addObserver = function () {

    window.addEventListener('orientationchange', function () {

        setTimeout(this.hls.setDimension.bind(this.hls), 200);
    }.bind(this));

    document.addEventListener('visibilitychange', this.toggleUpdateCookie.bind(this));
};

VDRXMLApi.prototype.toggleUpdateCookie = function () {

    if ('visible' === document.visibilityState) {
        this.stopUpdateInterval()
            .startUpdateInterval();
    } else {
        this.stopUpdateInterval();
    }
};

/**
 * start interval to update indicator
 */
VDRXMLApi.prototype.startUpdateInterval = function () {

    var d = new Date(),
        next = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() + 5, 0);

    if ("undefined" !== typeof this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = undefined;
    }

    this.updateTimeout = setTimeout(function () {
        this.update();
        this.updateInterval = setInterval(this.update.bind(this), 300000);
    }.bind(this), next.getTime() - d.getTime());

};

/**
 * stop indicator update interval
 * @returns {VDRXMLApi}
 */
VDRXMLApi.prototype.stopUpdateInterval = function () {

    if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = undefined;
    }
    if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = undefined;
    }
    return this;
};

/**
 * periodical update
 */
VDRXMLApi.prototype.update = function () {

    if (this.hasConnection()) {

        this.load();
    }
};

VDRXMLApi.prototype.hasConnection = function () {

    return (!navigator.connection || navigator.connection.type != 'none')
};

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
 * determine error level from url
 */
VDRXMLApi.prototype.getErrorLevel = function () {

    var debug = location.search.match(/(debug=[^&]+)/);

    if (debug && debug.length > 0) {
        debug = debug[0].split('=')[1];
    }

    switch (debug) {
        case 'debugHls':
            VDRXMLApi.prototype.errorLevel =
                this.errorLevels.info
                | this.errorLevels.warn
                | this.errorLevels.debug
                | this.errorLevels.debugHls
            ;
            break;
        case 'debug':
            VDRXMLApi.prototype.errorLevel =
                this.errorLevels.info
                | this.errorLevels.warn
                | this.errorLevels.debug
            ;
            break;
        case 'warn':
            VDRXMLApi.prototype.errorLevel =
                this.errorLevels.info
                | this.errorLevels.warn
            ;
            break;
        case 'info':
            VDRXMLApi.prototype.errorLevel = this.errorLevels.info;
            break;
        default:
            VDRXMLApi.prototype.errorLevel = 0;
    }

    return this;
};

/**
 * determine preset from url
 */
VDRXMLApi.prototype.getDefaultPreset = function () {

    var preset = location.search.match(/(preset=[^&]+)/);

    if (preset && preset.length > 0) {
        HLSAbstract.prototype.defaultPreset = preset[0].split('=')[1];
    }

    if ((preset = this.settings.get('defaultPreset'))) {

        HLSAbstract.prototype.defaultPreset = preset;
    }

    return this;
};

/**
 * load channels
 * @param {string} [responseType]
 */
VDRXMLApi.prototype.load = function (responseType) {

    var xhr = new XMLHttpRequest(),
        auth = this.getAuth();
    xhr.open(this.method, this.getBaseUrl() + this.url, true);
    xhr.onreadystatechange = this.handleReadyState;
    if ("undefined" !== typeof responseType) {
        xhr.responseType = responseType;
    }
    if (auth) {
        xhr.setRequestHeader("Authorization", auth);
        xhr.withCredentials = true;
    }
    xhr.send();
};

/**
 * return {string}
 */
VDRXMLApi.prototype.getBaseUrl = function () {

    var url = this.settings.get('baseUrl');

    if (url[url.length - 1] !== '/') {
        url += '/';
        this.settings.set('baseUrl', url);
    }

    return this.settings.get('baseUrl');
};

/**
 * retrieve authorization string
 * @return {string|null}
 */
VDRXMLApi.prototype.getAuth = function () {

    var username, password;

    if (!this.auth) {
        if ((password = this.settings.get('password')) && (username = this.settings.get('username'))) {
            this.auth = "Basic " + btoa(username + ":" + password);
        }
    }
    return this.auth;
};

window.addEventListener('DOMContentLoaded', function () {

    window.vdrXmlApi = new VDRXMLApi();
    vdrXmlApi.init();
});
