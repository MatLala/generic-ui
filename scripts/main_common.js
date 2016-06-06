/**
* @Define Routing for user interface
*/
 window.addEventListener('hashchange', function(event){
    process_hash();
});

process_hash = function(){
    var hash = window.location.hash;
    console.log(hash);
    switch(hash){
        case '':
            if (document.querySelector('.profileBox')){
                var profileBox = document.querySelector('.profileBox');
                profileBox.remove();
            }
            if (document.querySelector('.modalOverlay')){
                var modalOverlay = document.querySelector('.modalOverlay');
                modalOverlay.remove();
            }
            if (document.querySelector('.resultsTable')){
                document.querySelector('.resultsTable').remove();
                ui.log();
            }
            if (document.querySelector('.editorBox')){
                document.querySelector('.editorBox').remove();
            }
            return ;
//        case '#profile':
////            var headerMenu = document.querySelector('.headerMenu');
//            document.body.appendChild(ui.profile());
//            return ;
//        case '#settings':
//            if (document.querySelector('.modalOverlay')){
//                ui.settings();
//            }
//            else {
//                document.body.appendChild(ui.settings());
//            }
//            return ;
//        case '#upload':
//            ui.upload();
//            return ;
        case '#edit':
            return ;
    }
    if (/#edit=/.test(hash)){
        if (!document.getElementById('editorBox'))
           ui.editor();
    }
    if (/#profile/.test(hash)){
        if (!document.querySelector('.profileBox')){
           ui.profile();
        }
    }
    if (/#settings/.test(hash)){
        ui.settings();
    }
    if (/#upload/.test(hash)){
        ui.upload();
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
//        if (document.querySelector('.showAssetOverlay')){
//            var overlayDiv = document.querySelector('#assetOverlay');
//            overlayDiv.classList.remove('showAssetOverlay');
//            overlayDiv.classList.add('hideAssetOverlay');
//        }
        var searchTerms = hash.replace('#search=','');
        var out = document.querySelector('#listBox');
        out.innerHTML = '';
        ui.results();
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


