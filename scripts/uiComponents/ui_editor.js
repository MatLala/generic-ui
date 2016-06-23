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
    container.innerHTML = '';
    var editorTitle = document.createElement('div');
    editorTitle.className = 'editorTitle';
    editorTitle.innerHTML = 'Attribute Editor';
    
    var editorContent = document.createElement('div');
    editorContent.id = 'editorContent';
    editorContent.className = 'editorContent';
    
    var editorContentHeader = document.createElement('div');
    editorContentHeader.className = 'editorContentHeader';
    editorContent.appendChild(editorContentHeader);
    
    var nodeName = document.createElement('div');
    nodeName.innerHTML = 'Node : '+json._id;
    editorContentHeader.appendChild(nodeName);

    var inputs = [];

    for(key in json) {
        var inputDiv = document.createElement('div');
        inputDiv.className = 'editorInputs';
        var inputKey = document.createElement('input');
        inputKey.value = key;
        var inputValue = document.createElement('input');
        inputValue.value = json[key];
        inputDiv.appendChild(inputKey);
        inputDiv.appendChild(inputValue);
        inputs.push(inputDiv);
    }

    var area = document.createElement('textarea');
    area.name = 'editor';
    area.innerHTML = JSON.stringify(json);
    area = [area];

    var updateBt = document.createElement('button');
    updateBt.setAttribute('type', 'submit');
    updateBt.innerHTML = 'Update';

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
    editorContentHeader.appendChild(displaySwitch);

    displaySwitch.addEventListener('click', function(event) {
        this.advanced ? switchMode(form, inputs) : switchMode(form, area);
        this.innerHTML = this.advanced ? 'Advanced mode' : 'Simple mode';
        this.advanced = !this.advanced;
        
        if (document.querySelector('.editorForm textarea')){
            AutoGrowTextArea(document.querySelector('.editorForm textarea'));
        }
    });

    switchMode(form, inputs);

    form.appendChild(updateBt);
    container.appendChild(editorTitle);
    container.appendChild(editorContent);

    editorContent.appendChild(form);

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
