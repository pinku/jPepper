_.onDomReady(function () {

    var x = _("div");

    x
        .setStyle("width", "200px")
        .setStyle("height", "200px");

    var div1 = _("#div1");
    div1.setStyle("background-color", "red");

    var div2 = _("#div2");
    div2.setStyle("background-color", "green");

    _("#run").on("click", function () {

        _.POST("perfdesk/perfdesk.asmx/helloworld").then(function () {
            console.log("then");
            debugger;
        }).do();

    });
});