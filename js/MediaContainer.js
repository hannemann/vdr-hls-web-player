/**
 * @constructor
 */
MediaContainer = function () {};

/**
 * @type {VDRXMLApi}
 */
MediaContainer.prototype = new VDRXMLApi();

/**
 * @type {null}
 */
MediaContainer.prototype.currentMediaContainer = null;

/**
 * initialize
 * @return {MediaContainer}
 */
MediaContainer.prototype.init = function () {

    this.isLoaded = false;
    this.mediaItems = {};
    this.initElements().initHandler().addObserver();
    return this;
};

/**
 * fetch element
 * @return {MediaContainer}
 */
MediaContainer.prototype.initElements = function () {

    this.button = document.querySelector(this.buttonSelector);
    this.element = document.querySelector(this.containerSelector);
    return this;
};

/**
 * initialize handler
 * @return {MediaContainer}
 */
MediaContainer.prototype.initHandler = function () {

    this.handleReadyState = this.readyStateHandler.bind(this);
    this.handleReload = this.reloadHandler.bind(this);
    return this;
};

/**
 * add event listeners
 * @return {MediaContainer}
 */
MediaContainer.prototype.addObserver = function () {

    document.querySelector('#reload').addEventListener('click', this.handleReload);
    return this;
};

/**
 * show media container
 * @return {MediaContainer}
 */
MediaContainer.prototype.showMedia = function () {

    Array.prototype.slice.apply(document.querySelectorAll('.media-container')).forEach(function (container) {
        container.style.display = 'none';
    });

    this.element.style.display = 'block';

    MediaContainer.prototype.currentMediaContainer = this;

    return this;
};

/**
 * handle reload
 */
MediaContainer.prototype.reloadHandler = function () {

    if (this === MediaContainer.prototype.currentMediaContainer) {
        MediaContainer.prototype.currentMediaContainer.reload();
    }
};

/**
 * handle xhr ready state
 * @param {Event} e
 * @param {XMLHttpRequest} e.target
 * @return {MediaContainer}
 */
MediaContainer.prototype.readyStateHandler = function (e) {

    var xhr = e.target;

    if (4 === xhr.readyState && 200 === xhr.status) {
        this.xml = xhr.responseXML;
        this.info('items loaded');
        this.addItems();
    }

    return this;
};

/**
 * add media items
 * @return {MediaContainer}
 */
MediaContainer.prototype.addItems = function () {

    var items = Array.prototype.slice.apply(this.xml.getElementsByTagName(this.itemTagName));

    if (items.length > 0) {
        this.isLoaded = true;
    }

    items.forEach(function (item) {

        var id = this.itemIdIsAttribute
            ? item.getAttribute(this.itemIdFieldName)
            : item.getElementsByTagName(this.itemIdFieldName)[0].textContent;

        this.info('Adding item, %s', id);
        this.mediaItems[id] = new this.itemClass(item);
        this.mediaItems[id].init();
    }.bind(this));

    this.restoreState();

    return this;
};

/**
 * store container state
 */
MediaContainer.prototype.storeState = function () {

    this.scrollTop = this.element.scrollTop;
};

/**
 * restore container state
 */
MediaContainer.prototype.restoreState = function () {

    if (this.hls.currentMedia && this.hls.currentMedia instanceof this.itemClass) {
        this.mediaItems[this.hls.currentMedia[this.itemIdFieldName]].element.classList.add('active');
    }

    if (this.scrollTop) {
        this.element.scrollTop = this.scrollTop;
        delete this.scrollTop;
    }
};

/**
 * reload media items
 */
MediaContainer.prototype.reload = function () {

    var i;
    this.storeState();

    for (i in this.mediaItems) {
        if (this.mediaItems.hasOwnProperty(i)) {
            this.mediaItems[i].remove();
        }
    }

    this.doReload();
    return this;
};