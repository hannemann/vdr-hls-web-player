Channels = function () {
    this.init();
};

Channels.prototype = new VDRXMLApi();

Channels.prototype.url = 'channels.xml';

Channels.prototype.method = 'GET';

Channels.prototype.init = function () {

    this.className = 'Channels';
    this.handleReadyState = this.readyStateHandler.bind(this);
    this.errorLevel = this.errorLevels.info | this.errorLevels.warn | this.errorLevels.debug;

    this.load();
    this.info('initialized');
    return this;
};

Channels.prototype.load = function () {

    var xhr = new XMLHttpRequest();
    xhr.open(this.method, this.baseUrl + this.url);
    xhr.onreadystatechange = this.handleReadyState;
    xhr.send();
};

Channels.prototype.readyStateHandler = function (e) {

    var response = e.target;

    if (4 === response.readyState && 200 === response.status) {
        this.info(response);
        this.channels = response.responseXML;
        this.info('channels loaded');
    }
};

Channels.prototype.hasChannels = function () {

    return this.channels !== null;
};

Channels.prototype.getChannelById = function (id) {

    return this.channels.getElementById(id);
};

Channels.prototype.getLogoUrl = function (id) {

    return this.getChannelById(id).getElementsByTagName('logo')[0].innerHTML;
};