/**
 * @constructor
 * @property {Hls} controller
 * @property {HTMLVideoElement} video
 */
var VDRHls = function () {

    this.init();
};

/**
 * base url
 * @type {string}
 */
//VDRHls.prototype.baseUrl = 'http://xmlapi.hannemann.lan/hls/stream.m3u8';
VDRHls.prototype.baseUrl = 'http://192.168.3.99:10080/hls/stream.m3u8';

/**
 * default preset
 * @type {string}
 */
//VDRHls.prototype.defaultPreset = 'nvlow';
VDRHls.prototype.defaultPreset = 'low';

/**
 * available presets
 * @type {{high: string, mid: string, low: string, nvmid: string, nvlow: string}}
 */
VDRHls.prototype.presets = {
    "high" : "High",
    "mid" : "Mid",
    "low" : "Low",
    "nvmid" : "Nvenc_mid",
    "nvlow" : "Nvenc_low"
};

/**
 * default channel
 * @type {string}
 */
VDRHls.prototype.defaultChannel = 'Das Erste HD';

/**
 * available channels
 * @type {{Das Erste HD: string, SWR Fernsehen RP HD: string, WDR Köln HD: string, AXN HD: string, Disney Channel HD: string}}
 */
VDRHls.prototype.channels = {
    "Das Erste" : "C-1-1101-28106",
    "Das Erste HD" : "C-1-1051-11100",
    "SWR Fernsehen RP HD" : "C-1-1051-10304",
    "WDR Köln HD" : "C-1-1051-28325",
    "ProSieben HD" : "C-61441-10013-50015",
    "ProSieben" : "C-61441-10008-53621",
    "AXN HD" : "C-61441-10015-50023",
    "AXN" : "C-61441-10007-50304",
    "Disney Channel HD" : "C-61441-10016-50031"
};

VDRHls.prototype.init = function () {

    this.video = document.querySelector('video');
    this.setPreset(this.defaultPreset);
    this.urlParser = new UrlParser();

    this.initHandler();

    return this;
};

VDRHls.prototype.initHandler = function () {

    this.mediaRecover = this.recoverMedia.bind(this);
    this.handleError = this.errorHandler.bind(this);
    this.start = this.startPlayback.bind(this);
};

/**
 * add event listeners
 */
VDRHls.prototype.addObserver = function () {

    this.controller.on(Hls.Events.MANIFEST_PARSED, this.start);
    this.controller.on(Hls.Events.ERROR, this.handleError);
};

/**
 * retrieve HLS Controller instance
 * @return {Hls|boolean}
 */
VDRHls.prototype.getHlsController = function () {

    var config = {debug:true};

    config.xhrSetup = function(xhr, url) {

        if (url.indexOf('m3u8') > -1) {
            url = this.urlParser.addUniqueParam(url);
        }
        xhr.open('GET', url, true);

    }.bind(this);

    if (Hls.isSupported()) {
        this.controller = new Hls(config);
        return this.controller;
    }

    return false;
};

VDRHls.prototype.startPlayback = function () {

    this.video.play();
    //setTimeout(this.mediaRecover, 1500);
};

/**
 * stop and destroy
 */
VDRHls.prototype.stop = function () {

    this.video.pause();
    if (this.controller) {
        this.controller.detachMedia();
        this.controller.destroy();
    }
    delete this.controller;
};

/**
 * start playback
 * @param channel
 */
VDRHls.prototype.play = function (channel) {

    var src;

    src = this.getSource(channel);

    if (this.controller) {
        this.video.poster = this.captureFrame();
        this.stop();
    }
    this.getHlsController();
    this.addObserver();

    this.controller.loadSource(src);
    this.controller.attachMedia(this.video);
};

/**
 * retrieve stream source url
 * @param {string} channel
 */
VDRHls.prototype.getSource = function (channel) {

    var url = [
        this.baseUrl
    ];

    channel = channel ? this.channels[channel] : this.channels[this.defaultChannel];

    url.push(this.getParameters(channel));

    return url.join('?');
};

/**
 * retrieve stream source url parameters
 * @param {string} channel
 */
VDRHls.prototype.getParameters = function (channel) {

    return [
        "chid=" + channel,
        "preset=" + this.preset
    ].join('&');
};

/**
 * set preset
 * @param {string} preset
 */
VDRHls.prototype.setPreset = function (preset) {

    if ("undefined" !== typeof this.presets[preset]) {
        this.preset = this.presets[preset];
        document.querySelector('#preset').innerHTML = this.preset;
    }
};

VDRHls.prototype.errorHandler = function (event, data) {

    console.log("error encountered, try to recover");
    if (data.fatal) {
        switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                console.log("fatal network error encountered, try to recover");
                //this.controller.startLoad();
                this.stop();
                this.video.poster = '';
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                console.log("fatal media error encountered, try to recover");
                this.recoverMedia();
                break;
            default:
                // cannot recover
                this.stop();
                this.video.poster = '';
                break;
        }
    }
};

VDRHls.prototype.recoverMedia = function () {

    this.controller.recoverMediaError();
};

VDRHls.prototype.addVideoObserver = function () {

    this.video.addEventListener('progress', function () {
    }.bind(this));
};

VDRHls.prototype.captureFrame = function () {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    c.width = this.video.offsetWidth;
    c.height = this.video.offsetHeight;

    ctx.drawImage(this.video, 0, 0, this.video.offsetWidth, this.video.offsetHeight);

    return c.toDataURL();
};
