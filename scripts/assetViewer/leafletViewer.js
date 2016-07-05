(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['scripts/assetViewer/vendor/leaflet-0.8/leaflet.js'], factory);
    } else {
        // Browser globals
        root.leafletViewer = factory(root.L);
    }
}(this, function (L) {
	loadCss('scripts/assetViewer/vendor/leaflet-0.8/leaflet.css');
	loadCss('scripts/assetViewer/vendor/leaflet-0.8/draw/leaflet.draw.css');
	loadCss('scripts/assetViewer/vendor/leaflet-0.8/fullscreen/Control.FullScreen.css');
//	loadCss('scripts/assetViewer/vendor/leaflet-0.8/mappaint/mappaint.css');

	leafletViewer = function (viewport, url, w, h)
	{
		require( ['scripts/assetViewer/vendor/leaflet-0.8/draw/LetterIcon.js',
                  'scripts/assetViewer/vendor/leaflet-0.8/draw/leaflet.draw-src.js',
//                  'scripts/assetViewer/vendor/leaflet-0.8/mappaint/mappaint.js',
                  'scripts/assetViewer/vendor/leaflet-0.8/fullscreen/Control.FullScreen.js'], function(){

			var node = {};
			viewport.innerHTML = '';
			var minZoom = 0;
			var maxZoom = 0;
			var margin = 30;
				//
				// CHECK IF THE IMAGE MUST BE ZOOMIN OR ZOOMOUT
				//
			if (w > viewport.offsetWidth && h > viewport.offsetHeight)
			{
				if(w / viewport.offsetWidth < h / viewport.offsetHeight)
				{
					minZoom = - Math.log(h / (viewport.offsetHeight - margin)) / Math.log(2);
				}
				else
				{
					minZoom = - Math.log(w / (viewport.offsetWidth - margin )) / Math.log(2);
				}
			}
			else
			{
				if(viewport.offsetWidth / w > viewport.offsetHeight / h)
				{
					maxZoom = Math.log((viewport.offsetHeight - margin) / h) / Math.log(2);
				}
				else
				{
					minZoom = - Math.log((viewport.offsetWidth - margin) / w) / Math.log(2);
				}
			}
			var imageBounds = new L.latLngBounds( L.latLng([h,0]), L.latLng([0,w]));
			map = L.map(viewport, {
				//center: [w/2, h/2],
				fullscreenControl: true,
				fullscreenControlOptions: {
					position: 'topleft'
				},
				trackResize: true,
				minZoom: minZoom,
				maxZoom: maxZoom,
				maxBounds: imageBounds,
				crs: L.CRS.Simple
			});
			map.fitBounds(imageBounds);
			var io = L.imageOverlay(url, imageBounds).addTo(map);
//			map.MapPaint.disable();
//			map.addControl(new MapPaint.SwitchControl());
//			map.MapPaint.saveMethod = function(image, bounds) {
//				
//			}
			map.attributionControl.setPrefix(''); // Don't show the 'Powered by Leaflet' text.
			
			var featureGroup = L.featureGroup().addTo(map);
			var layersControl = L.control.layers();
//			layersControl.addOverlay(featureGroup,'Annotations').addTo(map);
			
			options = {
		//	    position: 'topright',
				draw: {
					polyline: {
						shapeOptions: {
							color: '#00c',
							weight: 10
						}
					},
					polygon: {
						allowIntersection: false, // Restricts shapes to simple polygons
						drawError: {
							color: '#e1e100', // Color the shape will turn when intersects
							message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
						},
						shapeOptions: {
							color: '#00c'
						}
					},
					circle: false, // Turns off this drawing tool
					rectangle: {
						shapeOptions: {
							color: '#00c'
						}
					},
					marker: {

			//				icon: new MyCustomMarker()
			//				icon: new L.LetterIcon(document.querySelectorAll('.leaflet-marker-icon').length,'16')
			//				icon: L.NumberedDivIcon()
					}
				},
				edit: {
					featureGroup: featureGroup //REQUIRED!!
				}
			};
			
//			var drawControl = new L.Control.Draw(options).addTo(map);
		});
		return;	
	}
	return leafletViewer;
}));
