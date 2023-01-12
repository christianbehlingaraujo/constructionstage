sap.ui.define([
	"../services/Service",
	"sap/ui/core/UIComponent",
	"sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function (Service, UIComponent, mobileLibrary, Filter, FilterOperator) {
	"use strict";

	// shortcut for sap.m.URLHelper
	var URLHelper = mobileLibrary.URLHelper;
	return Service.extend("com.itsgroup.brz.constructionstage.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},
		/**
		 * Convenience method to define the busy State
		 * @public
		 * @param {Boolean} bBusy Busy State 
		 */
		setAppBusy: function(bBusy) {
			this.getModel("appView").setProperty("/busy", bBusy);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle : function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

        _formatedDate: function(sDate){
            if(sDate != null){
                let newDeliveryDate = new Date(parseInt(sDate.substring(6,19)));
                return sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "dd/MM/yyyy HH:mm:ss",
                    UTC: true
                }).format(newDeliveryDate);
            }

            return "";
        }
	})
});