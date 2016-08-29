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

    this.id = channel.getAttribute('id');
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

    this.initSpinner()
        .initError()
        .initHandler()
        .addElement()
        .addObserver()
    ;
};

/**
 * initialize spinner
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.initSpinner = function () {

    this.spinner = document.createElement('i');
    this.spinner.classList.add('fa', 'fa-refresh', 'fa-spin', 'fa-fw', 'status-icon');

    return this;
};

/**
 * initialize error
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.initError = function () {

    this.error = document.createElement('i');
    this.error.classList.add('fa', 'fa-exclamation-triangle', 'status-icon');

    return this;
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

    if (this.hls.currentChannel) {
        this.hls.currentChannel
            .removeSpinner()
            .removeError()
            .unsetIsActive();
    }
    this.hls.play(this);
};

/**
 * set active className
 */
Channels.Channel.prototype.setIsActive = function () {

    this.element.classList.add('active');
    return this;
};

/**
 * remove active className
 */
Channels.Channel.prototype.unsetIsActive = function () {

    this.element.classList.remove('active');
    return this;
};

/**
 * add spinner
 */
Channels.Channel.prototype.addSpinner = function () {

    this.element.appendChild(this.spinner);
    return this;
};

/**
 * remove spinner
 */
Channels.Channel.prototype.removeSpinner = function () {

    if (this.spinner.parentNode) {
        this.element.removeChild(this.spinner);
    }
    return this;
};

/**
 * add spinner
 */
Channels.Channel.prototype.addError = function () {

    this.element.appendChild(this.error);
    return this;
};

/**
 * remove spinner
 */
Channels.Channel.prototype.removeError = function () {

    if (this.error.parentNode) {
        this.element.removeChild(this.error);
    }
    return this;
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