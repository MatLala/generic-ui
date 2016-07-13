(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.ui_upload = factory();
	}
}(this, function () {
    loadCss('scripts/uiComponents/ui_upload.css');
    document.addEventListener('DOMContentLoaded', function() {
        initUpload(); 
    });
//    require(['domReady'], function (domReady) {
//        domReady(function () {
//            loadBtUpload(); 
//        });
//    });
    
    /**
    * HTML rendering methods for UI Components inside Layout
    * require damas.js
    */

    
    function initUpload() {
        /**
        * Button for Upload Component
        * Localisation : Header
        */
        var uploadBt = document.createElement('button');
        uploadBt.className = 'uploadBt clickable';
        uploadBt.setAttribute('title', 'Upload');
        uploadBt.innerHTML = 'upload';
    //    document.getElementById('headerRight').appendChild(uploadBt);
        document.getElementById('menubar2').appendChild(uploadBt);

        uploadBt.addEventListener('click', function(ev) {
            var container = ui.modal();
            compUpload(container);
        });
        document.body.ondragover = function(ev){
            ev.stopPropagation();
            ev.preventDefault();
            if (!document.querySelector('.overlayBodyDrop') && !document.querySelector('.modalOverlay')){
                var container = document.createElement('div');
                container.className = 'overlayBodyDrop';
                compUpload(container);
                var containerClose = document.createElement('div');
                containerClose.className = 'fa fa-close fa-2x btClose clickable';
//                containerClose.innerHTML = 'X';
                containerClose.addEventListener('click', function(){
                    container.remove();
                });
                container.appendChild(containerClose);
                this.appendChild(container);
                
                container.ondragleave = function(ev){
                    ev.preventDefault();
                    ev.stopPropagation();
                    document.querySelector('.overlayBodyDrop').remove();
                };
            }
        };
    }
    
    /**
    * Generate Component : Upload
    * 
    */
    compUpload = function(container){
        if (navigator.userAgent.indexOf("Firefox") > 0){
            
            if (document.getElementById('modalHeader')){
                var modalHeader = document.getElementById('modalHeader');
                modalHeader.innerHTML = 'Upload Module';
            }

            var workdirsList = document.createElement('div');
            workdirsList.className = 'workdirsList';
            workdirsList.innerHTML = 'Current Work Directories :';
            container.appendChild(workdirsList);
            
            var workdirs = localStorage.getItem('workdirs');
            console.log(workdirs);
            workdirs = JSON.parse(workdirs);
            for (var i=0; i < workdirs.length; i++){
                var workdirDiv = document.createElement('div');
                var workdirTxt = document.createElement('div');
                workdirTxt.innerHTML = decodeURIComponent(workdirs[i]);
                var workdirDelete = document.createElement('i');
                workdirDelete.className = 'fa fa-close clickable workdirDel';
                workdirDelete.setAttribute('title', 'Delete');
                workdirDiv.appendChild(workdirDelete);
                workdirDiv.appendChild(workdirTxt);
                workdirsList.appendChild(workdirDiv);
            }
            var workdirDel = document.querySelectorAll('.workdirDel');
            for (var i=0; i < workdirDel.length; i++){
            workdirDel[i].addEventListener('click', function(e){
                if(confirm('Delete this work directory ?\n'+this.nextSibling.innerHTML)){
                    console.log(this.nextSibling.innerHTML);
                    removeWorkdirs('"'+this.nextSibling.innerHTML+'"');
                    this.parentNode.remove();
                }
            });
            }
            
            var zoneDrop = document.createElement('div');
            zoneDrop.className = 'dropZone';

            container.appendChild(zoneDrop);
            
            zoneDrop.ondragover = function(ev){
                ev.preventDefault();
                ev.stopPropagation();
                this.classList.add("dragover");
            };
            zoneDrop.ondragleave = function(ev){
                ev.preventDefault();
                this.classList.remove("dragover");
            };
            zoneDrop.ondrop = function(ev){
                container.innerHTML = '';
                container.style.textAlign = 'center';
                damasflow_ondrop(ev, container);
            }
        }
        else {
            container.style.textAlign = 'center';
            container.innerHTML = 'Upload works only with Firefox,<br>please use Firefox !';
            container.ondrop = function(ev){
                ev.preventDefault();
                ev.stopPropagation();
            };
        }
    //    document.getElementById('modalHeader').innerHTML = 'Upload';
    };

    damasflow_ondrop = function ( e, container )
    {
        if (document.querySelector('.modalOverlay')){
            document.querySelector('.modalOverlay').remove();
        }
        if (document.querySelector('.overlayBodyDrop')){
            document.querySelector('.overlayBodyDrop').remove();
        }
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
        if (e.dataTransfer.files){
            var file = e.dataTransfer.files[0];
        }

        var path;
        if (keys['text/x-moz-url'])
            path = keys['text/x-moz-url'];
        if (keys['text/plain'])
            path = keys['text/plain'].trim();

        console.log(path);
        if(!path)
        {
            alert('Could not determine the path for the file ' + e.dataTransfer.files[0].name +': Drop aborted' );
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
                return;
            }
        }

        var newPath= processPath(path);

        if(!newPath){
            newPath=path;
            var newWd=prompt("New source directory detected.\nSet and accept this new workdir to continue",path.replace(/\/[^\/]*$/,""));
            if(newWd){
                addWorkdirs(newWd);
                newPath= path.replace(new RegExp("^"+newWd+"/?"), '');
            }
            else
            {   
                if (document.body.classList.contains("dragover"))
                    document.body.classList.remove("dragover");
                return;
            }
        }
        if(newPath.indexOf("/")!=0)
            newPath= "/"+newPath;

        damas.search_rest('_id:'+newPath, function(res){
            if(res.length>0)
            {
                var comment = prompt("Upload new version\n\nFile : "+decodeURIComponent(newPath) +
                    "\nSize : "+ human_size(file.size)+
//                    "\n\nWork dir : "+ findWorkdir(path)+
                    "\n\nOrigin : "+ path+
//                    "\nDestination : "+ newPath.replace(file.name, '')+
                    "\n\nComment :", 'new version');
                if( comment !== null)
                {
                    upload_rest(e.dataTransfer.files[0],newPath, res[0], comment, function(node){
                    });
                }
                else {
                    if (document.body.classList.contains("dragover"))
                        document.body.classList.remove("dragover");
                }
            }
            else
            {
                var comment = prompt("Upload new file\n\nFile : "+ decodeURIComponent(newPath) +
                    "\nSize : "+ human_size(file.size)+
//                    "\n\nWork dir : "+ findWorkdir(path)+
                    "\n\nOrigin : "+ path+
//                    "\nDestination : "+ newPath.replace(file.name, '')+
                    "\n\nComment :", 'initial import');
                if( comment !== null)
                {
                    upload_rest(e.dataTransfer.files[0],newPath, null, comment, function(node){
                    });
                }
                else {
                    if (document.body.classList.contains("dragover"))
                        document.body.classList.remove("dragover");
                }
            }
        });
        return;
    }

    upload_rest = function ( file, path, id, comment, callback )
    {
        if (document.body.classList.contains("dragover"))
            document.body.classList.remove("dragover");
        
        var req = new XMLHttpRequest();
        var fd = new FormData();
        fd.append('path', path);
        fd.append('comment', comment);
        fd.append('id', id);
        fd.append('file', file);
        if(!document.getElementById('upload_div')){
            var upload_div = document.createElement('div');
            upload_div.id = 'upload_div';
            var table = document.createElement('table');
            table.id = 'upload_table';
            upload_div.appendChild(table);
            var contents = document.getElementById('contents');
            document.body.insertBefore(upload_div, contents);
        }
        else {
            var upload_div = document.getElementById('upload_div');
            var table = document.getElementById('upload_table');
        }
        var tr = document.createElement('tr');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
        var td3 = document.createElement('td');
        var td4 = document.createElement('td');

        var fileName = document.createElement('div');
        fileName.innerHTML = decodeURIComponent(path);
        td3.appendChild(fileName);

        var progress= document.createElement('progress');

        var uploadInfos = document.createElement('div');
        var speed = document.createElement('span');
        var stats= document.createElement('span');
        var cancel= document.createElement('div');
        speed.style.paddingLeft = '6px';

        uploadInfos.appendChild(stats);
        uploadInfos.appendChild(speed);

        td2.appendChild(progress);
        td4.appendChild(uploadInfos);
        td1.appendChild(cancel);
        td1.style.textAlign = 'center';

        speed.setAttribute("id","speed");
        progress.setAttribute("id",'progressBar');
        stats.setAttribute("id",'stats');
        cancel.setAttribute("id",'cancel');
        cancel.className = 'fa fa-close fa-lg clickable';
        cancel.setAttribute('title', 'Cancel');

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);

        cancel.addEventListener("click",function(e){
            tr.remove();
            if (table.childElementCount === 0){
                upload_div.remove();
            }
        });
            
        var d = new Date();
        var starttime = oldtime = d.getTime();
        progress.value = 0;
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
            var total = e.total;
            progress.max = total;
            var delta_size = e.loaded - progress.value;
            var d = new Date();
            var delta_time = d.getTime() - oldtime;
            oldtime = d.getTime();
            var tempSpeed=(( delta_size * 1000 / delta_time )) * 100;
            speed.innerHTML=human_size((tempSpeed) / 100) +'/s';
            progress.value = e.loaded;
            stats.innerHTML = e.loaded + '/' + total + ' (' + Math.ceil( e.loaded * 100 / total ) + '%)';
        };
        req.onreadystatechange = function(e){
            if(req.readyState == 4)
            {
                if(req.status === 201)
                {
                    var d = new Date();
                    var delta_time = d.getTime() - starttime;
                    speed.innerHTML= human_size( progress.max * 1000 / delta_time ) + '/s' ;
                    //setTimeout("500",function({upload_div.remove();}));
                    //        callback(JSON.parse(req.responseText));
                    cancel.setAttribute('title', 'Remove');
                }
                if(req.status === 500)
                {
                    alert(req.responseText);
                }
            }
        }
        req.send(fd);
    }
    
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
        console.log(wd);
        var workdirs=JSON.parse(localStorage["workdirs"]);
        var index=workdirs.indexOf(wd);
        if(index !== 0){
            workdirs.splice(wd,1);
            console.log(workdirs);
        }
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
    
    function findWorkdir(path) {
        var workdir=confWorkdir.concat(JSON.parse(localStorage["workdirs"]));
        var tempWd=null;
        for(var w=0;w<workdir.length;w++){
            if(workdir[w][workdir[w].length-1]==="/")
                tempWd= workdir[w];
            else
                tempWd= workdir[w]+"/";
            if(path.indexOf(tempWd)===0)
                return workdir[w].replace(path,"");
        }
        return null;
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
}));