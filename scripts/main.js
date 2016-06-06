require.config({
    paths:{
        'damas':"damas",
        'ui_components':"uiComponents/ui_components"
    },
    urlArgs: "v=" + (new Date()).getTime()
});

require(["damas", "ui_components"], function(damas){
    loadCss("scripts/uiComponents/ui.css");
    loadCss("scripts/uiComponents/ui_design.css");
    window.damas = damas;
    damas.server = '/api/';
    
    ui.header();
    ui.contentsHome();
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
            ui.contentsHome();
        }
    }
    if (/#profile/.test(hash)){
        if (!document.querySelector('#profileContent')){
           ui.modal(ui.profile());
        }
    }
    if (/#settings/.test(hash)){
        if (document.querySelector('#modalContent')){
            var modalContent = document.querySelector('#modalContent');
            modalContent.innerHTML = '';
            modalContent.appendChild(ui.settings());
        }
        else {
            ui.modal(ui.settings());
        }
    }
    if (/#upload/.test(hash)){
        ui.modal(ui.upload());
    }
    if (/view=/.test(hash)){
        ui.assetOverlay();
        var filepath = viewHashNode();
        console.log(filepath);
//        damas.search('file:'+filepath, function(index){
//            damas.read(index, function(node){
//                var newObject = JSON.parse(JSON.stringify(node[0]));
//                newObject.file = "/file/"+newObject.file;
//                console.log(node);
//                assetOverlay(newObject);
//            });
//        });
    }
    if (/#search=/.test(hash)){
        if (document.querySelector('.showAssetOverlay')){
            var overlayDiv = document.querySelector('#assetOverlay');
            overlayDiv.classList.remove('showAssetOverlay');
            overlayDiv.classList.add('hideAssetOverlay');
        }
        var searchTerms = hash.replace('#search=','');
        var out = document.querySelector('#panelPrincipal');
        out.innerHTML = '';
        ui.contentsResults();
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