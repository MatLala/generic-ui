assetViewerSelector = function (fileUrl, viewport)
{
	var extension = fileUrl.split(".").pop().toLowerCase();

	//Asset picture selector
	if(extension==='png'|| extension==='jpg'|| extension==='jpeg' || extension==='tiff' || extension==='gif'  || extension==='bmp')
	{
		require(["generic-ui/scripts/assetViewer/leafletViewer.js"], function(leafletViewer){
			var img = document.createElement('img');
			img.style.display = 'none';
			img.addEventListener( 'load', function(e){
				viewport.innerHTML = '';
				leafletViewer(viewport, fileUrl, this.width, this.height);
			});
			img.src = fileUrl;
		});
		return;
	}
	if(extension==='svg')
	{
		require(["generic-ui/scripts/assetViewer/leafletViewer.js"], function(leafletViewer){
			var img = document.createElement('img');
			img.style.display = 'none';
			img.addEventListener( 'load', function(e){
				viewport.innerHTML = '';
				var w = 32000;
				var w1 = this.width;
				var x = w/w1;
				var h1 = this.height;
				var h = h1*x;
				leafletViewer.initialize(viewport, fileUrl, this.width, this.height);
			});
			img.src = fileUrl;
		});
		return;
	}

	//Asset video selector
	if(extension==='mov' || extension === 'mp4' || extension === 'mkv' || extension === 'avi')
	{
		require([
            "generic-ui/scripts/assetViewer/vendor/video-js/video-js-5.10.7/video.js"
        ],
			function(videojs){
                require([
//                    "scripts/assetViewer/vendor/video-js/videojs.hotkeys.js",
//                    "scripts/assetViewer/vendor/video-js/video-framebyframe.js"
                ], function(){
                    loadCss('generic-ui/scripts/assetViewer/vendor/video-js/video-js-5.10.7/video-js.css');
                    loadCss('generic-ui/scripts/assetViewer/videojs.css');

                    viewport.innerHTML = '';
                    var wrapperVideo = document.createElement('video');
                    wrapperVideo.setAttribute('class', 'video-js vjs-default-skin');
                    wrapperVideo.setAttribute('controls','true');

                    var source1 = document.createElement('source');
                    source1.setAttribute('src',fileUrl);
                    source1.setAttribute('type','video/mp4');

                    var source2 = document.createElement('source');
                    source2.setAttribute('src',fileUrl);
                    source2.setAttribute('type','video/webm');

                    var source3 = document.createElement('source');
                    source3.setAttribute('src',fileUrl);
                    source3.setAttribute('type','video/x-flv');

                    viewport.appendChild(wrapperVideo);
                    wrapperVideo.appendChild(source1);
                    wrapperVideo.appendChild(source2);
                    wrapperVideo.appendChild(source3);

                    var player = videojs(wrapperVideo, {
                        "techOrder": ['html5', 'flash'],
                        "controls": true,
                        "preload": 'auto',
                        "loop": true,
                        plugins: {
//                            framebyframe: {
//                              fps: 24,
//                              steps: [
//                                { text: '-5', step: -5 },
//                                { text: '-1', step: -1 },
//                                { text: '+1', step: 1 },
//                                { text: '+5', step: 5 },
//                              ]
//                            }
                        }
                    }, function() {
//                        this.hotkeys({
//                            volumeStep: 0.1,
//                            seekStep: 1,
//                            enableMute: true,
//                            enableFullscreen: true
//                        });
                    });
                });
			});
		return;
				
	}	
	if(extension === 'flv')
	{
		require(["generic-ui/scripts/assetViewer/vendor/video-js/video-js-4.11.4/video.js"],
			function(videojs){
				loadCss('generic-ui/scripts/assetViewer/vendor/video-js/video-js-4.11.4/video-js.css');
				loadCss('generic-ui/scripts/assetViewer/videojs.css');
			
				var wrapperVideo = document.createElement('video');
				wrapperVideo.setAttribute('class', 'video-js vjs-default-skin');
				wrapperVideo.setAttribute('controls','true');

				var source1 = document.createElement('source');
				source1.setAttribute('src',fileUrl);
				source1.setAttribute('type','video/x-flv');

				var source2 = document.createElement('source');
				source2.setAttribute('src',fileUrl);
				source2.setAttribute('type','video/webm');

				var assetMain_viewer = document.getElementById('assetMain_viewer');
				assetMain_viewer.appendChild(wrapperVideo);
				wrapperVideo.appendChild(source1);
				wrapperVideo.appendChild(source2);

				var player = videojs(wrapperVideo, {
					"techOrder": ['flash', 'html5'],
					"preload": 'auto',
					"loop": true,
					plugins: {
//						framebyframe: {
//						  fps: 24,
//						  steps: [
//							{ text: '-5', step: -5 },
//							{ text: '-1', step: -1 },
//							{ text: '+1', step: 1 },
//							{ text: '+5', step: 5 },
//						  ]
//						}
					}
				}, function() {
//					this.hotkeys({
//						volumeStep: 0.1,
//						seekStep: 1,
//						enableMute: true,
//						enableFullscreen: true
//					});
				});
			});
		return;
	}
	//Asset Open Documents selector
	if(extension==='odt'|| extension==='odf' || extension==='odp'|| extension==='ods')
	{
		require(["generic-ui/scripts/assetViewer/vendor/webodf/webodf.js"], function(webodf){
			loadCss('generic-ui/scripts/assetViewer/webodf.css');
            viewport.innerHTML = '';
			var wrapperOpenDoc = document.createElement('div');
			wrapperOpenDoc.setAttribute('id','wrapperOpenDoc');

			viewport.appendChild(wrapperOpenDoc);
		
			function init() {
				var odfelement = document.getElementById("wrapperOpenDoc"),
				odfcanvas = new odf.OdfCanvas(odfelement);
				odfcanvas.load(fileUrl);
			}
			window.setTimeout(init, 0);
		});
		return;
	}
	
	//Asset Pdf selector
	if(extension==='pdf')
	{
		viewport.innerHTML = '';
		var wrapperPdf = document.createElement('iframe');
        wrapperPdf.style.width = '100%';
        wrapperPdf.style.height = '100%';
		wrapperPdf.id = 'viewer';
		wrapperPdf.src = fileUrl;
		viewport.appendChild(wrapperPdf);

		return;
	}
	//Asset Txt selector
	if(extension==='txt')
	{
		var httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', fileUrl, false);
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
                if(httpRequest.status === 200 || httpRequest.status == 0){
                    var textarea = document.createElement('div');
                    textarea.style.width = '100%';
                    textarea.style.height = '100%';
                    textarea.style.overflow = 'auto';
                    textarea.appendChild(document.createTextNode(httpRequest.responseText));
                    textarea.classList.add('fillParent');
                    viewport.appendChild(textarea);
                    textarea.fillParent();
                }
			}
		};
		
		httpRequest.send(null);
		return;
	}
	//Asset Py and others languages selector
	if(extension === 'py' || extension === 'sh' || extension === 'js' || extension === 'json' || extension === 'xml' || extension === 'md')
	{
		require(["generic-ui/scripts/assetViewer/vendor/highlight/highlight.min.js"],
//		require(["scripts/assetViewer/highlight/highlight.pack.js"],	
			function(hljs){
				loadCss('generic-ui/scripts/assetViewer/vendor/highlight/default.min.css');
				loadCss('generic-ui/scripts/assetViewer/vendor/highlight/style.css');
				var httpRequest = new XMLHttpRequest();
				httpRequest.onreadystatechange = function() {
					if (httpRequest.readyState === 4) {
						viewport.innerHTML = '';
						var pre = document.createElement('pre');
						var code = document.createElement('code');
						code.appendChild(document.createTextNode(httpRequest.responseText));
						hljs.highlightBlock(code);
						pre.classList.add('fillParent');
						code.classList.add('fillParent');
						viewport.appendChild(pre);
						pre.appendChild(code);
					}
				};
				httpRequest.open('GET', fileUrl);
				httpRequest.send();
		});
		return;
	}
	
	//Asset Map selector
	if(extension==='csv' || extension==='gpx' || extension==='kml' || extension==='wkt' || extension==='topojson' || extension==='geojson')
	{
		var wrapperMap = document.createElement('div');
		wrapperMap.id = map;
		wrapperMap.style.height = '100%';
		viewport.appendChild(wrapperMap);
		
		var map = L.map('map').setView([43.300, 5.367], 12);

		return;
	}
	
		//Asset nonviewable selector 
//	if(extension === 'blend' || extension === 'max' || extension === 'zip' || extension === 'rar' || extension === 'rfa' || extension === 'dxf' || extension === 'docx' || extension === 'doc' || extension === 'xls' || extension === 'xlsx' || extension === 'ma')
	else
	{	
		viewport.innerHTML = '';
		var wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'noviewer');
        var content = document.createElement('div');

		var txt1 = document.createElement('div');
		txt1.style.paddingBottom = '10px';
		txt1.innerHTML = '<strong>' + extension + '</strong> format not viewable';
		
		var wrapperIcon = document.createElement('div');
		wrapperIcon.style.display = 'block';
		wrapperIcon.style.marginLeft = 'auto';
		wrapperIcon.style.marginLRight = 'auto';
		wrapperIcon.style.paddingBottom = '10px';
		var iconFile = document.createElement('i');
		iconFile.setAttribute('class', 'fa fa-file-o fa-3x');
		wrapperIcon.appendChild(iconFile);
		
		var btDown = document.createElement('a');
		btDown.setAttribute('class', 'assetD');
        btDown.style.textDecoration = 'none';
        btDown.style.color = '#000';
		btDown.href = fileUrl;
		var iconDown = document.createElement('i');
		iconDown.setAttribute('class', 'fa fa-download');
		var txtDown = document.createElement('span');
        txtDown.style.paddingLeft = '6px';
		txtDown.innerHTML = 'Download';
		btDown.appendChild(iconDown);
		btDown.appendChild(txtDown);
		content.appendChild(txt1);
		content.appendChild(wrapperIcon);
		content.appendChild(btDown);
        
        wrapper.appendChild(content);
		viewport.appendChild(wrapper);
		
		return;
	}
}
