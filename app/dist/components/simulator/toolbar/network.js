'use strict';var _exports;function init(){const a=require('../../../lib/react.js'),b=require('../../../cssStr/cssStr.js'),c=require('../../../stores/webviewStores.js'),d=['wifi','2g','3g','4g'],e=require('../../../stores/windowStores.js'),f=require('../../../actions/windowActions.js'),g='network',h=a.createClass({displayName:'Network',getInitialState:function(){let i=c.getNetworkType();return{show:!1,nettype:i}},handleOnClick:function(i){i.stopPropagation();let j=!this.state.show;this.setState({show:j}),f.clickToolsbar(g)},_clickToolsbar:function(i){g!=i&&this.setState({show:!1})},componentDidMount:function(){e.on('CLICK_TOOLSBAR',this._clickToolsbar),e.on('BODY_CLICK',this._clickToolsbar)},componentWillUnmount:function(){e.removeListener('CLICK_TOOLSBAR',this._clickToolsbar),e.removeListener('BODY_CLICK',this._clickToolsbar)},clickNettype:function(i){i.stopPropagation();let j=i.currentTarget,k=j.dataset,l=k.nettype;c.setNetworkType(l),this.setState({show:!1,nettype:l})},render:function(){let i=this.state.show?{}:b.displayNone,j=this.state.show?'simulator-toolbar-model-icon-up':'simulator-toolbar-model-icon-down',k=[];for(let l in d){let m=d[l],n='simulator-toolbar-model-content-item';m===this.state.nettype&&(n+=' simulator-toolbar-model-content-item-current'),k.push(a.createElement('div',{onClick:this.clickNettype,className:n,'data-nettype':m,key:m},a.createElement('p',null,m)))}return a.createElement('div',{className:'simulator-toolbar-model simulator-toolbar-model_network',onClick:this.handleOnClick},a.createElement('p',null,this.state.nettype),a.createElement('i',{className:j}),a.createElement('div',{className:'simulator-toolbar-model-content',style:i},k))}});_exports=h}init(),module.exports=_exports;