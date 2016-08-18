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
    * require html container
    * require damas.js
    * require main.js
    * require ui_common.js
    * call by global initEditor function in ui_log.js and ui-search.js
    */
    function initEditor(filepath) {
            console.log(filepath);
            damas.search('#parent:' + filepath, function(index) {
                damas.read(index[0], function(node) {
                    if (!document.querySelector('#panelSecond')) {
                        var container = document.body;
                        compEditor(createPanel(container), node);
                    }
                    else {
                        compEditor(document.querySelector('#panelContent'), node);
                    }
                });
            });
    };
 
	function createPanel(container){
		var panel = document.createElement('div');
		panel.id = 'panelSecond';
		var panelContent = document.createElement('div');
		panelContent.id = 'panelContent';
		panelContent.className = 'panelContent';
		var panelClose = document.createElement('div');
		panelClose.className = 'fa fa-close btCloseP clickable';
	//    panelClose.innerHTML = 'X';
		panelClose.addEventListener('click', function(){
			panel.remove();
		});

		panel.appendChild(panelClose);
		panel.appendChild(panelContent);

		container.appendChild(panel);
		return panelContent;
	};

    /**
    * Generate Component : Editor
    * 
    */
    compEditor = function(container, json){

        document.addEventListener("secondPanel:close", function(e){
            if (document.querySelector('.selected')){
                document.querySelector('.selected').classList.remove('selected');
            }
        }, false);

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
        nodeName.innerHTML = 'Node : </br>'+json['#parent'];
        editorContentHeader.appendChild(nodeName);

        var area = document.createElement('textarea');
        area.name = 'editor';
        area.innerHTML = JSON.stringify(json).replace(/,/g, ',\n').replace(/{/g, '{\n').replace(/}/g, '\n}');
//        area.innerHTML = JSON.stringify(json);

        var updateBt = document.createElement('button');
        updateBt.setAttribute('type', 'submit');
        updateBt.className = 'clickable';
        updateBt.innerHTML = 'Update';
        updateBt.style.float = 'right';

        var form = document.createElement('form');
        form.className = 'editorForm';
        
        area.addEventListener('change', function(e){
            var updateN;
            try {
                updateN = JSON.parse(form.elements['editor'].value);
            } catch (e) {
                alert("not writing correctly !");
                return;
            }
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            var updateN;
            try {
                updateN = JSON.parse(form.elements['editor'].value);
            } catch (e) {
                alert("not writing correctly !");
                return;
            }
            damas.update(updateN, function( res ) {
                if (!res) {
                    alert("something went wrong!");
                    return;
                }
                else {
                    alert("update done!");
                    return;
                }
            });
            return false;
        });
        
        var deleteBt = document.createElement('button');
        deleteBt.innerHTML = 'Delete';
        deleteBt.className = 'clickable';
        deleteBt.style.float = 'left';
        deleteBt.addEventListener('click', function(event) {
            event.preventDefault();
            if (confirm("Delete this node ?")){
                damas.delete(json._id, function( res ) {
                    if (!res) {
                        alert("something went wrong!");
                        return;
                    }
                    else {
                        return;
                    }
                });
                return false;
            }
        });
        
        var bts = document.createElement('div');
        bts.style.width = '100%';
        bts.style.display = 'table';

        form.appendChild(area);
        form.appendChild(bts);
        bts.appendChild(updateBt);
        bts.appendChild(deleteBt);
        container.appendChild(editorTitle);
        container.appendChild(editorContent);
        
        editorContent.appendChild(form);

        area.style.height = window.innerHeight - (editorTitle.offsetHeight + editorContentHeader.offsetHeight + bts.offsetHeight) +'px';
        window.addEventListener('resize', function(event){
            area.style.height = window.innerHeight - (editorTitle.offsetHeight + editorContentHeader.offsetHeight + bts.offsetHeight) +'px';
        });
    };
    window.initEditor = initEditor;
}));