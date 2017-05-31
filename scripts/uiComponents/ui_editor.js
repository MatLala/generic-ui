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
        damas.read( node._id, function(node){
            initEditorText(JSON.stringify(node));
        });
    };

    function initEditorText(text)
    {
        document.querySelector('#layer0SidePanel').style.minWidth = '50ex';
        if (!document.querySelector('#panelSecond')) {
            draw(document.querySelector('#layer0SidePanel'), JSON.parse(text));
        }
        var d = document.querySelector('#panelSecond');
        var t = d.querySelector('textarea');
        var b = d.querySelector('button');
        update( t, text);
        b.setAttribute('disabled', 'disabled');
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
        updateBt.innerHTML = 'Send';
        updateBt.setAttribute('disabled', 'disabled');
        bts.style.textAlign = 'right';
        UI_resize_all();

        area.addEventListener('keyup', function(e){
            check(area, updateBt, node);
        });

        updateBt.addEventListener('click', function(event) {
            var updateN = JSON.parse(area.value);
            var spin = document.createElement('div');
            spin.innerHTML = 'X';
            spin.classList.add('spinCss');
            event.target.innerHTML = '';
            event.target.appendChild(spin);
            damas.upsert(updateN, function(res) {
                if (!res) {
                    event.target.innerHTML = 'Send';
                    //updateBt.setAttribute('disabled', 'disabled');
                    alert("damas.upsert failed");
                    return;
                }
                else {
                    update(area, JSON.stringify(res));
                    check(area, updateBt, res);
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

    update = function( area, text ) {
        try {
            var obj = JSON.parse(text);
            text = text.replace('{', '{\n');
            text = text.replace('}', '\n}');
            text = text.replace(/:/g, ':\n');
            text = text.replace(/,/g, ',\n\n');
            area.value = text;
            return true;
        } catch (e) {
                area.value = text;
                return e;
        }
    };

    check = function( area, button, node ) {
        button.innerHTML = 'Send';
        button.title = '';
        button.setAttribute('disabled', 'disabled');
        var obj;
        try {
            obj = JSON.parse(area.value);
        } catch (e) {
            button.innerHTML = e.name;
            button.title = e.message;
            return;
        }
        if (!same(node, obj)){
            button.removeAttribute('disabled');
        }
    };

    function same(a, b) {
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
