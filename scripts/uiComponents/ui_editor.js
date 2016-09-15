(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else {
		// Browser globals
		root.compEditor = factory();
	}
}(this, function () {
    loadCss('generic-ui/scripts/uiComponents/ui_editor.css');
    
    /**
    * HTML rendering methods for UI Components inside Layout
    * require damas.js
    * call by global initEditor function in ui_log.js and ui_search.js
    */
    function initEditor(node) {
        node = damas.read(node._id);
        if (!document.querySelector('#panelSecond')) {
            compEditor(createPanel(document.body), node);
        }
        else {
            compEditor(document.querySelector('#panelContent'), node);
        }
    };
 
	function createPanel(container){
		var panel = document.createElement('div');
		panel.id = 'panelSecond';
		var panelContent = document.createElement('div');
		panelContent.id = 'panelContent';
		var panelClose = document.createElement('div');
//		panelClose.className = 'fa fa-close btCloseP clickable';
        panelClose.className = 'btCloseP clickable';
	    panelClose.innerHTML = 'X';
        
        panelClose.addEventListener('click', function(e){
            panel.remove();
            if (document.querySelector('tr.selected')){
                document.querySelector('tr.selected').classList.remove('selected');
            }
        }, false);

		panel.appendChild(panelClose);
		panel.appendChild(panelContent);

		container.appendChild(panel);
		return panelContent;
	};

    /**
    * Generate Component : Editor
    * 
    */
    compEditor = function(container, node){
        container.innerHTML = '';
        var editorTitle = document.createElement('div');
        editorTitle.className = 'editorTitle';
        editorTitle.innerHTML = 'JSON Editor';

        var editorContent = document.createElement('div');
        editorContent.id = 'editorContent';
        editorContent.className = 'editorContent';

        var editorContentHeader = document.createElement('div');
        editorContentHeader.className = 'editorContentHeader';
        editorContent.appendChild(editorContentHeader);

        var nodeName = document.createElement('div');
        nodeName.innerHTML = 'Node : </br>'+ node._id;
        editorContentHeader.appendChild(nodeName);

        var area = document.createElement('textarea');
        area.name = 'editor';
		var text = JSON.stringify(node);
		text = text.replace(/,/g, ',\n');
		text = text.replace('{', '{\n');
		text = text.replace('}', '\n}');

/*
        var keys = Object.keys(node).sort();
        var text = '{\n';
        for (i = 0; i < keys.length ; i++){
            text += '"'+ keys[i] +'":"' + node[keys[i]] +'"';
            if (i !== keys.length - 1) {
                text += ',\n';
            }
            else {
                text += '\n}';
            }
        }
*/
        area.innerHTML = text;

        var updateBt = document.createElement('button');
        updateBt.innerHTML = 'Update';
        updateBt.setAttribute('disabled', 'disabled');

        var form = document.createElement('div');
        form.className = 'editorBox';

        area.addEventListener('keyup', function(e){
            var updateN;
            try {
                updateN = JSON.parse(area.value);
                if (!compareObjects(node, updateN)){
                    updateBt.removeAttribute('disabled');
                }
                else {
                    updateBt.setAttribute('disabled', 'disabled');
                }
            } catch (e) {
                updateBt.setAttribute('disabled', 'disabled');
                return;
            }
        });

        updateBt.addEventListener('click', function(event) {
            var updateN = JSON.parse(area.value);
            var spin = document.createElement('div');
            spin.innerHTML = 'X';
            spin.classList.add('spinCss');
            event.target.innerHTML = '';
            event.target.appendChild(spin);
            damas.update(updateN, function(res) {
                if (!res) {
                    event.target.innerHTML = 'Update';
                    //updateBt.setAttribute('disabled', 'disabled');
                    alert("damas.update failed");
                    return;
                }
                else {
                    compEditor(document.querySelector('#panelContent'), res);
                    return;
                }
            });
            return false;
        });
        
        var bts = document.createElement('div');
        bts.style.textAlign = 'right';

        form.appendChild(area);
        form.appendChild(bts);
        bts.appendChild(updateBt);
        container.appendChild(editorTitle);
        container.appendChild(editorContent);
        
        editorContent.appendChild(form);

        area.style.height = window.innerHeight - (editorTitle.offsetHeight + editorContentHeader.offsetHeight + bts.offsetHeight) +'px';
        window.addEventListener('resize', function(event){
            area.style.height = window.innerHeight - (editorTitle.offsetHeight + editorContentHeader.offsetHeight + bts.offsetHeight) +'px';
        });
    };
    
    function compareObjects(a, b) {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (i in a) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    window.initEditor = initEditor;
}));
