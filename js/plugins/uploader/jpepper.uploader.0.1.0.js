/*
jPepper.uploader
version 0.1.0
developed by Diego Pianarosa

usage:

var up = _("#uploader").uploader("init",{
    maxfilesize: 5000000,
    filetypes: "jpg, png, bmp",
    folder: "/public/temp",
    appendto: "#viewer",
    serverhandler: "ajaxfileupload.ashx"
});
up.uploader("startUpload");
*/

"use strict";

(function (_) {

    var SIGN = ".jp_uploader";
    var EVTDROP = "drop" + SIGN;
    var EVTDRAGOVER = "dragover" + SIGN;
    var EVTDRAGENTER = "dragenter" + SIGN;
    var EVTDRAGEND = "dragend" + SIGN;
    var EVTCHANGE = "change" + SIGN;
    var EVTFILESADDED = "filesadded";
    var EVTFILEUPLOADSTART = "fileuploadstart";
    var EVTFILEUPLOADPROGRESS = "fileuploadprogress";
    var EVTFILEUPLOADEND = "fileuploadend";
    var EVTFILESUPLOADSTART = "filesuploadstart";
    var EVTFILESUPLOADPROGRESS = "filesuploadprogress";
    var EVTFILESUPLOADEND = "filesuploadend";
    var EVTERROR = "error";
    var ERRORSOURCE = "jPepper.uploader";
    var MAXFILESIZE = "maxfilesize";
    var FOLDER = "folder";
    var APPENDTO = "appendto";
    var SERVERHANDLER = "serverhandler";
    var FILETYPES = "filetypes";
    var UPLOADERTYPE = "uptype";

    var ERRORS = [
        "File API not supported, can't init jPepper.uploader",
        "Some files exceeds the max file size",
        "Some files has not supported extension"
    ];

    var evtFilesAdded = new Event(EVTFILESADDED);
    var evtFilesUploadStart = new Event(EVTFILESUPLOADSTART);
    var evtFilesUploadProgress = new Event(EVTFILESUPLOADPROGRESS);
    var evtFilesUploadEnd = new Event(EVTFILESUPLOADEND);
    var evtFileUploadStart = new Event(EVTFILEUPLOADSTART);
    var evtFileUploadProgress = new Event(EVTFILEUPLOADPROGRESS);
    var evtFileUploadEnd = new Event(EVTFILEUPLOADEND);

    function init(args) {

        if (!window.File ||
            !window.FileReader ||
            !window.FileList ||
            !window.Blob) {
            throw ERRORS[0];
            this.trigger(EVTERROR, new _.Error(ERRORSOURCE, "", ERRORS[0], this));
            return false;
        }

        if (args !== undefined) {
            // max file size
            if (args[MAXFILESIZE] !== undefined) {
                this.data[MAXFILESIZE] = args[MAXFILESIZE];
            }
            // file types
            if (args[FILETYPES] !== undefined) {
                this.data[FILETYPES] = args[FILETYPES].split(",");
            }
            // folder
            if (args[FOLDER] !== undefined) {
                this.data[FOLDER] = args[FOLDER];
            }
            // appendto
            if (args[APPENDTO] !== undefined) {
                this.data[APPENDTO] = args[APPENDTO];
            }
            // serverhandler
            if (args[SERVERHANDLER] !== undefined) {
                this.data[SERVERHANDLER] = args[SERVERHANDLER];
            }
        }

        bindevents.call(this);
    };
    function destroy(args) {

        this.off(EVTDRAGENTER);
        this.off(EVTDRAGEND);
        this.off(EVTDRAGOVER);
        this.off(EVTDROP);

    };
    function startUpload(args) {

        var _this = this;

        this.trigger(EVTFILESUPLOADSTART);

        var i = 0, len = this.data.files.length;
        while (i != len) {
            var uri = this.data[SERVERHANDLER];
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            var file = this.data.files[i];

            this.trigger(EVTFILEUPLOADSTART, file);

            xhr.open("POST", uri, true);
            xhr.onreadystatechange = function (e) {

                // success
                if (this.readyState == 4 && this.status == 200) {

                    this.onreadystatechange = null;
                    _this.trigger(EVTFILEUPLOADEND, {
                        fileindex: this.fileindex
                    });

                    if (this.fileindex == len - 1) {
                        _this.trigger(EVTFILESUPLOADEND);
                    }

                }
                // error
                if ((this.readyState == 4 || this.readyState == 3) && this.status != 200) {

                    this.onreadystatechange = null;
                    this.trigger(EVTERROR, new _.Error(ERRORSOURCE, "", this.statusText, _this));

                }
            };
            fd.append("file", file);
            fd.append("name", file.name);
            fd.append("fileindex", i);
            fd.append("folder", _this.data[FOLDER] !== undefined ? this.data[FOLDER] : "");
            xhr.fileindex = i;
            xhr.file = file;
            xhr.send(fd);
            i++;
        }
    };
    function bindevents() {

        this.on(EVTDRAGENTER, ondragenter)
        this.on(EVTDRAGEND, ondragend);
        this.on(EVTDRAGOVER, ondragover);
        this.on(EVTDROP, ondrop);
        this.on(EVTCHANGE, onchange);
    };
    function ondrop(e) {
        e.preventDefault();

        var _this = this;

        this.data.files = e.dataTransfer.files;

        if (!validate.call(this)) return false;

        appendto.call(this);

        this.trigger(EVTFILESADDED);
    };
    function ondragover(e) {
        e.preventDefault();
    };
    function ondragenter(e) {
        e.preventDefault();
    };
    function ondragend(e) {
        e.preventDefault();
    };
    function onchange(e) {
        e.preventDefault();

        var _this = this;

        this.data.files = e.target.files;

        if (!validate.call(this)) return false;

        appendto.call(this);

        this.trigger(EVTFILESADDED);
    };
    function checkfilessize(files, mfs) {
        var i = 0, len = files.length;
        while (i != len) {
            if (files[i].size > mfs) {
                return false;
            }
            i++;
        }
        return true;
    };
    function checkfilesext(files, exts) {
        var i1 = 0, len1 = files.length;
        while (i1 != len1) {
            var ext = files[i1].name.substr((~-files[i1].name.lastIndexOf(".") >>> 0) + 2).trim();
            var i2 = 0, len2 = exts.length;
            var ok = false;
            while (i2 != len2) {
                if (exts[i2].trim() == ext) ok = true;
                i2++;
            }
            if (ok == false) {
                return false;
            }
            i1++;
        }
        return true;
    };
    function validate() {

        if (this.data[MAXFILESIZE] !== undefined) {
            if (!checkfilessize(this.data.files, this.data[MAXFILESIZE])) {
                this.trigger(EVTERROR, new _.Error(ERRORSOURCE, "", ERRORS[1], _this));
                return false;
            }
        }
        if (this.data[FILETYPES] !== undefined) {
            if (!checkfilesext(this.data.files, this.data[FILETYPES])) {
                this.trigger(EVTERROR, new _.Error(ERRORSOURCE, "", ERRORS[2], _this));
                return false;
            }
        }

        return true;
    };
    function appendto() {

        var _this = this;

        if (this.data[APPENDTO] !== undefined && this.data[APPENDTO] != "") {

            var i = 0, len = this.data.files.length;
            while (i != len) {
                var reader = new FileReader();
                var file = this.data.files[i];

                if (file.type.match("image")) {
                    reader.onloadend = function (e) {
                        var img = "<img src='" + e.target.result + "'/>";
                        var el = _(_this.data[APPENDTO]);
                        el.innerHTML(el.innerHTML() + img);
                    };

                    reader.readAsDataURL(file);
                }
                if (file.type.match("text")) {
                    reader.onloadend = function (e) {
                        var span = "<span>" + e.target.result + "'</span>";
                        var el = _(_this.data[APPENDTO]);
                        el.innerHTML(el.innerHTML() + span);
                    };

                    reader.readAsText(file);
                }
                i++;
            }

        }

    };

    _.createPlugin({
        name: "uploader",
        fn: function (m, args) {

            switch (m) {
                case "init":
                    init.call(this, args);
                    break;
                case "destroy":
                    destroy.call(this, args);
                    break;
                case "startUpload":
                    startUpload.call(this, args);
                    break;
            }

            return this;
        }
    });

})(jPepper);