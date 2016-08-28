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
        this.setDimension();
    }
};

HLSAbstract.prototype.setDimension = function () {

};