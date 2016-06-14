require.config({
    paths:{
        'damas':"damas",
        'ui_layout':"uiLayout/ui_layout",
        'ui_common':"uiComponents/ui_common",
        'log':"uiComponents/ui_log",
        'search':"uiComponents/ui_search",
        'upload':"uiComponents/ui_upload",
        'profile':"uiComponents/ui_profile",
        'editor':"uiComponents/ui_editor"
    },
    urlArgs: "v=" + (new Date()).getTime()
});

require(["damas", "ui_layout", "ui_common", "log", "search", "upload", "profile", "editor"], function(damas){
    loadCss("scripts/uiLayout/ui_layout.css");
    loadCss("scripts/uiLayout/ui_design.css");
    loadCss("scripts/uiComponents/ui_components.css");
    window.damas = damas;
    damas.server = '/api/';
    
    process_hash();
});

/**
* @Define Routing for user interface
*/
 window.addEventListener('hashchange', function(event){
    process_hash();
});

process_hash = function(){
    var hash = window.location.hash;
    console.log(hash);
    if (hash === ''){
        if (document.querySelector('.modalOverlay')){
            var modalOverlay = document.querySelector('.modalOverlay');
            modalOverlay.remove();
        }
        if (document.querySelector('.panelSecond')){
            document.querySelector('.panelSecond').remove();
        }
        if (document.querySelector('.showAssetOverlay')){
            var assetOverlay = document.getElementById('assetOverlay');
            assetOverlay.classList.remove('showAssetOverlay');
            assetOverlay.classList.add('hideAssetOverlay');
        }
        if (document.querySelector('.resultsTable')){
            document.querySelector('.resultsTable').remove();
        }
        //Default View
        var container = document.querySelector('#panelPrincipal');
        compLog(container);
    }
    if (/#profile/.test(hash)){
        if (!document.querySelector('#profileContent')){
            var container = ui.modal();
            compProfile(container);
        }
    }
    if (/#settings/.test(hash)){
        if (document.querySelector('#modalContent')){
            var container = document.querySelector('#modalContent');
            container.innerHTML = '';
        }
        else {
            var container = ui.modal();
        }
        compSettings(container);
//        container.appendChild(ui.settings());
    }
    if (/#upload/.test(hash)){
        var container = ui.modal();
        compUpload(container);
    }
    if (/view=/.test(hash)){
        
        // require assetViewer Repository
        var filepath = viewHashNode();
        console.log(filepath);
        damas.search('file:'+filepath, function(index){
            damas.read(index, function(node){
                var newObject = JSON.parse(JSON.stringify(node[0]));
                newObject.file = "/file/"+newObject.file;
                console.log(node);
                ui.assetOverlay(newObject);
            });
        });
    }
    if (/#search=/.test(hash)){
        if (document.querySelector('.showAssetOverlay')){
            var overlayDiv = document.querySelector('#assetOverlay');
            overlayDiv.classList.remove('showAssetOverlay');
            overlayDiv.classList.add('hideAssetOverlay');
        }
        var searchTerms = hash.replace('#search=','');
        
        var container = document.querySelector('#panelPrincipal');
        container.innerHTML = '';
        console.log(searchTerms);
        compSearch(container, searchTerms);
    }
    if (/edit=/.test(hash)){
        if (!document.querySelector('.panelSecond')) {
            var container = ui.secondPanel();
            compEditor(container);
        }   
    }
}

function addHash(hash){
    var currentHash = window.location.hash;
    var splitHash = currentHash.split('&');
    var arr = [];
    for (var i=0; i<splitHash.length; i++){
        if (splitHash[i] !== ''){
            arr.push(splitHash[i]);
        }
    }
    arr.push(hash);
    window.location.hash = arr.join('&');
}

function previousHash(){
    var currentHash = window.location.hash;
    var splitHash = currentHash.split('&');
    splitHash.pop();
    window.location.hash = splitHash.join('&');
}

function viewHashNode(){
    var currentHash = window.location.hash;
    var nHash = currentHash.substr(1);
    var splitHash = nHash.split('&');
    for (var i=0; i<splitHash.length; i++){
        if (/view=/.test(splitHash[i])){
            var filepath = splitHash[i].replace('view=','');
            return filepath;
        }
    }
}

function doHash(obj){
	var arr = [];
	for (key in obj) {
		arr.push(key + '=' + obj[key]);
	}
	window.location.hash = arr.join(',');
}

function loadCss(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

window.loadCss = loadCss;