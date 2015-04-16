_.onDomReady(function () {

    var form1 = new jPForm({
        id:"form1"
    });
    var section1 = new jPSection();
    form1.addcontrol(section1);

    var text1 = new jPText();
    section1.addcontrol(text1);

    var tb1 = new jPTextBox({
        id: "codice"
    });
    section1.addcontrol(tb1);

    var b1 = new jPButton({
        caption: "Ok",
        onclick: function (e) { 
            var j = this.parent.parent.tojson();
        }
    });
    section1.addcontrol(b1);

    form1.on("afterrender",function (e) {
    });

    form1.appendto("body");

    tb1.caption("ciao");


});