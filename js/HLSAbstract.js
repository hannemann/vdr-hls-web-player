/**
 * @constructor
 * @property {Preset|string} preset
 */
HLSAbstract = function () {};

/**
 * @type {VDRXMLApi}
 */
HLSAbstract.prototype = new VDRXMLApi();

/**
 * @type {string}
 */
HLSAbstract.prototype.streamUrl = 'hls/stream.m3u8';

/**
 * @type {string}
 */
HLSAbstract.prototype.defaultPreset = '';

/**
 * add event listeners
 */
HLSAbstract.prototype.addObserver = function () {

    this.progressHandler = this.handleProgress.bind(this);
    this.setDimensionHandler = this.handleSetDimension.bind(this);
    this.video.addEventListener('progress', this.progressHandler);
    window.addEventListener('orientationchange', this.setDimensionHandler);
    window.addEventListener('resize', this.setDimensionHandler);
    document.querySelector('#stop').addEventListener('click', this.stop.bind(this));
    document.querySelector('#reload').addEventListener('click', this.channels.reload.bind(this.channels));
};

/**
 * add spinner to channel
 */
HLSAbstract.prototype.play = function () {

    this.currentMedia
        .removeError()
        .addSpinner()
        .setIsActive();
};

/**
 * stop
 */
HLSAbstract.prototype.stop = function () {

    this.currentMedia
        .removeSpinner()
        .unsetIsActive()
        .removeError();
    this.info('paused');
};

/**
 * remove spinner from channel
 */
HLSAbstract.prototype.handleProgress = function () {

    this.currentMedia
        .removeSpinner()
        .removeError();
};

/**
 * remove spinner from channel
 */
HLSAbstract.prototype.handleError = function () {

    this.currentMedia
        .removeSpinner()
        .addError();
};

/**
 * retrieve stream source url
 * @param {Channels.Channel|Recordings.Recording} media
 */
HLSAbstract.prototype.getSource = function (media) {

    var url = [
        this.baseUrl + this.streamUrl
    ];

    if (media instanceof Recordings.Recording) {

        url.push(this.getRecordingParameters(media.fileName));
    } else {

        url.push(this.getChannelParameters(media.id));
    }

    return url.join('?');
};

/**
 * retrieve stream source url parameters for channel
 * @param {string} channel
 */
HLSAbstract.prototype.getChannelParameters = function (channel) {

    return [
        "chid=" + channel,
        "preset=" + this.preset.name
    ].join('&');
};

/**
 * retrieve stream source url parameters for recording
 * @param {string} filename
 */
HLSAbstract.prototype.getRecordingParameters = function (filename) {

    return [
        "filename=" + encodeURIComponent(filename),
        "preset=" + this.preset.name
    ].join('&');
};


/**
 * set preset
 * @param {string|Presets.Preset} preset
 */
HLSAbstract.prototype.setPreset = function (preset) {

    if ("string" === typeof preset) {
        preset = this.presets.get(preset);
    }

    if (preset) {
        this.preset = preset;
        this.presets.setActivePreset(preset.name);
    }
    this.setDimension();
};

/**
 * wrap dimension setter
 */
HLSAbstract.prototype.handleSetDimension = function () {

    setTimeout(function () {
        this.setDimension();
    }.bind(this), 200);
};

/**
 * set dimension according to viewport and preset
 */
HLSAbstract.prototype.setDimension = function () {

    var bg = document.querySelector('.video-background'),
        video = document.querySelector('video'),
        height;

    if (!this.preset) {
        this.preset = {
            "width" : 16,
            "height" : 9
        }
    }
    height = window.innerWidth  / (this.preset.width / this.preset.height);
    bg.style.flex = '0 0 ' + height + 'px';
    video.style.height = height + 'px';
};
