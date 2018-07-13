import React from 'react';
import PropTypes from 'prop-types';
import SecondaryPageModal from './SecondaryPageModal';

var SecondaryPage = class SecondaryPage extends React.Component{
	constructor(props){
		super(props)
		this.state = {
		    	showPopUp:false,
		    	secondaryPgId:'',
		    	secondaryPgName:'',	
		   };
		this.showSecondaryPageDataModal = this.showSecondaryPageDataModal.bind(this);
		this.hideSecondaryPageDataModal = this.hideSecondaryPageDataModal.bind(this);
	};
	
	showSecondaryPageDataModal(secPageId,secPageDisplayName){
		this.setState({
	    	showPopUp:true,
	    	secondaryPgId:secPageId,
	    	secondaryPgName:secPageDisplayName,
		});
	};
	
	hideSecondaryPageDataModal(secPageId,secPageDisplayName){
		this.setState({
	    	showPopUp:false,
	    	secondaryPgId:secPageId,
	    	secondaryPgName:secPageDisplayName,
		});
	};
	
 render(){
			 var secContents = this.props.secondaryItem;
			 //console.log('----  SecondaryPage secondaryContents = '+secContents);
			 //console.log('----- SecondaryPage currrent State secPageId = '+this.state.secondaryPgId +'secPage name = '+this.state.secondaryPgName+' showPopUp ='+this.state.showPopUp);
			 
			 return (<div><div onClick={() => {this.showSecondaryPageDataModal(this.props.secondaryItem.secPageId,this.props.secondaryItem.displayValue)}} data-toggle="modal" data-target="#myModal"><a href="#">{this.props.secondaryItem.displayValue}</a></div>
			 	{this.state.showPopUp ? <SecondaryPageModal show={this.state.showPopUp} onClose={()=> {this.hideSecondaryPageDataModal(this.props.secondaryItem.secPageId,this.props.secondaryItem.displayValue)}} secondaryPgId={this.state.secondaryPgId} secondaryPgName={this.state.secondaryPgName} panelInfo={this.props.panelInfo}></SecondaryPageModal> : null}
			 </div>)
		}
};

SecondaryPage.propTypes = {
			secondaryItem : PropTypes.object,
			secondaryRequestUrl : PropTypes.string
};
		
SecondaryPage.defaultProps = {
			secondaryItem:{},
			secondaryRequestUrl: '/aiui/contentLanding/getSecondaryPageData'
};

export default SecondaryPage;