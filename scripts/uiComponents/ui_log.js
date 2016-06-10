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
            var str = '<table><thead><th><input type="checkbox" id="select-all" /></th><th>author</th><th>file</th><th>time &xutri;</th><th>comment</th></thead><tbody>';
            for (var i=0; i<assets.length; i++){
                str +=  '<tr>';
                str +=  '<td><input type="checkbox"/></td>';
                str +=  '<td>'+assets[i].author+'</td>';
                str +=  '<td><a href="#view='+assets[i].file+'">'+assets[i].file+'</a></td>';
                str +=  '<td>'+new Date(parseInt(assets[i].time))+'</td>';
                str +=  '<td style="white-space:normal">'+assets[i].comment+'</td>';
                str +=  '</tr>';
            }
            str += '</tbody>';
            str += '</table>';
            // Component destination
            container.innerHTML = str;
        });
    });
});


