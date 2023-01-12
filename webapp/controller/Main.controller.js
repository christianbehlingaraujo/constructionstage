sap.ui.define([
    "./BaseController",
    "../model/formatter",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Carousel",
    "sap/m/Image",
    "sap/m/Button",
	"sap/m/ButtonType",
    "sap/ui/Device",
    "sap/m/MessageBox"
],
    function (BaseController,
	Formatter,
	Sorter,
	Filter,
	FilterOperator,
	JSONModel,
	Dialog,
	Carousel,
	Image,
	Button,
	ButtonType,
    Device,
    MessageBox) {
        "use strict";

        return BaseController.extend("com.itsgroup.brz.constructionstage.controller.Main", {
            /* =========================================================== */
            /* lifecycle methods                                           */
            /* =========================================================== */
            onInit: function (oEvent) {
                this.getRouter().getRoute("main").attachPatternMatched(this._onObjectMatched.bind(this), this);
            },

            /* =========================================================== */
            /* event handlers                                              */
            /* =========================================================== */
            onPressGridListItem: function(oEvent){
                this.setAppBusy(true);

                let oModelPath = oEvent.getSource().getBindingContextPath(),
                    oPath      = oModelPath.split("/").slice(-1).pop(),
                    oItems     = this.getModel("enterprises").getData().items,
                    oItem      = oItems[oPath];

                this.byId("gridList").addStyleClass("gridListEnterprisesScroll");
                
                this.byId(oEvent.getParameter("id")).setHighlight("Success");

                for(let i=0; i < oItems.length; i++){
                    if(i != Number(oPath)){
                        let oContent = this.byId(`container-constructionstage---main--gridListItem-container-constructionstage---main--gridList-${i}`);
                        
                        if(oContent === undefined){
                            oContent = this.byId(`application-ConstructionStage-Display-component---main--gridListItem-application-ConstructionStage-Display-component---main--gridList-${i}`);
                        }
                        
                        oContent.setHighlight("None");
                    }
                }

                this.getModel("constructionProgress").setData(oItem);
                this.getModel("constructionProgress").refresh(true);

                this.byId("DetailEnterprise").setVisible(true);

                this.setAppBusy(false);
            },

            onPressImage: function(oEvent){
                if(!this._oDialogImage){
                    this._oDialogImage = new Dialog({
                        //title: this.getResourceBundle().getText("mainTitleDialogImage"),
                        content: new Carousel({
                            height: "100%",
                            width: "100%",
                            pages: { 
                                path: 'constructionProgress>/images',
                                template: new Image({
                                    alt: '{constructionProgress>name}',
                                    src: '{constructionProgress>src}',
                                    height: "{constructionProgress>height}",
                                    width: "{constructionProgress>width}"
                                })
                            }
                        }),
                        endButton: new Button({
                            text: this.getResourceBundle().getText("mainButtonTextDialogImage"),
                            press: function () {
                                this._oDialogImage.close();
                            }.bind(this)
                        })
                    });

                    this.getView().addDependent(this._oDialogImage);
			    }

			    this._oDialogImage.open();
            },

            onPressVideo: function(oEvent){
                let oVideo = this.getModel("constructionProgress").getData().linkVideo;

                if(oVideo != undefined){
                    window.open(oVideo, "_blank");
                }else{
                    MessageBox.warning(this.getResourceBundle().getText("messageWarningLinkVideo"));
                }
            },

            /* =========================================================== */
            /* internal methods                                            */
            /* =========================================================== */
            _onObjectMatched: async function(oEvent) { 
                this.setAppBusy(true);
                let oID = oEvent.getParameter("arguments").id,
                    oContracts,
                    oItems = [];

                if(oID === "0") {
                    let email = "",
                        userInfo;

                    try {
                        userInfo = sap.ushell.Container.getService("UserInfo");
                    } catch (error) {}
                    
                    
                    if (typeof (userInfo) === "undefined" || userInfo === "") {
                        email = "ginorodolfo@inboxbear.com";
                    } else {
                        email = userInfo.getEmail();
                    }
        
                    let sXMLID      = await this.getServicesID(btoa(email)).method('GET'),
                        res         = jQuery.parseXML(sXMLID),
                        id          = res.getElementsByTagName("id")[0],
                        userID      = id.innerHTML;

                    console.log(id)

                    oContracts  = await this.callService(`ContractCollection?$filter=BuyerPartyID eq '${userID}' and ProcessingTypeCode eq 'SLCO'&$format=json`).method('GET');
                }else {
                    //149
                    oContracts  = await this.callService(`ContractCollection?$filter=BuyerPartyID eq '${oID}' and ProcessingTypeCode eq 'SLCO'&$format=json`).method('GET');
                }

                if(oContracts.length != 0){
                    let oOrgIDs = [];

                    for(let oContract of oContracts){
                        if(oOrgIDs.length === 0){
                            oOrgIDs.push({ orgID: oContract.SalesUnitPartyID })
                        }else{
                            let oOrgID = oOrgIDs.find(sID => {
                                if(sID.orgID === oContract.SalesUnitPartyID) return sID;
                            });

                            if(oOrgID === undefined) oOrgIDs.push({ orgID: oContract.SalesUnitPartyID });
                        }
                    }

                    if(oOrgIDs.length === 1){
                        let oWorkeStageParms = await this.callServiceSaleFormatedJSON(`ZStatusObraRootCollection?$filter=ZID eq '${oOrgIDs[0].orgID}'&$format=json`).method('GET');
                        let oPartner         = await this.callServiceFormatedJSON(`PartnerCollection?$filter=IDEmpreendimento_KUT eq '${oOrgIDs[0].orgID}'&$expand=PartnerAttachment&$format=json`).method('GET');

                        this.getModel("constructionProgress").setData(this._createObject(oWorkeStageParms, oPartner));
                        
                        this.getModel("constructionProgress").refresh(true);

                        this.byId("gridList").setVisible(false);
                        this.byId("DetailEnterprise").setVisible(true);

                        this.setAppBusy(false);
                    }else{
                        for(let oOrgID of oOrgIDs){
                            let oWorkeStageParms = await this.callServiceSaleFormatedJSON(`ZStatusObraRootCollection?$filter=ZID eq '${oOrgID.orgID}'&$format=json`).method('GET');
                            let oPartner         = await this.callServiceFormatedJSON(`PartnerCollection?$filter=IDEmpreendimento_KUT eq '${oOrgID.orgID}'&$expand=PartnerAttachment&$format=json`).method('GET');
        
                            oItems.push(this._createObject(oWorkeStageParms, oPartner));
                        }

                        this.getModel("enterprises").setData({ items: oItems });
                        this.getModel("enterprises").refresh(true);

                        this.setAppBusy(false);
                    }
                }else{
                    this.setAppBusy(false)
                    this.getRouter().navTo("notFound");
                }
            },

            _filterTheData: function(sModelPartnerAttachment){
                let oImages = [], oVideo, oWidth, oHeight;

                if(Device.system.phone){
                    oWidth  = "320px";
                    oHeight = "280px";
                }else if(Device.system.tablet){
                    oWidth  = "720px";
                    oHeight = "480px";
                }else{
                    //960 x 720 pixels
                    oWidth  = "960px";
                    oHeight = "720px";
                }

                sModelPartnerAttachment.map(sItem => {
                    if(sItem.TypeCode  === "Z44") {
                        const byteCharacters = atob(sItem.Binary);
                        const byteNumbers    = new Array(byteCharacters.length);

                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }

                        const byteArray = new Uint8Array(byteNumbers);
                        let blob        = new Blob([byteArray], {type: "image/png"});
			            let _imageUrl   = URL.createObjectURL(blob);

                        oImages.push({ name: sItem.Name, src: _imageUrl, width: oWidth, height: oHeight });
                    }
                });

                sModelPartnerAttachment.find(sItem => {
                    if(sItem.CategoryCode === "3") {
                        oVideo = sItem.LinkWebURI;
                        return;
                    }
                });
            
                return {
                    images: oImages,
                    linkVideo : oVideo
                }
            },

            _createObject: function(sModelWorkeStageParms, sPartner){
                let sModelPartnerAttachment = {};
                
                if(sPartner != undefined){
                    sModelPartnerAttachment = this._filterTheData(sPartner.PartnerAttachment);
                }else{
                    sModelPartnerAttachment.images    = [{ name: "", src: "", width: "100%", height: "100%" }];
                    sModelPartnerAttachment.linkVideo = "";
                }

                return { 
                    key: Math.random(),
                    orgID: sPartner != undefined ? sPartner.IDEmpreendimento_KUT: "",
                    name: sPartner != undefined ? sPartner.Name : "",
                    deliveryDate: this._formatedDate(sPartner != undefined ? sPartner.Datadaentrega_KUT: "").substring(0, 10),
                    address: sPartner != undefined ? sPartner.FormattedPostalAddressDescription: "",
                    lastUpdate: this._formatedDate(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZDATAATUALIZACAO : null),
                    workStage: sPartner != undefined ? sPartner.EstagiodaObra_KUTText: "",
                    images: sModelPartnerAttachment.images,
                    linkVideo: sModelPartnerAttachment.linkVideo,
                    constructionProgress: {
                        preliminary: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZPRELIMINARES : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZPRELIMINARES : "0"))
                        },
                        infrastructure: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZINFRAESTRUTURA : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZINFRAESTRUTURA : "0"))
                        },
                        foundation: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZFUNDACAO : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZFUNDACAO : "0"))
                        },
                        structure: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZESTRUTURA : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZESTRUTURA : "0"))
                        },
                        finishing: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZACABAMENTO : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZACABAMENTO : "0"))
                        },
                        paving: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZPAVIMENTACAO : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZPAVIMENTACAO : "0"))
                        },
                        landscaping: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZPAISAGISMO : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZPAISAGISMO : "0"))
                        },
                        checkList: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZCHECKLIST : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms!= undefined ? sModelWorkeStageParms.ZCHECKLIST : "0"))
                        },
                        documentation: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZDOCUMENTACAO : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZDOCUMENTACAO : "0"))
                        },
                        general: {
                            percentage: Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZGERAL : "0"),
                            valueColor: Formatter.stateworkStage(Formatter._formatedPercentage(sModelWorkeStageParms != undefined ? sModelWorkeStageParms.ZGERAL : "0"))
                        }
                    }
                };
            }
        });
    });
