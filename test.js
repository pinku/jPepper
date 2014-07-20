_.onDomReady(function () {

    var x = _("div");
    
    x
        .setStyle("width", "200px")
        .setStyle("height", "200px")
        .setStyle("background-color","red");

    x.on("click.first", function (e) { alert("click1"); })
    x.on("click.second", function (e) {
        alert("click2");
        x.off("click");
    })
});