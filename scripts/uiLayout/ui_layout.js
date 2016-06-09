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

ui.contents = function(){
    var panel = document.createElement('div');
    panel.id = 'panelPrincipal';
    panel.className = 'panelPrincipal';
    
    var out = document.querySelector('#contents');
    out.appendChild(panel);
}

ui.secondPanel = function(){
    var panel = document.createElement('div');
    panel.className = 'panelSecond';
    var panelContent = document.createElement('div');
    panelContent.id = 'panelContent';
    panelContent.className = 'panelContent';
    var panelClose = document.createElement('div');
    panelClose.className = 'btClose clickable';
    panelClose.innerHTML = 'X';
    panelClose.addEventListener('click', function(){
        panel.remove();
        previousHash();
    });
    
    panel.appendChild(panelClose);
    panel.appendChild(panelContent);
    var out = document.querySelector('#contents');
    out.appendChild(panel);
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
    
//    if (contentFt)
//        modalContent.appendChild(contentFt);
    
    modalBox.appendChild(modalContent);
    modalOverlay.appendChild(modalBox);
    
    document.body.appendChild(modalOverlay);
    return modalContent;
};

ui.profile = function(){
    var modal = ui.modal();
    var profileContent = document.createElement('div');
    profileContent.id = 'profileContent';
    profileContent.className = 'profileContent';
    
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
    
    settingsBt.addEventListener('click', function(event){
        window.location.hash = '#settings';
//        addHash('settings');
    });

    modal.appendChild(profileContent);
};


ui.settings = function(){
    var settingsContent = document.createElement('div');
    settingsContent.className = 'settingsContent';
    settingsContent.innerHTML = 'settings';
    
    return settingsContent;
};

ui.assetOverlay = function(){
    require([], function(assetOverlay){
    if(!document.getElementById('assetOverlay'))
		{
			ui.assetOverlayDraw();
		}
		//Div to integrate before (in .html file ?)
		var assetOverlay = document.getElementById('assetOverlay');
		var assetHeader = document.getElementById('assetHeader');
		var assetMain_viewer = document.getElementById('assetMain_viewer');
		var assetTitle = assetHeader.querySelector('.assetTitle');
		var assetBts = assetHeader.querySelector('.assetBts');
		assetOverlay.classList.remove('hideAssetOverlay');
		assetOverlay.classList.add('showAssetOverlay');
        
        assetTitle.innerHTML = '';
        assetBts.innerHTML = '';
        assetMain_viewer.innerHTML = '';

		var assetLabel = document.createElement('div');
		assetLabel.setAttribute('class', 'assetLabel');
		assetTitle.appendChild(assetLabel);

		//Adapt Asset Viewer
//		var mapsize = window.innerHeight - assetHeader.offsetHeight;
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
	var assetContent = document.createElement('div');
	assetContent.setAttribute('id', 'assetContent');
    assetContent.setAttribute('class', 'assetContent');
	var assetMain = document.createElement('div');
	assetMain.setAttribute('id', 'assetMain');
    assetMain.setAttribute('class', 'assetMain');
	var assetHeader = document.createElement('div');
	assetHeader.setAttribute('id', 'assetHeader');
	var assetTitle = document.createElement('div');
	assetTitle.setAttribute('class', 'assetTitle');
	var assetMain_viewer = document.createElement('div');
	assetMain_viewer.setAttribute('id', 'assetMain_viewer');
    assetMain_viewer.setAttribute('class', 'assetMain_viewer');
	var assetPanel = document.createElement('div');
	assetPanel.setAttribute('id', 'assetPanel');
    assetPanel.setAttribute('class', 'assetPanel');
	var assetBts = document.createElement('div');
	assetBts.setAttribute('class', 'assetBts');
    

	var closeAssetOverlay = document.createElement('div');
	closeAssetOverlay.setAttribute('id', 'closeAssetOverlay');
    closeAssetOverlay.setAttribute('class', 'clickable');
    closeAssetOverlay.innerHTML = 'X';
    assetHeader.appendChild(closeAssetOverlay);

	closeAssetOverlay.addEventListener( 'click', function(event){
		var assetOverlay = document.getElementById('assetOverlay');
		assetOverlay.classList.remove('showAssetOverlay');
		assetOverlay.classList.add('hideAssetOverlay');
		// to remove from here
		if(window['map']) map.remove();
		var assetHeader = document.getElementById('assetHeader');
		var assetMain_viewer = document.getElementById('assetMain_viewer');
		document.getElementById('assetHeader').querySelector('.assetTitle').innerHTML = '';
		document.getElementById('assetHeader').querySelector('.assetBts').innerHTML = '';
		assetMain_viewer.innerHTML = '';
		assetMain_viewer.removeAttribute('class');
		document.dispatchEvent(closeEvent);
        
		return;
	});
	
	assetHeader.appendChild(assetTitle);
    assetHeader.appendChild(assetBts);
	assetMain.appendChild(assetMain_viewer);
	assetContent.appendChild(assetMain);
	assetContent.appendChild(assetPanel);
	assetOverlay.appendChild(assetHeader);
	assetOverlay.appendChild(assetContent);
	
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
