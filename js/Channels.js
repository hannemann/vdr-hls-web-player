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

    this.getElement().addObserver().load();
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
 * add event listeners
 * @return {Channels}
 */
Channels.prototype.addObserver = function () {

    window.addEventListener('orientationchange', function () {

        var firstVisible = this.getFirstVisbleChannel();
        setTimeout(function () {
            firstVisible.element.scrollIntoView();
            this.element.scrollTop += firstVisible.element.offsetHeight * firstVisible.offset / 100;
        }.bind(this), 200);
    }.bind(this));
    return this;
};

Channels.prototype.getFirstVisbleChannel = function () {

    var i,
        elementTop = this.element.getBoundingClientRect().top,
        bottom;

    for (i in this.channelButtons) {
        if (this.channelButtons.hasOwnProperty(i)) {

            bottom = this.channelButtons[i].element.getBoundingClientRect().bottom;
            if (bottom > elementTop) {

                return {
                    "element" : this.channelButtons[i].element,
                    "offset" : 100 * (bottom - elementTop) / this.channelButtons[i].element.offsetHeight
                };
            }
        }
    }
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

        this.info('Adding channel %s', channel.getElementsByTagName('name')[0].textContent);
        this.channelButtons[channel.id] = new Channels.Channel(channel);
        this.channelButtons[channel.id].init();

    }.bind(this));
};

/**
 * reload all channels
 */
Channels.prototype.reload = function () {

    var i, scrollTop = this.element.scrollTop;

    for (i in this.channelButtons) {
        if (this.channelButtons.hasOwnProperty(i)) {
            this.channelButtons[i].remove();
        }
    }

    this.addChannels();
    if (this.hls.currentChannel) {
        this.channelButtons[this.hls.currentChannel].element.classList.add('active');
    }

    this.element.scrollTop = scrollTop;
};

/**
 * retrieve channel with given id
 * @param {string} id
 * @return {Element}
 */
Channels.prototype.getChannelById = function (id) {

    return this.channels.getElementById(id);
};

/**
 * retrieve logo url for channel
 * @param {Channels.Channel} channel
 * @return {string}
 */
Channels.prototype.getLogoUrl = function (channel) {

    return this.baseUrl + this.getChannelById(channel.id).getElementsByTagName('logo')[0].textContent;
};