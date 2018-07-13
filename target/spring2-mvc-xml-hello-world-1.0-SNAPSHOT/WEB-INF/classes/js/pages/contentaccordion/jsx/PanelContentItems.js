import React from 'react';
import PropTypes from 'prop-types';
import ContentItem from './ContentItem';

/* Panel component to hold the data for primary pages */
var PanelContentItems = class PanelContentItems extends React.Component{
	constructor(props) {
	    super(props)
	}

	getMountingNodes(mountingIsland,panelContents){
		   var innerKey = 'IA';
		    if(mountingIsland.indexOf("HP") != -1){
		           innerKey='HP';
		    }
		    var indents = [];
		    var contents = this.renderContentItem(panelContents);
		    
		    var marginRPanel = {
		    		width : "47%",
		    		float:"right"
		    }
		    
		    var marginLPanel = {
		    		width : "47%",
		    		float:"left"
		    }
		    
		    if(this.props.ndxPanel ==0){
			    indents.push(<div className="panel panel-default col-md-6 my-panel" style={marginLPanel} key={innerKey} ref={mountingIsland} id={mountingIsland}>{contents}</div>);
		    }else{
			    	indents.push(<div className="panel panel-default col-md-6 my-panel" style={marginRPanel} key={innerKey} ref={mountingIsland} id={mountingIsland}>{contents}</div>);
			}
		    return indents;
	}
	
	renderContentItem(contentItemsList){
		if(contentItemsList.length>0){
		var listStyle  = 'list-group-item';
			var contentItems = contentItemsList.map((contentItem,index) => (
					<li key={index}><ContentItem content={contentItem} panelInfo={this.props.panelInfo}/></li>)
			);
			return (<div className="panel-body my-panel-body"><ul className="list-group">{contentItems}</ul></div>)
		}else return null;
	}
	
	render() {
		var nodeData = this.getMountingNodes(this.props.mountingIsland,this.props.panelContents);
		return (<div>{nodeData}</div>);
	}
}

PanelContentItems.propTypes = {
		mountingIsland : PropTypes.string,
		panelContents : PropTypes.arrayOf(PropTypes.object)
}

PanelContentItems.defaultProps = {
		mountingIsland:'',
		panelContents:[{}]
}

export default PanelContentItems;
