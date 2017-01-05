"use strict";

(function (_, window) {

    //#region Constants
    var TAG_JPCAPP = "jpc-app",
        TAG_JPCCONTROL = "jpc-control",
        TAG_JPCFORM = "jpc-form";
    //#endregion

    //#region Errors Definition
    var ERRORSSRC = "";
    var ERRORSMSG = ["jPWebApp.init: No HTML TAG found with specified DATA-ID into the document" //0
    , "jPControl.initFromHtml: No HTML TAG found with specified selector into the document" //1
    , "jPControl.initFromHtml: HTML TAG not supported for jPControl" //2
    ];
    //#endregion

    //#region Utilities
    var utilities = {
        check_jpwa_tags: function check_jpwa_tags(t) {
            switch (t.toLowerCase()) {
                case TAG_JPCAPP:
                case TAG_JPCCONTROL:
                case TAG_JPCFORM:
                    return true;
                default:
                    return false;
            }
        }
    };
    //#endregion

    //#region jPWebApp
    var jPWebApp = function jPWebApp(id) {
        this.init(id);
    };
    jPWebApp.p = jPWebApp.prototype;
    jPWebApp.p.init = function (id) {

        ERRORSSRC = "jPWebApp.init";

        // option object
        this.opt = {
            id: id,
            el: null,
            controls: []
        };

        // custom tags definitions
        this.tags = {
            jpcapp: null,
            jpccontrol: null,
            jpcform: null
        };
        this.registerTags();

        // check if html tag for the app exists into the document
        if (!this.checkIfAppTagExists()) {};
    };
    jPWebApp.p.registerTags = function () {

        this.tags.jpcapp = document.registerElement(TAG_JPCAPP);
        this.tags.jpccontrol = document.registerElement(TAG_JPCCONTROL);
        this.tags.jpcform = document.registerElement(TAG_JPCFORM);
    };
    jPWebApp.p.checkIfAppTagExists = function () {

        var d = _(document);
        var tag = d.find(TAG_JPCAPP + "[data-id='" + this.opt.id + "']");
        if (tag.nodes.length == 0) {
            var err = new _.Error(ERRORSSRC, "0", ERRORSMSG[0])["throw"]();
            return false;
        }

        this.opt.el = tag.nodes[0];

        return true;
    };
    jPWebApp.p.scanForControls = function (sel) {

        // clear the controls collections
        this.opt.controls = [];

        var i = 0,
            len = this.opt.el.children.length;
        while (i < len) {
            debugger;
            i += 1;
        }

        return this;
    };
    //#endregion

    //#region jPControl
    var jPControl = function jPControl(id) {
        this.init(id);
    };
    jPControl.p = jPControl.prototype;
    jPControl.p.init = function (id) {

        ERRORSSRC = "jPControl.init";

        // option object
        this.opt = {
            id: id,
            el: null,
            type: null
        };

        return this;
    };
    jPControl.p.initFromHtml = function (sel) {

        ERRORSSRC = "jPControl.initFromHtml";

        // check if with selector specified exists a node
        var el = _(sel);
        if (el.nodes.length == 0) {
            var err = new _.Error(ERRORSSRC, "1", ERRORSMSG[1])["throw"]();
            return false;
        }

        // check control type
        var nn = el.nodes[0].nodeName;
        if (!utilities.check_jpwa_tags(nn)) {
            var err = new _.Error(ERRORSSRC, "2", ERRORSMSG[2])["throw"]();
            return false;
        }
        this.opt.type = nn;

        // check for data-id attr
        var id = el.dattr("id");
        if (id != null && id != "") {
            this.opt.id = id;
        } else {
            this.opt.id = new Date().getTime();
            el.dattr("id", this.opt.id);
        }

        return this;
    };
    //#endregion

    //#region jPForm
    var jPForm = function jPForm(id) {
        this.init(id);
    };
    jPForm.p = jPForm.prototype;
    jPForm.p.init = function (id) {};
    //#endregion

    window.jPWebApp = jPWebApp;
    window.jPControl = jPControl;
})(jPepper, window);

