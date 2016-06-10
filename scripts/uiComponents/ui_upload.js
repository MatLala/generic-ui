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

comUpload = (function(container){
    // To do : Connect upload damas-flow fonctions 
    damasflow_ondrop = function ( e )
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
                //var elem = damas.read_rest(parseInt(id));
                damas.utils.command_a( {cmd: 'graph', id: id }, function(res){
                    graph.load( JSON.parse( res.text ));
                });
                return;
            }
        }

        var newPath= processPath(path);

        if(!newPath){
            newPath=path;
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
                var newHash = getHash();
                if(!newHash.graph) newHash.graph = res[0];
                else newHash.graph += ',' + res[0];
                doHash(newHash);
                damas.graph( res[0], function(res){
                    graph.load(res);
                    //graph.load( JSON.parse( res ));
                });
                if( confirm('Update ' + decodeURIComponent(newPath) + '?'))
                {
                    upload_rest(e.dataTransfer.files[0],newPath, res[0], function(node){
                    });
                }
            }
            else
            {
                if( newPath = prompt('Publish as', newPath))
                {
                    upload_rest(e.dataTransfer.files[0],newPath, null, function(node){
                        graph.newNode(node);
                    });
                }
            }
        });
        return;
    }

    var zoneDrop = document.createElement('div');
    zoneDrop.className = 'testdrop';
    container.appendChild(zoneDrop);

    zoneDrop.ondrop = damasflow_ondrop;

});