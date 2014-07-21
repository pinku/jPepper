_.onDomReady(function () {

    var x = _("div");
    
    x
        .setStyle("width", "200px")
        .setStyle("height", "200px")
        .setStyle("background-color","red");

    var y = x.clone();

    y.remove();

    x.remove();
});