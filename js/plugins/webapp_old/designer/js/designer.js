"use strict";

(function (_) {

    //#region Designer

    var Designer = function () {
        this.init();
    };
    Designer.p = Designer.prototype;
    Designer.p.init = function () {

        this.form = null;
        this.desktop = _("#desktop");
        this.bindEvents();

    };
    Designer.p.bindEvents = function () {
        var _this = this;
        _("#btn_new").off().on("click", function (e) {
            _this.newForm();
        });
        _(".uicontrol").off().on("click", function (e) {
            var c = _(e.currentTarget);
            _this.newControl(c.attr("data-ctrl"));
        });
    };
    Designer.p.newForm = function () {
        var f = new jPForm();
        this.form = f;
        this.activeControl = this.form;
        this.desktop.empty();
        f.appendTo(this.desktop);
        this.bindEventsToControl(f);
    };
    Designer.p.newControl = function (type) {

        var c = null;
        switch (type) {
            case "section":
                c = new jPSection();
                this.activeControl.addControl(c);
                this.activeControl = c;
                break;
        }
    };
    Designer.p.initProperties = function () {

        // base properties
        this.activeControlProperties = [
            {
                group: "GENERICS",
                properties: [
                    {
                        name: "id"
                    }
                ]
            },
            {
                group: "APPEARANCE",
                properties: [
                    {
                        name: "cssClass"
                    },
                    {
                        name: "style"
                    }
                ]
            }
        ];

    };
    Designer.p.showProperties = function () {

        var _this = this;

        var _addTextProps = function (name, val) {

        };

        var group = "";
        _.each(this.activeControlProperties, function (e, i) {
                

        });
    };
    Designer.p.bindEventsToControl = function(c){

        c.el.off("click").on("click", function (e) {

        });
        c.el.off("mouseover").on("mouseover", function (e) {
            _(e.currentTarget).addClass("mover");
        });
        c.el.off("mouseout").on("mouseout", function (e) {
            _(e.currentTarget).removeClass("mover");
        });
    };

    //#endregion

    window.Designer = Designer;

})(jPepper);