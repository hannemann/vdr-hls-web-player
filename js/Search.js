/**
 * @constructor
 */
Search = function () {};

/**
 * @type {VDRXMLApi}
 */
Search.prototype = new VDRXMLApi();

/**
 * initialize
 */
Search.prototype.init = function () {

    this.initElements()
        .initHandler()
        .addObserver();
};

/**
 * initialize elements
 * @return {Search}
 */
Search.prototype.initElements = function () {

    this.button = document.querySelector('#search-button');
    this.input = document.querySelector('#search input');
    this.delete = document.querySelector('#search .fa-times-circle');

    return this;
};

/**
 * initialize handler
 * @return {Search}
 */
Search.prototype.initHandler = function () {

    this.toggleSearchHandler = this.handleToggleSearch.bind(this);
    this.keyUpHandler = this.handleKeyUp.bind(this);
    this.deleteHandler = this.handleDelete.bind(this);

    return this;
};

/**
 * add event listeners
 * @return {Search}
 */
Search.prototype.addObserver = function () {

    this.button.addEventListener('click', this.toggleSearchHandler);
    this.input.addEventListener('keyup', this.keyUpHandler);
    this.delete.addEventListener('click', this.deleteHandler);

    return this;
};

/**
 * toggle search
 * @return {Search}
 */
Search.prototype.handleToggleSearch = function () {

    this.input.parentNode.classList.toggle('active');

    if (this.input.parentNode.classList.contains('active')) {
        this.input.focus();
    } else {
        this.input.blur();
    }

    return this;
};

/**
 * hide search
 * @return {Search}
 */
Search.prototype.hide = function () {

    this.input.parentNode.classList.remove('active');

    this.input.value = '';

    return this;
};

/**
 * handle input
 * @return {Search}
 */
Search.prototype.handleKeyUp = function () {

    MediaContainer.prototype.currentMediaContainer.filter(this.input.value.toLowerCase());

    return this;
};

/**
 * delete input
 * @return {Search}
 */
Search.prototype.handleDelete = function () {

    this.input.focus();
    this.input.value = '';
    MediaContainer.prototype.currentMediaContainer.unsetFilter();

    return this;
};