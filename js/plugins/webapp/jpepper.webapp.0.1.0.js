/*
jPepper.webapp
version 0.1.0
developed by Diego Pianarosa

usage:

*/

"use strict";

(function (_, window) {

    var SIGN = ".jp_webapp",
        EVTERROR = "error",
        EVT_AFT_INIT = "afterinit",
        EVT_BEF_DESTROY = "beforedestroy",
        EVT_AFT_DESTROY = "afterdestroy",
        EVT_BEF_RENDER = "beforerender",
        EVT_AFT_RENDER = "afterrender",
        EVT_BEF_SHOW = "beforeshow",
        EVT_AFT_SHOW = "aftershow",
        EVT_BEF_HIDE = "beforehide",
        EVT_AFT_HIDE = "afterhide",
        ERRORSOURCE = "jPepper.webapp",
        JPCONTROL = "jPControl",
        JPFORM = "jPForm",
        JPSECTION = "jPSection",
        JPTEXT = "jPText",
        JPTEXTBOX = "jPTextBox",
        JPBUTTON = "jPButton",
        JPIMAGE = "jPImage",
        ERRORS = [],
        DATATYPE = "data-type",
        DATAID = "data-id";

    var EVT_BEF_Render = new Event(EVT_BEF_RENDER);

    //#region jPControl

    var jPControl = function (args) {

    };
    jPControl.p = jPControl.prototype;
    jPControl.p.init = function (args) {

        this.controls = [];
        this.opt = {
            id: "",
            tag: "div",
            type: JPCONTROL,
            events: []
        };
        this.el = null;

        if (args) {
            _.extend(this.opt, args);
        }

        if (this.opt.id === undefined || this.opt.id == "") { this.opt.id = _.newGUID(); }
        
        this.triggerEvent(EVT_AFT_INIT, "");

        return this;

    };
    jPControl.p.destroy = function () {

        this.triggerEvent(EVT_BEF_DESTROY);

        this.el.destroy();

        this.triggerEvent(EVT_AFT_DESTROY);
    };
    jPControl.p.render = function () {

        if (!this.triggerEvent(EVT_BEF_RENDER)) { return; }

        this.el = _.new(this.opt.tag);
        this.el
            .attr(DATATYPE, this.opt.type)
            .attr(DATAID, this.opt.id);
        if (this.opt.cssclass) this.el.attr("class", this.opt.cssclass);
        if (this.opt.style) this.el.attr("style", this.opt.style);

        (function _renderchilds(_this) {

            _.each(_this.controls, function (e, i, _this) {
                e.render();
                e.appendTo(_this.el);
            }, _this);

            return _this;

        })(this);

        this.triggerEvent(EVT_AFT_RENDER);

        return this;
    };
    jPControl.p.appendTo = function (p) {

        if (this.el == null) this.render();

        if (p instanceof jPepper.init) {
            p.append(this.el);
        } else {
            var dest = _(p);
            dest.append(this.el);
        }

        return this;
    };
    jPControl.p.show = function () {

        if (!this.triggerEvent(EVT_BEF_SHOW)) { return; }

        this.el.show();

        this.triggerEvent(EVT_AFT_SHOW);

        return this;
    };
    jPControl.p.hide = function () {

        if (!this.triggerEvent(EVT_BEF_HIDE)) { return; }

        this.el.hide();

        this.triggerEvent(EVT_AFT_HIDE);

        return this;
    };
    jPControl.p.remove = function () {

        this.el.remove();

        return this;
    };
    jPControl.p.addControl = function (c) {
        c.parent = this;
        this.controls.push(c);
        c.appendTo(this.el);
        return this;
    };
    jPControl.p.empty = function () {
        this.controls = [];
        this.el.innerHTML("");
        return this;
    };
    jPControl.p.toObject = function (o) {

        var _this = this;

        var obj = {
            opt: this.opt
        }
        obj.opt.controls = [];

        if (o) o.opt.controls.push(obj);

        _.each(this.controls, function (e, i) {

            e.toobject(obj);

        });

        return obj;
    };
    jPControl.p.toJson = function () {

        var o = this.toobject();
        var j = JSON.stringify(o);

        return j;
    };
    jPControl.p.on = function (evt, fn, args) {

        this.addEvent(evt, fn, args);

    };
    jPControl.p.addEvent = function (evt, fn, args) {

        var i = 0, len = this.opt.events.length;
        while (i != len) {
            if (this.opt.events[i] == null) {
                this.opt.events[i]={
                    evt: evt,
                    fn: fn,
                    args: args
                };
                return;
            }
            i++;
        }
        this.opt.events.push({
            evt: evt,
            fn: fn,
            args: args
        });

    };
    jPControl.p.removeEvent = function (evt) {

        var i = 0, len = this.opt.events.length;
        while (i != len) {

            if (this.opt.events[i].evt == evt) {
                this.opt.events[i] = null;
            }

            i++;

        }

    };
    jPControl.p.triggerEvent = function (evt, args) {

        var i = 0, len = this.opt.events.length;
        while (i != len) {

            if (this.opt.events[i].evt == evt) {
                return this.opt.events[i].fn.call(this, args);
            }
            i++;
        };

        return true;

    };
    jPControl.p.cssClass = function (c) {

        if (c) {
            this.opt.cssClass = c;
            this.el.attr("class", c);
        }
        else {
            return this.cssClass;
        }

    };

    //#endregion

    //#region jPForm

    var jPForm = function (args) {
        this.init(args);
    };
    jPForm.prototype = new jPControl;
    jPForm.constructor = jPForm;
    jPForm.p = jPForm.prototype;
    jPForm.p.init = function (args) {

        jPControl.prototype.init.call(this, args);

        this.opt.type = JPFORM;
        this.opt.tag = "div";

        return this;

    }

    //#endregion

    //#region jPSection

    var jPSection = function (args) {
        this.init(args);
    };
    jPSection.prototype = new jPControl;
    jPSection.constructor = jPSection;
    jPSection.p = jPSection.prototype;
    jPSection.p.init = function (args) {

        jPControl.prototype.init.call(this, args);

        this.opt.type = JPSECTION;
        this.opt.tag = "div";

        return this;

    }

    //#endregion

    //#region jPText

    var jPText = function (args) {
        this.init(args);
    };
    jPText.prototype = new jPControl;
    jPText.constructor = jPText;
    jPText.p = jPText.prototype;
    jPText.p.init = function (args) {

        jPControl.prototype.init.call(this, args);

        this.opt.type = JPTEXT;
        this.opt.tag = "span";

        return this;
    }
    jPText.p.text = function (t) {

        if (t) {
            this.el.val(t);
        } else {
            return this.el.innerHTML();
        }

    };

    //#endregion

    //#region jPTextBox

    var jPTextBox = function (args) {
        this.init(args);
    };
    jPTextBox.prototype = new jPControl;
    jPTextBox.constructor = jPTextBox;
    jPTextBox.p = jPTextBox.prototype;
    jPTextBox.p.init = function (args) {

        jPControl.prototype.init.call(this, args);

        this.opt.type = JPTEXTBOX;
        this.opt.tag = "div";

        return this;
    }
    jPTextBox.p.render = function () {

        jPControl.prototype.render.call(this);

        this.el.attr("type", "text");
        this
            .renderLabel()
            .renderInput();

        return this;
    };
    jPTextBox.p.renderLabel = function () {

        if (this.opt.caption) {
            var l = _.new("label");
            l.innerHTML(this.opt.caption);
            l.attr("for", this.opt.id + "_input");
            this.el.append(l);
        }

        return this;
    };
    jPTextBox.p.renderInput = function () {

        var i = _.new("input");
        i.attr("type", "text").attr("id", this.opt.id + "_input");
        this.el.append(i);

        return this;
    };
    jPTextBox.p.caption = function (c) {

        if (c) {
            this.opt.caption = c;
            this.el.empty();
            this
                .renderLabel()
                .renderInput();
        } else {
            return this.opt.caption;
        }

    };

    //#endregion

    //#region jPButton

    var jPButton = function (args) {
        this.init(args);
    };
    jPButton.prototype = new jPControl;
    jPButton.constructor = jPButton;
    jPButton.p = jPButton.prototype;
    jPButton.p.init = function (args) {

        jPControl.prototype.init.call(this, args);

        this.opt.type = JPBUTTON;
        this.opt.tag = "a";

        if (!this.opt.caption) this.opt.caption = JPBUTTON;

        return this;
    }
    jPButton.p.caption = function (t) {

        if (t) {
            this.el.innerHTML(t);
        } else {
            return this.el.innerHTML();
        }

    };
    jPButton.p.render = function () {

        jPControl.prototype.render.call(this);

        this.el
            .attr("href", "#")
            .innerHTML(this.opt.caption);
        this.bindevents();

        return this;
    };
    jPButton.p.bindevents = function () {

        var _this = this;
        if (this.opt.onclick) {
            this.el.on("click", function (e) {
                _this.opt.onclick.call(_this, e);
            });
        };
    };
    jPButton.p.onclick = function (f) {

        if (f) {
            this.opt.onclick = f;
            this.bindevents();
        } else {
            return this.opt.onclick;
        }

    };

    //#endregion

    //#region jPImage

    var jPImage = function (args) {
        this.init(args);
    };
    jPImage.prototype = new jPControl;
    jPImage.constructor = jPImage;
    jPImage.p = jPImage.prototype;
    jPImage.p.init = function (args) {

        jPControl.prototype.init.call(this, args);

        this.opt.type = JPIMAGE;
        this.opt.tag = "img";

        return this;
    }
    jPImage.p.src = function (t) {

        if (t) {
            this.el.attr("src", t);
        } else {
            return this.el.innerHTML();
        }

    };

    //#endregion

    window.jPForm = jPForm;
    window.jPSection = jPSection;
    window.jPText = jPText;
    window.jPTextBox = jPTextBox;
    window.jPButton = jPButton;
    window.jPImage = jPImage;

})(jPepper, window);

