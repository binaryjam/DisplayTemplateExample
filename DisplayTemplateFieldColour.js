/// <reference path="DefinitelyTyped/microsoft-ajax/microsoft.ajax.d.ts" />
/// <reference path="DefinitelyTyped/sharepoint/sharepoint.d.ts" />
/// <reference path="DefinitelyTyped/DisplayTemplateFieldColour.d.ts" />

//This is a work in progress, trying to come up with a kind of best practice, of best practices
//because the office pnp examples do not do things how other JS peeps might.


//Im not convinced about this either, this should be SOD'ed  and what about MDS again / Leaving in for future reference
//(jQuery || document.write('<script src="//ajax.aspnetcdn.com/ajax/jquery/jquery-1.10.0.min.js"><\/script>'));

//Creates the namespace and registers it so MDS knows its there, 
Type.registerNamespace('BinaryJam.JSLink');

(function(ns) {
	"use strict";
	ns.DisplayTemplateFieldColour = function () {
		
		//private members
		var overrides = {};
	  	overrides.Templates = {};
	  
	   	overrides.Templates.Fields = {
	       //Colour is the Name of our field
	       'Colour': {
	          'View': colour_FieldItemRender,
	          'DisplayForm': colour_FieldItemRender
	        }
	    };

		//Create CSS classes
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.binaryJam_dt_FieldColour { display:inline-block; margin 3px;width:20px;height:20px;border:1px solid black; }';
		document.getElementsByTagName('head')[0].appendChild(style);
		
		function colour_FieldItemRender(ctx) {
			if (ctx !== null && ctx.CurrentItem !== null) {
				
				var divStyle="style='background-color:" + ctx.CurrentItem['Colour'] + "'";
				var html = "<div class='binaryJam_dt_FieldColour'" + divStyle + "></div> " + ctx.CurrentItem['Colour'] ;
	
				return html;
			}
		};
		
		function registerTemplateOverrides() {
			SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrides);
		};
	
		function mdsRegisterTemplateOverrides() {
		    var thisUrl = _spPageContextInfo.siteServerRelativeUrl + "js/jslink/test1.js";
		    RegisterModuleInit(thisUrl, registerTemplateOverrides);
		};
		
		//Public interface
		this.RegisterTemplateOverrides = registerTemplateOverrides;
	  	this.MdsRegisterTemplateOverrides = mdsRegisterTemplateOverrides;
	};

})(BinaryJam.JSLink);

if (typeof _spPageContextInfo != "undefined" && _spPageContextInfo != null) {
	BinaryJam.JSLink.DisplayTemplateFieldColour.MdsRegisterTemplateOverrides();
} 
else {
	BinaryJam.JSLink.DisplayTemplateFieldColour.RegisterTemplateOverrides();
};
