sap.ui.define([] , function () {
	"use strict";

	return {
        
        statusConstruction: function(status){
            if(status === "Em contrução"){
                return "sap-icon://eam-work-order"
            }else
            if(status === "Lançamento"){
                return "sap-icon://building"
            }else
            if(status === "Futuro lançamento"){
                return "sap-icon://building"
            }else{
                return "sap-icon://accept"
            }   
        },

        stateworkStage: function(sPercentage){
            if(sPercentage <= 10){
                return "Error"
            }else
            if(sPercentage > 10 && sPercentage <= 50){
                return "Critical"
            }else
            if(sPercentage > 50 && sPercentage <= 80){
                return "Neutral"
            }else{
                return "Good"
            }
        },

        _formatedPercentage: function(SValue){
            let position = SValue.indexOf("."),
                oValue   = SValue.substring(0, position);

            if(position != 1){
                return Number(oValue);
            }else {
                return Number(SValue)
            }
        },

	};

});