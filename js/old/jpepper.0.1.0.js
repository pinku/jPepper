"use strict";


(function (window) {

    Object.defineProperty(Array.prototype, "remove", {
        value: function (from, to) {
            var rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        },
        writable: false,
        enumerable: false,
        configurable: false
    });

    //#region jPepper

    /**
    @constructor    jPepper
    @description    Funzione principale che definisce la classe jPepper
    @param          {object}    a   -   oggetto o stinga che indica il selettore da passare alla classe
    */
    var jPepper = function (a) {

        return new jPepper.init(a);

    };
    //#endregion

    //#region metodi statici

    /**
    @func           jPepper.init
    */
    jPepper.init = function (selector) {

        if (selector) {
            if (selector.type && selector.type === "jPepper") {
                return this.createElByNodes(selector.nodes);
            }
            this.selector = selector;
            this.type = "jPepper";
            return this.getEl(selector);
        }

        this.nodes = [];
        this.type = "jPepper";

        return this;
    };
    jPepper.getEl = function (selector) {
        return new jPepper.init().getEl(selector);
    };
    jPepper.getElByID = function (id) {
        return new jPepper.init().getElByID(id);
    };
    jPepper.getElByTag = function (tag) {
        return new jPepper.init().getElByTag(tag);
    };
    jPepper.getElByClass = function (c) {
        return new jPepper.init().getElByClass(c);
    };
    jPepper.createElByTag = function (tag) {
        return new jPepper.init().createElByTag(tag);
    };
    jPepper.createElByNodes = function (nodes) {
        return new jPepper.init().createElByNodes(nodes);
    };
    jPepper.extendObj = function (a, b) {
        for (var key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    };
    jPepper.iterateDom = function (a, b) {

        var _nodes = [];
        if (b) { _nodes = b; }

        if (a.selector && typeof (a.selector) == "object") {
            for (var i = 0; i < a.nodes.length; i++) {
                _nodes.push(a.nodes[i]);
                jPepper.iterateDom(a.nodes[i], _nodes);
            }
        }
        if (a.nodes) {
            for (var i = 0; i < a.nodes.length; i++) {
                _nodes.push(a.nodes[i]);
                jPepper.iterateDom(a.nodes[i], _nodes);
            }
        }
        if (a.childNodes) {
            for (var i = 0; i < a.childNodes.length; i++) {
                _nodes.push(a.childNodes[i]);
                jPepper.iterateDom(a.childNodes[i], _nodes);
            }
        }

        return _nodes;
    };
    jPepper.loadPage = function (a) {
        return new jPepper.init().loadPage(a);
    };
    jPepper.setListener = function (a, b, c) {
        var eventsArray = b.split(' '),
            i = eventsArray.length;

        while (i--) {
            a.addEventListener(eventsArray[i], c, false);
        }
    };
    jPepper.getPointerEvent = function (a) {
        return a.targetTouches ? a.targetTouches[0] : a;
    };
    jPepper.sendEvent = function (a, b, c, d) {
        var customEvent = doc.createEvent('Event');

        d = d || {};
        d.x = currX;
        d.y = currY;
        d.distance = d.distance;
        if (useJquery)
            jQuery(a).trigger(b, d);
        else {
            customEvent.originalEvent = c;
            for (var key in d) {
                customEvent[key] = d[key];
            }
            customEvent.initEvent(b, true, true);
            elm.dispatchEvent(customEvent);
        }
    };
    //#endregion

    //#region metodi di instanza
    jPepper.init.prototype.createElByTag = function (tag) {
        this.type = "jPepper";
        this.nodes = [];
        this.nodes.push(document.createElement(tag));
        return this;
    };
    jPepper.init.prototype.createElByNodes = function (nodes) {
        this.type = "jPepper";
        this.nodes = nodes;
        return this;
    };
    jPepper.init.prototype.getEl = function (selector) {

        if (
            (
            this.selector === document ||
            this.selector === window ||
            !this.nodes ||
            !this.nodes.lenght ==0
            ) &&
            !selector.nodeName
            ) {
            return jPepper.createElByNodes(document.querySelectorAll(selector));
        }

        if (selector.nodeName) {
            return new jPepper.init().createElByNodes([selector]);
        }

        var _n = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var _n1 = Array.prototype.slice.call(this.nodes[i].querySelectorAll(selector), 0);;
            _n = _n.concat(_n1);
        }
        return new jPepper.init().createElByNodes(_n);

    };
    jPepper.init.prototype.getElByID = function (id) {

        if (this.selector === document ||
            this.selector === window) {
            return jPepper.createElByNodes(document.getElementById(id));
        }

        var _nodes = jPepper.iterateDom(this);
        var _n = [];
        for (var i = 0; i < _nodes.length; i++) {
            if (_nodes[i].id == id) {
                _n.concat(_nodes[i].querySelectorAll(selector));
            }
        }
        return new jPepper.init().createElByNodes(_n);

    };
    jPepper.init.prototype.getElByTag = function (tag) {

        if (this.selector === document ||
            this.selector === window) {
            return jPepper.createElByNodes(document.getElementsByTagName(tag));
        }

        var _nodes = jPepper.iterateDom(this);
        var _n = [];
        for (var i = 0; i < _nodes.length; i++) {
            
            if (_nodes[i].tagName && _nodes[i].tagName.toLowerCase() == tag.toLowerCase()) {
                _n.push(_nodes[i]);
            }
        }
        return new jPepper.init().createElByNodes(_n);
    };
    jPepper.init.prototype.getElByClass = function (c) {

        if (this.selector === document ||
            this.selector === window) {
            return jPepper.createElByNodes(document.getElementsByClassName(c));
        }

        var _nodes = jPepper.iterateDom(this);
        var _n = [];
        for (var i = 0; i < _nodes.length; i++) {
            if (new RegExp('(\\s|^)' + c + '(\\s|$)').test(_nodes[i].className)) {
                _n.push(_nodes[i]);
            }
        }
        return new jPepper.init().createElByNodes(_n);

    };
    jPepper.init.prototype.onClick = function (f) {

        var _this = this;

        // setter
        if (f) {
            var handler = function (e) {
                f.call(_this, e);
            };
            if (this.selector === document ||
                this.selector === window) {
                this.selector.onclick = handler;
                return _this;
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.onclick = handler;
            }
            return _this;
        }

        // raise event
        if (!f) {
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.onclick();
            }
            return _this;
        }

    };
    jPepper.init.prototype.onChange = function (f) {

        var _this = this;

        // setter 
        if (f) {
            var handler = function (e) {
                f.call(_this, e);
            };
            if (this.selector === document ||
                this.selector === window) {
                this.selector.onchange = handler;
                return _this;
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.onchange = null;
                n.onchange = handler;
            }

            return _this;
        }

        // getter
        if (!v) {

            // ciclo per i nodi
            for (var i = 0; i < this.nodes.length; i++) {

                var n = this.nodes[i];

                switch (n.nodeName) {
                    case "SELECT":
                    case "TEXTAREA":
                        return n.onchange();
                        break;
                    case "SPAN":
                        return n.onchange();
                        break;
                    case "INPUT":
                        return n.onchange();
                        break;
                }
            }

            return;

        }

    };
    jPepper.init.prototype.onKeydown = function (f) {

        var _this = this;

        // setter
        if (f) {
            var handler = function (e) {
                f.call(_this, e);
            };
            if (this.selector === document ||
                this.selector === window) {
                this.selector.onkeydown = handler;
                return _this;
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.onkeydown = handler;
            }

            return _this;
        }

    };
    jPepper.init.prototype.onScroll = function (f) {

        var _this = this;

        // setter
        if (f) {
            var handler = function (e) {
                f.call(_this, e);
            };
            if (this.selector === document ||
                this.selector === window) {
                this.selector.onscroll = handler;
                return _this;
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.onscroll = handler;
            }

            return _this;
        }

    };
    jPepper.init.prototype.onBlur = function (f) {

        var _this = this;

        // setter
        if (f) {
            var handler = function (e) {
                f.call(_this, e);
            };
            if (this.selector === document ||
                this.selector === window) {
                this.selector.onblur = handler;
                return _this;
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.onblur = handler;
            }

            return _this;
        }

    };
    jPepper.init.prototype.val = function (v) {

        var _this = this;

        // setter
        if (v !== undefined) {

            // ciclo per i nodi
            for (var i = 0; i < this.nodes.length; i++) {

                var n = this.nodes[i];

                switch (n.nodeName) {
                    case "SPAN":
                        n.innerHTML = v;
                        break;
                    case "INPUT":
                        if (_(n).getAttr("type") == "checkbox") {
                            if (v == 1 || v == "on" || v == true || v == "true") { _(n).setAttr("checked", "checked"); } else { _(n).removeAttr("checked"); }
                        } else {
                            n.value = v;
                        }
                        break;
                    default:
                        n.value = v;
                        break;

                }
            }

            return this;
        }

        // getter
        if (!v) {

            // ciclo per i nodi
            for (var i = 0; i < this.nodes.length; i++) {

                var n = this.nodes[i];

                switch (n.nodeName) {
                    case "SELECT":
                    case "TEXTAREA":
                        return n.value;
                        break;
                    case "SPAN":
                        return n.innerHTML;
                        break;
                    case "INPUT":
                        if (_(n).getAttr("type") == "checkbox") {
                            if (_(n).nodes[0].checked) { return true; } else { return false; }
                        } else {
                            return n.value;
                        }
                        break;
                }
            }

            return;

        }

    };
    jPepper.init.prototype.hide = function () {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.style.display = "none";
        }
        return this;
    };
    jPepper.init.prototype.show = function () {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.style.display = "";
        }
        return this;
    };
    jPepper.init.prototype.empty = function () {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.innerHTML = "";
        }
        return this;
    };
    jPepper.init.prototype.setClass = function (c) {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.className = c;
        }
        return _this;
    };
    jPepper.init.prototype.addClass = function (c) {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.className += " " + c;
            n.className = n.className.trim();
        }
        return _this;
    };
    jPepper.init.prototype.removeClass = function (c) {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.className = n.className.replace(new RegExp(c, 'gm'), "").trim();
        }
        return _this;
    };
    jPepper.init.prototype.setAttr = function (a, b) {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.setAttribute(a, b);
        }
        return _this;
    };
    jPepper.init.prototype.removeAttr = function (a) {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.removeAttribute(a);
        }
        return _this;
    };
    jPepper.init.prototype.getAttr = function (a) {
        var _this = this;
        if (_this.nodes.length > 0) {
            return _this.nodes[0].getAttribute(a);
        };
    };
    jPepper.init.prototype.append = function (c) {

        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];

            // se oggetto jPepper
            if (c instanceof jPepper.init) {
                for (var y = 0; y < c.nodes.length; y++) {
                    n.appendChild(c.nodes[y]);
                }
                return _this;
            }

            // se nodo
            if (typeof (c) == "object") {
                n.appendChild(c);
            }

            // se stringa
            if (typeof (c) == "string") {
                n.innerHTML += c;
                return _this;
            }
        }
        return _this;
    };
    jPepper.init.prototype.remove = function () {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            n.parentNode.removeChild(n);
        }
        return _this;
    }
    jPepper.init.prototype.html = function (h) {
        var _this = this;

        // setter
        if (h) {
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.innerHTML = h;
            }
            return _this;
        }

        // getter 
        if (this.nodes.length > 0) {
            return this.nodes[0].innerHTML;
        }

    };
    jPepper.init.prototype.hasClass = function (c) {
        var _this = this;

        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            if (new RegExp('(\\s|^)' + c + '(\\s|$)').test(n.className)) return true;
        }

        return false;
    };
    jPepper.init.prototype.disable = function () {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            switch (n.nodeName) {
                case "INPUT":
                    switch (_(n).getAttr("type")) {
                        case "checkbox":
                            n.disabled = true;
                            break;
                    }
                    break;
            }
        }
        return _this;
    };
    jPepper.init.prototype.enable = function () {
        var _this = this;
        for (var i = 0; i < this.nodes.length; i++) {
            var n = this.nodes[i];
            switch (n.nodeName) {
                case "INPUT":
                    switch (_(n).getAttr("type")) {
                        case "checkbox":
                            n.disabled = false;
                            break;
                    }
                    break;
            }
        }
        return _this;
    };
    jPepper.init.prototype.getParent = function () {
        var _this = this;
        if (_this.nodes.length == 1) {
            return new jPepper.init().createElByNodes([_this.nodes[0].parentNode]);
        };
        var p = [];
        if (_this.nodes.length > 1) {
            for (var i = 0; i < _this.nodes.length; i++) {
                p.push(_this.nodes[i].parentNode);
            }
            return p;
        }
    };
    jPepper.init.prototype.detach = function () {

        this.nodes[0].parentNode.removeChild(this.nodes[0]);

    };
    jPepper.init.prototype.attachTo = function (a) {

        if (a.type && a.type == "jPepper") {
            for (var x = 0; x < a.nodes.length; x++) {
                for (var i = 0; i < this.nodes.length; i++) {
                    a.nodes[x].appendChild(this.nodes[i]);
                }
            }
            return;
        }

        for (var i = 0; i < this.nodes.length; i++) {
            a.attach(this.appendChild[i]);
        }

    };
    jPepper.init.prototype.loadPage = function (a) {

        /*
        parametri:
            a: {
                url: url della pagina da caricare,
                callBack: funzione di callback da chiamare al termine della richiesta
            }
        */

        var _this = this;

        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (a.callBack) {
                    a.callBack.call(_this, {
                        success: 1,
                        html: xhr.responseText
                    });
                }
            }
        }

        xhr.open("GET", a.url, true);
        xhr.setRequestHeader('Content-type', 'text/html');
        xhr.send();
    };
    jPepper.init.prototype.on = function (a, b) {

        var _this = this;

        // setter
        if (a && b) {
            var handler = function (e) {
                b.call(_this, e);
            };
            if (this.selector === document ||
                this.selector === window) {
                this.selector.onclick = handler;
                return _this;
            }
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n.addEventListener(a, handler);
            }
            return _this;
        }

    };
    jPepper.init.prototype.raise = function (a) {

        var _this = this;

        // raise event
        if (a) {
            for (var i = 0; i < this.nodes.length; i++) {
                var n = this.nodes[i];
                n[a]();
            }
            return _this;
        }

    };
    //#endregion

    window.jPepper = window._ = jPepper;

})(window);
