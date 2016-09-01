Search = function () {};

Search.prototype = new VDRXMLApi();

Search.prototype.init = function () {

    this.initElements()
        .initHandler()
        .addObserver();
};

Search.prototype.initElements = function () {

    this.button = document.querySelector('#search-button');
    this.input = document.querySelector('#search input');

    return this;
};

Search.prototype.initHandler = function () {

    this.toggleSearchHandler = this.handleToggleSearch.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);

    return this;
};

Search.prototype.addObserver = function () {

    this.button.addEventListener('click', this.toggleSearchHandler);
    this.input.addEventListener('keyup', this.keyUpHandler);

    return this;
};

Search.prototype.handleToggleSearch = function () {

    this.input.parentNode.classList.toggle('active');

    if (this.input.parentNode.classList.contains('active')) {
        this.input.focus();
    }

    return this;
};

Search.prototype.handleKeyUp = function () {

    MediaContainer.prototype.currentMediaContainer.filter(this.input.value.toLowerCase());

    return this;
};