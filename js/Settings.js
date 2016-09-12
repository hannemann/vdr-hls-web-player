Settings = function () {};

Settings.prototype = new VDRXMLApi();

Settings.prototype.storage = localStorage;

Settings.prototype.availableSettings = {
    "baseUrl" : {
        "type":"string",
        "label" : "Base URL"
    },
    "username" :{
        "type":"string",
        "label" : "Username"
    },
    "password" : {
        "type":"password",
        "label" : "Password"
    },
    "defaultPreset" : {
        "type":"string",
        "label" : "Default preset"
    }
};

Settings.prototype.init = function () {

    this.initElements()
        .initHandler()
        .addObserver();
};

Settings.prototype.initElements = function () {

    this.startButton = document.querySelector('#settings-button');
    return this;
};

Settings.prototype.initHandler = function () {

    this.handleStart = this.startHandler.bind(this);
    this.handlePopState = this.popStateHandler.bind(this);
    return this;
};

Settings.prototype.addObserver = function () {

    this.startButton.addEventListener('click', this.handleStart);
    window.addEventListener('popstate', this.handlePopState);
    return this;
};

Settings.prototype.startHandler = function () {

    var i, value, type;

    this.overlay = document.createElement('div');
    this.overlay.id = 'settings';
    for (i in this.availableSettings) {

        if (this.availableSettings.hasOwnProperty(i)) {

            type = this.availableSettings[i].type;
            switch (type) {
                case "string":
                case "password":
                    this['input' + i] = document.createElement('input');
                    if ("password" === type) {
                        this['input' + i].type = 'password';
                    }
                    if ((value = this.get(i))) {

                        this['input' + i].value = value;
                    }
                    this['label' + i] = document.createElement('div');
                    this['label' + i].innerText = this.availableSettings[i].label;
                    this['label' + i].classList.add('settings-label');

                    this.overlay.appendChild(this['label' + i]);
                    this.overlay.appendChild(this['input' + i]);

                    break;
            }
        }
    }

    history.pushState({"state" : "default"}, "Settings", "/#settings");
    document.body.appendChild(this.overlay);

    return this;
};

Settings.prototype.popStateHandler = function () {

    var i;

    if (this.overlay) {
        for (i in this.availableSettings) {

            if (this.availableSettings.hasOwnProperty(i)) {

                this.set(i, this['input' + i].value);
                delete this['label' + i];
                delete this['input' + i];
            }
        }
        document.body.removeChild(this.overlay);
        delete this.overlay;
    }
    return this;
};

Settings.prototype.get = function (key) {

    var value, type;

    if (this.availableSettings.hasOwnProperty(key)) {

        type = this.availableSettings[key].type;
        value = this.storage.getItem(key);

        if (value) {
            switch (type) {
                case "string":
                case "password":
                    value = value.toString();
                    break;
            }

            return value;
        }
    }
    return false;
};

Settings.prototype.set = function (key, value) {

    var type;

    if (this.availableSettings.hasOwnProperty(key)) {

        type = this.availableSettings[key].type;

        if (value || value == '') {
            switch (type) {
                case "string":
                case "password":
                    this.storage.setItem(key, value.toString());
                    break;
            }

            return value;
        }
    }
    return this;
};