/**
 * @param recording
 * @constructor
 */
Recordings.Recording = function (recording, container) {

    this.name = recording.getElementsByTagName('name')[0].textContent;
    this.filename = recording.getElementsByTagName('filename')[0].textContent;
    this.dateTitle = recording.getElementsByTagName('title')[0].textContent;
    this.duration = parseInt(recording.getElementsByTagName('duration')[0].textContent, 10);
    this.inuse = recording.getElementsByTagName('inuse')[0].textContent;
    this.size = parseInt(recording.getElementsByTagName('size')[0].textContent, 10);
    this.deleted = parseInt(recording.getElementsByTagName('name')[0].textContent, 10) > 0;
    this.title = recording.getElementsByTagName('title')[1].textContent;
    this.channelId = recording.getElementsByTagName('channelid')[0].textContent;
    this.channelName = recording.getElementsByTagName('channelname')[0].textContent;
    this.shortText = recording.getElementsByTagName('shorttext')[0].textContent;
    this.description = recording.getElementsByTagName('description')[0].textContent;
    this.container = container;
};

/**
 * @type {MediaItem}
 */
Recordings.Recording.prototype = new MediaItem();

/**
 * add element
 * @return {Recordings.Recording}
 */
Recordings.Recording.prototype.addElement = function () {

    this.element = document.createElement('div');
    this.element.classList.add('media-item');
    this.element.innerHTML = this.getInnerHTML();

    this.recordings.element.appendChild(this.element);

    return this;
};

/**
 * retrieve inner html
 * @return {string}
 */
Recordings.Recording.prototype.getInnerHTML = function () {

    var html = '';

    html += '<div class="media-content" id="' + this.id + '">'
        + '<div class="recording-name">' + this.title + '</div>'
        + '<div class="recording-short-text">' + this.shortText + '</div>'
        + '</div>';

    return html;
};

/**
 * retrieve stream parameter
 * @return {string}
 */
Recordings.Recording.prototype.getStreamParameter = function () {

    return "filename=" + encodeURIComponent(this.filename);
};

/**
 * apply filter
 * @param {string} token
 */
Recordings.Recording.prototype.applyFilter = function (token) {

    if (
        !(
            this.name.toLowerCase().indexOf(token) > -1
            || this.filename.toLowerCase().indexOf(token) > -1
            || this.dateTitle.toLowerCase().indexOf(token) > -1
            || this.title.toLowerCase().indexOf(token) > -1
            || this.channelId.toLowerCase().indexOf(token) > -1
            || this.channelName.toLowerCase().indexOf(token) > -1
            || this.shortText.toLowerCase().indexOf(token) > -1
            || this.description.toLowerCase().indexOf(token) > -1
        )
    ) {

        this.element.style.display = 'none';
    } else {

        this.element.style.display = '';
    }
};

/**
 * remove
 */
Recordings.Recording.prototype.remove = function () {

    this.removeObserver();
    this.element.parentNode.removeChild(this.element);
};