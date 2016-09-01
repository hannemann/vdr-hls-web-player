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
    MediaContainer.prototype.init.apply(this);
};

/**
 * initialize handler
 * @return {Recordings}
 */
Recordings.prototype.initHandler = function () {

    MediaContainer.prototype.initHandler.apply(this);
    this.loadItems = this.handleShowItemsRequest.bind(this);
    return this;
};

/**
 * add event listener
 * @return {Recordings}
 */
Recordings.prototype.addObserver = function () {

    this.button.addEventListener('click', this.loadItems);
    MediaContainer.prototype.addObserver.apply(this);
    return this;
};

/**
 * handle load request
 * @return {Recordings}
 */
Recordings.prototype.handleShowItemsRequest = function () {

    this.showMedia();
    if (!this.isLoaded) {
        this.load();
    }
    return this;
};
