/**
 * @typedef {{}} presetOptions
 * @property {string} Cmd
 * @property {string} MinSegments
 * @property {string} StreamTimeout
 */

/**
 * @param {string} preset
 * @param {presetOptions} config
 * @constructor
 * @property {number} minSegments
 * @property {number} streamTimeout
 * @property {string} cmd
 * @property {number} width
 * @property {number} heigth
 */
Presets.Preset = function (preset, config) {

    this.minSegments = parseInt(config.MinSegments, 10);
    this.streamTimeout = parseInt(config.StreamTimeout, 10);
    this.cmd = config.Cmd;
    this.name = preset;
    this.width = 0;
    this.height = 0;
    this.init();
};

/**
 * @type {VDRXMLApi}
 */
Presets.Preset.prototype = new VDRXMLApi();

/**
 * initialize
 */
Presets.Preset.prototype.init = function () {

    this.parseCmd()
        .addElement();
};

Presets.Preset.prototype.parseCmd = function () {

    var regex = {
            "width" : /scale=([0-9]{1,4}):[0-9]{1,4}/,
            "height" : /scale=[0-9]{1,4}:([0-9]{1,4})/
        }, i, match;

    for (i in regex) {
        if (regex.hasOwnProperty(i)) {
            match = this.cmd.match(regex[i]);
            if (match) {
                if (!isNaN(this[i])) {
                    this[i] = parseInt((match.length > 1 ? match[1] : match), 10);
                } else {
                    this[i] = match.length > 1 ? match[1] : match;
                }
            } else {
                this[i] = undefined;
            }
        }
    }
    return this;
};

/**
 * add element
 * @return {Presets.Preset}
 */
Presets.Preset.prototype.addElement = function() {

    var selected = this.name === this.hls.defaultPreset;
    this.element = new Option(this.name, this.name, selected, selected);
    this.presets.element.appendChild(this.element);

    return this;
};

/**
 * handle click
 */
Presets.Preset.prototype.clickHandler = function () {

    this.hls.setPreset(this);
};