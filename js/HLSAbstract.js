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
HLSAbstract.prototype.preset = 'nv_mid';

/**
 * add spinner to channel
 */
HLSAbstract.prototype.play = function () {

    var spinner = document.createElement('i');
    this.removeSpinnerHandler = this.removeSpinner.bind(this);
    this.video.addEventListener('playing', this.removeSpinnerHandler);
    spinner.classList.add('fa', 'fa-refresh', 'fa-spin', 'fa-fw');
    this.currentChannel.element.appendChild(spinner);
};

/**
 * remove spinner from channel
 */
HLSAbstract.prototype.removeSpinner = function () {

    this.video.removeEventListener('playing', this.removeSpinnerHandler);
    this.currentChannel.element.removeChild(this.currentChannel.element.querySelector('.fa-spin'));
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
 * @param {string|Preset} preset
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
 * set dimension according to viewport and preset
 */
HLSAbstract.prototype.setDimension = function () {

    var bg = document.querySelector('.video-background'),
        video = document.querySelector('video'),
        height = window.innerWidth  / (this.preset.width / this.preset.height);

    bg.style.flex = '0 0 ' + height + 'px';
    video.style.height = height + 'px';
};