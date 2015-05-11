/* global nsDTColourTestList */
/// <reference path="DefinitelyTyped/microsoft-ajax/microsoft.ajax.d.ts" />
/// <reference path="DefinitelyTyped/sharepoint/sharepoint.d.ts" />
"use strict";

// jQuery library is required in this sample
// Fallback to loading jQuery from a CDN path if the local is unavailable

//Actually it's not but its handy to have here as a reference for the next one
//(window.jQuery || document.write('<script src="//ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.0.min.js"><\/script>'));


//Creates the namespace and registers it so MDS knows its there, 
Type.registerNamespace('nsDTColourTestList');

(function(ns) {
	//private members
	var overrides = {};
  	overrides.Templates = {};
  
   	overrides.Templates.Fields = {
       //Colour is the Name of our field
       'Colour': {
          'View': colourFieldItemRender,
          'DisplayForm': colourFieldItemRender,
        }
    };

	function colourFieldItemRender(ctx) {
		console.log("colourFieldDisplay");
		if (ctx !== null && ctx.CurrentItem !== null) {
			//I don't like this but more research needed regarding a better way needs some kind of register CSS
			var divStyle="style='display:inline-block; margin 3px;width:20px;height:20px;border:1px solid black;background-color:" 
								+ ctx.CurrentItem['Colour'] + "'";

			var html = "<div " + divStyle + "></div> " + ctx.CurrentItem['Colour'] ;

			return html;
		}
	};
	
	function registerTemplateOverrides() {
		console.log("registerTemplateOverrides");
		SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrides);
	};

	function mdsRegisterTemplateOverrides() {
		console.log("mdsRegisterTemplateOverrides");
	    var thisUrl = _spPageContextInfo.siteServerRelativeUrl + "js/jslink/test1.js";
	    RegisterModuleInit(thisUrl, registerTemplateOverrides);
	};
	
	ns.RegisterTemplateOverrides = registerTemplateOverrides;
  	ns.MdsRegisterTemplateOverrides = mdsRegisterTemplateOverrides;

})(nsDTColourTestList);

if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
	console.log("Starting Display Override MDS");
	nsDTColourTestList.MdsRegisterTemplateOverrides();
} 
else {
	console.log("Starting Display Override noMDS");
	nsDTColourTestList.RegisterTemplateOverrides();
};
