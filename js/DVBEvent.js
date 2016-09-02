/**
 * @typedef {{}} EventOptions
 * @property {Channels.Channel} channel
 * @property {string} chid
 */

/**
 *
 * @param options
 * @constructor
 */
var DVBEvent = function (options) {

    this.channel = options.channel;
    this.parentNode = options.parentNode;
    this.init();
};

/**
 * @type {VDRXMLApi}
 */
DVBEvent.prototype = new VDRXMLApi();

/**
 * @type {string}
 */
DVBEvent.prototype.url = 'epg.xml';

/**
 * @type {string}
 */
DVBEvent.prototype.method = 'GET';

/**
 * initialize
 */
DVBEvent.prototype.init = function () {

    this.url += '?chid=' + this.channel.id   + '&at=now';

    this.initHandler()
        .load();
    this.info('initialized');
};

/**
 * initialize handler
 * @return {DVBEvent}
 */
DVBEvent.prototype.initHandler = function () {

    this.handleReadyState = this.readyStateHandler.bind(this);
    this.handleShowDescription = this.showDescriptionHandler.bind(this);

    return this;
};

/**
 * add event listeners
 * @return {DVBEvent}
 */
DVBEvent.prototype.addObserver = function () {

    this.descriptionButton.addEventListener('click', this.handleShowDescription);

    return this;
};

/**
 * remove event listeners
 * @return {DVBEvent}
 */
DVBEvent.prototype.removeObserver = function () {

    this.descriptionButton.addEventListener('click', this.handleShowDescription);

    return this;
};

/**
 * handle readyState change
 * @param e
 */
DVBEvent.prototype.readyStateHandler = function (e) {

    var response = e.target;

    if (4 === response.readyState && 200 === response.status) {
        this.info(response);
        this.event = response.responseXML;
        this.info('event loaded');
        this.addEvent();
    }
};

/**
 * add event data
 */
DVBEvent.prototype.addEvent = function () {

    if ("undefined" === typeof this.element) {
        this.element = document.createElement('div');
        this.element.classList.add('event');
        this.parentNode.appendChild(this.element);
        this.parentNode.parentNode.classList.add('new');
    }

    this.element.innerHTML = '<span class="media-time">'
        + this.getStart()
        + ' - ' + this.getEnd()
        + '</span>'
        + ' ' + this.getTitle()
        + '<br>'
        + ' ' + this.getShortText()
        + ' ' + this.getDescription()
    ;

    this.description = this.element.querySelector('.media-description');
    this.description.style.maxHeight = 1000 + this.description.offsetHeight + 'px';
    this.parentNode.parentNode.classList.add('hide-description');
    this.parentNode.parentNode.classList.remove('new');

    this.descriptionButton = this.element.querySelector('.media-shorttext');

    this.addObserver();
};

/**
 * retrieve start
 * @return {string}
 */
DVBEvent.prototype.getStart = function () {

    var node = this.event.getElementsByTagName('start')[0],
        start = node ? new Date(parseInt(node.textContent, 10) * 1000) : 'NaN',
        time = 'n.a.', hours, minutes;

    if (!isNaN(start)) {
        start = new Date(parseInt(node.textContent, 10) * 1000);
        hours = start.getHours();
        minutes = start.getMinutes();
        hours = hours < 10 ? '0' + hours.toString() : hours.toString();
        minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
        time = hours + ':' + minutes;
    }
    return time;
};

DVBEvent.prototype.getEnd = function () {

    var node = this.event.getElementsByTagName('stop')[0],
        stop = node ? new Date(parseInt(node.textContent, 10) * 1000) : 'NaN',
        time = 'n.a.', hours, minutes;

    if (!isNaN(stop)) {
        stop = new Date(parseInt(node.textContent, 10) * 1000);
        hours = stop.getHours();
        minutes = stop.getMinutes();
        hours = hours < 10 ? '0' + hours.toString() : hours.toString();
        minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
        time = hours + ':' + minutes;
    }

    return time;
};

DVBEvent.prototype.getTitle = function () {

    return '<span class="media-name">' + this.getTitleText() + '</span>';
};

DVBEvent.prototype.getTitleText = function () {

    var node = this.event.getElementsByTagName('title')[0];

    if (node) {
        return node.textContent;
    }

    return 'n.a.';
};

DVBEvent.prototype.getShortText = function () {

    return '<div class="media-shorttext"><i class="fa fa-chevron-right"></i>&nbsp;' + this.getShortTextText() + '</div>';
};

DVBEvent.prototype.getShortTextText = function () {

    var node = this.event.getElementsByTagName('shorttext')[0];

    if (node) {
        return node.textContent;
    }

    return 'n.a.';
};

DVBEvent.prototype.getDescription = function () {

    var node = this.event.getElementsByTagName('description')[0],
        description = 'n.a.';

    if (node) {
        description = node.textContent;
    }

    return '<div class="media-description">' + description + '</div>';
};

DVBEvent.prototype.getDescriptionText = function () {

    var node = this.event.getElementsByTagName('description')[0];

    if (node) {
        return node.textContent;
    }

    return 'n.a.';
};

DVBEvent.prototype.hasToken = function (token) {

    return this.getTitleText().toLowerCase().indexOf(token) > -1
        || this.getShortTextText().toLowerCase().indexOf(token) > -1
        || this.getDescriptionText().toLowerCase().indexOf(token) > -1;
};

DVBEvent.prototype.showDescriptionHandler = function (e) {

    e.preventDefault();
    e.stopPropagation();

    this.parentNode.parentNode.classList.toggle('hide-description');
};

DVBEvent.prototype.remove = function () {

    this.removeObserver();
    this.element.parentNode.removeChild(this.element);
};