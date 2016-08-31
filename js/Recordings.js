/**
 * @constructor
 */
Recordings = function () {};

/**
 * @type {VDRXMLApi}
 */
Recordings.prototype = new MediaContainer();

/**
 * @type {string}
 */
Recordings.prototype.method = 'GET';

/**
 * @type {string}
 */
Recordings.prototype.url = 'recordings.xml';

/**
 * @type {string}
 */
Recordings.prototype.buttonSelector = '#recordings-button';

/**
 * @type {string}
 */
Recordings.prototype.containerSelector = '#recordings';

Recordings.prototype.buttons = {};

/**
 * initialize
 */
Recordings.prototype.init = function () {

    this.isLoaded = false;

    this.initElements()
        .initHandler()
        .addObserver();
};

/**
 * initialize handler
 * @return {Recordings}
 */
Recordings.prototype.initHandler = function () {

    this.handleReadyState = this.readyStateHandler.bind(this);
    this.loadRecordings = this.handleRequest.bind(this);
    return this;
};

/**
 * add event listener
 * @return {Recordings}
 */
Recordings.prototype.addObserver = function () {

    this.button.addEventListener('click', this.loadRecordings);
    return this;
};

/**
 * handle load request
 * @return {Recordings}
 */
Recordings.prototype.handleRequest = function () {

    this.showMedia();
    if (!this.isLoaded) {
        this.load();
    }
    return this;
};

/**
 * handle xhr ready state
 * @param {Event} e
 * @param {XMLHttpRequest} e.target
 * @return {Recordings}
 */
Recordings.prototype.readyStateHandler = function (e) {

    var xhr = e.target;

    if (4 === xhr.readyState && 200 === xhr.status) {
        this.recordings = xhr.responseXML;
        this.info('recordings loaded');
        this.addRecordings();
    }

    return this;
};

Recordings.prototype.addRecordings = function (e) {

    var recordings = Array.prototype.slice.apply(this.recordings.getElementsByTagName('recording'));

    if (recordings.length > 0) {
        this.isLoaded = true;
    }

    recordings.forEach(function (recording) {
        this.info('Adding channel %s', recording.getElementsByTagName('name')[0].textContent);
        this.buttons[recording.getElementsByTagName('filename')[0].textContent] = new Recordings.Recording(recording);
        this.buttons[recording.getElementsByTagName('filename')[0].textContent].init();
    }.bind(this));

    return this;
};
