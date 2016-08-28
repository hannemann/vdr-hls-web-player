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

    var presets = this.parseIniFile(), name;

    for (name in presets) {
        if (presets.hasOwnProperty(name)) {

            this.presetButtons[name] = new Presets.Preset(name, presets[name]);
        }
    }
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

Presets.prototype.get = function (name) {

    return this.presetButtons[name];
};

Presets.prototype.parseIniFile = function () {

    var lines = this.presets.split(/\r\n|\r|\n/);
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var section = null;
    var value = {};

    lines.forEach(function(line){
        var match;
        if(regex.comment.test(line)){
            void(0);
        }else if(regex.param.test(line)){
            match = line.match(regex.param);
            if(section){
                value[section][match[1]] = match[2];
            }else{
                value[match[1]] = match[2];
            }
        }else if(regex.section.test(line)){
            match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        }else if(line.length == 0 && section){
            section = null;
        }
    });

    return value;
};