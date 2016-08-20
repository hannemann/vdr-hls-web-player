/**
 * @constructor
 * @property {Hls} controller
 * @property {HTMLVideoElement} video
 */
var VDRHls = function (api) {

    this.api = api;
    this.init();
};

VDRHls.prototype = new VDRXMLApi();

VDRHls.prototype.streamUrl = 'hls/stream.m3u8';

/**
 * default preset
 * @type {string}
 */
VDRHls.prototype.defaultPreset = 'nvlow';
//VDRHls.prototype.defaultPreset = 'low';

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
VDRHls.prototype.availableChannels = {
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

    this.className = 'VDRHls';
    this.video = document.querySelector('video');
    this.setPreset(this.defaultPreset);
    this.urlParser = new UrlParser();
    this.preservePoster = false;
    this.recoverTries = 0;
    this.currentChannel = this.defaultChannel;
    this.errorLevel = this.errorLevels.info | this.errorLevels.warn | this.errorLevels.debug;
    this.initHandler().addVideoObserver();
    this.info('initialized');
    return this;
};

VDRHls.prototype.initHandler = function () {

    this.mediaRecover = this.recoverMedia.bind(this);
    this.handleError = this.errorHandler.bind(this);
    this.start = this.startPlayback.bind(this);
    this.info('handlers initialized');

    return this;
};

/**
 * add event listeners
 */
VDRHls.prototype.addObserver = function () {

    this.controller.on(Hls.Events.MANIFEST_PARSED, this.start);
    this.controller.on(Hls.Events.ERROR, this.handleError);
    this.info('observers added to controller');
};

VDRHls.prototype.addVideoObserver = function () {

    this.video.addEventListener('canplay', function () {
        this.info('Video: can play video now');
        this.video.poster = this.api.channels.getLogoUrl(this.availableChannels[this.currentChannel]);
    }.bind(this));

    this.video.addEventListener('playing', function () {
        this.info('Video: Started Playback');
    }.bind(this));
    this.info('observers added to video element');

    return this;
};

/**
 * retrieve HLS Controller instance
 * @return {Hls|boolean}
 */
VDRHls.prototype.getHlsController = function () {

    var config = {debug:(this.errorLevel & this.errorLevels.debugHls)>0};
    this.recoverTries = 0;
    this.info('controller requested');

    config.xhrSetup = function(xhr, url) {

        if (url.indexOf('m3u8') > -1) {
            url = this.urlParser.addUniqueParam(url);
        }
        xhr.open('GET', url, true);

    }.bind(this);

    if (Hls.isSupported()) {
        this.controller = new Hls(config);
        this.info('controller initialized');
        return this.controller;
    }

    return false;
};

VDRHls.prototype.startPlayback = function () {

    this.video.play();
    //setTimeout(this.mediaRecover, 1500);
    this.info('playback started');
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
    if (!this.preservePoster) {
        this.video.poster = '';
    }
    this.info('paused');
};

/**
 * start playback
 * @param channel
 */
VDRHls.prototype.play = function (channel) {

    var src;
    this.info('play request');

    this.currentChannel = channel;
    src = this.getSource(channel);
    this.info('fetch video from %s', src);

    if (this.controller) {
        this.info('Video playing, set poster');
        this.video.poster = this.captureFrame();
        this.preservePoster = true;
        this.info('cancel video');
        this.stop();
        this.preservePoster = false;
    }
    this.getHlsController();
    this.addObserver();

    this.info('load src %s', src);
    this.controller.loadSource(src);
    this.info('attach to video element');
    this.controller.attachMedia(this.video);
};

/**
 * retrieve stream source url
 * @param {string} channel
 */
VDRHls.prototype.getSource = function (channel) {

    var url = [
        this.baseUrl + this.streamUrl
    ];

    channel = channel ? this.availableChannels[channel] : this.availableChannels[this.defaultChannel];

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

    this.info("error encountered, try to recover");
    this.debug(data);
    if (data.fatal) {
        switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                this.warn("fatal network error encountered, try to recover");
                if (this.recoverTries < 10) {
                    this.info('trying to restart');
                    this.debug('tried to startload %d times', this.recoverTries);
                    this.controller.startLoad();
                    this.recoverTries++;
                } else {
                    this.stop()
                }
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                this.info("fatal media error encountered, try to recover");
                this.mediaRecover();
                break;
            default:
                // cannot recover
                this.warn("cannot recover from fatal error. Stopping now");
                this.stop();
                break;
        }
    }
};

VDRHls.prototype.recoverMedia = function () {

    this.info('calling controller to recover media');
    this.controller.recoverMediaError();
};

VDRHls.prototype.captureFrame = function () {

    var c = document.createElement('canvas'),
        ctx = c.getContext('2d');

    c.width = this.video.offsetWidth;
    c.height = this.video.offsetHeight;

    ctx.drawImage(this.video, 0, 0, this.video.offsetWidth, this.video.offsetHeight);

    return c.toDataURL();
};
