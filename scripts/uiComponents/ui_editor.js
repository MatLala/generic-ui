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
compEditor = function(container){
    var editorContent = document.createElement('div');
    editorContent.id = 'editorContent';
    editorContent.className = 'editorContent';
    editorContent.innerHTML = 'Attribute Editor';

    container.appendChild(editorContent);
};
