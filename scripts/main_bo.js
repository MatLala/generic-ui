require.config({
    paths:{
        'damas':"damas",
        'domReady':"vendor/domReady",
        'utils':"utils",
        'ui_layout':"uiLayout/ui_layout",
        'log':"uiComponents/ui_log",
        'search':"uiComponents/ui_search",
        'editor':"uiComponents/ui_editor",
        'ao':"uiComponents/ui_overlay",
        'upload':"uiComponents/ui_upload"
    },
    urlArgs: "v=" + (new Date()).getTime()
});

require(["damas", "domReady", "utils", "ui_layout", "log", "search", "editor", "ao", "upload"], function(damas, domReady){
    loadCss("scripts/uiLayout/ui_layout.css");
    loadCss("scripts/uiLayout/ui_design.css");
    loadCss("scripts/vendor/font-awesome-4.6.3/css/font-awesome.min.css");
    window.damas = damas;
    damas.server = '/api/';

    if (localStorage) {
        damas.token = localStorage.getItem("token");
        damas.user = JSON.parse(localStorage.getItem("user"));
    }
    damas.verify(function(res) {
        if (!res) {
            window.location.hash = '#login';
        }
    });
});

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
        if (/(view|edit)=/.test(splitHash[i])){
            var filepath = splitHash[i].replace(/.*=/,'');
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
