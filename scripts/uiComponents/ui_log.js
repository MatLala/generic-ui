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
                str +=  '<td><input type="checkbox" value="'+ assets[i]._id +'" name="number[id][]"/></td>';
                str +=  '<td>'+assets[i].author+'</td>';
                str +=  '<td><a href="#view='+assets[i].file+'" class="tableFileName">'+assets[i].file+'</a></td>';
                str +=  '<td>'+new Date(parseInt(assets[i].time))+'</td>';
                str +=  '<td style="white-space:normal">'+assets[i].comment+'</td>';
                str +=  '</tr>';
            }
            str += '</tbody>';
            str += '</table>';
            // Component destination
            container.innerHTML = str;
            checkFt();
        });
    });
});

function checkFt() {
    var checkboxes = document.getElementsByName('number[id][]');	
    checkedB = [];
    for(var i = 0; i < checkboxes.length; i++){
        checkboxes[i].addEventListener("change", function(event){
            var checkbox = event.target;
            if(checkbox.checked){
                checkedB.push(this.value);
            }
            else {
                checkedB.splice(checkedB.indexOf(this.value),1);
            }
        });
    }
    var selectAll = document.getElementById('select-all');
    selectAll.addEventListener('click', function(e){
        if(this.checked){
            for (var i=0; i<checkboxes.length; i++){
                checkboxes[i].checked = true;
                checkedB.push(checkboxes[i].value);
            }
        }
        else {
            for (var i=0; i<checkboxes.length; i++){
                checkboxes[i].checked = false;
                checkedB.splice(checkedB.indexOf(checkboxes[i].value),1);
            }
        }
    });
}


