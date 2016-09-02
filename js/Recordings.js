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

/**
 * @type {string}
 */
Recordings.prototype.itemIdFieldName = 'filename';

/**
 * @type {string}
 */
Recordings.prototype.itemTagName = 'recording';

/**
 * initialize
 */
Recordings.prototype.init = function () {

    this.doReload = this.load;
    this.itemClass = Recordings.Recording;
    this.controlsButton = document.querySelector('#toggle-recording-controls');
    this.controls = document.querySelector('#recording-controls');
    this.skipAmountControl = this.controls.querySelector('select');
    this.skipForwardControl = this.controls.querySelector('.fa-forward');
    this.skipBackwardControl = this.controls.querySelector('.fa-backward');
    this.currentTimeDisplay = document.querySelector('#recording-current-time');
    this.currentStartPosition = 0;
    MediaContainer.prototype.init.apply(this);
};

/**
 * initialize handler
 * @return {Recordings}
 */
Recordings.prototype.initHandler = function () {

    MediaContainer.prototype.initHandler.apply(this);
    this.showControls = this.showControlsHandler.bind(this);
    this.hideControls = this.hideControlsHandler.bind(this);
    this.loadItems = this.showItemsRequestHandler.bind(this);
    this.skip = this.skipHandler.bind(this);
    this.timeUpdate = this.timeUpdateHandler.bind(this);
    return this;
};

/**
 * add event listener
 * @return {Recordings}
 */
Recordings.prototype.addObserver = function () {

    this.button.addEventListener('click', this.loadItems);
    this.controlsButton.addEventListener('click', this.showControls);
    this.channels.button.addEventListener('click', this.hideControls);
    this.skipForwardControl.addEventListener('click', this.skip);
    this.skipBackwardControl.addEventListener('click', this.skip);
    this.hls.video.addEventListener('timeupdate', this.timeUpdate);
    MediaContainer.prototype.addObserver.apply(this);
    return this;
};

/**
 * handle load request
 * @return {Recordings}
 */
Recordings.prototype.showItemsRequestHandler = function () {

    this.showMedia();
    if (!this.isLoaded) {
        this.load();
    }
    return this;
};

/**
 * show media
 * @return {MediaContainer}
 */
Recordings.prototype.showMedia = function () {

    this.controlsButton.classList.remove('hidden');
    document.querySelector('#reload').classList.add('hidden');
    return MediaContainer.prototype.showMedia.apply(this);
};

/**
 * hide controls
 */
Recordings.prototype.hideControlsHandler = function () {

    this.controlsButton.classList.add('hidden');
    this.controls.classList.remove('active');
    document.querySelector('#reload').classList.remove('hidden');
};

/**
 * show controls
 * @return {Recordings}
 */
Recordings.prototype.showControlsHandler = function () {

    this.controls.classList.toggle('active');
    return this;
};

/**
 * skip
 * @return {Recordings}
 */
Recordings.prototype.skipHandler = function (e) {

    var amount = parseInt(this.skipAmountControl.value, 10),
        streamTimeout = vdrXmlApi.presets.get(vdrXmlApi.presets.currentPreset).streamTimeout * 1000;

    this.currentStartPosition += this.hls.video.currentTime;

    this.hls.stop();
    if (e.currentTarget === this.skipForwardControl) {
        this.currentStartPosition += amount;
    } else {
        this.currentStartPosition -= amount;
        this.currentStartPosition = this.currentStartPosition < 0 ? 0 : this.currentStartPosition;
    }
    this.hls.currentMedia.startPosition = this.currentStartPosition;
    setTimeout(function () {
        this.hls.play(this.hls.currentMedia);
    }.bind(this), 2000 + streamTimeout);
    return this;
};

/**
 * handle timeupdate
 */
Recordings.prototype.timeUpdateHandler = function () {

    var currentTime, hours, minutes, seconds;

    if (!this.hls.currentMedia instanceof Recordings.Recording) {
        return;
    }
    currentTime = this.currentStartPosition + this.hls.video.currentTime;
    hours = Math.floor(currentTime / 3600);
    minutes = Math.floor((currentTime - hours * 2600) / 60);
    minutes = minutes < 10 ? '0' + minutes.toString() : minutes;
    seconds = parseInt((currentTime - hours * 3600 - minutes * 60), 10);
    seconds = seconds < 10 ? '0' + seconds.toString() : seconds;

    this.currentTimeDisplay.innerText = hours + ':' + minutes + ':' + seconds;
};
