/**
* HTML rendering methods for UI Elements inside Layout
* requires main.js
* call by process_hash function
* @return HTML element as container for components
*/


//loadCss('scripts/uiLayout/ui_layout.css');
//loadCss('scripts/uiLayout/ui_design.css');
loadCss('scripts/vendor/font-awesome-4.6.3/css/font-awesome.min.css');
/** 
 * @namespace for UI Elements
 */
if(window['ui']===undefined) ui = {};


/**
* 
* Lateral panel or overlay view in contents div
* 
*/

ui.secondPanel = function(container){
    var panel = document.createElement('div');
    panel.className = 'panelSecond';
    var panelContent = document.createElement('div');
    panelContent.id = 'panelContent';
    panelContent.className = 'panelContent';
    var panelClose = document.createElement('div');
    panelClose.className = 'fa fa-close fa-lg btClose clickable';
//    panelClose.innerHTML = 'X';
    panelClose.addEventListener('click', function(){
        panel.remove();
        document.dispatchEvent(closePanel);
    });
    var closePanel = new CustomEvent( "secondPanel:close");
    
    panel.appendChild(panelClose);
    panel.appendChild(panelContent);
    
    container.appendChild(panel);
    return panelContent;
};

/**
* 
* Modal Element - overlay view
* @ return {object} html Element
*/
ui.modal = function(){
    var modalOverlay = document.createElement('div');
    modalOverlay.className = 'modalOverlay';
    var modalBox = document.createElement('div');
    modalBox.className = 'modalBox';
    
    var modalHeader = document.createElement('div');
    modalHeader.id = 'modalHeader';
    var modalContent = document.createElement('div');
    modalContent.id = 'modalContent';

    var btClose = document.createElement('div');
    btClose.className = 'fa fa-close fa-lg btClose clickable'
//    btClose.innerHTML = 'X';
    
    modalBox.appendChild(btClose);
    
    btClose.addEventListener('click', function(){
        modalOverlay.remove();
        document.dispatchEvent(closeModal);
    });
    var closeModal = new CustomEvent( "modal:close");
    
    modalBox.appendChild(modalHeader);
    modalBox.appendChild(modalContent);
    modalOverlay.appendChild(modalBox);
    
    document.body.appendChild(modalOverlay);
    return modalContent;
};