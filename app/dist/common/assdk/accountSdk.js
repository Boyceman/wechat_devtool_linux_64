'use strict';var _exports;function init(){const a=require('../../stores/projectStores.js');require('../../stores/webviewStores.js');const b=require('../../actions/windowActions.js'),c=require('../../common/request/request.js'),{jsLoginURL:d,jsRefreshSessionURL:f,jsOperateWXDATAURL:g,jsAuthorizeURL:h,jsAuthorizeConfirmURL:j}=require('../../config/urlConfig.js');_exports={login:function(l,m){let n=a.getProjectByHash(l.apphash),o=n.appid;c({url:`${d}?appid=${o}`,method:'post',body:JSON.stringify({scope:['snsapi_base']}),needToken:1},(p,q,r)=>{let s={},t='';p||200!==q.statusCode?t=p.toString():(r=JSON.parse(r),r.baseresponse&&(0==r.baseresponse.errcode?s={errMsg:'login:ok',code:r.code}:t=r.baseresponse.errmsg)),s.errMsg||(s.errMsg=`login:fail ${t}`),m(s)})},refreshSession:function(l,m){let n=a.getProjectByHash(l.apphash),o=n.appid;c({url:`${f}?appid=${o}`,method:'post',needToken:1},(p,q,r)=>{let s={},t='';p||200!==q.statusCode?t=p.toString():(r=JSON.parse(r),r.baseresponse&&(0==r.baseresponse.errcode?s={errMsg:'refreshSession:ok',expireIn:r.session_expire_in,err_code:r.baseresponse.errcode}:t=r.baseresponse.errmsg)),s.errMsg||(s.errMsg=`refreshSession:fail ${t}`),m(s)})},operateWXData:function(l,m){let n='',o=l.args,p=o.data.api_name,q=a.getCurrentProject(),r=a.getSdkUserAuthStorage(q);q&&(n=q.appid),c({url:`${g}?appid=${n}`,method:'post',body:JSON.stringify({data:JSON.stringify(o.data||{})}),needToken:1},(s,t,u)=>{let v={},w='';if(!s&&200===t.statusCode&&(u=JSON.parse(u),u.baseresponse))if(0==u.baseresponse.errcode)try{v.data=JSON.parse(u.data),v.errMsg='operateWXData:ok'}catch(x){v.errMsg='operateWXData:fail'}else{if(-12000==u.baseresponse.errcode){let x=(y,z)=>{v.errMsg=y?'operateWXData:ok':'operateWXData:cancel';let A=z[0];if(y&&A.checked){let B={data:JSON.stringify(o.data||{}),grant_scope:A.scope};c({url:`${g}?appid=${n}`,method:'post',body:JSON.stringify(B),needToken:1},(C,D,E)=>{let F={};if(!C&&200===D.statusCode&&(E=JSON.parse(E),E.baseresponse&&0===E.baseresponse.errcode))try{F.data=JSON.parse(E.data),F.errMsg='operateWXData:ok'}catch(G){F.errMsg='operateWXData:fail'}F.errMsg||(F.errMsg='operateWXData:fail'),m(F)}),r[`operateWXData_${p}`]=1,a.setUserAuthPemissionStorage(q,r)}else m(v)};if(r[`operateWXData_${p}`]){let y=u.scope;y.checked=!0,x(!0,[y])}else b.showAuthorizeConfirm({appicon_url:`${u.appicon_url}`,appname:u.appname,scope_list:[u.scope],callback:x});return}w=u.baseresponse.errmsg}v.errMsg||(v.errMsg='operateWXData:fail '+w),m(v)})},authorize:function(l,m){let n='',o=l.args,p=a.getCurrentProject();p&&(n=p.appid),c({url:`${h}?appid=${n}`,method:'post',body:JSON.stringify({scope:o.scope||[]}),needToken:1},(q,r,s)=>{let t={},u='';if(!q&&200===r.statusCode&&(s=JSON.parse(s),s.baseresponse))if(t.body=s,0==s.baseresponse.errcode)t.errMsg='authorize:ok';else{if(-12000==s.baseresponse.errcode)return void b.showAuthorizeConfirm({appicon_url:`${s.appicon_url}`,appname:s.appname,scope_list:s.scope_list,callback:(v,w)=>{if(t.errMsg=v?'authorize:ok':'authorize:cancel',v){let x=[];for(let y=0;y<w.length;++y){let z=w[y];!z.checked||x.push(z.scope)}c({url:`${j}?appid=${n}`,method:'post',body:JSON.stringify({scope:x}),needToken:1},(y,z,A)=>{let B={};y||200!==z.statusCode||(A=JSON.parse(A),A.baseresponse&&0===A.baseresponse.errcode&&(B.errMsg='authorize:ok')),B.errMsg||(B.errMsg='authorize:fail'),m(B)})}else m(t)}});u=s.baseresponse.errmsg}t.errMsg||(t.errMsg='authorize:fail '+u),m(t)})}}}init(),module.exports=_exports;