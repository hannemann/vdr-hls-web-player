Presets = function () {};

Presets.prototype = new VDRXMLApi();

/**
 * @type {string}
 */
Presets.prototype.url = 'presets.ini?hls=1';

/**
 * @type {string}
 */
Presets.prototype.method = 'GET';

/**
 * @type {{}}
 */
Presets.prototype.presetButtons = {};

Presets.prototype.init = function () {

    this.className = 'Presets';
    this.handleReadyState = this.readyStateHandler.bind(this);
    this.getElement()
        .load();
};

/**
 * fetch element
 * @return {Presets}
 */
Presets.prototype.getElement = function () {

    this.element = document.querySelector('#presets');
    return this;
};

/**
 * handle readyState change
 * @param e
 */
Presets.prototype.readyStateHandler = function (e) {

    var response = e.target;

    if (4 === response.readyState && 200 === response.status) {
        this.info(response);
        this.presets = response.responseText;
        this.info('presets loaded');
        this.addPresets();
        this.setActivePreset(this.hls.preset);
    }
};

Presets.prototype.addPresets = function () {

    var presets = this.presets.match(/\[[^\]]*\]/g);

    presets.forEach(this.addPreset.bind(this));
};

Presets.prototype.addPreset = function (preset) {

    this.presetButtons[preset] = new Presets.Preset(preset.replace(/[\[\]]/g, ''));
};

Presets.prototype.setActivePreset = function (preset) {

    var i;

    for (i in this.presetButtons) {
        if (this.presetButtons.hasOwnProperty(i)) {
            if (this.presetButtons[i].name !== preset) {
                this.presetButtons[i].element.classList.remove('active');
            } else {
                this.presetButtons[i].element.classList.add('active');
            }
        }
    }
};