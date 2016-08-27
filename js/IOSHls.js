/**
 * @constructor
 */
IOSHls = function () {};

/**
 * @type {VDRXMLApi}
 */
IOSHls.prototype = new VDRXMLApi();

/**
 * @type {string}
 */
IOSHls.prototype.streamUrl = 'hls/stream.m3u8';

/**
 * @type {string}
 */
IOSHls.prototype.preset = 'nv_mid';

/**
 * initialilze
 * @return {IOSHls}
 */
IOSHls.prototype.init = function () {

    this.className = 'VDRHls';
    this.video = document.querySelector('video');
    this.setPreset(this.defaultPreset);
    this.currentChannel = null;
    this.info('initialized');
    this.addObserver();
    return this;
};

/**
 * add event listeners
 */
IOSHls.prototype.addObserver = function () {

    this.video.addEventListener('playing', function () {
        this.video.style.width = '';
        this.video.style.height = '';
    }.bind(this));
};

/**
 * play
 * @param {string} channel
 */
IOSHls.prototype.play = function (channel) {

    var src;
    this.info('play request');

    this.currentChannel = channel;
    src = this.getSource(channel);
    this.video.src = src;
    this.video.play();
    this.info('fetch video from %s', src);
};

/**
 * stop
 */
IOSHls.prototype.stop = function () {

    this.video.style.width = this.video.offsetWidth + 'px';
    this.video.style.height = this.video.offsetHeight + 'px';
    this.video.pause();
    this.video.src = '';
    this.info('paused');
};

/**
 * retrieve stream source url
 * @param {string} channel
 */
IOSHls.prototype.getSource = function (channel) {

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
IOSHls.prototype.getParameters = function (channel) {

    return [
        "chid=" + channel,
        "preset=" + this.preset
    ].join('&');
};