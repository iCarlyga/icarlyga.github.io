mtvn.btg.config.ReportSettings={
       version : '2.0.213',
       Omniture:{
          enabled: true,
          account: 'nickvia,viaicarly',
          dynamicAccountSelection: 'true',
          dynamicAccountList:  'devvianick=beta',
          linkInternalFilters: 'javascript:,icarly.com',
          enableVisitorNamespace: false
       },
       Nielsen:{
          enabled:    false,
          cId:        'us-400235'
       },
       GoogleAnalytics:{
          enabled:    false,
          account:    '',
          reportMode: '' // iframe/direct
       },
       QuantCast:{
          enabled:    false,
          labels:     '',
          reportMode: 'direct' //direct/ads
       },
       ComScore:{
          enabled:    true
       }
    };
    mtvn.btg.config.AdSettings={
       DoubleClick:{
          enabled:  true,
          dartSite: 'icarly.nol',
	positionThreshold: 2
       },
       Atom:{
          enabled:  false,
          dartSite: ''
       },
       International:{
          enabled:  false,
          dartSite: ''
       },
       QuantCast:{
          enabled:  false,
          enableDemoTargeting: false
       }
    };
mtvn.btg.Controller.init(); 
mtvn.btg.Controller.sendPageCall( { 
	pageName: 'icarly'+location.pathname, 
	channel: 'icarly', 
	prop4: prop4, 
	prop21: prop21, 
	hier1: 'icarly'+location.pathname,
	hier2: 'icarly'+location.pathname 
	} );
mtvn.btg.Controller.init(); 
var zone = location.pathname;
if(zone.indexOf(".html")<0){
	if(zone.charAt(zone.length-1)!="/") zone+="/index.html";
	else zone+="index.html";
}
var arr = zone.split("/");
if(arr.length==2){
		if(arr[1]=="index.html")
			zone = "/_hp";
}else if(arr.length==3){
		if(arr[2]=="index.html")zone = "/"+arr[1]+"/_mn";
	}
function gamePlay(){
	mtvn.btg.config.ReportSettings.Omniture["pageName"] = 'icarly'+location.pathname+'-playAgain'; 
	mtvn.btg.Controller.init(); 
	mtvn.btg.Controller.sendPageCall(); 

    	}