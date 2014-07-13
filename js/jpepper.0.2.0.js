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

    /*
    jPepper(sel)
    funzione principale di jPepper
    parametri:
    sel:    selettore per i nodi del DOM
    return:
    new jPepper.init(sel);
    */
    var jPepper = function (sel) {

        return new jPepper.init(sel);

    };

    //#region metodi statici

    /*
    jPepper.init(sel)
    costruttore dell'oggetto jPepper
    parametri:
    sel:    selettore per i nodi del DOM
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

    /*
    jPepper.onDomReady(fn)
    funzione che permette di associare un handler al completamento della preparazione del DOM
    parametri:
    fn:     funzione da associare all'evento
    */
    jPepper.onDomReady = function (fn) {
        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                fn.call(document);
            }
        }
    }

    /*
    jPepper.each(array, fn)
    permette di eseguire una funzioen per ogni elemento di un array
    parametri:
    array:  array
    fn:     funzione da associare all'evento
    */
    jPepper.each = function (array, fn) {
        var i=0, len=array.length;
        while(i!=len) {
            fn.call(array[i]);
            i++;
        }
    }

    /*
    jPepper.events
    array che contiene tutti gli eventi gestiti da jPepper
    */
    jPepper.events = [];

    /*
    jPepper.addEvent(event, node, fn)
    aggiunge un evento all'array
    parametri:
    event:  nome dell'evento
    node:   nodo al quale collegare l'evento
    fn:     handler da collegare
    return:
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

    /*
    jPepper.removeEvent(event, node, fn)
    aggiunge un evento all'array
    parametri:
    event:  nome dell'evento
    node:   nodo al quale collegare l'evento
    return:
    this
    */
    jPepper.removeEvent = function (event, node) {

        // l'evento verrà rimosso solo se già presente
        if (event != ALL_EVENTS) {
            var i = 0, len = _.events.length;
            while(i!=len) {
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
            while(i!=len) {
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

    //#endregion

    //#region metodi di istanza

    /*
    .setAttr(attr, val, ix)
    funzione che permette di settare il valore di un attributo 
    se non passato l'indice del nodo, la funzione attribuirà il valore a tutti i nodi presenti nella nodelist
    parametri:
    attr:   nome dell'attributo
    val:    valore da attribuire
    ix:     indice del nodo (riferito alla nodelist)
    return:
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
            while(i!=len) {
                this.nodes[i].setAttribute(attr, val);
                i++;
            }

        }

        return this;

    };

    /*
    .getAttr(attr, ix) 
    funzione che permette di recuperare il valore di un attributo
    se non passato l'indice del nodo (ox) viene restituito il valore del primo nodo presente nella nodelist
    parametri:
    attr:   nome dell'attributo
    ix:     indice del nodo (riferito alla nodelist)
    return:
    stringa che contiene il valore dell'attributo, nel caso l'attributo non sia presente sul nodo la 
    funzione restituisce null
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

    /*
    .show()
    funzione che permette di visualizzare un nodo
    imposta la proprietà css display su ""
    return:
    this
    */
    jPepper.init.prototype.show = function () {

        var i = 0, len = this.nodes.length;
        while(i!=len) {
            this.nodes[i].style.display = "";
            i++;
        }

        return this;
    };

    /*
    .hide()
    funzione che permette di nascondere un nodo
    imposta la proprietà css display su none
    return:
    this
    */
    jPepper.init.prototype.hide = function () {

        var i = 0, len = this.nodes.length;
        while(i!=len) {
            this.nodes[i].style.display = "none";
            i++;
        }

        return this;
    };

    /*
    .setStyle(style, val, ix)
    funzione che permette di settare il valore di una proprietà del css inline del nodo
    se non passato l'indice del nodo, la funzione attribuirà il valore a tutti i nodi presenti nella nodelist
    parametri:
    style:  nome della proprietà style css
    val:    valore da attribuire
    ix:     indice del nodo (riferito alla nodelist)
    return: 
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
            while(i!=len) {
                this.nodes[i].style[style] = val;
                i++;
            }

        }

        return this;

    };

    /*
    .getStyle(style, ix) 
    funzione che permette di recuperare il valore di uno style css
    se non passato l'indice del nodo (ox) viene restituito il valore del primo nodo presente nella nodelist
    parametri:
    style:  nome della proprietà style css
    ix:     indice del nodo (riferito alla nodelist)
    return:
    stringa che contiene il valore dell'attributo, nel caso l'attributo non sia presente sul nodo la 
    funzione restituisce null
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

    /*
    .addClass(css, ix)
    funzione che permette di aggiungere una classe css al nodo
    se non passato l'indice del nodo, la funzione attribuirà il valore a tutti i nodi presenti nella nodelist
    parametri:
    css:    nome della classe css da aggiungere
    ix:     indice del nodo (riferito alla nodelist)
    return: 
    this
    */
    jPepper.init.prototype.addClass = function (css, ix) {


        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].className = (this.nodes[ix].className + " " + css).trim();
            return this;
        }

        var i = 0, len = this.nodes.length;
        while(i!=len) {
            this.nodes[i].className = (this.nodes[i].className + " " + css).trim();
            i++;
        }

        return this;

    };

    /*
    .removeClass(css, ix)
    funzione che permette di rimuovere una classe css al nodo
    se non passato l'indice del nodo, la funzione rimuoverà la classe da tutti i nodi presenti nella nodelist
    parametri:
    css:    nome della classe css da aggiungere
    ix:     indice del nodo (riferito alla nodelist)
    return: 
    this
    */
    jPepper.init.prototype.removeClass = function (css, ix) {

        // index is passed?
        if (ix !== undefined) {
            this.nodes[ix].className = this.nodes[ix].className.replace(new RegExp(css, 'gm'), "").trim();
            return this;
        }

        var i = 0, len = this.nodes.length;
        while(i!=len) {
            this.nodes[i].className = this.nodes[i].className.replace(new RegExp(css, 'gm'), "").trim();
            i++;
        }

        return this;

    };

    /*
    .empty(ix)
    permette di rimuovere il contenuto di un nodo
    se non passato l'indice del nodo, la funzione rimuoverà il contenuto da tutti i nodi presenti nella nodelist
    parametri:
    ix:     indice del nodo (riferito alla nodelist)
    return: 
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

    /*
    .on(event, fn, args);
    funzione che permette di collegare un handler ad un evento
    parametri:
    events:  nome dell'evento (click, blur, etc....)
    fn:     funzione da associare all'evento
    args:   parametri da passare alla funzione
    return:
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
            while (i!=len) {
                var n = this.nodes[i];
                var y = 0, len2 = evarr.length;
                while(y!=len2) {
                    var e = evarr[y];
                    _.addEvent(e, n, fx);
                    y++;
                }
                i++;
            }
        }

        return this;
    };

    /*
    .off(event);
    funzione che permette di rimuovere gli handler collegati ad un evento
    parametri:
    event:  nome dell'evento (click, blur, etc....)
    return:
    this
    */
    jPepper.init.prototype.off = function (event) {

        var _this = this;

        if (event !== undefined && event != "") {

            var events = event.split(" ");

            var i = 0, len = this.nodes.length;
            while (i != len) {
                var y = 0, len2 = events.length;
                while(y!=len2) {
                    _.removeEvent(events[y], this.nodes[i]);
                    y++;
                }
                i++;
            }

        } else {

            var i = 0, len = this.nodes.length;
            while(i!=len) {
                _.removeEvent(ALL_EVENTS, this.nodes[i]);
                i++;
            }

        }


        return this;
    };

    //#endregion

    window.jPepper = window._ = jPepper;

})(window);
