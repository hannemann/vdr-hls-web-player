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
};

/**
 * add spinner to channel
 */
HLSAbstract.prototype.play = function () {

    this.currentChannel
        .removeError()
        .addSpinner()
        .setIsActive();
};

/**
 * stop
 */
HLSAbstract.prototype.stop = function () {

    this.currentChannel
        .removeSpinner()
        .unsetIsActive()
        .removeError();
    this.info('paused');
};

/**
 * remove spinner from channel
 */
HLSAbstract.prototype.handleProgress = function () {

    this.currentChannel
        .removeSpinner()
        .removeError();
};

/**
 * remove spinner from channel
 */
HLSAbstract.prototype.handleError = function () {

    this.currentChannel
        .removeSpinner()
        .addError();
};

/**
 * retrieve stream source url
 * @param {string} channel
 */
HLSAbstract.prototype.getSource = function (channel) {

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
HLSAbstract.prototype.getParameters = function (channel) {

    return [
        "chid=" + channel,
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
        height = window.innerWidth  / (this.preset.width / this.preset.height);

    bg.style.flex = '0 0 ' + height + 'px';
    video.style.height = height + 'px';
};