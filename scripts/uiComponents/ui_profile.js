/**
* HTML rendering methods for UI Components inside Layout
* require html container
* require damas.js
* call by process_hash function from main.js
*/

/**
* Button for Profile Component
* Localisation : Header
*/
var profileBt = document.createElement('a');
profileBt.className = 'profileBt clickable';
//    profileBt.setAttribute('href', '#profile');
profileBt.setAttribute('title', 'Profile');

document.getElementById('headerRight').appendChild(profileBt);

profileBt.addEventListener('click', function(event) {
    window.location.hash = '#profile';
//        addHash('profile');
});

/**
* Generate Component : Profile
* 
*/
compProfile = function(container){
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

    container.appendChild(profileContent);
};

/**
* Generate Component : Settings
* 
*/
compSettings = function(container){
    var settingsContent = document.createElement('div');
    settingsContent.className = 'settingsContent';
    settingsContent.innerHTML = 'settings';
    
    container.appendChild(settingsContent);
};