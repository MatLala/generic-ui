/**
* Commons functions for UI components
*/

function tableHead(container, assets) {
    var table = document.createElement('table');
    var thead = document.createElement('thead');
//    var th0 = document.createElement('th');
    var th1 = document.createElement('th');
    var th2 = document.createElement('th');
    var th3 = document.createElement('th');
    var th4 = document.createElement('th');
    var th5 = document.createElement('th');
    var th6 = document.createElement('th');
    var tbody = document.createElement('tbody');

//    var checkAll = document.createElement('input');
//    checkAll.setAttribute('type', 'checkbox');
//    checkAll.id = 'select-all';


    th1.innerHTML = 'author';
    th2.innerHTML = 'file';
//    th3.innerHTML = 'version';
    th4.innerHTML = 'time &xutri;';
    th5.innerHTML = 'comment';
    
    th2.addEventListener('click', function(){
        var container = document.querySelector('#panelPrincipal');
//        tableSort(container, 'file', 1, 200);
        tableSort(container, 'file', 1, 200);
    });
//{"query":{"#parent":{"exists":true}},"sort":{"#parent":1},"limit":200,"skip":0}
//{"query":{"time":{"$exists":true}},"sort":{"time":-1},"limit":200,"skip":0}
    
//    th0.appendChild(checkAll);
    table.appendChild(thead);
//    thead.appendChild(th0);
    thead.appendChild(th1);
    thead.appendChild(th2);
//    thead.appendChild(th3);
    thead.appendChild(th4);
    thead.appendChild(th5);
    thead.appendChild(th6);
    table.appendChild(tbody);

    container.appendChild(table);
    return tbody;
}

function tableBody(container, assets) {
    for (var i=0; i<assets.length; i++) {
        var tr = document.createElement('tr');
//        var td0 = document.createElement('td');
        var td1 = document.createElement('td');
        var td2 = document.createElement('td');
//        var td3 = document.createElement('td');
        var td4 = document.createElement('td');
        var td5 = document.createElement('td');
        var td6 = document.createElement('td');

//        var check = document.createElement('input');
//        check.setAttribute('type', 'checkbox');
//        check.setAttribute('value', assets[i]._id);
//        check.setAttribute('name', 'number[id][]');
//        check.id = 'select-all';

        td2.className = 'clickable';

        var edit = document.createElement('a');
        edit.className = 'clickable';
        edit.innerHTML = 'edit';

        td6.file = assets[i].file;

        td1.innerHTML = assets[i].author;
        td2.innerHTML = assets[i].file;
//        td3.innerHTML = assets[i].version;
        td4.innerHTML = new Date(parseInt(assets[i].time));
        td5.innerHTML = assets[i].comment;

//        td0.appendChild(check);
        td6.appendChild(edit);
//        tr.appendChild(td0);
        tr.appendChild(td1);
        tr.appendChild(td2);
//        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(td5);
        tr.appendChild(td6);
        container.appendChild(tr);

        td2.addEventListener('click', function(){
            addHash('view='+this.innerHTML);
        });

        td6.addEventListener('click', function(){
//            addHash('edit='+this.file);
            window.location.hash = 'edit='+this.file;
        });
    }
}


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

function AutoGrowTextArea(textField) {
    if (textField.clientHeight < textField.scrollHeight)
    {
        textField.style.height = textField.scrollHeight + "px";
        if (textField.clientHeight < textField.scrollHeight)
        {
            textField.style.height = 
            (textField.scrollHeight * 2 - textField.clientHeight) + "px";
        }
    }
}

function spinner(htmlElement) {
	var spin = document.createElement('img');
	spin.style.display = 'inline-block';
	spin.setAttribute('class', 'spinner');
	spin.setAttribute('src', 'scripts/assetViewer/icons/tail-spin.svg');
	spin.style.display = 'inline-block';
	htmlElement.innerHTML = spin;
}
