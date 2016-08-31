MediaContainer = function () {};

MediaContainer.prototype = new VDRXMLApi();

/**
 * fetch element
 * @return {Recordings|Channels}
 */
MediaContainer.prototype.initElements = function () {

    this.button = document.querySelector(this.buttonSelector);
    this.element = document.querySelector(this.containerSelector);
    return this;
};

/**
 * show media container
 * @return {Recordings|Channels}
 */
MediaContainer.prototype.showMedia = function () {

    Array.prototype.slice.apply(document.querySelectorAll('.media-container')).forEach(function (container) {
        container.style.display = 'none';
    });

    this.element.style.display = 'block';

    return this;
};