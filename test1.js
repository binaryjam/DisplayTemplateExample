'use strict'

Type.registerNamespace('nsDTColourTestList');

(function(ns) {

	//private members
	var overrides = {};
  	overrides.Templates = {};
  	overrides.Templates.OnPostRender = changeCancelButtonLocation;

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


	function changeCancelButtonLocation(ctx)
	{
		EnsureScriptFunc('mQuery.js', 'm$', function() {
		    // DO STUFF
		    alert("I got mQuery");
		});
		//Just some example code I'm commenting out till I find out how to use mQuery instead
		/*
		jQuery(".csrHiddenField").closest("tr").hide(); 
		$('input[value=Cancel]').click(function() {
			//GetUrlKeyValue built in function, handy it is http://techfindings-prem.blogspot.co.uk/search/label/GetUrlKeyValue
			window.location=GetUrlKeyValue('cancelSource');
		});
		*/
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






