/**
 * @typedef {Object} Hls
 * @property {Object} Events
 * @property {function} isSupported
 * @property {function} attachMedia
 * @property {function} detachMedia
 * @property {function} destroy
 * @property {function} loadSource
 * @property {function} startLoad
 * @property {function} recoverMediaError
 */

/**
 * @constructor
 * @property {Hls} controller
 * @property {HTMLElement} video
 */
var VDRHls = function () {};

VDRHls.prototype = new VDRXMLApi();

VDRHls.prototype.streamUrl = 'hls/stream.m3u8';

/**
 * default preset
 * @type {string}
 */
VDRHls.prototype.defaultPreset = 'Mid';

VDRHls.prototype.init = function () {

    this.className = 'VDRHls';
    this.video = document.querySelector('video');
    this.setPreset(this.defaultPreset);
    this.urlParser = new UrlParser();
    this.preservePoster = false;
    this.currentChannel = null;
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
        this.video.poster = this.channels.getLogoUrl(this.currentChannel);
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

    var config = {debug:(this.errorLevel & this.errorLevels.debugHls)>0},
        auth = this.getAuth();

    this.info('controller requested');

    config.xhrSetup = function(xhr, url) {

        if (url.indexOf('m3u8') > -1) {
            url = this.urlParser.addUniqueParam(url);
        }
        xhr.open('GET', url, true);
        if (auth) {
            xhr.setRequestHeader("Authorization", auth);
        }

    }.bind(this);

    config.startPosition = 2;

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
    this.video.style.width = '';
    this.video.style.height = '';
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
        this.video.style.width = video.offsetWidth + 'px';
        this.video.style.height = video.offsetHeight + 'px';
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

    this.preset = preset;
    this.presets.setActivePreset(preset);
};

VDRHls.prototype.errorHandler = function (event, data) {

    this.info("error encountered, try to recover");
    this.debug(data);
    if (data.fatal) {
        switch(data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                this.warn("fatal network error encountered, please try again");
                this.stop();
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
