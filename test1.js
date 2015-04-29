'use strict'

Type.registerNamespace('nsDTColourTestList');

(function(ns) {

	//private members
	var overrides = {};
  	overrides.Templates = {};
  	overrides.Templates.OnPostRender = onPostRender;

   	overrides.Templates.Fields = {
       //Colour is the Name of our field
       'Colour': {
          'View': colourFieldDisplay,
          'DisplayForm': colourFieldDisplay,
        }
    };

    //do not user var = function for private functions, else you get bit by declaration order.
	function colourFieldDisplay(ctx) {
		if (ctx !== null && ctx.CurrentItem !== null) {
			//I don't like this but more research needed regarding a better way needs some kind of register CSS
			var divStyle="style='display:inline-block; margin 3px;width:20px;height:20px;border:1px solid black;background-color:" 
								+ ctx.CurrentItem['Colour'] + "'";

			var html = "<div " + divStyle + "></div> " + ctx.CurrentItem['Colour'] ;

			return html;
		}
	};


	//more testing to do here this got fired lots of time.
	function onPostRender(ctx)
	{
		//Due to lifecycle, you cannot Ensure mquery load till later, so Im doing it here
		//because doing it earlier didnt work.
		//Force sync loading to prevent race conditions
		EnsureScriptFunc('mQuery.js', 'm$', function() {
		    alert("I got mQuery, now what ;-)");
		}, false);
		
	}


	function registerTemplateOverrides() {
		SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrides);
	};

	function mdsRegisterTemplateOverrides() {
	    var thisUrl = _spPageContextInfo.siteServerRelativeUrl + "js/jslink/test1.js";
	    registerField();
	    RegisterModuleInit(thisUrl, registerTemplateOverrides);
	};

	//public Members
    ns.RegisterTemplateOverrides = registerTemplateOverrides;
  	ns.MdsRegisterTemplateOverrides = mdsRegisterTemplateOverrides;
	

	if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
		nsDTColourTestList.MdsRegisterTemplateOverrides();
	} 
	else {
		nsDTColourTestList.RegisterTemplateOverrides();
	};

})(nsDTColourTestList);






