/// <reference path="DefinitelyTyped/microsoft-ajax/microsoft.ajax.d.ts" />
/// <reference path="DefinitelyTyped/sharepoint/sharepoint.d.ts" />
/* global Type */
/* global RegisterModuleInit */
/* global _spPageContextInfo */
/* global BinaryJam */
/* global SPClientTemplates */
/* global CTOverrides */
// ES5 Compliant code.
// Author Simon Tocker
// Description my version of a complete MDS compliant JSLink file.
// Based on Articles by Martin Hatch, Wictor Wilen and Paul Cimares
// 		https://www.martinhatch.com/2013/08/jslink-and-display-templates-part-1.html
// 		http://www.wictorwilen.se/the-correct-way-to-execute-javascript-functions-in-sharepoint-2013-mds-enabled-sites
//		http://www.myfatblog.co.uk/index.php/2013/09/listview-web-part-issues-with-jslink-and-display-templates-a-solution/

//Creates the namespace and registers it so MDS knows its there, 
Type.registerNamespace('BinaryJam.JSLink.ColourMe');
Type.registerNamespace('CTOverrides');

//Routine to handle mutiple jslinks views on a page
/* jshint ignore:start */
window.CTOverrides=window.CTOverrides||function(){var e=this;return e.uniqueIds=1e3,ExecuteOrDelayUntilScriptLoaded(function(){e.oldRenderListView=RenderListView,RenderListView=function(i,t){"undefined"!=typeof e["ctlist_"+i.ListTitle]&&(i.BaseViewID=e["ctlist_"+i.ListTitle]),e.oldRenderListView(i,t)}},"ClientTemplates.js"),e.AddNewView=function(i){return e["ctlist_"+i]=e.uniqueIds,e.uniqueIds+=1,e.uniqueIds-1},e}();
// Code here will be ignored by JSHint.
/* jshint ignore:end */

(function (ns) {
  //Goes inside the module not at the top.
	"use strict";

	//You can only have one JSLink on a page, so if you got a bunch of webparts all using custom list def, this stuff wont work
	//without a tweak.  So make each view on the page a Different name for each webparts list view
	var overrideListId=CTOverrides.AddNewView("NameOfView");

  //Class definition
	ns.DisplayTemplateOverride = function () {

		var overrides = { 
			Templates:{} ,
			//The Special CTOverides Stuff
			BaseViewID: overrideListId,
			ListTemplateType: 103
		};

		//Severity is a custom numeric field in a custom list
		overrides.Templates.Fields = {
			'Severity': {
				'DisplayForm': displayForm,
				'View': displayView
			}
		};
		
		//Severity Break points, Low is green, medium amber and above Medium is Red
		var LOW = 25;
		var MEDIUM = 100;

		//HTML Colour Codes
		var ragRed="#FF0000";
		var ragGreen="#00BB00";
		var ragAmber="#FFC200";

		//Not sure if it was just me but when I referenced "ctx", it existed globally in one context, maybe a fluke, 
		//but I named the param itemCtx as its in the context of an item any ways
		function displayForm(itemCtx) {
			var intValue;
			intValue = parseInt(itemCtx.CurrentFieldValue);

			return displayMethod(intValue);
		}

		function displayView(itemCtx) {
			var intValue;
			//CurrentFieldValue is available in displayForms but not in Views
			intValue = parseInt(itemCtx.CurrentItem[itemCtx.CurrentFieldSchema.Name]);

			return displayMethod(intValue);
		}

		function displayMethod(intValue) {
			var colour;  

				if (intValue <= LOW) {
					colour = ragGreen;
				} else if (intValue <= MEDIUM) {
					colour = ragAmber;
				} else if (intValue > MEDIUM) {
					colour = ragRed;
				}
				//using style not class as Im not convinced of best way to implement a CSS include
				return "<div style='color:" + colour + "'>" + intValue + "</div>";
		
		}

		//Boilerplate stuff
		function registerTemplateOverrides() {
			SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrides);
		}

		function mdsRegisterTemplateOverrides() {
			var thisUrl = _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/js/ColourMe.js";
			RegisterModuleInit(thisUrl, registerTemplateOverrides);
		}
		
		function registerOverride() {
			if (typeof _spPageContextInfo !== "undefined" && _spPageContextInfo !== null) {
				mdsRegisterTemplateOverrides();
			} else {
				registerTemplateOverrides();
			}
		}
		
		//Public interface cos Im a class definition.
		return {
			RegisterOverride:registerOverride
		};
		//End --BoilerPlate
	};

	//Create the class and run it
	var dt = new ns.DisplayTemplateOverride();
	dt.RegisterOverride();

})(BinaryJam.JSLink.ColourMe);