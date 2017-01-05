function load(url, callback) {
    var xhr;

    if (typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
        var versions = ["MSXML2.XmlHttp.5.0",
                        "MSXML2.XmlHttp.4.0",
                        "MSXML2.XmlHttp.3.0",
                        "MSXML2.XmlHttp.2.0",
                        "Microsoft.XmlHttp"]

        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            }
            catch (e) { }
        } // end for
    }

    xhr.onreadystatechange = ensureReadiness;

    function ensureReadiness() {
        if (xhr.readyState < 4) {
            return;
        }

        if (xhr.status !== 200) {
            return;
        }

        // all is well  
        if (xhr.readyState === 4) {
            callback(xhr);
        }
    }

    xhr.open('GET', url, true);
    xhr.send('');
}

function rebindEvents() {

    _(".leftsummary ul li a").off().on("click", function (e) {

        var link = _(e.currentTarget);
        var menu = link.attr("data-menu");
        var url = document.URL;
        var ix = url.indexOf("?");
        if (ix != -1) {
            url = url.substring(0, ix);
        }
        url = url.replace("#", "");
        url = url + "?page=" + menu;
        window.location = url;

    });

    _("a[data-cmd=page").off().on("click", function (e) {

        var link = _(e.currentTarget);
        var menu = link.attr("data-page");
        var url = document.URL;
        var ix = url.indexOf("?");
        if (ix != -1) {
            url = url.substring(0, ix);
        }
        url = url.replace("#", "");
        url = url + "?page=" + menu;
        window.location = url;

    });
}

function loadInto(url, jp) {

    load(url, function (e) {
        jp.nodes[0].innerHTML = e.responseText;

        prettify();

        rebindEvents();

    });

}

function queryString(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function checkQueryString() {

    var page = queryString("page");
    if (page != "") {
        loadInto("pages/"+page+".html", right);
    } else {
        loadInto("pages/introduction.html", right);
    }
}

function prettify() {

    // sostituisce tutti i caratteri speciali per l'html
    var pre = _("pre");
    var i = 0, len = pre.nodes.length;
    var reg1 = new RegExp("<", "g");
    var reg2 = new RegExp(">", "g"); 
    var reg3 = new RegExp('"', "g"); 

    while (i != len) {
        pre.nodes[i].innerHTML = pre.nodes[i].innerHTML.replace(reg1, "&lt;")
        pre.nodes[i].innerHTML = pre.nodes[i].innerHTML.replace(reg2, "&rt;") 
        pre.nodes[i].innerHTML = pre.nodes[i].innerHTML.replace(reg3, "&quot;") 
        i++;
    }
    prettyPrint();

}