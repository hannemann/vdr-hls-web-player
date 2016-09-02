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
Presets.prototype.items = {};

Presets.prototype.init = function () {

    this.className = 'Presets';
    this.handleReadyState = this.readyStateHandler.bind(this);
    this.getElement()
        .initHandler()
        .addObserver()
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

Presets.prototype.initHandler = function () {

    this.handleChange = this.changeHandler.bind(this);
    return this;
};

Presets.prototype.addObserver = function () {

    this.element.addEventListener('change', this.handleChange);
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
        this.hls.setPreset(this.currentPreset);
    }
};

Presets.prototype.addPresets = function () {

    var presets = this.parseIniFile(), name;

    for (name in presets) {
        if (presets.hasOwnProperty(name)) {

            this.items[name] = new Presets.Preset(name, presets[name]);
            if (name === VDRHls.prototype.defaultPreset) {
                this.currentPreset = name;
            }
        }
    }
    if (!this.currentPreset) {
        this.currentPreset = VDRHls.prototype.defaultPreset ? VDRHls.prototype.defaultPreset : name;
    }
};

/**
 * set active preset
 * @param presetName
 */
Presets.prototype.setActivePreset = function (presetName) {

    this.currentPreset = presetName;
    this.element.querySelector('[value="' + presetName + '"]').selected = true;
};

/**
 * retrieve preset by name
 * @param name
 * @return {*}
 */
Presets.prototype.get = function (name) {

    return this.items[name];
};

Presets.prototype.changeHandler = function () {

    this.hls.setPreset(this.items[this.element.options[this.element.selectedIndex].value]);
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