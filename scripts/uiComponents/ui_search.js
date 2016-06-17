/**
* HTML rendering methods for UI Components inside Layout
* require html container
* require damas.js
* call by process_hash function from main.js
*/


/**
* Input and button (for mobiles) elements for Search Component
* Localisation : Header
*/
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

/**
* Generate Component : Search Results
* 
*/
compSearch = (function(container, terms){
//    damas.search('file:/'+terms+'.*jpg/i', function(res){
    damas.search_mongo({'file': 'REGEX_'+terms+'.*'}, {"time":-1},200,0, function(res){
        console.log(res);
        damas.read(res, function(assets){
            container.appendChild(table(assets));
            checkFt();
        });
    });
});
