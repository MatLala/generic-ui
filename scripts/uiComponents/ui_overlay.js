/**
* HTML rendering methods for UI Components inside Layout
* require html container
* require damas.js
* call by process_hash function from main.js
*/

/**
* Header for assetViewer Component
* 
*/
compAssetHeader = function(json){
    var assetTitle = assetHeader.querySelector('.assetTitle');
    var assetBts = assetHeader.querySelector('.assetBts');

    var assetLabel = document.createElement('div');
    assetLabel.setAttribute('class', 'assetLabel');
    assetTitle.appendChild(assetLabel);
    if(json.file){
    //    assetLabel.innerHTML = json.file.split('/').pop();
        assetLabel.innerHTML = json.file;
        var btDl = document.createElement('a');
        btDl.setAttribute('class', 'headBt btDl clickable');
        btDl.setAttribute('href', json.file );
        btDl.setAttribute('title', 'Download');
        var btUp = document.createElement('a');
        btUp.setAttribute('class', 'headBt btUp clickable');
        btUp.setAttribute('title', 'Upload Version');
        assetBts.appendChild(btDl);
        assetBts.appendChild(btUp);
    }
    else
    {
        assetLabel.innerHTML = json._id;
    }
};


compAssetInfos = function(json){
    var div = document.createElement('div');
	div.setAttribute('class', 'stripInfos assetContent close');
//	element.appendChild(div);

	var td1 = document.createElement('div');
	td1.setAttribute('class', 'stripTable');
	div.appendChild(td1);
	var td1_a = document.createElement('div');
	td1_a.setAttribute('class', 'stripCell thumbFile');
	td1.appendChild(td1_a);
	var td1_b = document.createElement('div');
	td1_b.setAttribute('class', 'stripCell');
	td1.appendChild(td1_b);
//		var td2 = document.createElement('div');
//		td2.setAttribute('class', '');
//		div.appendChild(td2);
	var td3 = document.createElement('div');
	td3.setAttribute('class', 'showKeys');
	div.appendChild(td3);

	//Profile
	var a = document.createElement('div');
	a.setAttribute('class', 'thumbFile');
	td1_a.appendChild(a);

	var assetLabel = document.createElement('h3');
	td1_b.appendChild(assetLabel);
//	a.appendChild(icon(json));

	if (json.file) {
		assetLabel.innerHTML = json.file.split('/').pop();
	}
	if (json.type === 'folder' || json.type === 'sequence') {
		assetLabel.innerHTML = json._id;
	}
	if (json.type) {
		var assetType = document.createElement('h4');
		assetType.innerHTML = json.type;
		td1_b.appendChild(assetType);
	}
	if (json.user) {
		var assetUser = document.createElement('h4');
		assetUser.innerHTML = json.user;
		td1_b.appendChild(assetUser);
	}
	if (json.time) {
		var assetTime = document.createElement('h4');
		// moment.js require to add
//			moment.locale('fr');
		var getTime = json.time;
//			var assetDate = moment.unix(getTime).format('LLL');
//			assetTime.innerHTML = assetDate;
		assetTime.innerHTML = getTime;
		td1_b.appendChild(assetTime);
	}
	if (json.file) {
		var  ext = json.file.split(".").pop().toLowerCase();
		if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'tiff'){
			var assetImageSize = document.createElement('h4');
			var img = new Image();
			img.src = json.file;
			img.addEventListener( 'load', function(e){
				assetImageSize.innerHTML = img.width + "x" + img.height + "pixels";
				td1_b.appendChild(assetImageSize);
			});
		}
	}
	if (json.bytes) {
		var assetSize = document.createElement('h4');
		assetSize.innerHTML = human_size(json.bytes);
		td1_b.appendChild(assetSize);
	}
    
    return div;
};


//var profileBt = document.createElement('a');
//profileBt.className = 'profileBt clickable';
////    profileBt.setAttribute('href', '#profile');
//profileBt.setAttribute('title', 'Profile');
//
//document.getElementById('headerRight').appendChild(profileBt);
//
//profileBt.addEventListener('click', function(event) {
//    window.location.hash = '#profile';
////        addHash('profile');
//});

/**
* Generate Component : Profile
* 
*/


