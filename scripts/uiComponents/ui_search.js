(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.compSearch = factory();
	}
}(this, function () {

	loadCss('generic-ui/scripts/uiComponents/ui_search.css');

	window.addEventListener('hashchange', function(event){
		hashSearch();
	});

	var search_ui = { nbElements: 100 };

	require(['domReady'], function (domReady) {
		domReady(function () {
			if (/#search=/.test(location.hash)){
				// SEARCH RESULT MODE
				hashSearch();
			}
			document.querySelector('#panelPrincipal').addEventListener('scroll', function(event){
				if (/#search=/.test(location.hash)) {
					var container = event.target;
					if (container.scrollHeight - container.scrollTop === container.clientHeight){
						doSearch();
					}
				}
			});
		});
	});

	function hashSearch() {
		if (/#search=/.test(location.hash)){
			document.querySelector('#but_files').classList.add('selected');
			var container = document.querySelector('#contents');
			container.innerHTML = '';
			search_ui.offsetElements = 0;
			draw(container);
			doSearch();
/*
			var searchAbout = document.createElement('div');
			searchAbout.className = 'searchAbout';
			searchAbout.innerHTML = 'Search results for "'+ keys.search + '" :';
			container.appendChild(searchAbout);
*/
		}
	};

	function doSearch(){
		var keys = getHash();
		var sortBy = keys.sort || 'file';
		var order = keys.order ? parseInt(keys.order) : 1
		var sort = {};
		sort[sortBy] = order;
		var query = {};
		query[conf.pathKey] = 'REGEX_'+keys.search;
		damas.search_mongo(query, sort, search_ui.nbElements, search_ui.offsetElements, function(res){
			damas.read(res, function(assets){
				var tableBody = document.querySelector('#contents tbody');
				fill(tableBody, assets);
				search_ui.offsetElements += search_ui.nbElements;
			});
		});
	}

	/**
	* Input and button (for mobiles) elements for Search Component
	* Localisation : Header
	*/

	function draw( container ) {
		var searchInput = document.createElement('input');
		searchInput.className = 'searchInput';
		searchInput.setAttribute('placeholder', 'Search');
		//searchInput.setAttribute('type', 'search');
		//searchInput.setAttribute('name', 'search');
		//searchInput.setAttribute('autocomplete', 'on');
		searchInput.value = getHash().search;
		searchInput.focus();
		container.appendChild(searchInput);
		searchInput.addEventListener('change', function(event) {
			window.location.hash = '#search='+searchInput.value;
		});
		//searchInput.addEventListener('keyup', function(event) {
			//if (searchInput.value.length > 0 && window.location.hash !== searchInput.value) {
			//window.location.hash = '#search='+searchInput.value;
			//}
		//});
		var table = document.createElement('table');
		var colgroup = document.createElement('colgroup');
		var col1 = document.createElement('col');
		var col2 = document.createElement('col');
		var col3 = document.createElement('col');
		var col4 = document.createElement('col');
		//var col5 = document.createElement('col');
		var col6 = document.createElement('col');
		var thead = document.createElement('thead');
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		var th4 = document.createElement('th');
		//var th5 = document.createElement('th');
		var tbody = document.createElement('tbody');

		table.className = 'search';

		th1.setAttribute('name', conf.pathKey);
		th2.setAttribute('name', 'file_size');
		th3.setAttribute('name', 'file_mtime');
		th4.setAttribute('name', 'author');
		//th5.setAttribute('name', 'comment');

		th1.innerHTML = 'file';
		th2.innerHTML = 'size';
		th3.innerHTML = 'mtime';
		//th4.innerHTML = 'author';
		//th5.innerHTML = 'comment';
		//var a1 = document.createElement('a');
		//a1.setAttribute('href', 'search='+keys.search+'&sort='+this.getAttribute('name')+'&order='+ (-order) );
		//th1.appendChild(a1);

		thead.appendChild(th1);
		thead.appendChild(th2);
		thead.appendChild(th3);
		thead.appendChild(th4);
		//thead.appendChild(th5);
		colgroup.appendChild(col1);
		colgroup.appendChild(col2);
		colgroup.appendChild(col3);
		//colgroup.appendChild(col4);
		//colgroup.appendChild(col5);
		colgroup.appendChild(col6);
		table.appendChild(colgroup);
		table.appendChild(thead);
		table.appendChild(tbody);
		container.appendChild(table);

		var keys = getHash();
		var sort = keys.sort || conf.pathKey;
		var th = document.getElementsByName(sort)[0];
		var icon = document.createElement('span');
		var order = (keys.order)? keys.order: 1;
		icon.innerHTML = (order==='1')? '&dtrif;' : '&utrif;';
		th.innerHTML += ' ';
		th.appendChild(icon);

		for (var i=0; i < thead.children.length; i++){
			thead.children[i].addEventListener('click', function(){
				search_ui.offsetElements = 0;
				var keys = getHash();
				var order = (keys.order)? keys.order: 1;
				window.location.hash = 'search='+keys.search+'&sort='+this.getAttribute('name')+'&order='+ (-order);
			});
		}
		//return tbody;
	}

	/**
	 * Generate Table Content
	 */
	function fill(container, assets) {
		for (var i=0; i<assets.length; i++) {
			container.appendChild(tr(assets[i]));
		}
	}

	function tr(asset) {
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		var td4 = document.createElement('td');
		var td5 = document.createElement('td');
		var td6 = document.createElement('td');
		td1.classList.add('file');
		td2.classList.add('size');
		td3.classList.add('time');
		td4.classList.add('author');
		//td5.classList.add('comment');
		td6.classList.add('buttons');
		tr.setAttribute('title', JSON_tooltip(asset));
		td4.setAttribute('title', asset.comment);

		var time = new Date(parseInt(asset.file_mtime));
		var file = asset[conf.pathKey] || asset['#parent'];
		//tr.file = file;

		td2.innerHTML = human_size( asset.file_size || asset.bytes || asset.size || asset.source_size);
		td3.innerHTML = human_time(time);
		td4.innerHTML = asset.author;
		//td5.innerHTML = asset.comment || '';

		td3.addEventListener('click', function(e){
			damas.search_mongo({'#parent': asset._id}, {"file_mtime":1},100, 0, function(res){
				damas.read(res, function(children){
					for (var i=0; i<children.length; i++) {
						var newTr = searchtr(children[i]);
						newTr.classList.add('history');
						tr.parentNode.insertBefore(newTr, tr.nextSibling);
					}
				});
			})
		})

		var progress= document.createElement('progress');
		progress.style.width='1em';
		progress.value = '.5';
		progress.setAttribute('title', 'origin: '+asset.origin+'\n');
		//td6.appendChild(progress);

		var td6span = document.createElement('span');
		td6span.setAttribute('title', 'delete');
		td6span.classList.add('delete');
		td6span.innerHTML = 'x';
		td6.appendChild(td6span);
		td6span.addEventListener('click', function(e){
			if (confirm('Delete '+asset._id+' ?')) {
				damas.delete(asset._id);
			}
		});

		td1.appendChild( human_filename_href(file) );
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		//tr.appendChild(td4);
		//tr.appendChild(td5);
		tr.appendChild(td6);
		if (require.specified('ui_editor')){
			tr.addEventListener('click', function(){
				initEditor(asset);
			});
		}
		return tr;
	}

	// to find the method from eventlistener
	window.searchtr = tr;

}));


