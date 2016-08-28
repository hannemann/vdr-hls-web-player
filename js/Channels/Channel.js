/**
 * @param {documentElement} channel
 * @param {function} channel.querySelector
 * @param {string} channel.id
 * @constructor
 * @property {string} id
 * @property {boolean} isRadio
 * @property {string} name
 * @property {string} logoUrl
 */
Channels.Channel = function (channel) {

    this.id = channel.id;
    this.isRadio = channel.getElementsByTagName('isradio')[0].textContent != 'false';
    this.name = channel.getElementsByTagName('name')[0].textContent;
    this.logoUrl = channel.getElementsByTagName('logo')[0].textContent;
    this.className = 'Channel';
};

/**
 * @type {VDRXMLApi}
 */
Channels.Channel.prototype = new VDRXMLApi();

/**
 * initialize
 */
Channels.Channel.prototype.init = function () {

    this.initHandler()
        .addElement()
        .addObserver()
    ;
};

/**
 * initialize handler
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.initHandler = function () {

    this.handleClick = this.clickHandler.bind(this);

    return this;
};

/**
 * add element
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.addElement = function () {

    this.element = document.createElement('div');
    this.element.classList.add('channel');
    this.element.innerHTML = this.getInnerHTML();

    this.channels.element.appendChild(this.element);

    this.event = new DVBEvent({
        "channel" : this,
        "parentNode" : this.element.querySelector('.channel-content')
    });

    return this;
};

/**
 * add event listeners
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.addObserver = function () {

    this.element.addEventListener('click', this.handleClick);

    return this;
};

/**
 * remove event listeners
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.removeObserver = function () {

    this.element.removeEventListener('click', this.handleClick);

    return this;
};

/**
 * handle click
 */
Channels.Channel.prototype.clickHandler = function () {

    var i;
    this.hls.play(this);
    for (i in this.channels.channelButtons) {
        if (this.channels.channelButtons.hasOwnProperty(i)) {
            if (this.channels.channelButtons[i] !== this) {
                this.channels.channelButtons[i].element.classList.remove('active');
            } else {
                this.channels.channelButtons[i].element.classList.add('active');
            }
        }
    }
};

/**
 * retrieve inner html
 * @return {string}
 */
Channels.Channel.prototype.getInnerHTML = function () {

    var html = '';

    if ('' !== this.logoUrl) {
        html += '<div class="logo-wrapper"><img src="' + this.logoUrl + '" class="channel-logo"></div>';
    }
    html += '<div class="channel-content" id="' + this.id + '"><div class="channel-name">' + this.name + '</div></div>';

    return html;
};

/**
 * remove
 */
Channels.Channel.prototype.remove = function () {

    this.removeObserver();
    this.element.parentNode.removeChild(this.element);
};