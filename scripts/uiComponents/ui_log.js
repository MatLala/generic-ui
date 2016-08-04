(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['socket.io/socket.io'], factory);
	} else if (typeof module === 'object' && module.exports) { // Node
        module.exports = factory(require('socket.io-client'));
    } else { // Browser globals
        root.returnExports = factory(root.io);
    }
}(this, function (io) {
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
            nbElements = 100;
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
                var container = document.querySelector('#contents');
                compLog(container);
            }
        };

        window.addEventListener('hashchange', function(event){
            hashLog();
        });

        var container = document.querySelector('#panelPrincipal');
//        var container = document.querySelector('#contents');

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
            var tbody = document.createElement('tbody');
            
            table.className = 'log';

            th1.innerHTML = 'time';
            th2.innerHTML = 'file';
            th3.innerHTML = 'comment';
            
            th1.style.width = '15ex';
            th1.style.width = '15ex';

            var icon = document.createElement('span');
            icon.className = 'sortIcon';
            icon.innerHTML = '&xutri;';
            th1.appendChild(icon);

            table.appendChild(thead);
            thead.appendChild(th1);
            thead.appendChild(th2);
            thead.appendChild(th3);
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

                var time = new Date(parseInt(assets[i].time));
                var file = assets[i].file || assets[i]['#parent'];
                tr.file = file || assets[i]['#parent'];

                td1.setAttribute('title', time);
                td2.setAttribute('title', JSON_tooltip(assets[i]));

                var path = document.createElement('span');
                path.className = 'nomobile';
                var filename = document.createElement('span');
                if (file){
                    path.innerHTML = file.split('/').slice(0,-1).join('/')+'/';
                    filename.innerHTML = file.split('/').pop();
                }    

                td1.innerHTML = ('00'+time.getDate()).slice(-2)+'/'+('00'+time.getMonth()).slice(-2)+' '+('00'+time.getHours()).slice(-2)+':'+('00'+time.getMinutes()).slice(-2)+':'+('00'+time.getSeconds()).slice(-2);
                td3.innerHTML = '&lt;'+assets[i].author+'&gt; '+assets[i].comment;

                td2.appendChild(path);
                td2.appendChild(filename);

                tr.file = assets[i].file || assets[i]['#parent'];


                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                if (require.specified('ui_overlay')){
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

                if (require.specified('ui_editor')){
                    var tdEdit = document.createElement('td');
                    tdEdit.className = 'fa fa-pencil fa-lg clickable';
                    tr.appendChild(tdEdit);
                    tdEdit.addEventListener('click', function(){
    //                    addHash('edit='+this.file);
                        window.location.hash = 'edit='+this.parentNode.file;
                        if (document.querySelector('.selected')){
                           var ro = document.querySelectorAll('.selected')[0];
                            console.log(ro);
//                            ro.className = '';
                            ro.classList.remove('selected');
                        }
                        this.parentNode.className = 'selected';
                    });
                }
                container.appendChild(tr);
            }
        }
    
    if (typeof window !== 'undefined') {
        var address = location.protocol + '//' + location.host;
        var socket = io.connect(address, { path: '/socket.io' });

        window.addEventListener('beforeunload', function (event) {
            socket.close();
        });
    } else {
        // Suppose a local Socket.io server over TLS
        var address = 'wss://0.0.0.0:8443';
        var socket = io.connect(address, {
            path: '/socket.io',
            rejectUnauthorized: false
        });
    }

    socket.on('connect', function () {
        console.log('Connected to the Socket server ' + address);
    });

    socket.on('disconnect', function (reason) {
        console.log('Disconnected: ' + reason);
    });

    socket.on('create', function (nodes) {
        console.log(nodes.length + ' nodes created');
        console.log(nodes);
        var tbody = document.querySelector('tbody');
        nodes.forEach(function(node){
            if (node.time !== undefined && node['#parent'] !== undefined ) {
                var tr = tableLogTr(node);
                tr.style.opacity = '0';
                tbody.insertBefore(tr, tbody.firstChild);
                setTimeout(function() {
                    tr.style.opacity = '1';
                }, 1);
            }
        });
    });

    socket.on('update', function (nodes) {
        console.log(nodes.length + ' nodes updated');
        console.log(nodes);
    });

    socket.on('remove', function (nodes) {
        console.log(nodes.length + ' nodes removed');
        console.log(nodes);
    });

    return socket;
}));