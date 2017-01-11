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
    
    function initEditor(node) {
		document.querySelector('#layer0SidePanel').style.minWidth = '50ex';
        damas.read(node._id, function(node){
            if (!document.querySelector('#panelSecond')) {
                draw(document.querySelector('#layer0SidePanel'), node);
            }
            refresh( document.querySelector('#panelSecond'), node);
        });
    };

    draw = function (container, node) {
        var panel = document.createElement('div');
        var panelContent = document.createElement('div');
        var panelClose = document.createElement('div');
        var editorTitle = document.createElement('div');
        var editorContent = document.createElement('div');
        var form = document.createElement('div');
        var area = document.createElement('textarea');
        var updateBt = document.createElement('button');
        var bts = document.createElement('div');

        panel.appendChild(panelClose);
        panel.appendChild(panelContent);
        container.appendChild(panel);
        form.appendChild(area);
        form.appendChild(bts);
        bts.appendChild(updateBt);
        panelContent.appendChild(editorTitle);
        panelContent.appendChild(editorContent);
        editorContent.appendChild(form);

        area.name = 'editor';
        panel.id = 'panelSecond';
        panelContent.id = 'panelContent';
        //panelClose.className = 'fa fa-close btCloseP clickable';
        panelClose.className = 'btCloseP clickable';
        form.className = 'editorBox';
        editorTitle.className = 'editorTitle menubar';
        editorContent.id = 'editorContent';
        editorContent.className = 'editorContent';

        panelClose.innerHTML = 'X';
        panelClose.addEventListener('click', function(e){
            container.style.width = '0';
            container.style.minWidth = '0';
            panel.remove();
            if (document.querySelector('tr.selected')){
                document.querySelector('tr.selected').classList.remove('selected');
            }
        }, false);

        editorTitle.innerHTML = 'JSON Editor';
        updateBt.innerHTML = 'Update';
        updateBt.setAttribute('disabled', 'disabled');
        bts.style.textAlign = 'right';
        UI_resize_all();

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
                    refresh(form, res);
                    return;
                }
            });
            return false;
        });
        
        area.style.height = window.innerHeight - document.querySelector('#layer0menu').clientHeight -  (editorTitle.offsetHeight + bts.offsetHeight) +'px';
        window.addEventListener('resize', function(event){
            area.style.height = window.innerHeight - document.querySelector('#layer0menu').clientHeight -  (editorTitle.offsetHeight + bts.offsetHeight) +'px';
            //area.style.height = container.parentNode.clientHeight - (editorTitle.offsetHeight + bts.offsetHeight) -100 +'px';
        });
    };

    refresh = function( editor_div, node ) {
        console.log(editor_div);
        var text = JSON.stringify(node);
        text = text.replace('{', '{\n');
        text = text.replace('}', '\n}');
        text = text.replace(/:/g, ':\n');
        text = text.replace(/,/g, ',\n\n');
        var area = editor_div.querySelector('textarea');
        var updateBt = editor_div.querySelector('button');
        area.value = text;
        updateBt.innerHTML = 'Update';
        updateBt.setAttribute('disabled', 'disabled');
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
