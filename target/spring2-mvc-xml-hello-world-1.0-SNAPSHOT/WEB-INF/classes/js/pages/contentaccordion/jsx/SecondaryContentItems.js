import React from 'react';
import PropTypes from 'prop-types';

var createReactClass = require('create-react-class');

var SecondaryContentItems = createReactClass({

	getDefaultProps: function(){
		return{
			vignetteUrl: "http://AIContent.Plymouthrock.com",
			newWin:"_blank"
		}
	},
	
	render :function(){
			var secContentObj = this.props.secondaryContentItem;
			var secContentItemId = secContentObj.contentItemId;
			var secContentDisplayValue = secContentObj.displayValue;
			var secContentType = secContentObj.contentType;
			switch(secContentType){
			case 'Uploaded Document':
				return (<div><a target={this.props.newWin} href={this.props.vignetteUrl+secContentObj.url}>{secContentObj.displayValue}</a></div>);
			case 'URL':
				return (<div><a target={this.props.newWin} href={secContentObj.url}>{secContentObj.displayValue}</a></div>);
			case 'Category':
				return (<div onClick={this.props.onClick.bind(this,secContentItemId)}><a href="#">{secContentObj.displayValue}</a></div>);
			case 'Mailto':
				return (<div><a href={'mailto:'+secContentObj.url}>{secContentObj.displayValue}</a></div>);
			default:
				return (<div className="w_containerItemHeading">{secContentObj.displayValue}</div>);
				//return null;
			}
		}
});

SecondaryContentItems.propTypes = {
	vignetteUrl : PropTypes.string,
	newWin : PropTypes.string
};

export default SecondaryContentItems;