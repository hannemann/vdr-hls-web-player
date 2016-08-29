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
    
    // handle relative urls
    if(this.parser.protocol === '' && this.parser.host === '') {
        // On IE11 the pathname sometimes doesn't start with a slash
        if(this.parser.pathname.indexOf('/') != 0) {
            return '/' + this.parser.pathname + '?' + search.join('&');
        }
        return this.parser.pathname + '?' + search.join('&');
    }

    return this.parser.protocol
        + '//'
        + this.parser.host
        + this.parser.pathname
        + '?'
        + search.join('&');
};