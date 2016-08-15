

/**
 * StreamControl
 * @constructor
 */
var StreamControl = function () {};

StreamControl.prototype.baseUrl = 'http://xmlapi.hannemann.lan/streamcontrol.xml';
StreamControl.prototype.removeParam = 'remove';

StreamControl.prototype.getStreams = function () {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {

        var result = e.target, streams;
        if (4 === result.readyState && 200 === result.status) {
            streams = result.responseXML.getElementsByTagName('stream');
            console.log(streams[0].id);
        }
    };
    xhr.open('GET', this.baseUrl);
    xhr.send();
};