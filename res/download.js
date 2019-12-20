//download.js v4.2, by dandavis; 2008-2016. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download
(function(root,factory){if(typeof define==='function'&&define.amd){define([],factory)}else if(typeof exports==='object'){module.exports=factory()}else{root.download=factory()}}(this,function(){return function download(data,strFileName,strMimeType){var self=window,defaultMime="application/octet-stream",mimeType=strMimeType||defaultMime,payload=data,url=!strFileName&&!strMimeType&&payload,anchor=document.createElement("a"),toString=function(a){return String(a)},myBlob=(self.Blob||self.MozBlob||self.WebKitBlob||toString),fileName=strFileName||"download",blob,reader;myBlob=myBlob.call?myBlob.bind(self):Blob;if(String(this)==="true"){payload=[payload,mimeType];mimeType=payload[0];payload=payload[1]}
if(url&&url.length<2048){fileName=url.split("/").pop().split("?")[0];anchor.href=url;if(anchor.href.indexOf(url)!==-1){var ajax=new XMLHttpRequest();ajax.open("GET",url,!0);ajax.responseType='blob';ajax.onload=function(e){download(e.target.response,fileName,defaultMime)};setTimeout(function(){ajax.send()},0);return ajax}}
if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)){if(payload.length>(1024*1024*1.999)&&myBlob!==toString){payload=dataUrlToBlob(payload);mimeType=payload.type||defaultMime}else{return navigator.msSaveBlob?navigator.msSaveBlob(dataUrlToBlob(payload),fileName):saver(payload)}}
blob=payload instanceof myBlob?payload:new myBlob([payload],{type:mimeType});function dataUrlToBlob(strUrl){var parts=strUrl.split(/[:;,]/),type=parts[1],decoder=parts[2]=="base64"?atob:decodeURIComponent,binData=decoder(parts.pop()),mx=binData.length,i=0,uiArr=new Uint8Array(mx);for(i;i<mx;++i)uiArr[i]=binData.charCodeAt(i);return new myBlob([uiArr],{type:type})}
function saver(url,winMode){if('download' in anchor){anchor.href=url;anchor.setAttribute("download",fileName);anchor.className="download-js-link";anchor.innerHTML="downloading...";anchor.style.display="none";document.body.appendChild(anchor);setTimeout(function(){anchor.click();document.body.removeChild(anchor);if(winMode===!0){setTimeout(function(){self.URL.revokeObjectURL(anchor.href)},250)}},66);return!0}
if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)){url=url.replace(/^data:([\w\/\-\+]+)/,defaultMime);if(!window.open(url)){if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){location.href=url}}
return!0}
var f=document.createElement("iframe");document.body.appendChild(f);if(!winMode){url="data:"+url.replace(/^data:([\w\/\-\+]+)/,defaultMime)}
f.src=url;setTimeout(function(){document.body.removeChild(f)},333)}
if(navigator.msSaveBlob){return navigator.msSaveBlob(blob,fileName)}
if(self.URL){saver(self.URL.createObjectURL(blob),!0)}else{if(typeof blob==="string"||blob.constructor===toString){try{return saver("data:"+mimeType+";base64,"+self.btoa(blob))}catch(y){return saver("data:"+mimeType+","+encodeURIComponent(blob))}}
reader=new FileReader();reader.onload=function(e){saver(this.result)};reader.readAsDataURL(blob)}
return!0}}))
