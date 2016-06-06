/**
* @namespace for UI Components
*/
if(window['ui']===undefined) ui = {};

ui.header = function(){
    var header = document.querySelector('#header');
    header.classList.add = 'homeHeader';
    var headerLogo = document.createElement('div');
    headerLogo.className = 'headerLogo clickable';
    
    var searchBox = document.createElement('div');
    searchBox.className = 'headerSearch';
    
    var searchForm = document.createElement('form');
    searchForm.className = 'searchForm';
    var searchInput = document.createElement('input');
    searchInput.className = 'searchInput';
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
//    searchBt.setAttribute('href', '#search=');
    searchBt.setAttribute('title', 'Search');
    
    searchBox.appendChild(searchForm);
    searchBox.appendChild(searchBt);
    
    var menuBts = document.createElement('div');
    menuBts.className = 'headerMenu';
    
    var uploadBt = document.createElement('a');
    uploadBt.className = 'uploadBt clickable';
    uploadBt.setAttribute('title', 'Upload');
    
    var profileBt = document.createElement('a');
    profileBt.className = 'profileBt clickable';
//    profileBt.setAttribute('href', '#profile');
    profileBt.setAttribute('title', 'Profile');
    menuBts.appendChild(uploadBt);
    menuBts.appendChild(profileBt);
    
    uploadBt.addEventListener('click', function(event) {
        window.location.hash = '#upload';
//        addHash('upload');
    });
    profileBt.addEventListener('click', function(event) {
        window.location.hash = '#profile';
//        addHash('profile');
    });
    headerLogo.addEventListener('click', function(event) {
        document.location.hash = '';
    });
    searchForm.addEventListener('submit', function(event) {
        if (searchInput.value.length > 0){
            addHash('search='+searchInput.value);
        }
        else {
            document.location.hash = '';
        }
    });
    searchBt.addEventListener('click', function(){
        searchForm.style.display = 'inline-block';
        searchBt.style.display = 'none';
        menuBts.style.display = 'none';
        searchReset.addEventListener('click', function(){
            searchForm.style.display = 'none';
            searchBt.style.display = 'block';
            menuBts.style.display = 'table-cell';
        });
    });

    header.appendChild(headerLogo);
    header.appendChild(searchBox);
    header.appendChild(menuBts);
}

ui.log = function(){
    var logTable = document.createElement('table');
    logTable.innerHTML = 'log'
    var logTableLine = document.createElement('tr');
    logTable.appendChild(logTableLine);
    var logTableRow1 = document.createElement('td');
    var logTableRow2 = document.createElement('td');
    var logTableRow3 = document.createElement('td');
    var logTableRow1View = document.createElement('a');
//    logTableRow1View.setAttribute('href', '#view=nodeFile');
    logTableRow1View.innerHTML = 'viewNode';
    logTableRow2.id = 'btEditor';
    logTableRow2.innerHTML = 'editNode';
    logTableRow3.innerHTML = 'nodeKey';
    logTableRow1.appendChild(logTableRow1View);
    logTableLine.appendChild(logTableRow1);
    logTableLine.appendChild(logTableRow2);
    logTableLine.appendChild(logTableRow3);

    var out = document.querySelector('#listBox');
    out.appendChild(logTable);
    
    logTableRow1View.addEventListener('click', function(e){
        addHash('view=nodeFile');
    });
    
    logTableRow2.addEventListener('click', function(e){
        window.location.hash = '#edit=nodeFile';
//        if (!document.getElementById('editorBox'))
//            ui.editor();
    });
}

ui.results = function(){
    var resTable = document.createElement('table');
    resTable.className = 'resultsTable';
    resTable.innerHTML = 'results'
    var resTableLine = document.createElement('tr');
    resTable.appendChild(resTableLine);
    var resTableRow1 = document.createElement('td');
    var resTableRow2 = document.createElement('td');
    var resTableRow3 = document.createElement('td');
    var resTableRow1View = document.createElement('a');
//    logTableRow1View.setAttribute('href', '#view=nodeFile');
    resTableRow1View.innerHTML = 'viewNode';
    resTableRow2.id = 'btEditor';
    resTableRow2.innerHTML = 'editNode';
    resTableRow3.innerHTML = 'nodeKey';
    resTableRow1.appendChild(resTableRow1View);
    resTableLine.appendChild(resTableRow1);
    resTableLine.appendChild(resTableRow2);
    resTableLine.appendChild(resTableRow3);

    var out = document.querySelector('#listBox');
    out.appendChild(resTable);
    
    resTableRow1View.addEventListener('click', function(e){
        addHash('view=nodeFile');
    });
    
    resTableRow2.addEventListener('click', function(e){
        window.location.hash = '#edit=nodeFile';
//        addHash('edit=nodeFile');
    });
}

ui.editor = function(){
    var editorBox = document.createElement('div');
    editorBox.id = 'editorBox';
    editorBox.className = 'editorBox';
    var editorContent = document.createElement('div');
    editorContent.className = 'editorContent';
    var editorClose = document.createElement('div');
    editorClose.className = 'btClose clickable';
    editorClose.innerHTML = 'X';
    editorClose.addEventListener('click', function(){
        editorBox.remove();
        previousHash();
    });
    
    editorBox.appendChild(editorClose);
    editorBox.appendChild(editorContent);
    var out = document.querySelector('#contents');
    out.appendChild(editorBox);
};

ui.modal = function(){
    var modalOverlay = document.createElement('div');
    modalOverlay.className = 'modalOverlay';
    var modalBox = document.createElement('div');
    modalBox.className = 'modalBox';
    var modalContent = document.createElement('div');
    modalContent.id = 'modalContent';
    
    var btClose = document.createElement('div');
    btClose.className = 'btClose clickable';
    btClose.innerHTML = 'X';
    
    modalBox.appendChild(btClose);
    
    btClose.addEventListener('click', function(){
        modalOverlay.remove();
        previousHash();
    });
    
    modalBox.appendChild(modalContent);
    modalOverlay.appendChild(modalBox);
    return modalOverlay;
};

ui.profile = function(){
    if (!document.querySelector('#modalContent')){
        document.body.appendChild(ui.modal());
    }
    var modalContent = document.querySelector('#modalContent');
    modalContent.innerHTML = '';

    var profileContent = document.createElement('div');
    profileContent.id = 'profileBox';
    profileContent.className = 'profileBox';
    
    var profileResume = document.createElement('div');
    profileResume.className = 'profileResume';
    profileResume.innerHTML = 'profileResume';
    
    var settingsBt = document.createElement('div');
    settingsBt.className = 'profileBoxBt';
    settingsBt.innerHTML = 'settings';
    
    var signOutBt = document.createElement('div');
    signOutBt.className = 'profileBoxBt';
    signOutBt.innerHTML = 'signOut';
    
    profileContent.appendChild(profileResume);
    profileContent.appendChild(settingsBt);
    profileContent.appendChild(signOutBt);
    
    modalContent.appendChild(profileContent);
    
    settingsBt.addEventListener('click', function(event){
        window.location.hash = '#settings';
//        addHash('settings');
    });

    return modalOverlay;
};

ui.upload = function(){
    var modal = document.body.appendChild(ui.modal());
};

ui.settings = function(){
    var settingsResume = document.createElement('div');
    settingsResume.className = 'settingsResume';
    settingsResume.innerHTML = 'settingsResume';
    
    if (document.querySelector('#modalContent')){
        var modalContent = document.querySelector('#modalContent');
        modalContent.innerHTML = '';
        modalContent.appendChild(settingsResume);
    }
    else {
        var modalOverlay = document.body.appendChild(ui.modal());
        var content = modalOverlay.lastElementChild.lastElementChild;
        content.appendChild(settingsResume);
    }
};

ui.assetOverlay = function(){
    require([], function(assetOverlay){
    if(!document.getElementById('assetOverlay'))
		{
			ui.assetOverlayDraw();
		}
		//Div to integrate before (in .html file ?)
		var assetOverlay = document.getElementById('assetOverlay');
		var assetMain_header = document.getElementById('assetMain_header');
		var assetMain_viewer = document.getElementById('assetMain_viewer');
		var assetTitle = assetMain_header.querySelector('.assetTitle');
		var assetBts = assetMain_header.querySelector('.assetBts');
		assetOverlay.classList.remove('hideAssetOverlay');
		assetOverlay.classList.add('showAssetOverlay');
        
        assetTitle.innerHTML = '';
        assetBts.innerHTML = '';
        assetMain_viewer.innerHTML = '';

		var assetLabel = document.createElement('div');
		assetLabel.setAttribute('class', 'assetLabel');
		assetTitle.appendChild(assetLabel);

		//Adapt Asset Viewer
//		var mapsize = window.innerHeight - assetMain_header.offsetHeight;
//		assetMain_viewer.style.height = mapsize + "px";
		ui.assetPanelDetails();
//		if(json.file)
//		{
			// COMMON PART (NAME, DOWNLOAD, ETC)
//				assetLabel.innerHTML = json.file.split('/').pop();
//			assetLabel.innerHTML = json.file;
            assetLabel.innerHTML = 'nodeId';

			var btDl = document.createElement('a');
			btDl.setAttribute('class', 'headBt btDl clickable');
//			btDl.setAttribute('href', json.file );
            btDl.setAttribute('title', 'Download');
            var btUp = document.createElement('a');
			btUp.setAttribute('class', 'headBt btUp clickable');
			btUp.setAttribute('title', 'Upload Version');
			assetBts.appendChild(btDl);
            assetBts.appendChild(btUp);

			//Asset URL
			//Asset initialize selector
//			spinner(assetMain_viewer);
//			assetViewerSelector(json.file, assetMain_viewer);
//		}
//		else
//		{
//			assetLabel.innerHTML = json._id;
//		}
	});
}

ui.assetOverlayDraw = function(){
    var assetOverlay = document.createElement('div');
	assetOverlay.setAttribute('id', 'assetOverlay');
	assetOverlay.setAttribute('class', 'hideAssetOverlay');
	var assetBox = document.createElement('div');
	assetBox.setAttribute('id', 'assetBox');
	var assetMain = document.createElement('div');
	assetMain.setAttribute('id', 'assetMain');
	var assetMain_header = document.createElement('div');
	assetMain_header.setAttribute('id', 'assetMain_header');
	var assetTitle = document.createElement('div');
	assetTitle.setAttribute('class', 'assetTitle');
	var assetMain_viewer = document.createElement('div');
	assetMain_viewer.setAttribute('id', 'assetMain_viewer');
	var assetPanel = document.createElement('div');
	assetPanel.setAttribute('id', 'assetPanel');
	var assetBts = document.createElement('div');
	assetBts.setAttribute('class', 'assetBts');
    

	var closeAssetOverlay = document.createElement('div');
	closeAssetOverlay.setAttribute('id', 'closeAssetOverlay');
    closeAssetOverlay.setAttribute('class', 'clickable');
    closeAssetOverlay.innerHTML = 'X';
    assetMain_header.appendChild(closeAssetOverlay);

	closeAssetOverlay.addEventListener( 'click', function(event){
		var assetOverlay = document.getElementById('assetOverlay');
		assetOverlay.classList.remove('showAssetOverlay');
		assetOverlay.classList.add('hideAssetOverlay');
		// to remove from here
		if(window['map']) map.remove();
		var assetMain_header = document.getElementById('assetMain_header');
		var assetMain_viewer = document.getElementById('assetMain_viewer');
		document.getElementById('assetMain_header').querySelector('.assetTitle').innerHTML = '';
		document.getElementById('assetMain_header').querySelector('.assetBts').innerHTML = '';
		assetMain_viewer.innerHTML = '';
		assetMain_viewer.removeAttribute('class');
		document.dispatchEvent(closeEvent);
        
		return;
	});
	
	assetMain_header.appendChild(assetTitle);
    assetMain_header.appendChild(assetBts);
	assetMain.appendChild(assetMain_viewer);
	assetBox.appendChild(assetMain);
	assetBox.appendChild(assetPanel);
	assetOverlay.appendChild(assetMain_header);
	assetOverlay.appendChild(assetBox);
	
	document.body.appendChild(assetOverlay);
}

ui.assetCard = function(htmlElement, title, color, contentFt){
    var card = document.createElement('li');
    card.setAttribute('class', 'open assetCard');
    var cardTitle = document.createElement('a');
    cardTitle.setAttribute('class', 'assetAccTitle clickable');
    cardTitle.appendChild(document.createTextNode(title));
    var cardCont = document.createElement('li');
    cardCont.setAttribute('class', 'submenu');
    card.appendChild(cardTitle);
    card.appendChild(cardCont);
    
    card.style.backgroundColor = color;
    
    // Insert card content with a function 
    if (contentFt)
        cardCont.appendChild(contentFt);
    
    htmlElement.appendChild(card);
}

ui.assetPanelDetails = function(){
    var assetPanel = document.getElementById('assetPanel');
	assetPanel.innerHTML = '';

	var assetList = document.createElement('ul');
	assetList.setAttribute('id', 'assetAccordion');
	assetList.setAttribute('class', 'accordion');
	assetPanel.appendChild(assetList);
    
    ui.assetCard(assetList, 'Informations', '#f29494');
    ui.assetCard(assetList, 'Versions', '#ffffa5');
    ui.assetCard(assetList, 'Comments', '#6565ff');
}

var closeEvent = new CustomEvent( "assetOverlay:close");

//to listen to this event:
document.addEventListener("assetOverlay:close", function(){
    previousHash();
}, false);
