'use strict';var _exports;function init(){const a=require('../../lib/react.js');require('../../lib/react-dom.js');const b=require('../../cssStr/cssStr.js'),c=require('../../stores/webviewStores.js'),d=require('../../stores/windowStores.js'),f=require('../../actions/webviewActions.js'),g=require('../../stores/projectStores.js'),h=require('../../actions/projectActions.js'),j=require('../../weapp/utils/tools.js'),k=require('./../../common/log/log.js'),l=require('../../common/assdk/asSdk.js'),m=require('../../debugger/debugger.js'),n=require('../../config/dirConfig.js'),o=require('../../actions/windowActions.js'),p=require('./console/showconsole.js'),q=require('../../config/config.js'),r=require('./port/port.js'),s=100000,u=1000000,v='about:blank';var w;let x={};const y=function(A,B){o.showConfirm({content:A,callback:B})},z=a.createClass({displayName:'DevTools',getInitialState:function(){return{isWxml:!1}},addContentScripts:function(A){A.addContentScripts([{name:'contentScripts',matches:['<all_urls>'],js:{files:['app/dist/contentscript/contentScript.js']},run_at:'document_start'}])},_initport:function(A){let B=A.name;if(`webview${s}`===B)this.port.init(A),this.port.postMessage('contentscript',{},'SHAKE_HANDS');else if(`webview${u}`===B){if(this.devtoolsview.src===v)return;this.devtoolsPort.init(A),this.devtoolsPort=A,this.devtoolsPort.postMessage('contentscript',{},'SHAKE_HANDS')}},_externalPort:function(A){let B=A.name;'storage'===B?(this.storagePort.init(A),this.storagePort.postMessage('',{},'SHAKE_HANDS')):'appdata'===B?(this.appdataPort.init(A),this.appdataPort.postMessage('',{},'SHAKE_HANDS')):'wxml'===B&&(this.wxmlPort.init(A),this.wxmlPort.postMessage('',{},'SHAKE_HANDS'))},initRuntime:function(){chrome.runtime.onConnect.addListener(this._initport)},storageMessage:function(A){if('GET_APP_DATA'===A.command){let B={storage:j.getProjectStorage(this.props.project)};this.storagePort.postMessage('',B,'tabui-setAsData')}},wxmlMessage:function(A){let{command:B,ext:C,data:D}=A;if('GET_CURRENT_DEBUGGEE'===B){let E=c.getCurrentWebviewID(),F=this.debuggeeMap[E];if(!F)return void k.error(`appservice.js error do not find ${E} debuggee`);this.wxmlPort.postMessage('',{res:{debuggee:F},ext:C,args:D},'GET_CURRENT_DEBUGGEE')}else'SEND_COMMAND'===B?('DOM.setInspectMode'===D.method&&'none'===D.commandParams.mode&&this.setState({isWxml:!1}),m.sendCommand(D.debuggee,D.method,D.commandParams,E=>{this.wxmlPort.postMessage('',{res:E,ext:C,args:D},'GET_DEVTOOLS_RES')})):'OPEN_FILE'===B&&o.openProjectFile(D)},appdataMessage:function(A){let B=A.command;'GET_APP_DATA'===B?this.port.postMessage('appservice',{},'GET_APP_DATA'):'WRITE_APP_DATA'===B&&this.port.postMessage('appservice',A.data,'WRITE_APP_DATA')},onMessage:function(A){if('COMMAND_FROM_ASJS'===A.command){let G=A.sdkName;if('__open-tools-log'===G)return void nw.Shell.openItem(n.WeappLog);if('__open-tools-vendor'===G)return void nw.Shell.openItem(n.WeappVendor);if('APP_SERVICE_COMPLETE'===G)return void c.emit('APPSERVICE_INIT');if('send_app_data'===G)return void this.appdataPort.postMessage('',A,'SEND_APP_DATA');if('publish'===G)return void f.asPublish(A);if('__show-new-feature-check'===G)return void o.toggleNewFeatureCheckShowStatus(!0);if('__hhdmbadmb'===G){const H=require('path'),I=require('fs');let J=H.join(__dirname,'../../../html/ext.html');return I.existsSync(J)?void nw.Window.open('app/html/ext.html',{show:!0,width:1219,height:1219},K=>{}):void 0}l.exec(A,(H,I)=>{setTimeout(()=>{this.port.postMessage('appservice',H,'GET_ASSDK_RES',A)},0)})}},initExternal:function(){chrome.runtime.onConnectExternal.addListener(this._externalPort)},newWindow:function(A){A.addEventListener('newwindow',function(B){let C=B.targetUrl;C&&('https://developers.google.com/web/tools/chrome-devtools/'===C&&(C='https://mp.weixin.qq.com/debug/wxadoc/dev/index.html'),nw.Window.open(C,{width:799,height:799}))})},_initAppservice:function(){function A(){function H(){C.removeEventListener('loadcommit',H),C.showDevTools(!0,E)}E.removeEventListener('loadcommit',A),C.addEventListener('loadcommit',H),C.src=`http://${G.hash}.appservice.open.weixin.qq.com/appservice`}let B=this.refs.container,C=this.appserviceWebview=document.createElement('webview');C.style.cssText='height:0.01px;width:0.01px';let D=C.getUserAgent();C.setUserAgentOverride(`${D} appservice webview/${s}`),B.appendChild(C),this.addContentScripts(C);let E=this.devtoolsview=document.createElement('webview');E.className=`devtools-content`;let F=`${E.getUserAgent()} asviewdevtools webview/${u} chromeRuntimeID/${chrome.runtime.id}`;E.setUserAgentOverride(F),E.setAttribute('partition','persist:devtools'),B.appendChild(E),this.addContentScripts(E),this.newWindow(E);let G=this.props.project;E.addEventListener('loadcommit',A),E.src=v,this.initRuntime(),this.initExternal(),this.onHeadersReceived(),this.onBeforeSendHeaders(),this.onSyncMessage()},_postMsgToAS:function(A){this.port.postMessage('appservice',A,'MSG_FROM_WEBVIEW')},_upASData:function(A,B){this.storagePort.postMessage('',{storage:B},'tabui-setAsData')},_restart:function(){let A=this.props.project;this.appserviceWebview.src=`http://${A.hash}.appservice.open.weixin.qq.com/appservice`},_startDebuggee:function(A,B){let C=B.webview,D=B.webviewOffset;new Date,m.start(C,{webviewOffset:D},E=>{this.debuggeeMap[A]=E,this.wxmlPort.postMessage('',{debuggee:E},'CHANGE_DEBUGGEE'),f.touchSetSuc(A)},(E,F,G={})=>{if('DOM.inspectNodeRequested'===F&&this.setState({isWxml:!1}),'DOM.inlineStyleInvalidated'!==F&&'DOM.characterDataModified'!==F){if('DOM.nodeHighlightRequested'===F&&'DOM.nodeHighlightRequested'===x.method&&G.nodeId===x.nodeId)return;x='DOM.nodeHighlightRequested'===F?{method:F,nodeId:G.nodeId}:{};let I=c.getOffset();this.wxmlPort.postMessage('',{debuggee:E,method:F,params:G,offset:I},'ON_EVENT')}},(E,F)=>{for(let G in this.wxmlPort.postMessage('',{debuggee:E},'ON_DETACH'),this.debuggeeMap)this.debuggeeMap[G].targetId===E.targetId&&delete this.debuggeeMap[G]})},_changeWebview:function(A){let B=this.debuggeeMap[A];B&&this.wxmlPort.postMessage('',{debuggee:B},'CHANGE_DEBUGGEE')},_setWebviewInfo:function(A){for(let B in this.debuggeeMap)m.sendCommand(this.debuggeeMap[B],'Emulation.setDeviceMetricsOverride',{width:parseInt(A.width),height:parseInt(A.height),deviceScaleFactor:A.dpr,mobile:!0,fitWindow:!1})},_getWeappError:function(A,B,C){this.port.postMessage('appservice',{fileName:j.getFileNameFromUrl(B),errStr:C},'WINDOW_GET_WEBAPP_ERROR')},inspector:function(){return this.wxmlPort.hasInit?void(this.setState({isWxml:!0}),this.wxmlPort.postMessage('',{},'SET_INSPECT_MODE')):void o.showTipsMsg({msg:'\u8BF7\u5148\u5207\u6362\u81F3 Wxml Pannel',type:'error'})},onSyncMessage:function(){let A=this.appserviceWebview;A.addEventListener('dialog',B=>{let C=B.messageType||'',D=B.messageText;if('prompt'===C){let E=/^____sdk____/.test(D);if(E){let F=JSON.parse(D.replace(/^____sdk____/,''));if('COMMAND_FROM_ASJS'===F.command){let G=F.sdkName;l.exec(F,(H,I)=>{B.dialog.ok(JSON.stringify({to:'appservice',msg:H,command:'GET_ASSDK_RES',ext:F})),('setStorageSync'===G||'clearStorageSync'===G)&&f.upASData(I.appid,I.storage)})}}}else if('confirm'===C){B.preventDefault();let E=B.dialog;y(D,F=>{F?E.ok():E.cancel()})}})},onBeforeSendHeaders:function(){let A=this.appserviceWebview,B=A.request,C=this.props.project;B.onBeforeSendHeaders.addListener(D=>{let E=D.url;if('main_frame'===D.type&&E.match(/\?load$/))return clearTimeout(w),w=setTimeout(()=>{h.restart(this.props.project)},500),{cancel:!0};let F=D.requestHeaders||[],G=F.findIndex(I=>{return'cookie'===I.name.toLowerCase()});F.splice(G,1);for(var H=0;H<F.length;++H)'_Cookie'===F[H].name&&(F[H].name='Cookie'),'Referer'===F[H].name&&(F[H].value=`https://servicewechat.com/${C.appid}/devtools/page-frame.html`);return{requestHeaders:D.requestHeaders}},{urls:['<all_urls>']},['blocking','requestHeaders'])},onHeadersReceived:function(){let A=this.appserviceWebview,B=A.request;B.onHeadersReceived.addListener(C=>{let D=C.type;if('script'===D){let E=C.responseHeaders||[],F=E.find(G=>{return G.name===q.ES6_ERROR});F&&this._showWeappError(q.ES6_ERROR,F.value)}},{urls:['<all_urls>']},['blocking','responseHeaders'])},_showWeappError:function(A,B){'edit'===this.props.propshow&&/ERROR$/.test(A)&&A!==q.WEBVIEW_ERROR&&setTimeout(()=>{o.showTipsMsg({msg:'\u7F16\u8BD1\u51FA\u73B0\u9519\u8BEF\uFF0C\u8BF7\u53BB\u63A7\u5236\u53F0\u67E5\u770B\u8BE6\u7EC6\u4FE1\u606F',type:'error'})}),p(this.appserviceWebview,A,B)},componentDidMount:function(){this.port=new r({onMessage:this.onMessage}),this.devtoolsPort=new r,this.storagePort=new r({onMessage:this.storageMessage}),this.wxmlPort=new r({onMessage:this.wxmlMessage}),this.appdataPort=new r({onMessage:this.appdataMessage}),this.debuggeeMap={},this._initAppservice(),c.on('POST_MSG_TOAS',this._postMsgToAS),c.on('UP_AS_DATA',this._upASData),g.on('RESTART_PROJECT',this._restart),d.on('START_WEBVIEW_DEBUGGEE',this._startDebuggee),d.on('WINDOW_CHANGE_WEBVIEW_ID',this._changeWebview),d.on('SET_WEBVIEW_INFO',this._setWebviewInfo),d.on('WINDOW_GET_WEBAPP_ERROR',this._getWeappError),d.on('WINDOW_SHOW_WEBAPP_ERROR',this._showWeappError)},componentWillUnmount:function(){this.devtoolsview.remove(),this.appserviceWebview.remove(),c.removeListener('POST_MSG_TOAS',this._postMsgToAS),c.removeListener('UP_AS_DATA',this._upASData),g.removeListener('RESTART_PROJECT',this._restart),d.removeListener('START_WEBVIEW_DEBUGGEE',this._startDebuggee),d.removeListener('WINDOW_CHANGE_WEBVIEW_ID',this._changeWebview),d.removeListener('SET_WEBVIEW_INFO',this._setWebviewInfo),d.removeListener('WINDOW_GET_WEBAPP_ERROR',this._getWeappError),d.removeListener('WINDOW_SHOW_WEBAPP_ERROR',this._showWeappError),chrome.runtime.onConnectExternal.removeListener(this._externalPort),chrome.runtime.onConnect.removeListener(this._initport)},render:function(){let A='appservice'===this.props.show?{height:'100%'}:b.webviewDisplayNone;'edit'===this.props.propshow&&(A=b.webviewDisplayNone);let B='debug'===this.props.propshow?{}:b.displayNone,C=this.state.isWxml?'devtools-inspector devtools-inspector-active':'devtools-inspector';return a.createElement('div',{style:A,ref:'container',className:'devtools'},a.createElement('div',{className:'devtools-inspector-bg',style:B}),a.createElement('div',{style:B,onClick:this.inspector,className:C}))}});_exports=z}init(),module.exports=_exports;