/**
* HTML rendering methods for UI Components inside Layout
* require html container
* require damas.js
* call by process_hash function from main.js
*/


/**
* Generate Component : Editor
* 
*/
compEditor = function(container, json){
    var editorContent = document.createElement('div');
    editorContent.id = 'editorContent';
    editorContent.className = 'editorContent';
    editorContent.innerHTML = 'Attribute Editor';

    container.appendChild(editorContent);

    var area = document.createElement('textarea');
    area.name = 'editor';
    area.innerHTML = JSON.stringify(json);

    var updateBt = document.createElement('button');
    updateBt.setAttribute('type', 'submit');
    updateBt.innerHTML = 'Valider';

    var form = document.createElement('form');
    form.className = 'editorForm';

    form.addEventListener('submit', function(event){
        event.preventDefault();
        damas.update(null, JSON.parse(form.elements['editor'].value), function( res ) {
            if (!res) {
                alert("something went wrong!");
                return;
            }
        });
        return false;
    });

    form.appendChild(area);
    form.appendChild(updateBt);
    container.appendChild(form);

};
