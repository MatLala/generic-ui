/**
* HTML rendering methods for UI Components inside Layout
* require html container
* require damas.js
* call by process_hash function from main.js
*/


/**
* Generate Component : Log Results
* 
*/
compLog = (function(container){
    damas.search_mongo({'time': {$exists:true}}, {"time":-1},200,0, function(res){
        damas.read(res, function(assets){
            container.appendChild(table(assets));
            checkFt();
        });
    });
});


/**
* Variant : insert console log html
* from public folder in Nodejs server version
* require utils.js
*/
compLog1 = (function(container){
    var x = document.createElement('iframe');
    x.src = "console.html";
    x.style.width = '100%';
    x.style.height = '100%';
    x.style.border = 'none';
    x.style.margin = '0';
    x.style.padding = '0';
    container.style.overflow = 'hidden';
    container.appendChild(x);
});
