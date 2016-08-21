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

    var start = this.getStartDate(), end = this.getEndDate();

    if ("undefined" === typeof this.element) {
        this.element = document.createElement('div');
        this.element.classList.add('event');
        this.parentNode.appendChild(this.element);
    }

    this.element.innerHTML = '<span class="event-start">'
        + start.getHours()
        + ':' + start.getMinutes()
        + ' - ' + end.getHours()
        + ':' + end.getMinutes()
        + '</span>'
        + ' ' + this.getTitle()
        + '<br>'
        + ' ' + this.getShortText()
    ;
};

Event.prototype.getStartDate = function () {

    return new Date(parseInt(this.event.querySelector('start').innerHTML, 10) * 1000);
};

Event.prototype.getEndDate = function () {

    return new Date(parseInt(this.event.querySelector('stop').innerHTML, 10) * 1000);
};

Event.prototype.getTitle = function () {

    return '<span class="event-title">' + this.event.querySelector('title').innerHTML + '</span>';
};

Event.prototype.getShortText = function () {

    return '<span class="event-shorttext">' + this.event.querySelector('shorttext').innerHTML + '</span>';
};