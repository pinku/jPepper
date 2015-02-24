"use strict"

/*
jPepper.jptable
version 0.1.0
developed by Diego Pianarosa

usage:

var table = _("#mytable").jptable("init",{
});
*/

(function (_) {

	var PLUGINNAME = "jptable";

	var init = function (args) {

	};
	var destroy = function () {

	};

	_.createPlugin({
		name: PLUGINNAME,
		fn: function (m, args) {

			switch (m) {
				case "init":
					init.call(this, args);
					break;
				case "destroy":
					destroy.call(this, args);
					break;
			}

			return this;
		}
	});

})(jPepper);
