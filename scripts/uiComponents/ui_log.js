(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.compLog = factory();
	}
}(this, function () {
    loadCss('scripts/uiComponents/ui_log.css');
    require(['domReady'], function (domReady) {
        domReady(function () {
            hashLog();
        });
    });
    /**
    * HTML rendering methods for UI Components inside Layout
    * require html container
    * require damas.js
    * call by process_hash function from main.js
    */

    /**
    * Listen specific component Hash
    * 
    */
    function hashLog() {
        nbElements = 20;
        offsetElements = 0;
        var hash = window.location.hash;
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
    };
    
    window.addEventListener('hashchange', function(event){
        hashLog();
    });
    
    var container = document.querySelector('#panelPrincipal');

    container.addEventListener('scroll', function(event){
        event.preventDefault();
        var hash = window.location.hash;
        if (hash === ''){
        if (container.scrollHeight - container.scrollTop === container.clientHeight){
            damas.search_mongo({'time': {$exists:true},'#parent':{$exists:true}}, {"time":-1},nbElements, offsetElements, function(res){
                damas.read(res, function(assets){
                    var tableBody = document.querySelector('#contents tbody');
                    tableLogContent(tableBody, assets);
                    offsetElements += nbElements;
                });
            });
        }
        }
    });

    /**
    * Generate Component : Log Results
    * 
    */

    compLog = (function(container){
        container.innerHTML = '';
        var tableBody = tableLog(container);
        damas.search_mongo({'time': {$exists:true}, '#parent':{$exists:true}}, {"time":-1},nbElements,0, function(res){
            damas.read(res, function(assets){ 
                tableLogContent(tableBody, assets);
                offsetElements += nbElements;
            });
        });
    });

    /**
    * Generate Table
    * 
    */

    function tableLog(container) {
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        var th3 = document.createElement('th');
        var th4 = document.createElement('th');
        var tbody = document.createElement('tbody');

        th1.innerHTML = 'time';
        th2.innerHTML = 'file';
        th3.innerHTML = 'author';
        th4.innerHTML = 'comment';
        
        var icon = document.createElement('span');
        icon.className = 'sortIcon';
        icon.innerHTML = '&xutri;';
        th2.appendChild(icon);

        table.appendChild(thead);
        thead.appendChild(th1);
        thead.appendChild(th2);
        thead.appendChild(th3);
        thead.appendChild(th4);
        table.appendChild(tbody);
        
        container.appendChild(table);
        return tbody;
    }

    /**
    * Generate Table Content
    * 
    */
    function tableLogContent(container, assets) {
        for (var i=0; i<assets.length; i++) {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');

            td2.className = 'clickable';
            
            var time = new Date(parseInt(assets[i].time));
            var file = assets[i].file || assets[i]['#parent'];
            
            
            td1.setAttribute('title', time);
            td2.setAttribute('title', JSON_tooltip(assets[i]));
            
            var path = document.createElement('span');
            path.className = 'nomobile';
            var filename = document.createElement('span');
            if (file){
                path.innerHTML = file.split('/').slice(0,-1).join('/')+'/';
                filename.innerHTML = file.split('/').pop();
            }    

            td1.innerHTML = ('00'+time.getHours()).slice(-2)+':'+('00'+time.getMinutes()).slice(-2)+':'+('00'+time.getSeconds()).slice(-2);
            td3.innerHTML = assets[i].author;
            td4.innerHTML = assets[i].comment;
            
            td2.appendChild(path);
            td2.appendChild(filename);
            
            tr.file = assets[i].file || assets[i]['#parent'];
            

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            
            if (require.specified('ao')){
                var tdViewer = document.createElement('td');
                tdViewer.className = 'fa fa-eye fa-lg clickable';
                tr.appendChild(tdViewer);
                tdViewer.addEventListener('click', function(){
//                    addHash('edit='+this.file);
                    window.location.hash = 'view='+this.parentNode.file;
                    if (document.querySelector('.selected')){
                        document.querySelector('.selected').classList.remove('selected');
                    }
                    this.parentNode.className = 'selected';
                });
            }
            
            if (require.specified('editor')){
                var tdEdit = document.createElement('td');
                tdEdit.className = 'fa fa-pencil fa-lg clickable';
                tr.appendChild(tdEdit);
                tdEdit.addEventListener('click', function(){
//                    addHash('edit='+this.file);
                    window.location.hash = 'edit='+this.parentNode.file;
                    if (document.querySelector('.selected')){
                        document.querySelector('.selected').classList.remove('selected');
                    }
                    this.parentNode.className = 'selected';
                });
            }
            container.appendChild(tr);
        }
    }
}));