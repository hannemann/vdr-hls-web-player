/**
 * @constructor
 */
Channels = function () {};

/**
 * @type {VDRXMLApi}
 */
Channels.prototype = new VDRXMLApi();

/**
 * @type {string}
 */
Channels.prototype.url = 'channels.xml';

/**
 * @type {string}
 */
Channels.prototype.method = 'GET';

/**
 * @type {{}}
 */
Channels.prototype.channelButtons = {};

/**
 * initialize
 * @return {Channels}
 */
Channels.prototype.init = function () {

    this.className = 'Channels';
    this.handleReadyState = this.readyStateHandler.bind(this);

    this.getElement().load();
    this.info('initialized');
    return this;
};

/**
 * fetch element
 * @return {Channels}
 */
Channels.prototype.getElement = function () {

    this.element = document.querySelector('#channels');
    return this;
};

/**
 * handle readyState change
 * @param e
 */
Channels.prototype.readyStateHandler = function (e) {

    var response = e.target;

    if (4 === response.readyState && 200 === response.status) {
        this.info(response);
        this.channels = response.responseXML;
        this.info('channels loaded');
        this.addChannels();
    }
};

/**
 * add channels
 */
Channels.prototype.addChannels = function () {

    var channels = Array.prototype.slice.apply(this.channels.getElementsByTagName('channel'));
    channels.forEach(function (channel) {

        this.info('Adding channel %s', channel.querySelector('name').innerHTML);
        this.channelButtons[channel.id] = new Channels.Channel(channel);
        this.channelButtons[channel.id].init();

    }.bind(this));
};

/**
 * determine if we have channels
 * @return {boolean}
 */
//Channels.prototype.hasChannels = function () {
//
//    return this.channels !== null;
//};

/**
 * retrieve channel with given id
 * @param {string} id
 * @return {Element}
 */
Channels.prototype.getChannelById = function (id) {

    return this.channels.getElementById(id);
};

/**
 * retrieve logo url for channel with given id
 * @param {string} id
 * @return {string}
 */
Channels.prototype.getLogoUrl = function (id) {

    return this.getChannelById(id).querySelector('logo').innerHTML;
};