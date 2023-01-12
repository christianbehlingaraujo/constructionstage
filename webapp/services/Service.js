sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("com.itsgroup.brz.constructionstage.services.Service", {

    callService: function (entityName) {
      return {
        method: async (method) => {
          let sServiceURL = this.getOwnerComponent().getModel().sServiceUrl;

          let response = await fetch(
            `${sServiceURL}/${entityName}`,{
            method: method.toUpperCase(),
            headers: {
              "Content-Type": "application/json",
              'Authorization': "Basic X1BPUlRBTDpCcnpAMjAyMQ=="
            }
          }).then((response) => {
            if(response.status == 200 || response.status == 201) return response.json();
              return new response.text()
          }).catch((err) => {err});
      
          try { return response.d.results } catch (error) { return response }
        },
      };
    },

    callServiceFormatedJSON: function (entityName) {
      return {
        method: async (method) => {
          let sServiceURL = this.getOwnerComponent().getModel().sServiceUrl;

          let response = await fetch(
            `${sServiceURL}/${entityName}`,{
            method: method.toUpperCase(),
            headers: {
              "Content-Type": "application/json",
              'Authorization': "Basic X1BPUlRBTDpCcnpAMjAyMQ=="
            }
          }).then((response) => {
            if(response.status == 200 || response.status == 201) return response.json();
              return new response.text()
          }).catch((err) => {err});
      
          try { return response.d.results[0] } catch (error) { return response }
        },
      };
    },

    callServiceZ: function (entityName) {
      return {
        method: async (method) => {
          let sServiceURL = this.getOwnerComponent().getModel("C4C_Z").sServiceUrl;

          let response = await fetch(
            `${sServiceURL}/${entityName}`,{
            method: method.toUpperCase(),
            headers: {
              "Content-Type": "application/json",
              'Authorization': "Basic X1BPUlRBTDpCcnpAMjAyMQ=="
            }
          }).then((response) => {
            if(response.status == 200 || response.status == 201) return response.json();
              return new response.text()
          }).catch((err) => {err});
      
          try { return response.d.results } catch (error) { return response }
        },
      };
    },

    callServiceZFormatedJSON: function (entityName) {
      return {
        method: async (method) => {
          let sServiceURL = this.getOwnerComponent().getModel("C4C_Z").sServiceUrl;

          let response = await fetch(
            `${sServiceURL}/${entityName}`,{
            method: method.toUpperCase(),
            headers: {
              "Content-Type": "application/json",
              'Authorization': "Basic X1BPUlRBTDpCcnpAMjAyMQ=="
            }
          }).then((response) => {
            if(response.status == 200 || response.status == 201) return response.json();
              return new response.text()
          }).catch((err) => {err});
      
          try { return response.d.results[0] } catch (error) { return response }
        },
      };
    },
    
    callServiceSaleFormatedJSON: function (entityName) {
      return {
        method: async (method) => {
          let sServiceURL = this.getOwnerComponent().getModel("C4C_Sale").sServiceUrl;

          let response = await fetch(
            `${sServiceURL}/${entityName}`,{
            method: method.toUpperCase(),
            headers: {
              "Content-Type": "application/json",
              'Authorization': "Basic X1BPUlRBTDpCcnpAMjAyMQ=="
            }
          }).then((response) => {
            if(response.status == 200 || response.status == 201) return response.json();
              return new response.text()
          }).catch((err) => {err});
      
          try { return response.d.results[0] } catch (error) { return response }
        },
      };
    },

    getServicesID: function (key) {

      //ID Cliente no CRM: 1008558
      //Usuário: leadpf05@getnada.com
      //Senha: Le@dpf05
      let sUrlService = this.getOwnerComponent().getModel("c4codatagetuser").sServiceUrl;

      let oHeader = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic cm9kcmlnb2ZmLmFiYXBAZ21haWwuY29tOnNraWdhd2tAUk8xMjEyIw",
        "SCPI": key,
        'x-csrf-token': "fetch"
      }

      return {
        method: async (sMethod) => {

          let oResponse = await fetch(`${sUrlService}`,
            {
              method: sMethod.toUpperCase(),
              headers: oHeader
            }
          ).then((response) => response.text())
            .catch((err) => err);

          return oResponse;
        }
      }
    },
	});
});