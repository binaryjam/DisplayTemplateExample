/* global EnsureScriptFunc */    //No Types for init.js, shame really.  Have to put this here as Type.registerNamespace doesnt return anything for intellisense to pick up on
/* global nsDTColourTestList */  //Intellisense doesnt work for revealing module pattern, rather annoying
/// <reference path="typings/sharepoint/sharepoint.d.ts"/>
/// <reference path="typings/microsoft-ajax/microsoft.ajax.d.ts"/>

'use strict';
//Author:Simon
//Help from Hugh Wood
//Reference Blogs
//	 Martin Hatch - http://www.martinhatch.com/2013/08/jslink-and-display-templates-part-1.html
//   Wictor Wilen - http://www.wictorwilen.se/the-correct-way-to-execute-javascript-functions-in-sharepoint-2013-mds-enabled-sites
//   Hugh Wood - http://www.spcaf.com/blog/sharepoint-javascript-context-development-part-4-the-way-of-the-async-delta-manager/
//So what is this ?
//   I'm trying to create an Display Template that uses the best practices I can pull together and hopefully
//	 by using JS Patterns produce something that works efficiently and elegantly
//   No ugly code.
//   It's now also a test bed for using VS code and Git with Intellisense by incorporating Definately Typed objects.
//
//   Early days so don't expect elegant or efficient yet :-)
//

//Creates the namespace and registers it so MDS knows its there, 
Type.registerNamespace('nsDTColourTestList');

(function(ns) {
	//private members
	var overrides = {};
  	overrides.Templates = {};
  	overrides.Templates.OnPostRender = onPostRender;   //As this is associated with a template not sure why its firing lots of times on DisplayForm.aspx.
														// but not for AllItems.aspx
   	overrides.Templates.Fields = {
       //Colour is the Name of our field
       'Colour': {
          'View': colourFieldDisplay,
          'DisplayForm': colourFieldDisplay,
        }
    };

    //do not user var = function for private functions, else you get bit by declaration order.
	function colourFieldDisplay(ctx) {
		console.log("colourFieldDisplay");
		if (ctx !== null && ctx.CurrentItem !== null) {
			//I don't like this but more research needed regarding a better way needs some kind of register CSS
			var divStyle="style='display:inline-block; margin 3px;width:20px;height:20px;border:1px solid black;background-color:" 
								+ ctx.CurrentItem['Colour'] + "'";

			var html = "<div " + divStyle + "></div> " + ctx.CurrentItem['Colour'] ;

			return html;
		}
	};


	//more testing to do here this got fired lots of times on a DispForm.
	function onPostRender(ctx)
	{

		console.log("onPostRender");
		//Due to lifecycle, you cannot Ensure mquery load till later, so Im doing it here
		//because doing it earlier didnt work.
		
		//Force sync loading to prevent race conditions, I suppose it depends what you do here.
		EnsureScriptFunc('mQuery.js', 'm$', function() {
		    console.log("mquery callback");
		}, false);
		
	}


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

//I thought this odd, but it must be that, if you are in the context of MDS then this object 
//exists, if it doesnt exist then your are in a normal page, but this object exists in normal pages too
//yes but not at this point in the lifecycle.
//What a really strange way of determining in MDS mode or not.
if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
	console.log("Starting Display Override MDS");
	nsDTColourTestList.MdsRegisterTemplateOverrides();
} 
else {
	console.log("Starting Display Override noMDS");
	nsDTColourTestList.RegisterTemplateOverrides();
};
