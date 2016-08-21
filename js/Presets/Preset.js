/**
 * @param {string} preset
 * @constructor
 */
Presets.Preset = function (preset) {

    this.name = preset;
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

    this.initHandler()
        .addElement()
        .addObserver();
};

/**
 * initialize handler
 * @return {Presets.Preset}
 */
Presets.Preset.prototype.initHandler = function () {

    this.handleClick = this.clickHandler.bind(this);

    return this;
};

/**
 * add element
 * @return {Presets.Preset}
 */
Presets.Preset.prototype.addElement = function() {

    this.element = document.createElement('div');
    this.element.classList.add('preset');
    this.element.innerHTML = this.name;

    this.presets.element.appendChild(this.element);

    return this;
};

/**
 * add event listeners
 * @return {Presets.Preset}
 */
Presets.Preset.prototype.addObserver = function () {

    this.element.addEventListener('click', this.handleClick);

    return this;
};

/**
 * handle click
 */
Presets.Preset.prototype.clickHandler = function () {

    this.hls.setPreset(this.name);
};