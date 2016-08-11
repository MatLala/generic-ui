(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.compLog = factory();
	}
}(this, function () {
    loadCss('generic-ui/scripts/uiComponents/ui_overlay.css');
    require(['domReady', 'scripts/assetViewer/assetViewerSelector.js'], function (domReady, assetViewerSelector) {
        domReady(function () {
            hashViewer();
        });
    });
    window.addEventListener('hashchange', function(event){
        hashViewer();
    });
    /**
    * HTML rendering methods for UI Components inside Layout
    * require html container
    * require damas.js
    * call by process_hash function from main.js
    */
    function hashViewer() {
        var hash = window.location.hash;
        if (/view=/.test(hash)){
            // require assetViewer Repository
            var filepath = decodeURIComponent(viewHashNode());
            var viewerContainer = assetOverlay();
            overlayHeader(filepath);
            assetViewerSelector(filepath, viewerContainer)
        }
    }

    assetOverlay = function(){
        if(!document.getElementById('assetOverlay'))
        {
            assetOverlayDraw();
        }
        //Div to integrate before (in .html file ?)
        var assetOverlay = document.getElementById('assetOverlay');
        var assetMain_viewer = document.getElementById('assetMain_viewer');
        assetOverlay.classList.remove('hideAssetOverlay');
        assetOverlay.classList.add('showAssetOverlay');
        return assetMain_viewer;
    }

    assetOverlayDraw = function(){
        var assetOverlay = document.createElement('div');
        assetOverlay.setAttribute('id', 'assetOverlay');
        assetOverlay.setAttribute('class', 'hideAssetOverlay');
        var assetContent = document.createElement('div');
        assetContent.setAttribute('id', 'assetContent');
        assetContent.setAttribute('class', 'assetContent');
        var assetMain = document.createElement('div');
        assetMain.setAttribute('id', 'assetMain');
        assetMain.setAttribute('class', 'assetMain');
        var assetHeader = document.createElement('div');
        assetHeader.setAttribute('id', 'assetHeader');
        var assetTitle = document.createElement('div');
        assetTitle.setAttribute('class', 'assetTitle');
        var assetMain_viewer = document.createElement('div');
        assetMain_viewer.setAttribute('id', 'assetMain_viewer');
        assetMain_viewer.setAttribute('class', 'assetMain_viewer');
        var assetPanel = document.createElement('div');
        assetPanel.setAttribute('id', 'assetPanel');
        assetPanel.setAttribute('class', 'assetPanel');
        var assetBts = document.createElement('div');
        assetBts.setAttribute('class', 'assetBts');


        var closeAssetOverlay = document.createElement('div');
        closeAssetOverlay.setAttribute('id', 'closeAssetOverlay');
        closeAssetOverlay.setAttribute('class', 'fa fa-close fa-lg clickable');
//        closeAssetOverlay.innerHTML = 'X';
        assetHeader.appendChild(closeAssetOverlay);

        closeAssetOverlay.addEventListener( 'click', function(event){
            var assetOverlay = document.getElementById('assetOverlay');
            assetOverlay.classList.remove('showAssetOverlay');
            assetOverlay.classList.add('hideAssetOverlay');
            // to remove from here
            if(window['map']) map.remove();
            var assetHeader = document.getElementById('assetHeader');
            var assetMain_viewer = document.getElementById('assetMain_viewer');
            document.getElementById('assetHeader').querySelector('.assetTitle').innerHTML = '';
            document.getElementById('assetHeader').querySelector('.assetBts').innerHTML = '';
            assetMain_viewer.innerHTML = '';
            assetMain_viewer.removeAttribute('class');
            var closeEvent = new CustomEvent( "assetOverlay:close");
            document.dispatchEvent(closeEvent);

            return;
        });

        assetHeader.appendChild(assetTitle);
        assetHeader.appendChild(assetBts);
        assetMain.appendChild(assetMain_viewer);
        assetContent.appendChild(assetMain);
        assetContent.appendChild(assetPanel);
        assetOverlay.appendChild(assetHeader);
        assetOverlay.appendChild(assetContent);

        document.body.appendChild(assetOverlay);
    }
    document.addEventListener("assetOverlay:close", function(){
//        if (document.getElementById('contents').children.length > 0){
            var n = window.location.hash;
            var splitH = n.split('view=');
            splitH.pop();
            history.pushState({}, null, splitH);
//        }
//        else {
//            previousHash();
//        }
            
    }, false);


    /**
    * Header for overlay Component
    * 
    */
    overlayHeader = function(filepath){
        var assetTitle = assetHeader.querySelector('.assetTitle');
        var assetBts = assetHeader.querySelector('.assetBts');

        var assetLabel = document.createElement('div');
        assetLabel.setAttribute('class', 'assetLabel');
        assetTitle.appendChild(assetLabel);
        //    assetLabel.innerHTML = json.file.split('/').pop();
        assetLabel.innerHTML = filepath;
    };
}));