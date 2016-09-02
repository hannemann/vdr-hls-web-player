/**
 * @param recording
 * @param {Recordings} container
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
    this.element.classList.add('media-item', 'hide-description');
    this.element.innerHTML = this.getInnerHTML();

    this.recordings.element.appendChild(this.element);

    this.descriptionButton = this.element.querySelector('.media-shorttext');

    return this;
};

/**
 * initialize handler
 * @return {Recordings.Recording}
 */
Recordings.Recording.prototype.initHandler = function () {

    this.handleShowDescription = this.showDescriptionHandler.bind(this);
    MediaItem.prototype.initHandler.apply(this);
    return this;
};

/**
 * add event listeners
 * @return {Recordings.Recording}
 */
Recordings.Recording.prototype.addObserver = function () {

    this.descriptionButton.addEventListener('click', this.handleShowDescription);
    MediaItem.prototype.addObserver.apply(this);
    return this;
};

/**
 * remove event listeners
 * @return {Recordings.Recording}
 */
Recordings.Recording.prototype.removeObserver = function () {

    this.descriptionButton.removeEventListener('click', this.handleShowDescription);
    MediaItem.prototype.removeObserver.apply(this);
    return this;
};

/**
 * handle click
 */
Recordings.Recording.prototype.clickHandler = function () {

    this.container.currentStartPosition = 0;
    MediaItem.prototype.clickHandler.apply(this);
};

/**
 * retrieve inner html
 * @return {string}
 */
Recordings.Recording.prototype.getInnerHTML = function () {

    var html = '';

    html += '<div class="media-content" id="' + this.id + '">'
        + '<div class="media-name">' + this.title + '</div>'
        + '<div class="media-shorttext"><i class="fa fa-chevron-right"></i>&nbsp;' + this.shortText + '</div>'
        + '</div>';

    return html;
};

/**
 * retrieve stream parameter
 * @return {string}
 */
Recordings.Recording.prototype.getStreamParameter = function () {

    var start = this.startPosition ? this.startPosition : 0;
    delete this.startPosition;

    return "filename=" + encodeURIComponent(this.filename) + '&start=' + start;
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
 * show description
 * @param {Event} e
 */
Recordings.Recording.prototype.showDescriptionHandler = function (e) {

    var content;

    e.preventDefault();
    e.stopPropagation();

    if (!this.descriptionNode) {

        this.element.classList.add('new');
        content = this.element.querySelector('.media-content');
        this.descriptionNode = document.createElement('div');
        this.descriptionNode.classList.add('media-description');
        this.descriptionNode.innerText = this.description;
        content.appendChild(this.descriptionNode);
        this.descriptionNode.style.maxHeight = 1000 + this.descriptionNode.offsetHeight + 'px';
        this.element.classList.remove('new');
    }


    this.element.classList.toggle('hide-description');
};

/**
 * remove
 */
Recordings.Recording.prototype.remove = function () {

    this.removeObserver();
    this.element.parentNode.removeChild(this.element);
};