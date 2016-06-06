require.config({
    paths:{
        'damas':"damas",
        'main_common': "main_common",
        'ui_components':"uiComponents/ui_components"
    },
    urlArgs: "v=" + (new Date()).getTime()
});

require(["damas", "main_common", "ui_components"], function(damas){
    loadCss("scripts/uiComponents/ui.css");
    loadCss("scripts/uiComponents/ui_design.css");
    window.damas = damas;
    damas.server = '/api/';
    
    ui.header();
    ui.log();
    process_hash();
});