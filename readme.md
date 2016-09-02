# VDR HLS Web Client

This is a prototype of a web based client for playing around with the streaming feature of [vdr-plugin-xmlapi](https://github.com/nanohcv/vdr-plugin-xmlapi).  
To implement HLS Streaming in Google Chrome and Firefox the [dailymotion hls.js API](https://github.com/dailymotion/hls.js) is used.

## Settings
Hit the cog symbol to type in your settings
* Base URL: The base url of xmlapi plugin
* Username
* Password
* Default preset: the name of the default preset

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

## Notes on IOS
since i don't own an ios device its hard for me to test anything if i change something, but i try not to break compatibility.
I was not able to stream via HTTPS with a self signed certificat or using authentication for now. If you have any ideas about this please contact me. 

Have fun

Hannemann