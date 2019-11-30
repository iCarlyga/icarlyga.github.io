function icarlyPrint(urlAlias,contentType,showID,numberPages){
					site="icarly";
					var ro={};
					com.mtvi.reporting.Account.name = "viakfprint";
					ro.name = com.mtvi.reporting.Account.name;
					ro.dynamicAccountSelection = false;
					ro.dynamicAccountList = "nickviadev=nick-d.mtvi.com,nick-q.mtvi.com";
					ro.linkInternalFilters = "javascript:,nick.com";
					ro.trackExternalLinks = true;
					ro.trackDownloadLinks = true;
					dispatcher.setAccountVars(ro);
					dispatcher.setAttribute("pageName",site+"-"+contentType+"-"+showID+"-"+urlAlias);
					dispatcher.setAttribute("channel",site);
					dispatcher.setAttribute("hier1",site+"/"+contentType+"/"+showID+"/"+urlAlias);
					dispatcher.setAttribute("hier2",site+"/"+contentType+"/"+showID+"/"+urlAlias);
					dispatcher.setAttribute("prop1",numberPages);
					dispatcher.setAttribute("prop2",site);
					dispatcher.setAttribute("prop3",contentType);
					dispatcher.setAttribute("prop4",showID);
					dispatcher.setAttribute("prop5",urlAlias);
					dispatcher.sendCall();
					resetParamsToDefault();
}