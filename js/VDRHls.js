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
 * @property {int} startPosition
 */
var VDRHls = function () {};

/**
 * @type {HLSAbstract}
 */
VDRHls.prototype = new HLSAbstract();

/**
 * initialize
 * @return {VDRHls}
 */
VDRHls.prototype.init = function () {

    this.className = 'VDRHls';
    this.video = document.querySelector('video');
    this.urlParser = new UrlParser();
    this.preservePoster = false;
    this.currentMedia = null;
    this.initHandler().addVideoObserver();
    this.info('initialized');
    return this;
};

/**
 * initialize handler
 * @return {VDRHls}
 */
VDRHls.prototype.initHandler = function () {

    this.errorHandler = this.handleError.bind(this);
    this.start = this.startPlayback.bind(this);
    this.info('handlers initialized');

    return this;
};

/**
 * add event listeners
 */
VDRHls.prototype.addObserver = function () {

    this.controller.on(Hls.Events.MANIFEST_PARSED, this.start);
    this.controller.on(Hls.Events.ERROR, this.errorHandler);
    this.info('observers added to controller');
};

/**
 * add video element related event listeners
 * @return {VDRHls}
 */
VDRHls.prototype.addVideoObserver = function () {

    this.video.addEventListener('canplay', function () {
        this.info('Video: can play video now');
        if (this.currentMedia instanceof Channels.Channel) {
            this.video.poster = this.channels.getLogoUrl(this.currentMedia);
        }

    }.bind(this));

    this.info('observers added to video element');

    HLSAbstract.prototype.addObserver.apply(this);

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
            xhr.withCredentials = true;
        }

    }.bind(this);

    config.startPosition = this.startPosition;

    if (Hls.isSupported()) {
        this.controller = new Hls(config);
        this.info('controller initialized');
        return this.controller;
    }

    return false;
};

/**
 * start playback
 */
VDRHls.prototype.startPlayback = function () {

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
    HLSAbstract.prototype.stop.apply(this);
};

/**
 * start playback
 * @param {Channels.Channel|Recordings.Recording} media
 */
VDRHls.prototype.play = function (media) {

    var src;
    this.currentMedia = media;

    if (this.controller) {
        this.info('Video playing, set poster');
        this.video.poster = this.captureFrame();
        this.preservePoster = true;
        this.info('cancel video');
        this.stop();
        this.preservePoster = false;
    }

    HLSAbstract.prototype.play.apply(this);
    this.info('play request');
    src = this.getSource();
    this.info('fetch video from %s', src);
    this.getHlsController();
    this.addObserver();

    this.info('load src %s', src);
    this.controller.loadSource(src);
    this.info('attach to video element');
    this.controller.attachMedia(this.video);

    this.video.play();
};

VDRHls.prototype.handleError = function (event, data) {

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
                this.recoverMedia();
                break;
            default:
                // cannot recover
                this.warn("cannot recover from fatal error. Stopping now");
                this.stop();
                break;
        }
    }
    HLSAbstract.prototype.handleError.apply(this);
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
