/**
 * @constructor
 */
IOSHls = function () {};

/**
 * @type {VDRXMLApi}
 */
IOSHls.prototype = new HLSAbstract();

/**
 * initialize
 * @return {IOSHls}
 */
IOSHls.prototype.init = function () {

    this.className = 'IOSHls';
    this.video = document.querySelector('video');
    this.addRestartHandler = true;
    this.currentMedia = null;
    this.initHandler().addObserver();
    this.info('initialized');
    return this;
};

IOSHls.prototype.initHandler = function () {

    this.errorHandler = this.handleError.bind(this);
    this.handleVideoPlaying = this.restart.bind(this);
    return this;
};

IOSHls.prototype.addObserver = function () {

    this.video.addEventListener('error', this.errorHandler);
    HLSAbstract.prototype.addObserver.apply(this);
    return this;
};

/**
 * play
 * @param {Channels.Channel} channel
 */
IOSHls.prototype.play = function (channel) {

    var src;
    this.currentMedia = channel;
    HLSAbstract.prototype.play.apply(this);
    this.info('play request');

    if (this.addRestartHandler) {
        this.addRestartHandler = false;
        this.video.addEventListener('playing', this.handleVideoPlaying);
    } else {
        this.addRestartHandler = true;
    }
    src = this.getSource(channel);
    this.video.src = src;
    this.video.play();
    this.info('fetch video from %s', src);
};

/**
 * stop
 */
IOSHls.prototype.stop = function () {

    this.video.pause();
    this.video.src = '';

    setTimeout(HLSAbstract.prototype.stop.bind(this), 200);
};

IOSHls.prototype.restart = function () {

    this.play(this.currentMedia);
    this.video.removeEventListener('playing', this.handleVideoPlaying);
};
