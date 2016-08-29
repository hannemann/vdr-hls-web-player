# VDR HLS Web Client

This is a prototype of a web based client for playing around with the streaming feature of [vdr-plugin-xmlapi](https://github.com/nanohcv/vdr-plugin-xmlapi).  
To implement HLS Streaming in Google Chrome and Firefox the [dailymotion hls.js API](https://github.com/dailymotion/hls.js) is used.

## Settings
Please add your settings to /js/settings.js as shown in /js/settings.js.sample

#### Authentication
Not supported yet in xmlapi please use [my fork](https://github.com/hannemann/vdr-plugin-xmlapi) if you really need it right now.
Even better: use the [dev branch](https://github.com/nanohcv/vdr-plugin-xmlapi/tree/dev) of xmlapi.

#### Landscape mode (small resolutions only)
To hide channels in landscape mode enter fullscreen

## Possible URL-Parameter
* preset={your preset}
* debug={debugHls|debug|warn|info}

## Presets
You can find my presets in the folder xmlapi. Please note that 'nv' prefixed presets work only with a ffmpeg version with compiled nvenc support.  
If you want to compile in nvenc support you need a kepler graphics chip.  
@see [vdr-portal.de](http://www.vdr-portal.de/board19-verschiedenes/board10-verschiedenes/128687-transkodieren-mit-nvidia-kepler-graka-unter-linux-mit-ffmpeg-es-geht/)

My box transcodes live tv at about 30% CPU using a Geforce GT 630

* Intel(R) Celeron(R) CPU G1610T @ 2.30GHz
* 01:00.0 VGA compatible controller: NVIDIA Corporation GK208 [GeForce GT 630 Rev. 2] (rev a1)

Have fun

Hannemann