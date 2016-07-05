(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.compSearch = factory();
	}
}(this, function () {
    loadCss('scripts/uiComponents/ui_search.css');
    require(['domReady'], function (domReady) {
        domReady(function () {
            hashSearch(); 
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
    function hashSearch() {
        sortBy = 'file';
        order = 1;

        var hash = window.location.hash;
        if (/search=/.test(hash)) {
            if (document.querySelector('.showAssetOverlay')){
                var overlayDiv = document.querySelector('#assetOverlay');
                overlayDiv.classList.remove('showAssetOverlay');
                overlayDiv.classList.add('hideAssetOverlay');
            }
            var searchTerms = hash.replace(/#search=([^&]*).*/,'$1');
            var container = document.querySelector('#panelPrincipal');
            console.log(searchTerms);
            container.innerHTML = '';
            var tableBody = tableSearch(container, searchTerms);   
            tableSearchSort(tableBody, searchTerms, sortBy, order);
            var thead = document.getElementsByName(sortBy)[0];
            sortIcon('up', thead);
        }
    };

    window.addEventListener('hashchange', function(event){
        hashSearch();
    });

    /**
    * Generate Component : Search Results
    * 
    */

    function tableSearchSort(container, terms, sortBy, order){
        var nbElements = 20;
        offsetElements = 0;
        sortBy = sortBy;
        order = order;

        var sort = {};
        sort[sortBy] = order;

        damas.search_mongo({'file': 'REGEX_'+terms+'.*'}, sort, nbElements, offsetElements, function(res){
            damas.read(res, function(assets){
                container.innerHTML = '';
                tableSearchContent(container, assets);
                offsetElements += nbElements;
            });
        });
    };

    var container = document.querySelector('#panelPrincipal');
    container.addEventListener('scroll', function(event){
        var hash = window.location.hash;
        if (/search=/.test(hash)) {
            event.preventDefault();
            if (container.scrollHeight - container.scrollTop === container.clientHeight){
                var sort = {};
                sort[sortBy] = order;
                var searchTerms = hash.replace(/#search=([^&]*).*/,'$1');
                damas.search_mongo({'file': 'REGEX_'+searchTerms+'.*'}, sort, nbElements, offsetElements, function(res){
                    damas.read(res, function(assets){
                        var tableBody = document.querySelector('#contents tbody');
                        tableSearchContent(tableBody, assets);
                        offsetElements += nbElements;
                    });
                });
            }
        }
    });

    /**
    * Input and button (for mobiles) elements for Search Component
    * Localisation : Header
    */
    var searchForm = document.createElement('form');
    searchForm.className = 'searchForm';
    var searchInput = document.createElement('input');
    searchInput.className = 'searchInput';
    searchInput.setAttribute('type', 'search');
    searchInput.setAttribute('name', 'search');
    searchInput.setAttribute('results', '10');
    searchInput.setAttribute('placeholder', 'Search');
    searchInput.setAttribute('autocomplete', 'on');
    var searchReset = document.createElement('div');
    searchReset.className = 'searchReset clickable';
    searchReset.innerHTML = 'X';
    searchReset.addEventListener('click', function(){
        searchInput.value = '';
        document.location.hash = '';
    });
    searchForm.appendChild(searchInput);
    searchForm.appendChild(searchReset);

    var searchBt = document.createElement('a');
    searchBt.className = 'searchBt clickable';
    searchBt.innerHTML = '&bigodot;';
    searchBt.setAttribute('title', 'Search');

    document.getElementById('headerCentral').appendChild(searchForm);
    document.getElementById('headerCentral').appendChild(searchBt);

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (searchInput.value.length > 0 && window.location.hash !== searchInput.value) {
            window.location.hash = '#search='+searchInput.value;
        }
        if (searchInput.value.length === 0) {
            document.location.hash = '';
        }
    });
    //searchForm.addEventListener('keyup', function(event) {
    //    event.preventDefault();
    //    if (searchInput.value.length > 0 && window.location.hash !== searchInput.value) {
    //        
    //    }
    //});
    searchBt.addEventListener('click', function(){
        searchForm.style.display = 'inline-block';
        searchBt.style.display = 'none';
        searchReset.addEventListener('click', function(){
            searchForm.style.display = 'none';
            searchBt.style.display = 'block';
        });
    });

    /**
    * Generate Component : Search Results
    * 
    */
    //compSearch = (function(container, terms){
    //    
    //    container.innerHTML = '';
    //    var tableBody = tableSearch(container, terms);
    //    damas.search_mongo({'file': 'REGEX_'+terms+'.*'}, {"time":-1},nbElements,offsetElements, function(res){
    //        console.log(res);
    //        damas.read(res, function(assets){
    //            tableSearchContent(tableBody, assets);
    //            offsetElements += nbElements;
    //        });
    //    });
    //});

    /**
    * Generate Table
    * 
    */

    function tableSearch(container, terms) {
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        var th3 = document.createElement('th');
        var th4 = document.createElement('th');
        var tbody = document.createElement('tbody');

        th1.setAttribute('name', 'time');
        th2.setAttribute('name', 'file');
        th3.setAttribute('name', 'author');
        th4.setAttribute('name', 'comment');

        th1.innerHTML = 'time';
        th2.innerHTML = 'file';
        th3.innerHTML = 'author';
        th4.innerHTML = 'comment';

        table.appendChild(thead);
        thead.appendChild(th1);
        thead.appendChild(th2);
        thead.appendChild(th3);
        thead.appendChild(th4);
        table.appendChild(tbody);

        for (var i=0; i < thead.children.length; i++){
            thead.children[i].addEventListener('click', function(){
                this.sorted ? (tableSearchSort(tbody, terms, this.getAttribute('name'), 1), sortIcon('up', this)) : (tableSearchSort(tbody, terms, this.getAttribute('name'), -1), sortIcon('down', this));
                this.sorted = !this.sorted;
            });
        }

        container.appendChild(table);
        return tbody;
    }

    function sortIcon(status, th){
        if (document.querySelector('.sortIcon'))
            document.querySelector('.sortIcon').remove();
        var icon = document.createElement('span');
        icon.className = 'sortIcon';
        if (status === 'up'){
            icon.innerHTML = '&xutri;';
            th.appendChild(icon);
        }
        if (status === 'down'){
            icon.innerHTML = '&xdtri;';
            th.appendChild(icon);
        }
    }

    /**
    * Generate Table Content
    * 
    */
    function tableSearchContent(container, assets) {
        for (var i=0; i<assets.length; i++) {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');

            td2.className = 'clickable';

            td1.innerHTML = new Date(parseInt(assets[i].time));
            td2.innerHTML = assets[i].file;
            td3.innerHTML = assets[i].author;
            td4.innerHTML = assets[i].comment;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            container.appendChild(tr);
        }
    }
}));