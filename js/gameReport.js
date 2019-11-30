function trackKidsGamePlay(urlAlias){
    var site = "icarly";
    var ro={};
    com.mtvi.reporting.Account.name = "viakidsgameplay";
    ro.name = com.mtvi.reporting.Account.name;
    ro.dynamicAccountSelection = false;
    ro.dynamicAccountList = "nickviadev=nick-d.mtvi.com,nick-q.mtvi.com";
    ro.linkInternalFilters = "javascript:,nick.com";
    ro.trackExternalLinks = true;
    ro.trackDownloadLinks = true;
    dispatcher.setAccountVars(ro);
    dispatcher.setAttribute("channel",site);
    dispatcher.setAttribute("hier1",site+"/"+urlAlias);
    dispatcher.setAttribute("hier2","");
    dispatcher.setAttribute("prop1",site+"/"+urlAlias);
    dispatcher.setAttribute("prop2",urlAlias);
    dispatcher.setAttribute("prop3",site);				
    dispatcher.sendCall();
    resetParamsToDefault();
}