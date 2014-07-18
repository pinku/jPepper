"use strict";

/*
jPepper
Copyright 2014-2020 Diego Pianarosa
d.pianarosa@pianarosa.net

Source code at:
https://github.com/pinku/jPepper

*/

(function (window) {

    var ALL_EVENTS = "*ALL*";

    /**
    This is the jPepper's main function, it can be used also in the short way whit the _ (underscore) character.
    params:
    sel         <string>    Selector string for query the DOM (it can be an TAG name, and ID, a CSS Class, an attribute and so on...)
    returns:
    new jPepper.init(sel);
    */
    var jPepper = function (sel) {

        return new jPepper.init(sel);

    };

    //#region static methods

    /**
    This function let you connect a handler to the document's ready state 
    params:
    fn      <function>  Handler to connect to the event
    */
    jPepper.onDomReady = function (fn) {
        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                fn.call(document);
            }
        }
    }

    /**
    This function let you iterate an array and call a function for each element
    params:
    arr     <array>     Array to iterate
    fn      <function>  function to call for each element
    @memberof jPepper
    */
    jPepper.each = function (arr, fn) {
        var i = 0, len = arr.length;
        while (i != len) {
            fn.call(arr[i]);
            i++;
        }
    }

    /**
    This array is used from jPepper to store each binded event
    */
    jPepper.events = [];

    /**
    This function is used by jPepper to add an event handler to the events array
    params:
    event       <string>    Name of the event to bind
    node        <node>      DOM node for the event binding
    fn          <function>  Handler to connect to the event
    returns:
    this
    */
    jPepper.addEvent = function (event, node, fn) {

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
                _.events[i].node == node &&
                _.events[i].fn == fn) {
                return this;
            }
            i++;
        }

        if (nullix != -1) {
            _.events[nullix] = {
                event: event,
                node: node,
                fn: fn
            }
        } else {
            _.events[_.events.length] = {
                event: event,
                node: node,
                fn: fn
            };
        }
        node.addEventListener(event, fn);

        return this;

    };

    /**
    This function is used by jPepper to remove an event handler to the events array
    params:
    event       <string>    Name of the event to bind
    node        <node>      DOM node for the event binding
    returns:
    this
    */
    jPepper.removeEvent = function (event, node) {

        // l'evento verrà rimosso solo se già presente
        if (event != ALL_EVENTS) {
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
        } else {
            var i = 0, len = _.events.length;
            while (i != len) {
                if (_.events[i] != null &&
                    _.events[i].node == node) {
                    node.removeEventListener(_.events[i].event, _.events[i].fn);
                    _.events[i] = null;
                }
                i++;
            }
        }

        return this;

    };

    /**
    This is the real constructor of a jPepper object. It's alway called by the jPepper(sel) function.
    params:
    sel         <string>    Selector string for query the DOM (it can be an TAG name, and ID, a CSS Class, an attribute and so on...)
    return:
    this
    */
    jPepper.init = function (sel) {

        // type
        this.type = "jPepper";

        // selector
        this.selector = sel;

        // nodes array
        this.nodes = [];

        // events array
        this.events = [];

        // is a string?
        if (typeof this.selector === "string") {
            this.nodes = document.querySelectorAll(this.selector);
        }

        // is a object?
        if (typeof this.selector === "object") {
            this.nodes.push(this.selector);
        }

        return this;

    };

    //#endregion

    //#region istance methods

    /**
    This function let you set an attribute for DOM's nodes.
    params:
    attr        <string>    Name of the attribute to set
    val         <string>    Value to set for the attribute
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.setAttr = function (attr, val, ix) {

        // setter 
        if (attr !== undefined && val !== undefined) {

            // index is passed?
            if (ix !== undefined) {
                this.nodes[ix].setAttribute(attr, val);
                return this;
            }

            var i = 0, len = this.nodes.length;
            while (i != len) {
                this.nodes[i].setAttribute(attr, val);
                i++;
            }

        }

        return this;

    };

    /**
    This function let you get an attribute for DOM's nodes.
    params:
    attr        <string>    Name of the attribute to set
    [ix]        <int>       (Optional) Index of the node
    returns:
    <string>    attribute value, null if not found
    */
    jPepper.init.prototype.getAttr = function (attr, ix) {

        // getter
        if (attr !== undefined) {

            // index is passed?
            var i = 0;
            if (ix !== undefined) i = ix;

            return this.nodes[i].getAttribute(attr);

        }

        return null;

    };

    /**
    This function let you show DOM's nodes
    params:
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.show = function (ix) {

        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].style.display = "";
            return this;
        }

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].style.display = "";
            i++;
        }

        return this;
    };

    /**
    This function let you hide DOM's nodes
    params:
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.hide = function (ix) {

        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].style.display = "none";
            return this;
        }

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].style.display = "none";
            i++;
        }

        return this;
    };

    /**
    This function let you set a style attrubute for DOM's nodes.
    params:
    style       <string>    Name of the css style to set
    val         <string>    Value to set for the attribute
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.setStyle = function (style, val, ix) {

        // setter 
        if (style !== undefined && val !== undefined) {

            // index is passed?
            if (ix !== undefined) {
                this.nodes[ix].style[style] = val;
                return this;
            }

            var i = 0, len = this.nodes.length;
            while (i != len) {
                this.nodes[i].style[style] = val;
                i++;
            }

        }

        return this;

    };

    /**
    This function let you get a style attribute for DOM's nodes.
    params:
    style       <string>    Name of the attribute to get
    [ix]        <int>       (Optional) Index of the node. if not passed the function
                            will return the style of the first node in the collection.
    returns:
    <string>    attribute value, null if not found
    */
    jPepper.init.prototype.getStyle = function (style, ix) {

        // getter
        if (style !== undefined) {

            // index is passed?
            var i = 0;
            if (ix !== undefined) i = ix;

            return this.nodes[i].style[style];

        }

        return null;

    };

    /**
    This function let you add a css class for DOM's nodes.
    params:
    css         <string>    Name of the css class to add
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.addClass = function (css, ix) {


        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].className = (this.nodes[ix].className + " " + css).trim();
            return this;
        }

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].className = (this.nodes[i].className + " " + css).trim();
            i++;
        }

        return this;

    };

    /**
    This function let you remove a css class for DOM's nodes.
    params:
    css         <string>    Name of the css class to remove
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.removeClass = function (css, ix) {

        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].className = this.nodes[ix].className.replace(new RegExp(css, 'gm'), "").trim();
            return this;
        }

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].className = this.nodes[i].className.replace(new RegExp(css, 'gm'), "").trim();
            i++;
        }

        return this;

    };

    /**
    This function let you empty a DOM's nodes.
    params:
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.empty = function (ix) {

        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].innerHTML = null;
            return this;
        }

        var i = 0, len = this.nodes.length;
        while (i != len) {
            this.nodes[i].innerHTML = null;
            i++;
        }

        return this;

    };

    /**
    This function let you remove a DOM's nodes.
    params:
    [ix]        <int>       (Optional) Index of the node
    returns:
    this
    */
    jPepper.init.prototype.remove = function (ix) {

        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].parentNode.removeChild(this.nodes[ix]);
            return this;
        }

        var i = 0, len = this.nodes.length;
        while (i != len) {
            _.removeEvent(ALL_EVENTS, this.nodes[i]);
            this.nodes[i].remove();
            i++;
        }

        return this;

    };

    /**
    This function let you bind an handler to an event
    params:
    events      <string>    Event or events name to bind. Each event can be separated with a space
    fn          <function>  Handler to bind to the event
    [args]      <object>    (Optional) Object to pass to the handler when the event is fired
    returns:
    this
    */
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
                    _.addEvent(e, n, fx);
                    y++;
                }
                i++;
            }
        }

        return this;
    };

    /**
    This function let you remove an handler from events
    params:
    [events]    <string>    (Optional)  Event or events name to remove. Each event can be separated with a space
                                        If not passed each events will be disconnected
    returns:
    this
    */
    jPepper.init.prototype.off = function (events) {

        var _this = this;

        if (events !== undefined && events != "") {

            var evarr = events.split(" ");

            var i = 0, len = this.nodes.length;
            while (i != len) {
                var y = 0, len2 = evarr.length;
                while (y != len2) {
                    _.removeEvent(evarr[y], this.nodes[i]);
                    y++;
                }
                i++;
            }

        } else {

            var i = 0, len = this.nodes.length;
            while (i != len) {
                _.removeEvent(ALL_EVENTS, this.nodes[i]);
                i++;
            }

        }


        return this;
    };

    //#endregion

    window.jPepper = window._ = jPepper;

})(window);
