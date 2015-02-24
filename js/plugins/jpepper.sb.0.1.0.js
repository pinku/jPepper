"use strict";

var ERR1 = "jPepper SiteBuilder already initialized, call destroy method.";

var SBMAINELEMENT = "SBMainElement";
var SBOPTIONS = "SBOptions";
var SHOWSBMENU = "showSBMenu";

(function (_) {
	_.createPlugin({
		name: "SBInit",
		fn: function (a) {

			if (_.data[SBMAINELEMENT] !== undefined &&
				_.data[SBMAINELEMENT] !== null &&
				_.data[SBMAINELEMENT] !== "") {
				throw ERR1;
			}
			_.data[SBMAINELEMENT] = this.selector;

			var opt = {};
			_.data[SBOPTIONS] = opt;

			this[SHOWSBMENU] = function () {

				var html = "<div id='sbmenu'></div>";
				this.innerHTML(this.innerHTML() + html);

			};
			
			return this;
		}
	});

})(jPepper);

