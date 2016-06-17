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

    var inputs = [];

    for(key in json) {
        var inputKey = document.createElement('input');
        inputKey.value = key;
        var inputValue = document.createElement('input');
        inputValue.value = json[key];
        inputs.push(inputKey);
        inputs.push(inputValue);
    }

    var area = document.createElement('textarea');
    area.name = 'editor';
    area.innerHTML = JSON.stringify(json);
    area = [area];

    var updateBt = document.createElement('button');
    updateBt.setAttribute('type', 'submit');
    updateBt.innerHTML = 'Valider';

    var form = document.createElement('form');
    form.className = 'editorForm';

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        damas.update(null, JSON.parse(form.elements['editor'].value), function( res ) {
            if (!res) {
                alert("something went wrong!");
                return;
            }
        });
        return false;
    });

    var displaySwitch = document.createElement('button');
    displaySwitch.advanced = false;
    displaySwitch.innerHTML = 'Advanced mode';

    displaySwitch.addEventListener('click', function(event) {
        this.advanced ? switchMode(form, inputs) : switchMode(form, area);
        this.innerHTML = this.advanced ? 'Advanced mode' : 'Simple mode';
        this.advanced = !this.advanced;
    });

    switchMode(form, inputs);

    container.appendChild(editorContent);
    container.appendChild(displaySwitch);
    form.appendChild(updateBt);
    container.appendChild(form);

};

function switchMode(form, inputs) {
    var len = form.childNodes.length - 1;
    for (var i = 0; i < len; ++i) {
        form.removeChild(form.childNodes[0]);
    }
    for (var i = inputs.length - 1; i >= 0; --i) {
        form.insertBefore(inputs[i], form.childNodes[0]);
    }
}
