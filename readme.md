# VDR HLS Web Client

This is a prototype of a web based client for playing around with the streaming feature of [vdr-plugin-xmlapi](https://github.com/nanohcv/vdr-plugin-xmlapi)

Please add your settings to /js/settings.js as shown in /js/settings.js.sample

## Chrome
Video should start automatically if you click on a channel item

## Firefox
Click on a channel item and hit the play button of the video element to start streaming

## Android Chrome
Click on a channel item and hit the play button of the video element to start streaming

## ios
Under construction. If youre interested in contributing please start with the file examples/ios.html

## Presets
You should add -r 25 parameter to your presets to prevent chrashes in chrome. I did not test if FF crashes too bt it seems to work well with the setting applied.
You can find my presets in the folder xmlapi. Please note that 'nv' prefixed presets work only with a ffmpeg version with compiled nvenc support.
@see [vdr-portal.de](http://www.vdr-portal.de/board19-verschiedenes/board10-verschiedenes/128687-transkodieren-mit-nvidia-kepler-graka-unter-linux-mit-ffmpeg-es-geht/)

Have fun

Hannemann