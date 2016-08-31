Recordings.Recording = function (recording) {

    this.name = recording.getElementsByTagName('name')[0].textContent;
    this.fileName = recording.getElementsByTagName('filename')[0].textContent;
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
};

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