/* global ExecuteOrDelayUntilScriptLoaded */
/* global RenderListView */
/* global CTOverrides */
window.CTOverrides = window.CTOverrides || function () {
	var CTHandler = this;

	CTHandler.uniqueIds = 1000;
	ExecuteOrDelayUntilScriptLoaded(function () {

		CTHandler.oldRenderListView = RenderListView;

		RenderListView = function (ctx, webPartId) {
			if ("undefined" !== typeof CTHandler["ctlist_" + ctx.ListTitle]) {
				ctx.BaseViewID = CTHandler["ctlist_" + ctx.ListTitle];
			}
			CTHandler.oldRenderListView(ctx, webPartId);
		}
	}, "ClientTemplates.js");

	CTHandler.AddNewView = function (viewName) {

		CTHandler["ctlist_" + viewName] = CTHandler.uniqueIds;
		CTHandler.uniqueIds += viewName;
		return CTHandler.uniqueIds - 1;
	};

	return CTHandler;


}();