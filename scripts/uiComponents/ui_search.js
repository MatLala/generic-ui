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
			var container = document.querySelector('#contents');
			container.innerHTML = '';
			search_ui.offsetElements = 0;
			draw(document.querySelector('#contents'));
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
		damas.search_mongo({file: 'REGEX_'+keys.search}, sort, search_ui.nbElements, search_ui.offsetElements, function(res){
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
		//searchInput.setAttribute('type', 'search');
		searchInput.setAttribute('name', 'search');
		searchInput.setAttribute('placeholder', 'Search');
		searchInput.setAttribute('autocomplete', 'on');
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
		var thead = document.createElement('thead');
		var th1 = document.createElement('th');
		var th2 = document.createElement('th');
		var th3 = document.createElement('th');
		var tbody = document.createElement('tbody');

		table.className = 'search';

		th1.setAttribute('name', 'file');
		th2.setAttribute('name', 'size');
		th3.setAttribute('name', 'time');

		th1.innerHTML = 'file';
		th2.innerHTML = 'size';
		th3.innerHTML = 'time';

		thead.appendChild(th1);
		thead.appendChild(th2);
		thead.appendChild(th3);
		table.appendChild(thead);
		table.appendChild(tbody);
		container.appendChild(table);

		var keys = getHash();
		var sort = keys.sort || 'file';
		var th = document.getElementsByName(sort)[0];
		var icon = document.createElement('span');
		var order = (keys.order)? keys.order: 1;
		icon.innerHTML = (order==='1')? '&xutri;' : '&xdtri;';
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
		td4.classList.add('buttons');
		tr.setAttribute('title', JSON_tooltip(asset));

		var time = new Date(parseInt(asset.time));
		var file = asset.file || asset['#parent'];
		tr.file = file;

		td2.innerHTML = human_size( asset.bytes || asset.size || asset.source_size);
		td3.innerHTML = human_time(time);
		var td4span = document.createElement('span');
		td4span.setAttribute('title', 'delete');
		td4span.classList.add('delete');
		td4span.innerHTML = 'x';
		td4.appendChild(td4span);
		td4span.addEventListener('click', function(e){
			if (confirm('Delete '+asset._id+' ?')) {
				damas.delete(asset._id);
			}
		});

		td1.appendChild( human_filename_href(file) );
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
		if (require.specified('ui_editor')){
			tr.addEventListener('click', function(){
				initEditor(asset);
			});
		}
		return tr;
	}

}));


