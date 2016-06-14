/**
* HTML rendering methods for UI Components inside Layout
* require html container
* require damas.js
* call by process_hash function from main.js
*/


/**
* Button for Upload Component
* Localisation : Header
*/
var uploadBt = document.createElement('a');
uploadBt.className = 'uploadBt clickable';
uploadBt.setAttribute('title', 'Upload');
document.getElementById('headerRight').appendChild(uploadBt);

uploadBt.addEventListener('click', function(event) {
    window.location.hash = '#upload';
//        addHash('upload');
});

/**
* Generate Component : Upload
* 
*/
compUpload = (function(container){

// In progress : Connect upload damas-flow functions 
    
    var zoneDrop = document.createElement('div');
    zoneDrop.className = 'testdrop';
    
    container.appendChild(zoneDrop);
    
    zoneDrop.ondragover = function(ev){
        ev.preventDefault();
        this.classList.add("dragover");
    };
    zoneDrop.ondragleave = function(ev){
        ev.preventDefault();
        this.classList.remove("dragover");
    };

    zoneDrop.ondrop = function(ev){
//        this.classList.remove("dragover");
        container.innerHTML = '';
        container.style.textAlign = 'center';
        damasflow_ondrop(ev, container);
    }
});

/**
* damas-flow functions 
*/

var confWorkdir = (JSON.parse(loadConfJSON())).workdirs;
console.log(confWorkdir);

if(!localStorage['workdirs'])
	localStorage['workdirs']='[]';

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            //if (httpRequest.status === 200) {
            var data = JSON.parse(httpRequest.responseText);
            if (callback) callback(data);
            //}
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

function loadConfJSON() {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', 'conf.json', false);
	xobj.send(null);
	return xobj.responseText;
}

function removeWorkdirs(wd){
	var workdirs=JSON.parse(localStorage["workdirs"]);
	var index=workdirs.indexOf(wd);
	if(workdirs[wd])
		workdirs.splice(wd,1);
	localStorage["workdirs"]=JSON.stringify(workdirs);
	console.log(localStorage["workdirs"]);
}

function addWorkdirs(wd){
	var workdirs=JSON.parse(localStorage["workdirs"]);
	workdirs.push(wd);
	localStorage["workdirs"]=JSON.stringify(workdirs);
	console.log(localStorage["workdirs"]);
}

function processPath(path){
	var workdir=confWorkdir.concat(JSON.parse(localStorage["workdirs"]));
	var tempWd=null;
	workdir.sort(function(a, b){
		return b.length - a.length;
	});
	for(var w=0;w<workdir.length;w++){
		if(workdir[w][workdir[w].length-1]==="/")
			tempWd= workdir[w];
		else
			tempWd= workdir[w]+"/";
		if(path.indexOf(tempWd)===0)
			return path.replace(tempWd,"");
	}
	return null;
}

damasflow_ondrop = function ( e, container )
{
    //alert('COMING SOON :) Drop your assets and connect them, in this web page');
    e.stopPropagation();
    if(e.preventDefault) e.preventDefault();

    // DEBUG START
    console.log(e.dataTransfer);
    console.log(e.dataTransfer.files);
    if(e.dataTransfer.types)
    {
        var keys = {};
        for(i=0;i<e.dataTransfer.types.length;i++)
        {
            keys[e.dataTransfer.types[i]] = e.dataTransfer.getData(e.dataTransfer.types[i]);
        }
        console.log(keys);
    }
    // END DEBUG

    var path;
    if (keys['text/x-moz-url'])
        path = keys['text/x-moz-url'];
    if (keys['text/plain'])
        path = keys['text/plain'].trim();

    console.log(path);
    if(!path)
    {
        container.innerHTML = 'Could not determine the path for the file ' + e.dataTransfer.files[0].name +': Drop aborted';
        
//        alert('Could not determine the path for the file ' + e.dataTransfer.files[0].name +': Drop aborted' );
        return;
    }

    if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0)
    {
        var text = e.dataTransfer.getData('Text');
        console.log(text);
        if( text.indexOf(window.location.origin) === 0)
        {
            // DROPPED AN EXISTING NODE FROM SAME SERVER
            var r = new RegExp(window.location.origin+'.*#view=');
            var id = parseInt(text.replace(r, ''));
            console.log('Dropped node #' +id);
            //var elem = damas.read_rest(parseInt(id));
//            damas.utils.command_a( {cmd: 'graph', id: id }, function(res){
//                graph.load( JSON.parse( res.text ));
//            });
            return;
        }
    }

    var newPath= processPath(path);

    if(!newPath){
        newPath=path;
//        var alertTxt = document.createElement('div');
//        alertTxt.innerHTML = "This file doesn't appear to be held in a defined local work directory, thus we cannot extract a relative path from its absolute path:<br>"+path+"<br>You can set a workdir now:<br>";
//        var wdTxt = document.createElement('div');
//        var wdInput = document.createElement('input');
//        wdInput.value = path.replace(/\/[^\/]*$/,"");
//        wdTxt.appendChild(wdInput);
//        container.appendChild(alertTxt);
//        container.appendChild(wdTxt);
//        
//        var btCancel = document.createElement('button');
//        btCancel.setAttribute('class','modal-bt');
//        btCancel.innerHTML = 'Cancel';
//        var btOk = document.createElement('button');
//        btOk.setAttribute('class','modal-bt');
//        btOk.innerHTML = 'Ok';
////        var modalFooter = document.getElementById('modal-footer');
//        
//        container.appendChild(btOk);
//        container.appendChild(btCancel);
//        
//        btOk.addEventListener('click', function(){
//            addWorkdirs(wdInput.value);
//            newPath= path.replace(new RegExp("^"+ wdInput.value +"/?"), '');
//            container.innerHTML = '';
//        });
//        btCancel.addEventListener('click', function(){
//            var modalOverlay = document.querySelector('.modalOverlay');
//            modalOverlay.remove();
//            previousHash();
//            return;
//        });
        
        var newWd=prompt("This file doesn't appear to be held in a defined local work directory, thus we cannot extract a relative path from its absolute path:\n"+path+"\nYou can set a workdir now:",path.replace(/\/[^\/]*$/,""));
        if(newWd){
            addWorkdirs(newWd);
            newPath= path.replace(new RegExp("^"+newWd+"/?"), '');
        }
        else
        {
            return;
        }
    }
    if(newPath.indexOf("/")!=0)
        newPath= "/"+newPath;

    //sha1sum(e.dataTransfer.files[0]);

    damas.search_rest('file:'+newPath, function(res){
        if(res.length>0)
        {
            //window.document.location.hash = 'graph='+res[0];
            //damas.get_rest( 'graph/'+res[0], function(res){
            
//            var newHash = getHash();
//            if(!newHash.graph) newHash.graph = res[0];
//            else newHash.graph += ',' + res[0];
//            doHash(newHash);
//            damas.graph( res[0], function(res){
//                graph.load(res);
//                //graph.load( JSON.parse( res ));
//            });
            if( confirm('Update ' + decodeURIComponent(newPath) + '?'))
            {
                upload_rest(e.dataTransfer.files[0],newPath, res[0], function(node){
                });
            }
        }
        else
        {
//            var alertTxt = document.createElement('div');
//            alertTxt.innerHTML = "Publish as : <br>";
//            var newPathTxt = document.createElement('div');
//            newPathTxt.innerHTML = newPath;
//            container.appendChild(alertTxt);
//            container.appendChild(newPathTxt);
//            
//            var btCancel = document.createElement('button');
//            btCancel.setAttribute('class','modal-bt');
//            btCancel.innerHTML = 'Cancel';
//            var btOk = document.createElement('button');
//            btOk.setAttribute('class','modal-bt');
//            btOk.innerHTML = 'Ok';
//    //        var modalFooter = document.getElementById('modal-footer');
//
//            container.appendChild(btOk);
//            container.appendChild(btCancel);
//
//            btOk.addEventListener('click', function(){
//                upload_rest(e.dataTransfer.files[0],newPath, null, function(node){
//                    container.innerHTML='';
//                    var logDiv = document.querySelector('#panelPrincipal');
//                    compLog(logDiv);
////                    graph.newNode(node);
//                });
//                
//            });
//            btCancel.addEventListener('click', function(){
//                var modalOverlay = document.querySelector('.modalOverlay');
//                modalOverlay.remove();
//                previousHash();
//                return;
//            });
            
            if( newPath = prompt('Publish as', newPath))
            {
                upload_rest(e.dataTransfer.files[0],newPath, null, function(node){
//                    graph.newNode(node);
                });
            }
        }
    });
    return;
}

upload_rest = function ( file, path, id, callback )
{
  var req = new XMLHttpRequest();
  var fd= new FormData();
  fd.append('path',path);
  fd.append('id',id);
  fd.append('file', file);
  if(!document.getElementById('upload_div')){
    var upload_div = document.createElement( 'div' );
    var progress= document.createElement('progress');
    var speed = document.createElement('span');
    var stats= document.createElement('span');
    var cancel= document.createElement('button');
    var exit= document.createElement('button');
    upload_div.appendChild(speed);
    upload_div.appendChild(stats);
    upload_div.appendChild(progress);
    upload_div.appendChild(cancel);
    upload_div.appendChild(exit);
    upload_div.setAttribute("id","upload_div");
    speed.setAttribute("id","speed");
    progress.setAttribute("id",'progressBar');
    stats.setAttribute("id",'stats');
    exit.setAttribute("id",'exit');
    cancel.setAttribute("id",'cancel');
    cancel.innerHTML="Cancel";
    exit.innerHTML="X";

    exit.addEventListener("click",function(e){
      upload_div.remove();
    });
    document.getElementById('modalContent').appendChild(upload_div);
  }
  else {
    var cancel= document.getElementById('cancel');
    var progress=document.getElementById('progressBar');
    var speed= document.getElementById('speed');
    var stats= document.getElementById('stats');
  }
  var d = new Date();
  var starttime = oldtime = d.getTime();
  progress.value=0;
  /*req.upload.addEventListener("progress",progressHandler, false);
  req.addEventListener("load", completeHandler, false);*/
  if(id)
    req.open("PUT", damas.server + "upload/", callback !== undefined);
  else
    req.open("POST", damas.server + "upload/", callback !== undefined);
  cancel.addEventListener("click",function(e){
    if(req.readyState<4){
      req.abort();
      req=null;
      speed.innerHTML="---";
      stats.innerHTML="Aborted";
    }
  });
  req.upload.onprogress = function(e) {
    progress.max=e.total;
    var delta_size = e.loaded - progress.value;
    var d = new Date();
    var delta_time = d.getTime() - oldtime;
    oldtime = d.getTime();
    var tempSpeed=(( delta_size * 1000 / delta_time )) * 100;
    speed.innerHTML=human_size((tempSpeed) / 100) +'/s';
    progress.value = e.loaded;
    stats.innerHTML = e.loaded + ' / ' + e.total + ' (' + Math.ceil( e.loaded * 100 / e.total ) + '%)';
  };
  req.onreadystatechange = function(e){
    if(req.readyState == 4)
    {
      if(req.status == 201)
      {
        var d = new Date();
        var delta_time = d.getTime() - starttime;
        speed.innerHTML= human_size( progress.max * 1000 / delta_time ) + '/s' ;
        //setTimeout("500",function({upload_div.remove();}));
//        callback(JSON.parse(req.responseText));
          alert('ok!');
      }
    }
  }
  req.send(fd);
}
human_size = function ( filesize )
{
        var t = typeof filesize;
        if( !( t === 'number' || t === 'string') )
                return "?";
        if (filesize>1024*1024*1024*1024)
                return (filesize/1024/1024/1024/1024).toFixed(2) + " TiB";
        if (filesize>1024*1024*1024)
                return (filesize/1024/1024/1024).toFixed(2) + " GiB";
        if (filesize>1024*1024)
                return (filesize/1024/1024).toFixed(2) + " MiB";
        if (filesize>1024)
                return (filesize/1024).toFixed(2) + " KiB";
        return filesize + " Bytes";
}
