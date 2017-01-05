"use strict";

/*
jPepper
Copyright 2014-2020 Diego Pianarosa
d.pianarosa@pianarosa.net
jpepper@jpepper.org
www.jpepper.org

Source code at:
https://github.com/pinku/jPepper

*/

//#region Revisions

/*
[0.4.1] [09.04.15] [Diego Pianarosa]
----------------------------------------------------
-   Added disable/enable function
-   Added data function
-   Modified append function for supporting jPepper 
    objects, nodes and strings
----------------------------------------------------
/*
[0.4.2] [24.04.15] [Diego Pianarosa]
----------------------------------------------------
-   IE does not support custom event
----------------------------------------------------
*/

//#endregion

(function (window) {

    var ALL_EVENTS = "*ALL*";
    var INNER_EVENT = "*JPEPPER*";
    var ERROR_EVENT = "jperror";
    var DRAGGED_NODE = "DRAGGED_NODE";
    var DRAGSTART = "dragstart";
    var DRAGOVER = "dragover";
    var DROP = "drop";
    var TRUE = "true";
    var FALSE = "false";
    var WORKER = "jpepperww.0.4.0.js";

    var ERRORS = [
        "ERRCODE 1 - jPepper.align: No object found with the specified selector"
    ];

    //#region jPepper

    var jPepper = function (sel) {

        return new jPepper.init(sel);

    };

    //#region Error
    jPepper.Error = function (src, code, msg, args) {
        this.init(src, code, msg, args);
    };
    jPepper.Error.prototype.init = function (src, code, msg, args) {
        this.source = src;
        this.code = code;
        this.message = msg;
        this.args = args;
    };
    //#endregion

    //#region Queue & Task

    jPepper.Queue = function () {

        this.tasks = [];
        this.qi = 0;
        this.running = false;
        this.stopped = true;
        this.id = +new Date;
    };
    jPepper.Queue.prototype.add = function (t, args) {

        t.queue = this;
        t.queueindex = this.tasks.length;
        this.tasks.push({
            task: t,
            args: args
        });

        return this;
    };
    jPepper.Queue.prototype.start = function () {

        this.stopped = false;
        var t = this.tasks[this.qi].task.fn.apply(this.tasks[this.qi].task, this.tasks[this.qi].args);
        if (t && t instanceof jPepper.Task && !this.executed) {
            t.do();
        }

    };
    jPepper.Queue.prototype.restart = function () {

        this.qi = 0;
        this.start();
    };
    jPepper.Queue.prototype.next = function () {

        if (this.stopped == true) return -1;
        this.qi += 1;
        if (this.qi == this.tasks.length) {
            this.stopped = true;
            return -1;
        }
        this.tasks[this.qi].task.prevTask = this.tasks[this.qi - 1].task;
        var t = this.tasks[this.qi].task.fn.apply(this.tasks[this.qi].task, this.tasks[this.qi].args);
        if (t && t instanceof jPepper.Task && !this.executed) {
            t.outerqueue = this;
            t.do();
        }
        return this.qi;
    };
    jPepper.Queue.prototype.stop = function () {
        this.stopped = true;
    };
    jPepper.Queue.prototype.clear = function () {

        this.qi = 0;
        this.tasks = [];

    };

    jPepper.Task = function (fn, args) {

        this.fn = fn;
        this.args = [];
        this.executed = false;

        var i = 1, len = arguments.length;
        while (i < len) {
            this.args.push(arguments[i]);
            i++;
        }

        this.outerqueue = null;
        this.innerqueue = new Queue();
        this.innerqueue.add(this, this.args);

    };
    jPepper.TaskInit = function (fn, args) {

        var t = new _.Task();
        t.fn = fn;
        t.args = args;
        t.innerqueue.clear();
        t.innerqueue.add(t, t.args);
        return t;

    };
    jPepper.Task.prototype.ok = function () {
        this.executed = true;
        if (this.innerqueue.next() == -1 && this.outerqueue != null) {
            this.outerqueue.tasks[this.outerqueue.qi].task.executed = true;
            this.outerqueue.tasks[this.outerqueue.qi].task.results = this.results;
            var i = this.outerqueue.next();
            if (i == -1 && this.outerqueue.tasks[0].task.outerqueue != null) {
                this.outerqueue.tasks[0].task.outerqueue.next();
            }
        }
    };
    jPepper.Task.prototype.donext = jPepper.Task.prototype.ok;
    jPepper.Task.prototype.err = function () {
        this.innerqueue.stop();
    };
    jPepper.Task.prototype.then = function (t, args) {

        var args = [];
        var i = 1, len = arguments.length;
        while (i < len) {
            args.push(arguments[i]);
            i++;
        }

        var task = t;
        if (typeof t == "function") {
            task = _.TaskInit(t, args);
        }

        task.outerqueue = this.innerqueue;
        this.innerqueue.add(task, task.args);
        return this;
    };
    jPepper.Task.prototype.do = function (args) {
        if (args !== undefined) this.innerqueue.tasks[this.queueindex].args = args;
        this.executed = false;
        this.innerqueue.start();
        return this;
    };

    //#endregion

    //#region static methods
    jPepper.onDomReady = function (fn) {
        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                fn.call(document);
            }
        }
    }
    jPepper.each = function (obj, fn, args) {
        if (obj instanceof Array) {
            var i = 0, len = obj.length;
            while (i != len) {
                fn(obj[i], i, args);
                i++;
            }
            return;
        }
        if (obj instanceof Object) {
            for (var i in obj) {
                if (obj.hasOwnProperty(i) && i != "length") {
                    fn(obj[i], i, args);
                }
            }
            return;
        }
    }
    jPepper.POST = function (url, args) {

        return new jPepper.Task(function (url, args) {

            var _this = this;

            var p = '';
            if (typeof (args) == 'object') {
                p = JSON.stringify(args);
            } else {
                p = args;
            }

            var xhr;
            try {
                xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            _this.results = xhr.response;
                            _this.donext();
                        }
                    }
                };
                xhr.send(p);
            } catch (e) {
                _this.results = null;
                _this.error = e;
                _this.err();
            }
        }, url, args);

    };
    jPepper.POSTWW = function (url, args) {

    };
    jPepper.GET = function (url, args) {

        return new jPepper.Task(function (url, args) {

            var _this = this;

            var p = '';
            if (typeof (args) == 'object') {
                p = JSON.stringify(args);
            } else {
                p = args;
            }

            var xhr;
            try {
                xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            _this.results = xhr.response;
                            _this.ok();
                        }
                    }
                };
                xhr.send(p);
            } catch (e) {
                _this.error = e;
                _this.err();
            }
        }, url, args);

    };
    jPepper.load = function (jp, url, args) {

        var t1 = _.GET(url, args);
        var t2 = new _.Task(function (jp) {
            var i = 0, len = jp.nodes.length;
            while (i != len) {
                jp.nodes[i].innerHTML = jp.nodes[i].innerHTML + this.prevTask.results;
                i++;
            }
            this.ok();
        }, jp);

        t1.then(t2);

        return t1;

    }
    jPepper.extend = function (a, b) {
        for (var key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }
    jPepper.events = [];
    jPepper.data = {};
    jPepper.worker = null;
    jPepper.addEvent = function (event, name, node, fn) {

        // l'evento verrà aggiunto solo se non già presente, quindi ciclo
        // per l'array per controlare che la voce non sia già presente
        var i = 0, len = _.events.length, nullix = -1;
        while (i != len) {
            if (_.events[i] == null) {
                if (nullix == -1) nullix = i;
                i++;
                continue;
            }
            if (_.events[i].event == event &&
                _.events[i].name == name &&
                _.events[i].node == node &&
                _.events[i].fn == fn) {
                return this;
            }
            i++;
        }

        if (nullix != -1) {
            _.events[nullix] = {
                event: event,
                name: name,
                node: node,
                fn: fn
            }
        } else {
            _.events[_.events.length] = {
                event: event,
                name: name,
                node: node,
                fn: fn
            };
        }
        node.addEventListener(event, fn, false);

        return this;

    };
    jPepper.removeEvent = function (event, name, node) {

        if (event != ALL_EVENTS && event != "" && name != "") {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].event == event &&
                    _.events[i].name == name &&
                    _.events[i].node == node) {
                    node.removeEventListener(event, _.events[i].fn);
                    _.events[i] = null;
                }
                i++;
            }
            return this;
        }

        if (event != ALL_EVENTS && event != "" && name == "") {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].event == event &&
                    _.events[i].node == node) {
                    node.removeEventListener(event, _.events[i].fn);
                    _.events[i] = null;
                }
                i++;
            }
            return this;
        }

        if (event != ALL_EVENTS && event == "" && name != "") {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].name == name &&
                    _.events[i].node == node) {
                    node.removeEventListener(event, _.events[i].fn);
                    _.events[i] = null;
                }
                i++;
            }
            return this;
        }

        // event == ALL_EVENTS?
        if (event == ALL_EVENTS) {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].node == node) {
                    node.removeEventListener(_.events[i].event, _.events[i].fn);
                    _.events[i] = null;
                }
                i++;
            }
            return this;
        }

    };
    jPepper.triggerEvent = function (event, name, node, args) {

        if (event != ALL_EVENTS && event != "" && name != "") {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].event == event &&
                    _.events[i].name == name &&
                    _.events[i].node == node) {
                    _.events[i].fn.call(this, args);
                }
                i++;
            }
            return this;
        }

        if (event != ALL_EVENTS && event != "" && name == "") {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].event == event &&
                    _.events[i].node == node) {
                    _.events[i].fn.call(this, args);
                }
                i++;
            }
            return this;
        }

        if (event != ALL_EVENTS && event == "" && name != "") {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].name == name &&
                    _.events[i].node == node) {
                    _.events[i].fn.call(this, args);
                }
                i++;
            }
            return this;
        }

        // event == ALL_EVENTS?
        if (event == ALL_EVENTS) {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].node == node) {
                    _.events[i].fn.call(this, args);
                }
                i++;
            }
            return this;
        }

    };
    jPepper.init = function (sel) {

        // type
        this.type = "jPepper";

        // selector
        this.selector = sel;

        // nodes array
        this.nodes = [];

        // events array
        this.events = [];

        // data
        this.data = {};

        // is a string?
        if (typeof this.selector === "string") {
            this.nodes = document.querySelectorAll(this.selector);
        }

        // is a NodeList?
        if (jPepper.isNodeList(this.selector)) {
            var i = 0, len = this.selector.length;
            while (i != len) {
                this.nodes.push(this.selector[i]);
                i++;
            }
        }

        // is a object?
        if (typeof this.selector === "object" &&
            !(this.selector instanceof Array) &&
            !jPepper.isNodeList(this.selector)) {
            this.nodes.push(this.selector);
        }

        // is a array?
        if (typeof this.selector === "object" &&
            this.selector instanceof Array) {
            this.nodes = this.selector;
        }

        return this;

    };
    jPepper.createPlugin = function (args, isstatic) {

        if (!isstatic) {
            jPepper.init.prototype[args.name] = args.fn;
        } else {
            jPepper[args.name] = args.fn;
        }
    }
    jPepper.queryString = function (param, value) {

        // getter
        if (param === undefined || (param !== undefined && value === undefined)) {

            var qsParm = {};
            var query = window.location.search.substring(1);
            var parms = query.split('&');
            for (var i = 0; i < parms.length; i++) {
                var pos = parms[i].indexOf('=');
                if (pos > 0) {
                    var key = parms[i].substring(0, pos);
                    var val = parms[i].substring(pos + 1);
                    qsParm[key] = val;
                }
            }

            if (param === undefined) {
                return qsParm;
            } else {
                return qsParm[param];
            }

        }
    };
    jPepper.initWorker = function (path) {
        this.worker = new Worker(path + WORKER);
    };
    jPepper.new = function (tag) {

        var n = document.createElement(tag);
        return _(n);

    };
    jPepper.isNodeList = function (e) {

        if (e.constructor.name == "NodeList") return true;

        return false;
    };
    jPepper.newGUID = function () {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
        };

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

    };
    //#endregion

    //#region instance methods
    jPepper.init.prototype.attr = function (attr, val) {

        // getter
        if (val === undefined) {

            return this.nodes[0].getAttribute(attr);

        } else {

            // setter
            var i = 0, len = this.nodes.length;
            while (i != len) {
                this.nodes[i].setAttribute(attr, val);
                i++;
            }

            return this;

        }

    };
    jPepper.init.prototype.dattr = function (attr, val) {

        // getter
        if (val === undefined) {

            return this.nodes[0].getAttribute("data-" + attr);

        } else {

            // setter
            var i = 0, len = this.nodes.length;
            while (i != len) {
                this.nodes[i].setAttribute("data-" + attr, val);
                i++;
            }

            return this;

        }

    };
    jPepper.init.prototype.removeAttr = function (attr) {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].removeAttribute(attr);
            i++;
        }

        return this;
    };
    jPepper.init.prototype.show = function () {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].style.display = "";
            i++;
        }

        return this;
    };
    jPepper.init.prototype.hide = function () {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].style.display = "none";
            i++;
        }

        return this;
    };
    jPepper.init.prototype.style = function (style, val) {

        // getter 
        if (val === undefined) {

            return this.nodes[0].style[style];

        } else {

            // setter
            var i = 0, len = this.nodes.length;
            while (i != len) {
                this.nodes[i].style[style] = val;
                i++;
            }

            return this;

        }

    };
    jPepper.init.prototype.addClass = function (css) {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].className = (this.nodes[i].className + " " + css).trim();
            i++;
        }

        return this;

    };
    jPepper.init.prototype.removeClass = function (css) {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].className = this.nodes[i].className.replace(new RegExp(css, 'gm'), "").trim();
            i++;
        }

        return this;

    };
    jPepper.init.prototype.empty = function () {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].innerHTML = null;
            i++;
        }

        return this;

    };
    jPepper.init.prototype.remove = function () {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            _.removeEvent(ALL_EVENTS, this.nodes[i]);
            this.nodes[i].remove();
            i++;
        }

        return this;

    };
    jPepper.init.prototype.parent = function () {

        var i = 0, len = this.nodes.length, arr = [];
        while (i != len) {
            arr.push(this.nodes[i].parentNode);
            i++;
        }

        return new jPepper.init(arr);

    };
    jPepper.init.prototype.parents = function (sel) {

        var i = 0, len = this.nodes.length, arr = [];
        while (i != len) {
            var n = this.nodes[i].parentNode;
            while (true) {
                if (n == document && sel == document) {
                    arr.push(document);
                    break;
                }
                if (n == document && sel != document) {
                    break;
                }
                if (n.matches(sel)) {
                    arr.push(n);
                    break;
                }
                n = n.parentNode;
            }

            i++;
        }

        return new jPepper.init(arr);

    };
    jPepper.init.prototype.clone = function () {

        var i = 0, len = this.nodes.length, arr = [];
        while (i != len) {
            arr.push(this.nodes[i].cloneNode(true));
            i++;
        }

        return new jPepper.init(arr);

    };
    jPepper.init.prototype.draggable = function (o) {

        // handler
        var ds = function (e) {
            _.data[DRAGGED_NODE] = e.target;
        };

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].setAttribute("draggable", TRUE);
            _.addEvent(DRAGSTART, INNER_EVENT, this.nodes[i], ds);
            i++;
        }

        return this;

    };
    jPepper.init.prototype.droppable = function (o) {

        var _this = this;

        // on drag over
        var fx1 = function (e) {
            e.preventDefault();
            if (o.dragover !== undefined) o.dragover.call(_this, e);
        };
        // on drop
        var fx2 = function (e) {
            e.preventDefault();
            if (o.drop !== undefined) o.drop.call(_this, e);
        };
        var i = 0, len = this.nodes.length;
        while (i != len) {
            _.addEvent(DRAGOVER, INNER_EVENT, this.nodes[i], fx1);
            _.addEvent(DROP, INNER_EVENT, this.nodes[i], fx2);
            i++;
        }

        return this;

    };
    jPepper.init.prototype.load = function (url, args) {

        return _.load(this, url, args);

    };
    jPepper.init.prototype.on = function (events, fn, args) {

        var _this = this;

        if (events !== undefined) {

            // handler
            var fx = function (e) {
                fn.call(_this, e, args);
            };

            // split degli eventi
            var evarr = events.split(" ");

            var i = 0, len = this.nodes.length;
            while (i != len) {
                var n = this.nodes[i];
                var y = 0, len2 = evarr.length;
                while (y != len2) {
                    var e = evarr[y];
                    var ea = e.split(".");
                    if (ea.length == 1) {
                        _.addEvent(e, "", n, fx);
                    } else {
                        _.addEvent(ea[0], ea[1], n, fx);
                    }
                    y++;
                }
                i++;
            }
        }

        return this;
    };
    jPepper.init.prototype.off = function (events) {

        var _this = this;

        // evenss is not blank?
        if (events !== undefined && events != "") {

            var evarr = events.split(" ");

            var i = 0, len = this.nodes.length;
            while (i != len) {
                var y = 0, len2 = evarr.length;
                while (y != len2) {
                    var ea = evarr[y].split(".");
                    if (ea.length == 1) {
                        _.removeEvent(ea[0], "", this.nodes[i]);
                    } else {
                        _.removeEvent(ea[0], ea[1], this.nodes[i]);
                    }
                    y++;
                }
                i++;
            }

        } else {

            var i = 0, len = this.nodes.length;
            while (i != len) {
                _.removeEvent(ALL_EVENTS, "", this.nodes[i]);
                i++;
            }

        }

        return this;

    };
    jPepper.init.prototype.trigger = function (events, args) {

        var _this = this;

        // evenss is not blank?
        if (events !== undefined && events != "") {

            var evarr = events.split(" ");

            var i = 0, len = this.nodes.length;
            while (i != len) {
                var y = 0, len2 = evarr.length;
                while (y != len2) {
                    var ea = evarr[y].split(".");
                    if (ea.length == 1) {
                        _.triggerEvent(ea[0], "", this.nodes[i], args);
                    } else {
                        _.triggerEvent(ea[0], ea[1], this.nodes[i], args);
                    }
                    y++;
                }
                i++;
            }

        } else {

            var i = 0, len = this.nodes.length;
            while (i != len) {
                _.triggerEvent(ALL_EVENTS, "", this.nodes[i], args);
                i++;
            }

        }

        return this;

    };
    jPepper.init.prototype.val = function (val) {

        // getter
        if (val === undefined) {

            switch (this.nodes[0].nodeName) {
                case "SPAN":
                case "DIV":
                    return this.nodes[0].innerHTML;
                case "INPUT":
                case "TEXTAREA":
                case "SELECT":
                    if (this.nodes[0].getAttribute("type") == "checkbox") {
                        if (this.nodes[0].checked) { return true; } else { return false; }
                    } else {
                        return this.nodes[0].value;
                    }
            }

        } else {

            // setter
            var ix = 0, len = this.nodes.length;
            while (ix != len) {

                switch (this.nodes[ix].nodeName) {
                    case "SPAN":
                    case "DIV":
                        this.nodes[ix].innerHTML = val;
                        break;
                    case "TEXTAREA":
                    case "INPUT":
                    case "SELECT":
                        if (this.nodes[ix].getAttribute("type") == "checkbox") {
                            if (val == 1 || val == "on" || val == true || val == "true") { this.nodes[ix].setAttribute("checked", "checked"); } else { this.nodes[ix].removeAttribute("checked"); }
                        } else {
                            this.nodes[ix].value = val;
                        }
                        break;
                }

                ix++;
            }

            return this;

        }

    };
    jPepper.init.prototype.innerHTML = function (html) {

        // getter
        if (html === undefined) {

            return this.nodes[0].innerHTML;

        } else {

            // setter
            var i = 0, len = this.nodes.length;
            while (i != len) {
                this.nodes[i].innerHTML = html;
                i++;
            }

            return this;

        }

    };
    jPepper.init.prototype.innerHtml = jPepper.init.prototype.innerHTML;
    jPepper.init.prototype.innerText = function (text) {

        // getter
        if (text === undefined) {

            return this.nodes[0].innerText;

        } else {

            // setter
            var i = 0, len = this.nodes.length;
            while (i != len) {
                this.nodes[i].innerText = text;
                i++;
            }

            return this;

        }

    };
    jPepper.init.prototype.align = function (sel, pos) {

        // get the element
        var o = document.querySelectorAll(sel);

        // if not found
        if (o.length == 0) {
            throw ERRORS[0];
            return this;
        }

        var i = 0, len = this.nodes.length;

        // check positioning
        switch (pos) {
            case "left":
                while (i != len) {
                    this.nodes[i].style["left"] = o[0].offsetLeft + "px";
                    i++;
                }
                break;
            case "right":
                while (i != len) {
                    this.nodes[i].style["left"] = o[0].offsetLeft + o[0].offsetWidth - this.nodes[i].offsetWidth + "px";
                    i++;
                }
                break;
            case "top":
                break;
            case "bottom":
                break;
        }

        return this;
    };
    jPepper.init.prototype.focus = function () {

        this.nodes[0].focus();

        return this;

    };
    jPepper.init.prototype.append = function (a) {

        if (a instanceof jPepper.init) {
            var i = 0, len = this.nodes.length;
            while (i != len) {

                var n = this.nodes[i];

                var y = 0, len2 = a.nodes.length;
                while (y != len2) {
                    n.appendChild(a.nodes[y]);
                    y++;
                }

                i++;
            }
            return this;
        }

        if (typeof (a) == "object") {
            var i = 0, len = this.nodes.length;
            while (i != len) {

                var n = this.nodes[i];

                n.appendChild(a);

                i++;
            }
            return this;
        }

        if (typeof (a) == "string") {
            var i = 0, len = this.nodes.length;
            while (i != len) {

                var n = this.nodes[i];

                n.innerHTML += a;

                i++;
            }
            return this;
        }

        return this;
    };
    jPepper.init.prototype.rect = function () {

        return this.nodes[0].getBoundingClientRect();

    };
    jPepper.init.prototype.find = function (sel) {

        // is a string?
        if (typeof this.selector === "string") {
            return _(this.selector + " " + sel);
        }

        // is jPepper?
        if (typeof this.selector === "jPepper.init") {

        }

        // is a object?
        if (typeof this.selector === "object") {
            return _(this.nodes[0].querySelectorAll(sel));
        }

    };
    jPepper.init.prototype.center = function () {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            var el = _(this.nodes[i]);
            var r1 = el.rect();
            el
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("margin-top", "-" + (r1.height / 2).toString() + "px")
                .style("margin-left", "-" + (r1.width / 2).toString() + "px");
            i++;
        }

    };
    jPepper.init.prototype.disable = function () {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].disabled = true;
            i++;
        }

        return this;
    };
    jPepper.init.prototype.enable = function () {

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].enabled = true;
            i++;
        }

        return this;
    };
    //#endregion

    window.jPepper = window._ = jPepper;
    window.Queue = _.Queue;
    window.Task = _.Task;

    //#endregion

})(window);
