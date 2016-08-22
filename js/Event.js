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
var Event = function (options) {

    this.channel = options.channel;
    this.parentNode = options.parentNode;
    this.init();
};

Event.prototype = new VDRXMLApi();

Event.prototype.url = 'epg.xml';

Event.prototype.method = 'GET';

Event.prototype.init = function () {

    this.url += '?chid=' + this.channel.id   + '&at=now';

    this.initHandler()
        .load();
    this.info('initialized');
};

Event.prototype.initHandler = function () {

    this.handleReadyState = this.readyStateHandler.bind(this);

    return this;
};

/**
 * handle readyState change
 * @param e
 */
Event.prototype.readyStateHandler = function (e) {

    var response = e.target;

    if (4 === response.readyState && 200 === response.status) {
        this.info(response);
        this.event = response.responseXML;
        this.info('event loaded');
        this.addEvent();
    }
};

Event.prototype.addEvent = function () {

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

Event.prototype.getStart = function () {

    var node = this.event.querySelector('start'),
        start = node ? new Date(parseInt(node.innerHTML, 10) * 1000) : 'NaN',
        time = 'n.a.';

    if (!isNaN(start)) {
        start = new Date(parseInt(node.innerHTML, 10) * 1000);
        time = start.getHours() + ':' + start.getMinutes();
    }
    return time;
};

Event.prototype.getEnd = function () {

    var node = this.event.querySelector('stop'),
        stop = node ? new Date(parseInt(node.innerHTML, 10) * 1000) : 'NaN',
        time = 'n.a.';

    if (!isNaN(stop)) {
        stop = new Date(parseInt(node.innerHTML, 10) * 1000);
        time = stop.getHours() + ':' + stop.getMinutes();
    }

    return time;
};

Event.prototype.getTitle = function () {

    var node = this.event.querySelector('title'),
        title = 'n.a.';

    if (node) {
        title = node.innerHTML;
    }

    return '<span class="event-title">' + title + '</span>';
};

Event.prototype.getShortText = function () {

    var node = this.event.querySelector('title'),
        shortText = 'n.a.';

    if (node) {
        shortText = node.innerHTML;
    }

    return '<span class="event-shorttext">' + shortText + '</span>';
};

Event.prototype.getDescription = function () {

    var node = this.event.querySelector('description'),
        description = 'n.a.';

    if (node) {
        description = node.innerHTML;
    }

    return '<div class="event-description">' + description + '</div>';
};