MediaItem = function () {};

MediaItem.prototype = new VDRXMLApi();


MediaItem.prototype.init = function () {

    this.initSpinner()
        .initError()
        .initHandler()
        .addElement()
        .addObserver()
    ;
};


/**
 * initialize spinner
 * @return {Recordings.Recording|Channels.Channel}
 */
MediaItem.prototype.initSpinner = function () {

    this.spinner = document.createElement('i');
    this.spinner.classList.add('fa', 'fa-refresh', 'fa-spin', 'fa-fw', 'status-icon');

    return this;
};

/**
 * initialize error
 * @return {Recordings.Recording|Channels.Channel}
 */
MediaItem.prototype.initError = function () {

    this.error = document.createElement('i');
    this.error.classList.add('fa', 'fa-exclamation-triangle', 'status-icon');

    return this;
};

/**
 * initialize handler
 * @return {Recordings.Recording|Channels.Channel}
 */
MediaItem.prototype.initHandler = function () {

    this.handleClick = this.clickHandler.bind(this);

    return this;
};

/**
 * add event listeners
 * @return {Recordings.Recording|Channels.Channel}
 */
MediaItem.prototype.addObserver = function () {

    this.element.addEventListener('click', this.handleClick);

    return this;
};

/**
 * remove event listeners
 * @return {Recordings.Recording|Channels.Channel}
 */
MediaItem.prototype.removeObserver = function () {

    this.element.removeEventListener('click', this.handleClick);

    return this;
};

/**
 * handle click
 */
MediaItem.prototype.clickHandler = function () {

    if (this.hls.currentMedia) {
        this.hls.currentMedia
            .removeSpinner()
            .removeError()
            .unsetIsActive();
    }
    this.hls.play(this);
};

/**
 * set active className
 */
MediaItem.prototype.setIsActive = function () {

    this.element.classList.add('active');
    return this;
};

/**
 * remove active className
 */
MediaItem.prototype.unsetIsActive = function () {

    this.element.classList.remove('active');
    return this;
};

/**
 * add spinner
 */
MediaItem.prototype.addSpinner = function () {

    this.element.appendChild(this.spinner);
    return this;
};

/**
 * remove spinner
 */
MediaItem.prototype.removeSpinner = function () {

    if (this.spinner.parentNode) {
        this.element.removeChild(this.spinner);
    }
    return this;
};

/**
 * add spinner
 */
MediaItem.prototype.addError = function () {

    this.element.appendChild(this.error);
    return this;
};

/**
 * remove spinner
 */
MediaItem.prototype.removeError = function () {

    if (this.error.parentNode) {
        this.element.removeChild(this.error);
    }
    return this;
};