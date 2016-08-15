UrlParser = function () {
    this.init();
};

UrlParser.prototype.init = function () {

    this.now = Date.now();
    this.parser = document.createElement('a');
};

UrlParser.prototype.addUniqueParam = function (url) {

    var search;

    this.parser.href = url;

    search = this.parser.search
        .replace(/nc=.*/, '')
        .split('?')[1]
        .split('&');

    search.push('nc=' + (this.now + performance.now()).toString());

    return this.parser.protocol
        + '//'
        + this.parser.host
        + this.parser.pathname
        + '?'
        + search.join('&');
};