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

    //window.addEventListener('orientationchange', function () {
    //
    //    var firstVisible = this.getFirstVisbleChannel();
    //    setTimeout(function () {
    //        firstVisible.element.scrollIntoView();
    //        this.element.scrollTop += firstVisible.element.offsetHeight * firstVisible.offset / 100;
    //    }.bind(this), 200);
    //}.bind(this));

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

//Channels.prototype.getFirstVisbleChannel = function () {
//
//    var i,
//        elementTop = this.element.getBoundingClientRect().top,
//        bottom;
//
//    for (i in this.mediaItems) {
//        if (this.mediaItems.hasOwnProperty(i)) {
//
//            bottom = this.mediaItems[i].element.getBoundingClientRect().bottom;
//            if (bottom > elementTop) {
//
//                return {
//                    "element" : this.mediaItems[i].element,
//                    "offset" : 100 * (bottom - elementTop) / this.mediaItems[i].element.offsetHeight
//                };
//            }
//        }
//    }
//};