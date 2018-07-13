import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

var createReactClass = require('create-react-class');

var CategoryContentItems = createReactClass({
	
	render :function(){
		var categoryContentObj = this.props.categoryContentItem
		var catContentType = categoryContentObj.contentType
		switch(catContentType){
		case 'Uploaded Document':
			return (<table className="welcomeCategoryTable"><tr><td className="welcomeCategoryCell"><a target={this.defaultProps.newWin} href={this.defaultProps.vignetteUrl+categoryContentObj.url}>{categoryContentObj.displayValue}</a></td>
			<td className="welcomeCategoryDescCell">{categoryContentObj.description}</td></tr></table>);
		case 'URL':
			return (<table className="welcomeCategoryTable"><tr><td className="welcomeCategoryCell"><a target={this.defaultProps.newWin} href={categoryContentObj.url}>{categoryContentObj.displayValue}</a></td><td className="welcomeCategoryDescCell">{categoryContentObj.description}</td></tr></table>);
		case 'Mailto':
			return (<div><a href={'mailto:'+categoryContentObj.url}>{categoryContentObj.displayValue}</a></div>);
		case 'Header':
			return(<div className="w_containerItemHeading">{categoryContentObj.displayValue}</div>);
		default:
			/*return (<div>{categoryContentObj.displayValue}</div>)*/
			return null;
		}

		
		
	
	},
	propTypes : {
		vignetteUrl : PropTypes.string,
		newWin : PropTypes.string
	},

	defaultProps : {
		vignetteUrl:'http://AIContent.Plymouthrock.com',
		newWin:'_blank'
	},
	
});

export default CategoryContentItems;
