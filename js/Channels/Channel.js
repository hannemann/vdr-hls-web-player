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
Channels.Channel = function (channel, container) {

    this.id = channel.getAttribute('id');
    this.isRadio = channel.getElementsByTagName('isradio')[0].textContent != 'false';
    this.name = channel.getElementsByTagName('name')[0].textContent;
    this.url = channel.getElementsByTagName('logo')[0].textContent;
    this.method = 'GET';
    this.className = 'Channel';
    this.container = container;
};

/**
 * @type {VDRXMLApi}
 */
Channels.Channel.prototype = new MediaItem();

/**
 * initialize handler
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.initHandler = function () {

    this.handleReadyState = this.parseImageResponse.bind(this);
    MediaItem.prototype.initHandler.apply(this);

    return this;
};

/**
 * add element
 * @return {Channels.Channel}
 */
Channels.Channel.prototype.addElement = function () {

    this.element = document.createElement('div');
    this.element.classList.add('media-item');
    this.element.innerHTML = this.getInnerHTML();

    this.channels.element.appendChild(this.element);

    this.event = new DVBEvent({
        "channel" : this,
        "parentNode" : this.element.querySelector('.media-content')
    });

    this.load('arraybuffer');

    return this;
};

/**
 * retrieve inner html
 * @return {string}
 */
Channels.Channel.prototype.getInnerHTML = function () {

    var html = '';

    if ('' !== this.logoUrl) {
        html += '<div class="logo-wrapper"><img class="media-item-logo"></div>';
    }
    html += '<div class="media-content" id="' + this.id + '"><div class="channel-name">' + this.name + '</div></div>';

    return html;
};

/**
 * convert image response to base64
 * @param {Event} e
 * @param {XMLHttpRequest} e.target
 */
Channels.Channel.prototype.parseImageResponse = function (e) {

    var xhr = e.target;
    var arr, raw, b64, dataURL;
    if (4 === xhr.readyState && 200 === xhr.status) {

        arr = new Uint8Array(xhr.response);
        raw = String.fromCharCode.apply(null,arr);
        b64=btoa(raw);
        dataURL="data:image/png;base64,"+b64;
        this.element.querySelector('img').src = dataURL;
    }
};

/**
 * retrieve stream parameter
 * @return {string}
 */
Channels.Channel.prototype.getStreamParameter = function () {

    return "chid=" + this.id;
};

/**
 * apply filter
 * @param {string} token
 */
Channels.Channel.prototype.applyFilter = function (token) {

    if ( !(this.name.toLowerCase().indexOf(token) > -1 || this.event.hasToken(token)) ) {

        this.element.style.display = 'none';
    } else {

        this.element.style.display = '';
    }
};

/**
 * remove
 */
Channels.Channel.prototype.remove = function () {

    this.removeObserver();
    this.element.parentNode.removeChild(this.element);
};