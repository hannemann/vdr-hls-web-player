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

DVBEvent.prototype = new VDRXMLApi();

DVBEvent.prototype.url = 'epg.xml';

DVBEvent.prototype.method = 'GET';

DVBEvent.prototype.init = function () {

    this.url += '?chid=' + this.channel.id   + '&at=now';

    this.initHandler()
        .load();
    this.info('initialized');
};

DVBEvent.prototype.initHandler = function () {

    this.handleReadyState = this.readyStateHandler.bind(this);

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

DVBEvent.prototype.addEvent = function () {

    if ("undefined" === typeof this.element) {
        this.element = document.createElement('div');
        this.element.classList.add('event');
        this.parentNode.appendChild(this.element);
    }

    this.element.innerHTML = '<span class="event-start">'
        + this.getStart()
        + ' - ' + this.getEnd()
        + '</span>'
        + ' ' + this.getTitle()
        + '<br>'
        + ' ' + this.getShortText()
        + ' ' + this.getDescription()
    ;
};

DVBEvent.prototype.getStart = function () {

    var node = this.event.querySelector('start'),
        start = node ? new Date(parseInt(node.innerHTML, 10) * 1000) : 'NaN',
        time = 'n.a.';

    if (!isNaN(start)) {
        start = new Date(parseInt(node.innerHTML, 10) * 1000);
        time = start.getHours() + ':' + start.getMinutes();
    }
    return time;
};

DVBEvent.prototype.getEnd = function () {

    var node = this.event.querySelector('stop'),
        stop = node ? new Date(parseInt(node.innerHTML, 10) * 1000) : 'NaN',
        time = 'n.a.';

    if (!isNaN(stop)) {
        stop = new Date(parseInt(node.innerHTML, 10) * 1000);
        time = stop.getHours() + ':' + stop.getMinutes();
    }

    return time;
};

DVBEvent.prototype.getTitle = function () {

    var node = this.event.querySelector('title'),
        title = 'n.a.';

    if (node) {
        title = node.innerHTML;
    }

    return '<span class="event-title">' + title + '</span>';
};

DVBEvent.prototype.getShortText = function () {

    var node = this.event.querySelector('shorttext'),
        shortText = 'n.a.';

    if (node) {
        shortText = node.innerHTML;
    }

    return '<span class="event-shorttext">' + shortText + '</span>';
};

DVBEvent.prototype.getDescription = function () {

    var node = this.event.querySelector('description'),
        description = 'n.a.';

    if (node) {
        description = node.innerHTML;
    }

    return '<div class="event-description">' + description + '</div>';
};