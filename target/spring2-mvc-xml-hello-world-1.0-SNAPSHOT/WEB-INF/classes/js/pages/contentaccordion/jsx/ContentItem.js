import React from 'react';
import PropTypes from 'prop-types';
import SecondaryPage from './SecondaryPage';

var ContentItem = class ContentItem extends React.Component {
	constructor(props){
		super(props)
	};
	
 render(){
		var contentItem = this.props.content;
		var contentType = this.props.content.contentType;
		switch(contentType){
		case 'Header':
			return this.processHeader(contentItem);
		case 'Secondary Page':
			return this.processSecondaryPages(contentItem);
		case 'Uploaded Document':
			return this.processUploadedDocument(contentItem);
		case 'URL':
			return this.processUrl(contentItem);
		case 'Mailto':
			return this.processMailTo(contentItem); 
		}
	};
		
	processHeader(contentItem){
		var headerStyle = {
	    fontFamily:"Arial",
	    fontSize:"13px",
	    fontWeight:"500",
	    fontStyle:"normal",
	    textDecoration:"none",
	    color:"#333333",
//		paddingLeft: "5x",
	    margin: "10px 0"
		};
		//return(<div style={headerStyle}>{contentItem.displayValue}</div>);
		return(<div className="w_containerHeading">{contentItem.displayValue}</div>);
	};
	
	processSecondaryPages(contentItem){
		var secondaryPageStyle = {
		fontFamily:"Arial",
		fontSize:"11px",
		fontWeight:"regular",
		fontStyle:"normal",
		textDecoration:"none",
		color:"#333333",
		paddingLeft: "15x",
		margin: "5px 0px 3px 10px",
		cursor:"pointer",
		color:"blue",
		textDecoration:"none"
		};
		//return (<div style={secondaryPageStyle}><SecondaryPage secondaryItem={contentItem} panelInfo={this.props.panelInfo}/></div>)
		return (<div className="w_label_1 w_label_2ndLvl"><SecondaryPage secondaryItem={contentItem} panelInfo={this.props.panelInfo}></SecondaryPage></div>)
		
	};
	
	processCategory(contentItem){
		var categoryStyle = {};
		return(<div>{contentItem.displayValue}</div>);
	};
	
	processUploadedDocument(contentItem){
		var uploadedDocumentStyle = {
				fontFamily:"Arial",
				fontSize:"11px",
				fontWeight:"regular",
				fontStyle:"normal",
				textDecoration:"none",
				color:"#333333",
				paddingLeft: "15x",
				margin: "5px 0px 3px 10px",
				cursor:"pointer",
				color:"blue",
				textDecoration:"none"
				};
		//return (<div style={uploadedDocumentStyle}><a target={ContentItem.defaultProps.newWin} href={ContentItem.defaultProps.vignetteUrl+contentItem.url}>{contentItem.displayValue}</a></div>);
		return (<div className="w_label_1 w_label_2ndLvl"><a target={ContentItem.defaultProps.newWin} href={ContentItem.defaultProps.vignetteUrl+contentItem.url}>{contentItem.displayValue}</a></div>);
	};
	
	processUrl(contentItem){
		var urlStyle = {
				fontFamily:"Arial",
				fontSize:"11px",
				fontWeight:"regular",
				fontStyle:"normal",
				textDecoration:"none",
				color:"#333333",
				paddingLeft: "15x",
				margin: "5px 0px 3px 10px",
				cursor:"pointer",
				color:"blue",
				textDecoration:"none"
				};
		//return(<div style={urlStyle}>{contentItem.displayValue}</div>);
		return(<div className="w_label_1 w_label_2ndLvl"><a target={ContentItem.defaultProps.newWin} href={contentItem.url}>{contentItem.displayValue}</a></div>);
		
	};
	
	processMailTo(contentItem){
		var urlStyle = {
				fontFamily:"Arial",
				fontSize:"11px",
				fontWeight:"regular",
				fontStyle:"normal",
				textDecoration:"none",
				color:"#333333",
				paddingLeft: "15x",
				margin: "5px 0px 3px 10px",
				cursor:"pointer",
				color:"blue",
				textDecoration:"none"
				};
		return (<div className="w_label_1 w_label_2ndLvl"><a href={'mailto:'+contentItem.url}>{contentItem.displayValue}</a></div>);
		
	};
};

ContentItem.propTypes = {
		vignetteUrl : PropTypes.string,
		newWin : PropTypes.string
};
	
ContentItem.defaultProps = {
		vignetteUrl:'http://AIContent.Plymouthrock.com',
		newWin:'_blank'
};

export default ContentItem;