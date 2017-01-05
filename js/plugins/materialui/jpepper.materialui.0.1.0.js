/*
jPepper.materialui
version 0.1.0
developed by Diego Pianarosa

*/

"use strict";

(function (_) {

    var SIGN = ".jp_materialui";
    var EVTERROR = "error";
    var ERRORSOURCE = "jPepper.materialui";

    var ERRORS = [
    ];

    function init(args) {

        if (args !== undefined) {
        }

        window.mui = {};
        mui.viewport = args.viewport;
        mui.pages = [];
        mui.panels = [];

        mui.destroy = function () {

        };
        mui.bindevents = function () {

        };
        mui.addpage = function (p, id) {
            var page = new MUIPage(p, id);
            mui.pages.push(page);
        };
        mui.getpage = function (p) {
            var i = 0, len = mui.pages.length;
            while (i != len) {
                var pa = mui.pages[i];
                if (pa.id == p) return pa;
                i++;
            }
            return null;
        };
        mui.showpage = function (page) {
            var p = mui.getpage(page);
            p.show();
        };
        mui.hidepage = function (page) {
            var p = mui.getpage(page);
            p.hide();
        };
        mui.addpanel = function (p, id) {
            var panel = new MUIPanel(p, id);
            mui.panels.push(panel);
        };
        mui.showpanel = function (panel, from, after) {
            var p = mui.getpanel(panel);
            p.show(from, after);
        };
        mui.hidepanel = function (panel) {
            var p = mui.getpanel(panel);
            p.hide();
        };
        mui.getpanel = function (p) {
            var i = 0, len = mui.panels.length;
            while (i != len) {
                var pa = mui.panels[i];
                if (pa.id == p) return pa;
                i++;
            }
            return null;
        };
        mui.settheme = function (theme) {

            _(".viewport").addClass(theme + " c50");
            _(".viewport .page .toolbar").addClass(theme + " c500");
            _(".viewport .page .footer").addClass(theme + " c500");
            _(".viewport .panel .inner").addClass(theme + " c700");
            _(".viewport .panel .inner .title").addClass(theme + " c600");
            _(".viewport .page .content article").addClass(theme + " c600");
        }
    };

    _.createPlugin({
        name: "materialui",
        fn: function (m, args) {

            switch (m) {
                case "init":
                    init(args);
                    break;
                case "destroy":
                    destroy(args);
                    break;
            }

            return this;
        }
    }, true);

    //#region Page
    var MUIPage = function (p, id) {
        return this.init(p, id);
    };
    MUIPage.p = MUIPage.prototype;
    MUIPage.p.init = function (p, id) {
        this.el = p;
        this.id = id;
        this.sections = [];
        return this;
    };
    MUIPage.p.show = function () {
        this.el.show();
    };
    MUIPage.p.hide = function () {
        this.el.hide();
    };
    //#endregion

    //#region Panel
    var MUIPanel = function (p, id) {
        return this.init(p, id);
    };
    MUIPanel.p = MUIPanel.prototype;
    MUIPanel.p.init = function (p, id) {
        this.el = p;
        this.id = id;
        this.bindevents();
        return this;
    };
    MUIPanel.p.bindevents = function () {
        var _this = this;
        this.el.on("click", function (e) {
            if (e.target != e.currentTarget) return;
            _this.el.removeClass("visible");
        });
        this.el.find(".inner").on("click", function (e) {
            if (e.target != e.currentTarget) return;
            _this.el.removeClass("visible");
        });
    };
    MUIPanel.p.show = function (after) {
        this.el.removeClass("visible").addClass("visible").show();
        if (after) {
            after();
        }
    };
    MUIPanel.p.hide = function () {
        this.el.hide();
    };
    //#endregion

})(jPepper);