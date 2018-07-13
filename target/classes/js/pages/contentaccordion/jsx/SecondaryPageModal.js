import React from 'react';
import CategoryContentItems from './CategoryContentItems';
import SecondaryContentItems from './SecondaryContentItems';

var createReactClass = require('create-react-class');

var SecondaryPageModal = createReactClass({
	getInitialState : function(){
		return {secondaryData : [],categoryData:[]}
		}
	,
	componentDidMount: function (){
		 	//console.log('SecondaryPageModal secondary page id = '+this.props.secondaryPgId +' secondary page name = '+this.props.secondaryPgName);
			var secondaryPageRequest = $.ajax({
				 headers: {
				      'Accept': 'application/json',
				      'Content-Type': 'application/json'
				  },
				  url: '/aiui/contentLanding/getSecondaryPageData',
				  type: 'POST',
				  asynch:false,
				  data: JSON.stringify({
					  secPageId:  this.props.secondaryPgId
				  }),
				  beforeSend: function(status, xhr){
						blockUser();
					},
				  contentType: 'application/json; charset=utf-8',
				  dataType: 'json',
				  timeout: 30000,	        
				  cache: false
				});
			
			secondaryPageRequest.done(function(data,status,jqXHR){
					// console.log('--SecondaryPage response data = '+JSON.stringify(data));
					this.setState({secondaryData:data});
					//	data.map((secondaryContentItem,index) => {
					//	console.log('data @ '+index+' secondaryContentItem = '+JSON.stringify(secondaryContentItem));
					//	});
				
		    }.bind(this));
					
			secondaryPageRequest.fail(function(jqXHR,status,exception){
			    console.log(" SecondaryPage data fetch request failed = :");
			});
			
			secondaryPageRequest.always(function(){
				$.unblockUI();
				console.log(" SecondaryPage any last clearing things");
			});
	  }
	,
	loadCategoryItems:function(contentItemId){
		//console.log('Category load contents for category with contentId = '+contentItemId);
		var categoryItemsRequest = $.ajax({
			 headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			  },
			  url: '/aiui/contentLanding/getContentItemCategories',
			  type: 'POST',
			  asynch:false,
			  data: JSON.stringify({
				  contentItemId:  contentItemId
			  }),
			  beforeSend: function(status, xhr){
					blockUser();
				},
			  contentType: 'application/json; charset=utf-8',
			  dataType: 'json',
			  timeout: 30000,	        
			  cache: false
			});
		
		categoryItemsRequest.done(function(data,status,jqXHR){
			var secData = this.state.secondaryData;	
			this.setState({secondaryData:secData,categoryData:data});
		}.bind(this));
				
		categoryItemsRequest.fail(function(jqXHR,status,exception){
		    console.log(" SecondaryPageModal data fetch request failed = :");
		});
		
		categoryItemsRequest.always(function(){
			$.unblockUI();
			console.log(" SecondaryPageModal any last clearing things");
		});
		
 }
	
	,
	render:function(){
//		console.log('@ render SecondaryPageModal')
//		console.log(this.state.secondaryData);
//		console.log(this.props.secondaryPgId);
//		console.log(this.props.secondaryPgName);
//		console.log(' this.props.show = '+this.props.show);
//		console.log('panel info passed to Popup'+JSON.stringify(this.props.panelInfo));
		var agency = this.props.panelInfo.channelCd == 'Teachers' ? "Independent Agent" : "Captive";

		if(!this.props.show){
			return null;	
		}
		
		var secData = this.state.secondaryData;
		var hasCategory = false;
		var nodes = secData.map((secondaryContentItem,index) => {
			if(secondaryContentItem.contentType=='Category'){
				hasCategory = true;
				return (<li key={"SecItem"+index} className="list-group-item"><SecondaryContentItems onClick={() => {this.loadCategoryItems(secondaryContentItem.contentItemId)}} secondaryContentItem={secondaryContentItem}></SecondaryContentItems></li>);
			}
			return (<li key={"SecItem"+index} className="list-group-item"><SecondaryContentItems secondaryContentItem={secondaryContentItem}></SecondaryContentItems></li>);
		});

		var catData = this.state.categoryData;
		var catNodes = null;
		
		if(hasCategory && catData.length>0){
			catNodes = catData.map((categoryContentItem,index) => {
				return (<li key={"CatItem"+index} className="list-group-item"><CategoryContentItems categoryContentItem={categoryContentItem}></CategoryContentItems></li>);
				
			});
		}
		
		const backdropStyle = {
			      position: "fixed",
			      top: "0",
			      bottom: "0",
			      left: "0",
			      right: "0",
			      backgroundColor: "rgba(0,0,0,0.3)",
			      padding: "50px",
			      zIndex: "1099",
			    };

		// The modal "window"
	    const modalStyle = {
	      backgroundColor: "#fff",
	      borderRadius: "15px 15px 15px 15px",
	      width: "1050px",
	      height: "auto",
	      margin: "0 auto",
	      padding: "15px",
	      display: "table-cell",
	      left:"10%",
	      right:"10%",
	      top:"10%",
	      bottom:"10%",
	      cursor : "auto",
	    };
	    
	    const curPointer = {
	    	cursor : "pointer"
	    }
	    
	    const clsBtnAlign = {
	    		float:"right",
	    		marginRight:"5px"
	    }
	    
	    const leftPanelAlign = {
	    		width:"40%",
	    		float:"left"
	    }
	    
	    const rightPanelAlign = {
	    		width:"50%",
	    		float:"right"
	    }
	    
	    
	    var secHeader = hasCategory? this.buildCategoryPopUpHeader(this.props.secondaryPgName):this.buildSinglePopUpHeader(this.props.secondaryPgName);
			    
		return (<div>
				<div className="backdrop" style={backdropStyle}>
				<div className="container">
				<div className="modal" style={modalStyle}>
		        <div className="title"><button type="button" className="close" data-dismiss="modal" onClick={this.props.onClose}>&times;</button>
		        	<ol className="breadcrumb"><li>{this.props.panelInfo.stateCd}</li><li>{agency}</li><li>{this.props.panelInfo.department}</li>
		  	      	</ol>
		        	</div>
		        	{hasCategory ?
		        			<div>
		        			{secHeader}
		        			<div className="panel panel-default col-md-4 my-panel" style={leftPanelAlign}>
		        			    <div className="panel-body tab-pane my-panel-body">
		        			        <ul className="list-group">{nodes}</ul>
		        			    </div>
		        			</div>
		        			<div className="panel panel-default col-md-7 col-md-offset-1 my-panel" style={rightPanelAlign}>
		        			<div className="panel-body tab-pane my-panel-body"><ul className="list-group">{catNodes}</ul></div>
		        			</div>
		        			<div className="col-md-1 col-md-offset-10" style={clsBtnAlign}><button id="close"  type="button" className="aiBtn primaryBtn aiBtnSmall" onClick={this.props.onClose}>Close</button></div>
		        			</div> : 
		        			<div>
		        			{secHeader}
		        			<div className="panel panel-default col-md-12 my-panel">
		        			    <div className="panel-body tab-pane my-panel-body">
		        			    	<ul className="list-group">{nodes}</ul>
		        			    </div>
		        			</div>
		        			<div className="col-md-1 col-md-offset-10" style={clsBtnAlign}><button id="close"  type="button" className="aiBtn primaryBtn aiBtnSmall" onClick={this.props.onClose}>Close</button></div>
		        			</div>
		        	}
		        </div>
		        </div>
		        </div>
		        </div>
	           )
	},
	
	buildSinglePopUpHeader(title){
		return <div className="headerMainPanel"><div className="col-md-12 headerLeft text-center">{title}</div></div>
	}
	,
	buildCategoryPopUpHeader(title){
		 const leftPanelAlign = {
		    		width:"40%",
		    		float:"left"
		    }
		    
		    const rightPanelAlign = {
		    		width:"50%",
		    		float:"right"
		    }
		 
		 if (this.props.panelInfo.department == "Resources") {
			 return <div className="headerMainPanel"><div className="col-md-4 headerLeft text-center" style={leftPanelAlign}>{title}</div><div className="col-md-7 text-center headerRight col-md-offset-1" style={rightPanelAlign}>&nbsp;&nbsp;&nbsp;Item&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Description</div></div>
		 }
		 else {
			 return <div className="headerMainPanel"><div className="col-md-4 headerLeft text-center" style={leftPanelAlign}>{title}</div><div className="col-md-7 text-center headerRight col-md-offset-1" style={rightPanelAlign}>Item</div></div>
		 }

	}
	
});


export default SecondaryPageModal;
