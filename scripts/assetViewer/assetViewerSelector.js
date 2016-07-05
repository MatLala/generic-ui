assetViewerSelector = function (fileUrl, viewport)
{
	var extension = fileUrl.split(".").pop().toLowerCase();

	//Asset picture selector
	if(extension==='png'|| extension==='jpg'|| extension==='jpeg' || extension==='tiff' || extension==='gif'  || extension==='bmp')
	{
		require(["scripts/assetViewer/leafletViewer.js"], function(leafletViewer){
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
		require(["scripts/assetViewer/leafletViewer.js"], function(leafletViewer){
			var img = document.createElement('img');
			img.style.display = 'none';
			img.addEventListener( 'load', function(e){
				viewport.innerHTML = '';
				var w = 32000;
				var w1 = this.width;
				var x = w/w1;
				var h1 = this.height;
				var h = h1*x;
//				leafletViewer(viewport, fileUrl, w, h);
				leafletViewer.initialize(viewport, fileUrl, this.width, this.height);
			});
			img.src = fileUrl;
		});
		return;
	}

	//Asset video selector
	if(extension==='mov' || extension === 'mp4' || extension === 'mkv' || extension === 'avi')
	{
		require(["scripts/assetViewer/vendor/video-js/video-js-4.11.4/video.js"],
			function(videojs){
				loadCss('scripts/assetViewer/vendor/video-js/video-js-4.11.4/video-js.css');
				loadCss('scripts/assetViewer/videojs.css');
	
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
	if(extension === 'flv')
	{
		require(["scripts/assetViewer/vendor/video-js/video-js-4.11.4/video.js"],
			function(videojs){
				loadCss('scripts/assetViewer/vendor/video-js/video-js-4.11.4/video-js.css');
				loadCss('scripts/assetViewer/videojs.css');
			
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
		require(["scripts/assetViewer/vendor/webodf/webodf.js"], function(webodf){
			loadCss('scripts/assetViewer/webodf.css');
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
		wrapperPdf.id = 'viewer';
		wrapperPdf.src = fileUrl;
		viewport.appendChild(wrapperPdf);

		return;
	}
	//Asset Txt selector
	if(extension==='txt')
	{
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				var textarea = document.createElement('textarea');
				textarea.appendChild(document.createTextNode(httpRequest.responseText));
				textarea.classList.add('fillParent');
				viewport.appendChild(textarea);
				textarea.fillParent();
			}
		};
		httpRequest.open('GET', fileUrl);
		httpRequest.send();
		return;
	}
	//Asset Py selector
	if(extension === 'py')
	{
		require(["scripts/assetViewer/vendor/highlight/highlight.min.js"],
//		require(["scripts/assetViewer/highlight/highlight.pack.js"],	
			function(hljs){
				loadCss('scripts/assetViewer/vendor/highlight/default.min.css');
				loadCss('scripts/assetViewer/vendor/highlight/style.css');
				var httpRequest = new XMLHttpRequest();
				httpRequest.onreadystatechange = function() {
					if (httpRequest.readyState === 4) {
						viewport.innerHTML = '';
						//if (httpRequest.status === 200) {
						//var data = JSON.parse(httpRequest.responseText);
						//if (callback) callback(data);
						//alert(httpRequest.responseText);
						var pre = document.createElement('pre');
						var code = document.createElement('code');
						code.appendChild(document.createTextNode(httpRequest.responseText));
						hljs.highlightBlock(code);
						pre.classList.add('fillParent');
						code.classList.add('fillParent');
						//textarea.style.position = 'absolute';
						//textarea.style.top = '0';
						//textarea.style.left = '0';
						//textarea.style.width = '100%';
						//textarea.style.height = '100%';
						viewport.appendChild(pre);
						pre.appendChild(code);
						//pre.fillParent();
						//code.fillParent();
						//viewport.innerHTML = '';
						//}
					}
				};
				httpRequest.open('GET', fileUrl);
				httpRequest.send();
		});
		return;
	}
	
	//Asset nonviewable selector 
	if(extension === 'blend' || extension === 'max' || extension === 'zip' || extension === 'rar' || extension === 'rfa' || extension === 'dxf' || extension === 'docx' || extension === 'doc' || extension === 'xls' || extension === 'xlsx')
	{	
		viewport.innerHTML = '';
		var wrapper = document.createElement('div');
		wrapper.setAttribute('class', 'noviewer');
		var txt1 = document.createElement('div');
		txt1.style.paddingBottom = '10px';
		txt1.innerHTML = 'format <strong>' + extension + '</strong> non visualisable';
		
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
		btDown.href = fileUrl;
		var iconDown = document.createElement('i');
		iconDown.setAttribute('class', 'fa fa-download');
		var txtDown = document.createElement('span');
		txtDown.innerHTML = 'Download';
		btDown.appendChild(iconDown);
		btDown.appendChild(txtDown);
		wrapper.appendChild(txt1);
		wrapper.appendChild(wrapperIcon);
		wrapper.appendChild(btDown);
		viewport.appendChild(wrapper);
		
		btDown.addEventListener('click', function(event){
//			$$('iframe.downloadIframe')[0].src = damas.server + "/download.php?file=" + node.keys.get('file');
			
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
}
