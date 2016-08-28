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

    this.className = 'VDRHls';
    this.video = document.querySelector('video');
    this.addRestartHandler = true;
    this.currentChannel = null;
    this.initHandler();
    this.info('initialized');
    return this;
};

IOSHls.prototype.initHandler = function () {

    this.handleVideoPlaying = this.restart.bind(this);
    return this;
};

/**
 * play
 * @param {Channels.Channel} channel
 */
IOSHls.prototype.play = function (channel) {

    var src;
    this.currentChannel = channel;
    HLSAbstract.prototype.play.apply(this);
    this.info('play request');

    if (this.addRestartHandler) {
        this.addRestartHandler = false;
        this.video.addEventListener('playing', this.handleVideoPlaying);
    } else {
        this.addRestartHandler = true;
    }
    src = this.getSource(channel.id);
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
    this.info('paused');
};

IOSHls.prototype.restart = function () {

    this.play(this.currentChannel);
    this.video.removeEventListener('playing', this.handleVideoPlaying);
};