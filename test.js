_.onDomReady(function () {

    var x = _("div");
    
    x
        .setStyle("width", "200px")
        .setStyle("height", "200px")
        .setStyle("background-color","red");

    var t1 = new Task(function (args) {

        alert("task1");

        var y = args.a + args.b;

        this.results = y;
        this.ok();

    });
    var t2 = new Task(function (h) {

        alert("task2");

        var g = this.prevTask.results + h;

        alert(g);

        this.results = g;

        this.ok();

    });
    var t3 = new Task(function (h) {

        alert("task3");

        var g = this.prevTask.results + h;

        alert(g);

        this.ok();

    });

    t1
        .ifok(t2, 20)
        .ifok(t3, 100)
        .do({
            a: 10,
            b: 10
        });

});