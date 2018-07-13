import React from 'react';
import PropTypes from 'prop-types';
import PanelContentItems from './PanelContentItems';
var createReactClass = require('create-react-class');

var PrimaryPanels = createReactClass({
	getInitialState: function(){
		return {data:{},mountingContanier:null};
	},

	getDefaultProps: function(){
		return{
			primaryRequestUrl: "/aiui/contentLanding/getPrimaryPageData"
		}
	},
	
	componentDidUpdate(prevProps, prevState) {
		if(this.props.panelClosed != prevProps.panelClosed){
			if(!this.props.panelClosed){
		// console.log('primary panel data for mounting Island ='+this.props.mountingIsland);
		//console.log('this.props.department ='+this.props.department+'this.props.mountingIsland ='+this.props.mountingIsland+'this.props.stateCd = '+this.props.stateCd);
		//console.log('this.props.panelClosed ='+this.props.panelClosed);
		var primaryPageRequest = $.ajax({
		 headers: {
		      'Accept': 'application/json',
		      'Content-Type': 'application/json'
		  },
		  url: this.props.primaryRequestUrl,
		  type: 'POST',
		  asynch:false,
		  data: JSON.stringify({
			  department:  this.props.department,
		  	  pageLevel: 'Primary',
			  state:  this.props.stateCd,
			  mountingIsland: this.props.mountingIsland,
			  companyCd: this.props.companyCd
		  }),
		  beforeSend: function(status, xhr){
				blockUser();
			},
		  contentType: 'application/json; charset=utf-8',
		  dataType: 'json',
		  timeout: 30000,	        
		  cache: false
	});
	
	primaryPageRequest.done(function(data,status,jqXHR){
		//console.log('page request is done..');
		this.setState({ data:data,mountingContanier:this.props.mountingIsland });
    }.bind(this));
			
	primaryPageRequest.fail(function(jqXHR,status,exception){
	   // console.log(" primaryPageRequest data fetch request failed = :");
	});
	
	primaryPageRequest.always(function(){
		$.unblockUI();
		//console.log(" primaryPageRequest any last clearing things");
	});
	
	}}
	},
	
	render: function() {
		
		if(this.state.data.length<1){
			return null;
		}
		
		var mountingArr = this.props.mountingIsland.split('-');
		var hasContent = false;
		for(let cont=0;cont<mountingArr.length;cont++){
			if(this.state.data[mountingArr[cont]]!=null){
				hasContent = true;
			}
		}
		//No content nodes we ignore! 
		if(!hasContent){
			return null;
		}
		
		var nodes = mountingArr.map((node, index) => {
				var conObj = this.state.data[node];
				var contentItem = [];
				var panelPrimaryProps = {};
				var stateCd= '';
				var department = '';
				var channelCd = '';
				//console.log(JSON.stringify(conObj));
				for (var key in conObj) {
					  if(key === 'contentItem'){ contentItem = conObj[key];}
					  if(key === 'department'){panelPrimaryProps.department=conObj[key]}
					  if(key === 'stateCd'){panelPrimaryProps.stateCd=conObj[key]}
					  if(key === 'channelCd'){panelPrimaryProps.channelCd=conObj[key]}
				}
				//console.log('contentItem = '+contentItem+'primary Panel Props = '+JSON.stringify(panelPrimaryProps));
				if(this.state.data && this.state.data[node] && contentItem.length>1){
					return (<PanelContentItems key={index} ndxPanel={index} mountingIsland={node} panelContents={contentItem} panelInfo={panelPrimaryProps}></PanelContentItems>)
				}
			    return null;
		});
		
		//console.log('#### Panel nodes = '+ JSON.stringify(nodes));
		var headerInfo = this.buildHeaderInfo();
		return (<div>{headerInfo}{nodes}</div>)
	}
	,
	buildHeaderInfo(){
	
		var marginRPanel = {width : "45%",float:"right"}
		var marginLPanel = {width : "45%",float:"left"}
		 
		if(this.state.mountingContanier == null ) return null;
		if(this.state.mountingContanier.indexOf('IA')!=-1 && this.state.mountingContanier.indexOf('HP')!=-1){
			return <div className="headerMainPanel"><div className="col-md-6 headerLeft text-center" style={marginLPanel}>Captive</div><div className="col-md-6 headerRight" style={marginRPanel}>Independent Agent</div></div>
		}
		else if(this.state.mountingContanier.indexOf('IA')!=-1){
			return <div className="headerMainPanel"><div className="col-md-6 headerLeft text-center" style={marginLPanel}>Independent Agent</div></div>
		}
		else if(this.state.mountingContanier.indexOf('HP')!=-1){
			return <div className="headerMainPanel"><div className="col-md-6 headerLeft text-center" style={marginLPanel}>Captive</div></div>
		}else{
			return null
		}
	}
	
});

PrimaryPanels.propTypes = {
	stateCd : PropTypes.string,
	companyCd : PropTypes.string,
	mountingIsland : PropTypes.string,
	department : PropTypes.string,
	primaryRequestUrl : PropTypes.string,
	panelClosed: PropTypes.bool
};

/*
PrimaryPanels.defaultProps = {
	primaryRequestUrl:'/aiui/contentLanding/getPrimaryPageData',
	stateCd :'',
	companyCd :'',
	mountingIsland :'',
	department :''
};
*/

export default PrimaryPanels;