# VDR HLS Web Client

This is a prototype of a web based client for playing around with the streaming feature of [vdr-plugin-xmlapi](https://github.com/nanohcv/vdr-plugin-xmlapi).  
To implement HLS Streaming in Google Chrome and Firefox the [dailymotion hls.js API](https://github.com/dailymotion/hls.js) is used.

## Settings
Please add your settings to /js/settings.js as shown in /js/settings.js.sample

#### Authentication
Not supported yet in xmlapi please use [my fork](https://github.com/hannemann/vdr-plugin-xmlapi) if you really need it right now.

#### Landscape mode
To hide channels in landscape mode enter fullscreen

## Possible URL-Parameter
* preset={your preset}
* debug={debugHls|debug|warn|info}

## Chrome
Video should start automatically if you click on a channel item

## Firefox
Click on a channel item and hit the play button of the video element to start streaming

## Android Chrome
Click on a channel item and hit the play button of the video element to start streaming

## ios
Under construction. If youre interested in contributing please start with the file examples/ios.html
Video should start playing but will stop after the first sequence (tested on iphone 6)

## Presets
You should add -r 25 parameter to your presets to prevent chrashes in chrome. I did not test if FF crashes too bt it seems to work well with the setting applied.  
You can find my presets in the folder xmlapi. Please note that 'nv' prefixed presets work only with a ffmpeg version with compiled nvenc support.  
If you want to compile in nvenc support you need a kepler graphics chip.  
@see [vdr-portal.de](http://www.vdr-portal.de/board19-verschiedenes/board10-verschiedenes/128687-transkodieren-mit-nvidia-kepler-graka-unter-linux-mit-ffmpeg-es-geht/)

My box transcodes live tv at about 30% CPU using a Geforce GT 630

* Intel(R) Celeron(R) CPU G1610T @ 2.30GHz
* 01:00.0 VGA compatible controller: NVIDIA Corporation GK208 [GeForce GT 630 Rev. 2] (rev a1)

Have fun

Hannemann