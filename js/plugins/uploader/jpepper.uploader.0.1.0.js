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
    var CREATETHUMBS = "createthumbs";
    var THUMBSFOLDER = "thumbsfolder";
    var THUMBSWIDTH = "thumbswidth";
    var THUMBSHEIGHT = "thumbsheight";
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
            // create thumbs
            if (args[CREATETHUMBS] !== undefined) {
                this.data[CREATETHUMBS] = args[CREATETHUMBS];
            } else {
                this.data[CREATETHUMBS] = false;
            }
            // thumbs folder
            if (args[THUMBSFOLDER] !== undefined) {
                this.data[THUMBSFOLDER] = args[THUMBSFOLDER];
            }
            // thumbs width
            if (args[THUMBSWIDTH] !== undefined) {
                this.data[THUMBSWIDTH] = args[THUMBSWIDTH];
            }
            // thumbs height
            if (args[THUMBSHEIGHT] !== undefined) {
                this.data[THUMBSHEIGHT] = args[THUMBSHEIGHT];
            }
        }

        this.data.filenames = [];

        this.destroy = destroy;
        this.startUpload = startUpload;
        this.renamefile = renamefile;

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

        if (this.data.files === undefined ||
            this.data.files == null ||
            this.data.files.length == 0) {
            _this.trigger(EVTFILESUPLOADEND);
            return;
        }

        var i = 0, len = this.data.files.length;
        while (i != len) {
            var uri = this.data[SERVERHANDLER];
            var xhr = new XMLHttpRequest();
            var fd = new FormData();
            var file = this.data.files[i];
            var newname = this.data.filenames[i] != undefined ? this.data.filenames[i] : file.name;
            
            this.trigger(EVTFILEUPLOADSTART, file);

            xhr.open("POST", uri, true);
            xhr.onprogress = function (e) {
                _this.trigger(EVTFILESUPLOADPROGRESS, e);
            }
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
                    _this.trigger(EVTERROR, new _.Error(ERRORSOURCE, "", this.statusText, _this));

                }
            };
            fd.append("file", file);
            fd.append("name", newname);
            fd.append("fileindex", i);
            fd.append("folder", _this.data[FOLDER] !== undefined ? this.data[FOLDER] : "");
            if (_this.data[CREATETHUMBS]) {
                fd.append(CREATETHUMBS, "true");
                if (_this.data[THUMBSFOLDER]) fd.append(THUMBSFOLDER, _this.data[THUMBSFOLDER]);
                if (_this.data[THUMBSWIDTH]) fd.append(THUMBSWIDTH, _this.data[THUMBSWIDTH]);
                if (_this.data[THUMBSHEIGHT]) fd.append(THUMBSHEIGHT, _this.data[THUMBSHEIGHT]);
            }
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

        if (this.data.files !== undefined && this.data.files.length != 0) {
            Array.prototype.push.apply(e.target.files, _this.data.files);
        }
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
            var ext = files[i1].name.substr((~-files[i1].name.lastIndexOf(".") >>> 0) + 2).trim().toLowerCase();
            var i2 = 0, len2 = exts.length;
            var ok = false;
            while (i2 != len2) {
                if (exts[i2].trim().toLowerCase() == ext) ok = true;
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

        var _this = this;

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
                file.index = i;
                if (file.type.match("image")) {
                    reader.onload = (function (fi) {
                        return function (e) {
                            var img = "<img src='" + e.target.result + "' data-ix='" + fi.index + "'/>";
                            var el = _(_this.data[APPENDTO]);
                            el.innerHTML(el.innerHTML() + img);
                        };
                    })(file);

                    reader.readAsDataURL(file);
                }
                if (file.type.match("text")) {
                    reader.onloadend = (function (fi) {
                        return function (e) {
                            var span = "<span data-ix='" + fi.index + "'>" + e.target.result + "'</span>";
                            var el = _(_this.data[APPENDTO]);
                            el.innerHTML(el.innerHTML() + span);
                        };
                    })(file);

                    reader.readAsText(file);
                }
                i++;
            }

        }

    };
    function renamefile(i, n) {

        if (this.data.files !== undefined &&
            this.data.files !== null &&
            this.data.files.length > 0 &&
            this.data.files[i]) {

            if (this.data.filenames.length == 0) {
                var ix = 0, len = this.data.files.length;
                while (ix < len) {
                    this.data.filenames[ix] = this.data.files[ix].name;
                    ix++;
                }
            }

            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(this.data.files[i].name)[1];
            if (ext === undefined) ext = "";
            this.data.filenames[i] = n + (ext == "" ? "" : "." + ext);

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