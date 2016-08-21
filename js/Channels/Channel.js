/**
 * @param {documentElement} channel
 * @constructor
 * @property {string} id
 * @property {boolean} isRadio
 * @property {string} name
 * @property {string} logoUrl
 */
Channels.Channel = function (channel) {

    this.id = channel.id;
    this.isRadio = channel.querySelector('isradio').innerHTML != 'false';
    this.name = channel.querySelector('name').innerHTML;
    this.logoUrl = channel.querySelector('logo').innerHTML;
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
 * handle click
 */
Channels.Channel.prototype.clickHandler = function () {

    var i;
    this.hls.play(this.id);
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
    html += '<div class="channel-name">' + this.name + '</div>';

    return html;
};