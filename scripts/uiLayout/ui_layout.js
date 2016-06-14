/**
* HTML rendering methods for UI Elements inside Layout
* requires main.js
* call by process_hash function
* @return HTML element as container for components
*/



/** 
 * @namespace for UI Elements
 */
if(window['ui']===undefined) ui = {};


/**
* 
* Lateral panel or overlay view in contents div
* 
*/
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
    return panelContent;
};

/**
* 
* Modal Element - overlay view
* @ return {object} html Element
*/
ui.modal = function(){
    var modalOverlay = document.createElement('div');
    modalOverlay.className = 'modalOverlay';
    var modalBox = document.createElement('div');
    modalBox.className = 'modalBox';
    
    var modalHeader = document.createElement('div');
    modalHeader.id = 'modalHeader';
    var modalContent = document.createElement('div');
    modalContent.id = 'modalContent';
    var modalFooter = document.createElement('div');
    modalFooter.id = 'modalFooter';
    
    var btClose = document.createElement('div');
    btClose.className = 'btClose clickable';
    btClose.innerHTML = 'X';
    
    modalBox.appendChild(btClose);
    
    btClose.addEventListener('click', function(){
        modalOverlay.remove();
        previousHash();
    });
    
    modalBox.appendChild(modalHeader);
    modalBox.appendChild(modalContent);
    modalBox.appendChild(modalFooter);
    modalOverlay.appendChild(modalBox);
    
    document.body.appendChild(modalOverlay);
    return modalContent;
};

/**
* 
* Overlay Element
* require assetViewer Repository - Calling assetViewerSelector function
* 
*/
ui.assetOverlay = function(json){
    require(["scripts/assetViewer/assetViewerSelector.js"], function(assetOverlay){
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
			assetViewerSelector(json.file, assetMain_viewer);
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
