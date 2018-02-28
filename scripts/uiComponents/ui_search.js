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
		if(window.processHash)
			hashSearch();
	});

	var search_ui = { nbElements: 100 };

	require(['domReady'], function (domReady) {
		domReady(function () {
			if (/#search=/.test(location.hash)){
				// SEARCH RESULT MODE
				hashSearch();
			}

			var scrollElem = document.getElementById('layer0');
			scrollElem.addEventListener('scroll', function(event){
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
			window.results = [];
			doSearch();
		}
	};

	function doSearch(){
		var keys = getHash();
		var sortBy = keys.sort || 'time';
		var order = keys.order ? parseInt(keys.order) : -1;
		var sort = {};
		sort[sortBy] = order;
		var query = {};
		try {
			query = JSON.parse(decodeURIComponent(keys.search));
		} catch (e) {
			query[conf.file_path] = 'REGEX_'+decodeURIComponent(keys.search);
		}
		damas.search_mongo(query, sort, search_ui.nbElements, search_ui.offsetElements, function(res){
			var searchInfo = document.querySelector('span#searchInfo');
			searchInfo.innerHTML = '&nbsp;'+res.count+' results';
			window.results = window.results.concat(res.ids);
			if (res.count > 0) {
				damas.read(res.ids, function(assets){
					var table = document.querySelector('#contents table');
					fill(table, assets);
					search_ui.offsetElements += search_ui.nbElements;
				});
			}
		});
	}

	function draw( container ) {
		var br1 = document.createElement('br');
		var searchShortcuts = document.createElement('div');
		container.appendChild(br1);
		container.appendChild(searchShortcuts);
		searchShortcuts.innerHTML = 'shortcuts: ';
		searchShortcuts.style.textAlign = 'right';
		var a0 = document.createElement('a');
		var a1 = document.createElement('a');
		var a2 = document.createElement('a');
		var a3 = document.createElement('a');
		a0.innerHTML = 'latest';
		a0.href='#search=';
		a1.innerHTML = 'deleted';
		a1.href='#search={"deleted":true}&sort='+conf.file_path+'&order=1';
		//a2.innerHTML = 'announced';
		//a2.href='#search={"'+conf.file_path+'":"REGEX_/","origin":{"$exists":true,"$ne":"online"},"synced_online":{"$exists":false},"online":"1"}&sort='+conf.file_path+'&order=1';
		a2.innerHTML = 'errors';
		a2.href = '#search={"sync_error":{"$exists":true}, "sync_disabled":{"$exists":false},"deleted":{"$ne":true}}';
		a3.innerHTML = 'disabled';
		a3.href = '#search={"sync_disabled":true}';
		searchShortcuts.appendChild(a0);
		//a3.innerHTML = 'locks';
		//a3.href = '#search={"lock":{"$exists":true}}&sort=lock&order=1';
		searchShortcuts.appendChild(a0);
		searchShortcuts.innerHTML += ' ';
		searchShortcuts.appendChild(a1);
		searchShortcuts.innerHTML += ' ';
		//searchShortcuts.appendChild(a2);
		//searchShortcuts.innerHTML += ' ';
		searchShortcuts.appendChild(a2);
		searchShortcuts.innerHTML += ' ';
		searchShortcuts.appendChild(a3);

		var searchInput = document.createElement('input');
		searchInput.className = 'searchInput';
		searchInput.setAttribute('placeholder', 'Search');
		searchInput.value = decodeURIComponent(getHash().search);
		searchInput.focus();
		container.appendChild(searchInput);
		searchInput.addEventListener('change', function(event) {
			var keys = getHash();
			window.location.hash = 'search='+searchInput.value+((keys.sort)?'&sort='+keys.sort:'')+((keys.order)?'&order='+keys.order:'');
		});
		var searchInfo = document.createElement('span');
		searchInfo.setAttribute('id', 'searchInfo');
		container.appendChild(searchInfo);


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
		//var th3 = document.createElement('th');
		var th4 = document.createElement('th');
		var th5 = document.createElement('th');
		//var th6 = document.createElement('th');
		var th7 = document.createElement('th');

		table.className = 'search';


		th1.setAttribute('name', conf.file_path);
		th2.setAttribute('name', conf.file_size);
		//th3.setAttribute('name', conf.file_mtime);
		th4.setAttribute('class', 'sync');
		th5.setAttribute('name', 'sync_priority');
		th7.setAttribute('name', 'time');

		th1.innerHTML = 'name';
		th2.innerHTML = 'size';
		//th3.innerHTML = 'file<br/>time';
		th7.innerHTML = 'published';

		thead.appendChild(th7);
		thead.appendChild(th2);
		//thead.appendChild(th3);
		thead.appendChild(th1);
		thead.appendChild(th5);
		thead.appendChild(th4);

			for (var sync of conf.syncKeys) {
				var th = document.createElement('th');
				thead.appendChild(th);
				th.classList.add('sync');
				th.innerHTML = sync.replace('synced_','');
				th.style.transform = 'rotate(-45deg)';
				th.style.transformOrigin = '50% 70%';
				th.style.height = '1ex';
				th.style.maxWidth = '1ex';
				//th.style.overflow = 'hidden';
				th.style.textAlign = 'left';
			}

		//th4.innerHTML = 'sync'+conf.syncKeys.join('<br/>');
		//th4.style.transform = 'rotate(-45deg)';
		//th4.style.textAlign = 'left';
		th5.innerHTML = 'priority';
		//var a1 = document.createElement('a');
		//a1.setAttribute('href', 'search='+keys.search+'&sort='+this.getAttribute('name')+'&order='+ (-order) );
		//th1.appendChild(a1);


		if (conf.syncKeys) {
			var str_title = 'Sync: What is this?\n\nEach cell is a server (from left to right):\n';
			for (var sync of conf.syncKeys) {
				str_title += sync.replace('synced_','')+'\n';
			}
			str_title += '\ngray: the file is not synced on this server\ngreen: the file was synced on this server\nyellow: the file is outdated on this server\no: this server is the file origin';
			//th4.setAttribute('title',str_title);
			//thead.appendChild(th4);
		}

		//thead.appendChild(th6);

		colgroup.appendChild(col1);
		colgroup.appendChild(col2);
		colgroup.appendChild(col3);
		//colgroup.appendChild(col4);
		//colgroup.appendChild(col5);
		colgroup.appendChild(col6);
		table.appendChild(colgroup);
		table.appendChild(thead);
		container.appendChild(table);

		var keys = getHash();
		var sort = keys.sort || 'time';
		var th = document.getElementsByName(sort)[0];
		if (th) {
			var icon = document.createElement('span');
			var order = (keys.order)? keys.order: 1;
			icon.innerHTML = (order==='1')? '&dtrif;' : '&utrif;';
			th.innerHTML += ' ';
			//th.insertBefore(icon, th.childNodes[0]);
			th.appendChild(icon);
		}

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
			container.appendChild(tablebody(assets[i]));
		}
	}

	function tablebody(asset) {
		var tbody = document.createElement('tbody');
		tbody.appendChild(tablerow(asset));
		return tbody;
	}

	function tablerow(asset) {
		var tr = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		//var td3 = document.createElement('td');
		var td4 = document.createElement('td');
		var td5 = document.createElement('td');
		//var td6 = document.createElement('td');
		var td7 = document.createElement('td');
		td1.classList.add('file');
		td2.classList.add('size');
		//td3.classList.add('time');
		//td4.classList.add('sync');
		td5.classList.add('priority');
		//td6.classList.add('buttons');
		td7.classList.add('time');
		tr.setAttribute('title', JSON_tooltip(asset));
		//td4.setAttribute('title', asset.comment);

		//var time = new Date(parseInt(asset[conf.file_mtime]));
		var file = asset[conf.file_path] || asset['#parent'];
		//tr.file = file;

		td2.innerHTML = human_size( asset.file_size || asset.bytes || asset.size || asset.source_size);
		//td3.innerHTML = html_time(time);
		td4.innerHTML = (asset.sync_disabled===true)? '&#10008;':'&#10004;';
		//td4.innerHTML = asset.author;
		//td5.innerHTML = asset.comment || '';

/*
		td3.addEventListener('click', function(e){
			damas.search_mongo({'#parent': asset._id}, {"time":1},1000, 0, function(res){
				damas.read(res.ids, function(children){
					for (var i=0; i<children.length; i++) {
						var newTr = searchtr(children[i]);
						newTr.classList.add('history');
						tr.parentNode.insertBefore(newTr, tr.nextSibling);
					}
				});
			})
		})
		*/

		tr.appendChild(td7);
		tr.appendChild(td2);
		//tr.appendChild(td3);
		tr.appendChild(td1);
		tr.appendChild(td5);
		tr.appendChild(td4);


		td4.setAttribute('title', 'enable / disable sync' );
		td4.style.cursor = 'pointer';

		td4.addEventListener('click', function(e){
			damas.update({_id:asset._id,sync_disabled:!asset.sync_disabled}, function(node){
				e.stopPropagation();
				e.preventDefault();
				e.target.parentNode.parentNode.insertBefore(tablerow(node), e.target.parentNode );
				e.target.parentNode.parentNode.removeChild(tr);
				return false;
			});
		});


		if (conf.syncKeys) {
			var title = '';
			var titleLines = '';
			var ref_time = asset.time;
			for (var syncKey of conf.syncKeys) {
				var site_name = syncKey.replace('synced_', '');
				var synced = asset.hasOwnProperty(syncKey);
				var syncing = asset.hasOwnProperty('syncing_'+site_name);
				var time = '';
				var span= document.createElement('td');
				if (asset.sync_disabled === true) {
					span.style.textDecoration = 'line-through';
				}
				span.classList.add('sync');
				tr.appendChild(span);
				span.innerHTML = '&nbsp;';
				//progress.classList.add('synced', 'origin: '+asset.origin+'\n');
				//span.setAttribute('title', sync);
				//span.classList.add((asset.hasOwnProperty(sync))?'synced':'notsynced');
				var is_origin = asset.origin === site_name;
				if (synced && !is_origin) {
					time = human_time(new Date(parseInt(asset[syncKey])));
					title = time + ' ' + site_name+ '\n';
					titleLines += time + ' ' + site_name+ '\n';
				}
				if (is_origin) {
					//span.style.backgroundColor = 'lightgreen';
					//span.classList.add('synced');
					//span.classList.remove('notsynced');
					span.innerHTML = 'o';
					if (asset.hasOwnProperty('sync_error')){
						span.classList.add('sync_error');
					} else {
						if (asset.hasOwnProperty('synced_online')){
							span.classList.add('synced');
							if (asset.synced_online < asset.time) {
								span.classList.add('outdated');
							} else {
							}
						} else {
							span.classList.add('notsynced');
						}
					}
					time = human_time(new Date(parseInt(asset.time)));
					title = time + ' ' + site_name + ' (origin)\n';
					titleLines += time + ' ' + site_name + ' (origin)\n';
					//continue;
					span.addEventListener('click', function(e){
						e.stopPropagation();
						var synced_keys = [];
						for (var key in asset){
							if (0 === key.indexOf("synced_")){
							    synced_keys.push(key);
							}
						}
						if (true === confirm("reset "+synced_keys+" of "+asset._id+"?\n\nthis will make rsync compare the file at destination again and update it if necessary")) {
							new_asset = {};
							new_asset._id = asset._id;
							synced_keys.forEach(function(k){
								new_asset[k] = null;
							});
							damas.update(new_asset, function(res){
								if (res){
									var tr = e.target.parentNode.parentNode;
									tr.parentNode.replaceChild(tablerow(res),tr);
								} else {
									alert('No change was made.');
								}

							});

						}
					});
					span.style.cursor='pointer';

				}
				/*
				if (is_origin || synced) {
					if(!asset.hasOwnProperty('sync_error')){
						span.classList.add('synced');
					}
				}
				*/
				if (synced) {
						if (asset.zeroed === true && 'online' === site_name ) {
							span.classList.add('zeroed');
						}
						else {
							span.classList.add('synced');
						}
				}
				else {
					if (!is_origin){
						span.classList.add('notsynced');
					}
				}
				if (syncing){
					span.classList.add('syncing');
				}
				if (!is_origin && (asset[syncKey] < asset.time)) {
					span.classList.add('outdated');
				}
				if (!is_origin && !synced) {
					title = '--/--/-- --:--:-- ' + site_name+ '\n';
					titleLines += '--/--/-- --:--:-- ' + site_name+ '\n';
				}
			span.setAttribute('title', title );

			}
			td5.setAttribute('title', titleLines );
			if (asset.sync_disabled === true) {
				//td4.style.textDecoration = 'line-through';
				td5.style.textDecoration = 'line-through';
			}

			function conv_priority( val, out)
			{

			switch (val) {
				case 2:
					out.innerHTML = 'very high';
					break;
				case 1:
					out.innerHTML = 'high';
					break;
				case 0:
				case undefined:
					out.innerHTML = 'normal';
					break;
				case -1:
					out.innerHTML = 'low';
					break;
				case -2:
					out.innerHTML = 'very low';
					break;
				default:
					out.innerHTML = asset.sync_priority;
			}
			}
			conv_priority(asset.sync_priority, td5);
			td5.addEventListener('click', function(e){
				e.stopPropagation();
				var value = prompt('Set sync priority for '+asset._id+'\n\nHigh = 1\nNormal = 0\nLow = -1\n\n', asset.sync_priority || 0);
				if (value !== null) {
					asset.sync_priority = parseInt(value);
					damas.update(asset, function(){
						conv_priority(parseInt(value), e.target);
					});
				}
			});
		}

/*
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
		*/

		td7.innerHTML = html_time(new Date(parseInt(asset.time)));
		td7.setAttribute('title', titleLines );
		td7.style.cursor = 'pointer';

		td7.addEventListener('click', function(e){
			e.stopPropagation();
			var value = confirm('Re publish '+asset._id+' ?');
			if (false !== value) {
				var origin = prompt('Origin', asset.origin);
				if (null !== origin) {
					var comment = prompt('Message', 'republished from web');
					if (null !== comment) {
						damas.create({
							'#parent': asset._id,
							origin: origin,
							comment: comment
						}, function(n1){
							n1._id = asset._id;
							n1['#parent'] = undefined;
							damas.update(n1, function(n2){
								alert('Re publish done!');
								e.target.parentNode.parentNode.insertBefore(tablerow(n2), e.target.parentNode );
								e.target.parentNode.parentNode.removeChild(tr);
							});
						});
					}
				}
			}
		});

		if (true===asset.deleted){
			td1.style.textDecoration = "line-through"
		}
		/*
		if (file.match(/\/$/)){
			var a = document.createElement('a');
			a.innerHTML = file;
			a.href = '#search='+file+'.';
			td1.appendChild(a);
		}
		else {
		*/
			td1.appendChild( human_filename_href(file) );
		//}
		//tr.appendChild(td4);
		//tr.appendChild(td6);
		if (require.specified('ui_editor')){
			tr.addEventListener('click', function(){
				initEditor(asset);
				window.selection = asset;
			});
		}
		return tr;
	}

	// to find the method from eventlistener
	window.searchtr = tablerow;

}));


