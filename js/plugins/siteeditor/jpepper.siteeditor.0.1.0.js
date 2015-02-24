"use strict";

(function (_) {

    var SIGN = ".jp_siteeditor",
        ERRORSOURCE = "jPepper.siteeditor",
        SEMAINELEMENT = "SEMAINELEMENT",
        SEPATH = "sepath",
        SELANGUAGES = "selanguages",
        SELANGUAGE = "selanguage",
        SEEDITMODE = "SEEDITMODE",
        MODIFIED = "_modified_",
        EVTERROR = "error",
        EVTMOUSEOVER = "mouseover" + SIGN,
        EVTMOUSEOUT = "mouseout" + SIGN,
        EVTCONTEXTMENU = "contextmenu" + SIGN;
      

    var ERRORS = [
        "jPepper.siteeditor ERRCODE 1: Site editor already initialized. Call seDestroy() method first.",
        "jPepper.siteeditor ERRCODE 2: Site editor not initialized.",
        "jPepper.siteeditor ERRCODE 3: Edit mode value must be 0 or 1."
    ];
    var SEDRIVER = "";

    //#region createPlugin

    _.createPlugin({
        name: "siteeditor",
        fn: function (m, args) {

            switch (m) {
                case "init":
                    init.call(this, args);
                    break;
                case "rebind":
                    bindEvents.call(this);
                    break;
                case "destroy":
                    destroy.call(this, args);
                    break;
            }

            return this;

        }
    });

    //#endregion 

    //#region functions

    var init = function (args) {

        if (_.data[SEMAINELEMENT] !== undefined &&
            _.data[SEMAINELEMENT] !== null &&
            _.data[SEMAINELEMENT] !== "") {
            var err = new _.Error(ERRORSOURCE, "", ERRORS[0], this);
            throw err;
            this.trigger(EVTERROR, err);
            return this;
        }

        if (args[SEPATH] !== undefined &&
            args[SEPATH] !== null) {
            _.data[SEPATH] = args[SEPATH];
            SEDRIVER = _.data[SEPATH] + "sedriver.asmx/";
        }

        if (args[SELANGUAGES] !== undefined &&
            args[SELANGUAGES] !== null) {
            _.data[SELANGUAGES] = args[SELANGUAGES];
        }

        if (args[SELANGUAGE] !== undefined &&
            args[SELANGUAGE] !== null) {
            _.data[SELANGUAGE] = args[SELANGUAGE];
        }

        _.data[SEMAINELEMENT] = this.selector;

        bindEvents.call(this, args);

        return this;

    };
    var destroy = function (args) {


        if (_.data[SEMAINELEMENT] !== undefined &&
            _.data[SEMAINELEMENT] !== null &&
            _.data[SEMAINELEMENT] !== "") {
            _.data[SEMAINELEMENT] = null;
            unbindEvents();
            return this;
        }

        var err = new _.Error(ERRORSOURCE, "", ERRORS[1], this);
        throw err;
        this.trigger(EVTERROR, err);
        return this;

    };
    var over = function (e) {
        this.style("cursor", "pointer");
    };
    var out = function (e) {
        this.style("cursor", "default");
    };
    var menuedit = function (e) {

        var detail = new Detail(this, e);

    };
    var showMenu = function (e) {

        var _this = this;

        this.el = _(e.currentTarget);

        var x = e.pageX,
            y = e.pageY;

        var menuwrapper =
                _(document.createElement("div"))
                .attr("id", "se-wrapper")
                .addClass("se-wrapper");

        var edit = "<a href='#' id='se-menu-edit'>Edit</a>";
        var menu = "<div id='se-menu' style='left:" + x.toString() + "px; top: " + y.toString() + "px" + "'>" + edit + "</div>";

        menuwrapper
            .innerHTML(menu)
            .on("click", function (e) {
                this.remove();
            });

        _(_.data[SEMAINELEMENT]).append(menuwrapper);

        _("#se-menu-edit").on("click", function (e) {
            this.off();
            menuwrapper.remove();
            menuedit.call(_this, _this.el);
        });

    };
    var bindEvents = function () {

        _("[data-seeditable='1']").off(EVTMOUSEOVER).on(EVTMOUSEOVER, function (e) {
            e.preventDefault();
            over.call(this, e);
            return false;
        });

        _("[data-seeditable='1']").off(EVTMOUSEOUT).on(EVTMOUSEOUT, function (e) {
            e.preventDefault();
            out.call(this, e);
            return false;
        });

        _("[data-seeditable='1']").off(EVTCONTEXTMENU).on(EVTCONTEXTMENU, function (e) {
            e.preventDefault();
            showMenu.call(this, e);
            return false;
        });

    };
    var unbindEvents = function () {

        _("[data-seeditable='1']").off(EVTMOUSEOVER);

        _("[data-seeditable='1']").off(EVTMOUSEOUT);

        _("[data-seeditable='1']").off(EVTCONTEXTMENU);

    };

    //#endregion

    //#region Detail

    var Detail = function (_this, e) {
        this.init(_this, e);
    };
    Detail.prototype.init = function (_this,e) {

        this.el = e;

        // controlla se è specificato un data-setype
        var setype = this.el.attr("data-setype");
        if (setype !== undefined &&
            setype !== null &&
            setype !== "") {
            this.analyzeSeType(setype);
            return;
        }

        // analizza il tag
        this.analyzeTag();

    };
    Detail.prototype.analyzeSeType = function (e) {

        switch (e) {
            case "productcategories":
                this.editProductCategories();
                break;
        }

    };
    Detail.prototype.analyzeTag = function () {
        switch (this.el.nodes[0].nodeName) {
            case "H1":
            case "H2":
            case "H3":
            case "H4":
            case "H5":
            case "A":
            case "P":
                this.editText();
                break;
        }
    };
    Detail.prototype.loadDetail = function (det) {

        return _.GET(_.data[SEPATH] + "LoadControl.aspx?c=" + det);

    };
    Detail.prototype.loadData = function (key, type) {

        return _.POST(_.data[SEPATH] + "sedriver.asmx/LoadData", {
            key: key,
            type: type
        });

    };
    Detail.prototype.editText = function () {

        var _this = this;
        _this.type = "text";

        _this.setag = _this.el.nodes[0].nodeName;
        _this.seid = _this.el.attr("data-seid");
        _this.seclass = _this.el.attr("className");

        // carica i dati
        this.loadData(_this.el.attr("data-seid"), "text")
        // carica il detail
        .then(_this.loadDetail("text"))
        // gestisce il detail
        .then(function () {

            _this.data = JSON.parse(Encoder.htmlDecode(JSON.parse(JSON.parse(this.prevTask.prevTask.results).d).response));
            _this.lang = _.data[SELANGUAGE];
            _this.resetModifiedFlag();
            _this.show(this.prevTask.results);
            _this.setDatailHeader();
            _this.bindBodyEvents();
            _this.setDetailButtons();
            _this.setDetailBody();


        })
        // esegue la coda
        .do();
    };
    Detail.prototype.editProductCategories = function () {

        var _this = this;
        _this.type = "productcategories";

        _this.setag = _this.el.nodes[0].nodeName;
        _this.seid = _this.el.attr("data-seid");
        _this.seclass = _this.el.attr("className");

        // carica i dati
        this.loadData(_this.el.attr("data-seid"), "productcategories")
        // carica il detail
        .then(_this.loadDetail("productcategories"))
        // gestisce il detail
        .then(function () {

            _this.data = JSON.parse(Encoder.htmlDecode(JSON.parse(JSON.parse(this.prevTask.prevTask.results).d).response));
            _this.lang = _.data[SELANGUAGE];
            _this.resetModifiedFlag();
            _this.show(this.prevTask.results);
            _this.setDatailHeader();
            _this.bindBodyEvents();
            _this.setDetailButtons();
            _this.setDetailBody();


        })
        // esegue la coda
        .do();
    };
    Detail.prototype.setDatailHeader = function () {

        var _this = this;

        _("[data-id='se-detail'] [data-id='se-lang']").innerHTML(_this.populateLang());
        _("[data-id='se-detail'] [data-id='se-tag']").innerHTML(_this.setag);
        _("[data-id='se-detail'] [data-id='se-id']").innerHTML(_this.seid);
        _("[data-id='se-detail'] [data-id='se-class']").innerHTML(_this.seclass);
        _("[data-id='se-detail'] [data-id='se-lang']").off().on("change", function (e) {
            var val = _("[data-id='se-detail'] [data-id='se-lang']").val();
            _this.lang = val;
            _this.setDetailBody();
        });

    };
    Detail.prototype.setDetailBody = function () {

        var _this = this;

        _("[data-id='se-detail'] [data-id='se-body']").attr("se-lang", this.lang);
        
        for (var i=0; i<Object.keys(this.data[this.lang]).length; i++) {

            var key = Object.keys(this.data[this.lang])[i];
            if (key.substr(0, 1) == "_") continue;

            var value = this.data[this.lang][key];
            // converte i br in newline
            value = value.replace(/<br\s*\/?>/mg, "\n");
            
            _("[data-id='se-detail'] [data-id='"+key+"']").val(value);

        }


    };
    Detail.prototype.setDetailButtons = function () {

        var _this = this;

        // save
        _("[data-id='se-detail'] [data-id='se-save']").off().on("click", function (e) {
            _this.save();
        });

        // cancel
        _("[data-id='se-detail'] [data-id='se-close']").off().on("click", function (e) {
            _this.wrapper.remove();
        });

    };
    Detail.prototype.bindBodyEvents = function () {

        var _this = this;

        _("[data-id='se-detail'] [data-id='se-body'] textarea").off().on("change", function (e) {
            
            _this.data[_this.lang][MODIFIED] = 1;
            var value = this.val();
            //replace newline with br
            value = value.replace(/\n/mg, "<br>");
            _this.data[_this.lang][this.attr("data-id")] = value;

        });
    };
    Detail.prototype.show = function (html) {

        var _this = this;

        this.wrapper =
            _(document.createElement("div"))
            .attr("id", "se-wrapper")
            .innerHTML(html)
            .on("click", function (e) {
                if (e.currentTarget != e.target) return;
                this.remove();
            });

        _(_.data[SEMAINELEMENT]).append(_this.wrapper);

    };
    Detail.prototype.populateLang = function () {

        var html = "";
        for (var i = 0; i < _.data[SELANGUAGES].length; i++) {
            html += "<option value='" + _.data[SELANGUAGES][i].code + "'>" + _.data[SELANGUAGES][i].descr + "</option>";
        };
        return html;
    };
    Detail.prototype.resetModifiedFlag = function () {

        for (var i in this.data) {
            this.data[i][MODIFIED] = 0;
        }

    };
    Detail.prototype.save = function () {

        var _this = this;

        // key
        var key = _this.el.attr("data-seid");

        // data to save
        var data = {
            id: _this.seid,
            type: _this.type,
            data: _this.data
        }

        // remove not modified properties
        for (var i in data.data) {
            if (data.data[i][MODIFIED] == 0) {
                delete data.data[i];
                continue;
            }
            delete data.data[i][MODIFIED];
        }

        // call webservice
        _.POST(SEDRIVER + "SaveDetail", {
            data: data
        })
        // remove detail and execute afterSave
        .then(function () {
            _this.wrapper.remove();
            _this.afterSave();
        })
        // start the queue
        .do();

    };
    Detail.prototype.afterSave = function () {

        switch (this.type) {
            case "text":
                this.el.innerHTML(this.data[this.lang]["se-text"]);
                break;
        }
    };

    //#endregion

})(jPepper);