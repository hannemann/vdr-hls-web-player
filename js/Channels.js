/**
 * @constructor
 */
Channels = function () {};

/**
 * @type {VDRXMLApi}
 */
Channels.prototype = new MediaContainer();

/**
 * @type {string}
 */
Channels.prototype.url = 'channels.xml';

/**
 * @type {string}
 */
Channels.prototype.method = 'GET';

/**
 * @type {string}
 */
Channels.prototype.buttonSelector = '#channels-button';

/**
 * @type {string}
 */
Channels.prototype.containerSelector = '#channels';

/**
 * @type {string}
 */
Channels.prototype.itemIdFieldName = 'id';

/**
 * @type {string}
 */
Channels.prototype.itemIdIsAttribute = true;

/**
 * @type {string}
 */
Channels.prototype.itemTagName = 'channel';

/**
 * @type {string}
 */
Channels.prototype.className = 'Channels';

/**
 * initialize
 * @return {Channels}
 */
Channels.prototype.init = function () {

    MediaContainer.prototype.init.apply(this);
    this.doReload = this.addItems;
    this.itemClass = Channels.Channel;
    this.showMedia()
        .load();
    this.info('initialized');
    return this;
};

/**
 * add event listeners
 * @return {Channels}
 */
Channels.prototype.addObserver = function () {

    this.button.addEventListener('click', this.showMedia.bind(this));
    MediaContainer.prototype.addObserver.apply(this);

    return this;
};

/**
 * retrieve channel with given id
 * @param {string} id
 * @return {Channels.Channel}
 */
Channels.prototype.getChannelById = function (id) {

    return this.mediaItems[id];
};

/**
 * retrieve logo url for channel
 * @param {Channels.Channel} channel
 * @return {string}
 */
Channels.prototype.getLogoUrl = function (channel) {

    return this.getChannelById(channel.id).element.querySelector('.media-item-logo').src;
};