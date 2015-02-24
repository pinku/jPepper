"use strict";

window._jp = window._;

var createhtml = function () {

    return _("#prehtml").val();

}
var createcss = function () {

    return "<style>" + _("#precss").val() + "</style>";
    
}
var createjs = function () {
    return "var fn = function() {" + _("#prejs").val() + "}; fn();";
}

var showtestcode = function () {
    if (a.mode == "new") {
        var main = _jp("body");
        main.load("pages/testcode.html");
    }
}

var runprejs = function () {
    try {
        eval(createjs());
    }
    catch (e) {
        alert("error");
    }
}

var bindevents = function () {
    _("#newtest").on("click", function (e) {
    });
    _("#prehtml").on("blur", function (e) {
        var t = createcss() +  createhtml();
        _("#result .content").innerHTML(t);
        runprejs();
    });
    _("#precss").on("blur", function (e) {
        var t = createcss() +  createhtml();
        _("#result .content").innerHTML(t);
        runprejs();
    });
    _("#prejs").on("blur", function (e) {
        var t = createcss() +  createhtml();
        _("#result .content").innerHTML(t);
        runprejs();
    });
}

_jp.onDomReady(function (e) {

    var main = _jp("#content");
    
    _.load(main, "pages/prehtml.html")
        .then(_.load, main, "pages/precss.html")
        .then(_.load, main, "pages/prejs.html")
        .then(_.load, main, "pages/result.html")
        .then(_.load, main, "pages/newtest.html")
        .then(function () {
            bindevents();
        }).do();

});

