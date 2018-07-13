import React, { Component } from 'react';
import PropTypes from 'prop-types';

var Collapsible = class Collapsible extends React.Component {
  constructor(props) {
    super(props)

    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.continueOpenCollapsible = this.continueOpenCollapsible.bind(this);

    // Defaults the dropdown to be closed
    if (this.props.open) {
      this.state = {
        isClosed: false,
        shouldSwitchAutoOnNextCycle: false,
        height: 'auto',
        transition: 'none',
        hasBeenOpened: true,
        overflow: this.props.overflowWhenOpen,
        inTransition: false,
      }
    } else {
      this.state = {
        isClosed: true,
        shouldSwitchAutoOnNextCycle: false,
        height: 0,
        transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
        hasBeenOpened: false,
        overflow: 'hidden',
        inTransition: false,
      }
    }
  }

    componentDidMount(){
      
    }
    
  componentDidUpdate(prevProps, prevState) {
      if(this.state.shouldOpenOnNextCycle){
      this.continueOpenCollapsible();
  }

  if (prevState.height === 'auto' && this.state.shouldSwitchAutoOnNextCycle === true) {
      window.setTimeout(() => { // Set small timeout to ensure a true re-render
        this.setState({
          height: 0,
          overflow: 'hidden',
          isClosed: true,
          shouldSwitchAutoOnNextCycle: false,
        });
      }, 50);
  }

  // If there has been a change in the open prop (controlled by accordion)
   if (prevProps.open !== this.props.open) {
      if(this.props.open === true) {
          // if there are two channels then nested accordion trigger opening, else the outer state accordion opens the data there will be no 
    	  // channel nested accordion.
    	  
      	
    	  this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  }

  closeCollapsible() {
      this.setState({
      shouldSwitchAutoOnNextCycle: true,
      height: 0,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      inTransition: true,
    });
  }

  openCollapsible() {
	  if(this.props.trigger === 'Independent Agent' || this.props.trigger === 'Captive' || (1 == this.props.channelCount &&(this.props.trigger === 'Connecticut' || this.props.trigger === 'New Jersey' || this.props.trigger === 'New York' 
    	  || this.props.trigger === 'Pennsylvania' || this.props.trigger === 'Massachusetts' || this.props.trigger === 'New Hampshire'))){ 
//		  console.log(' State = ' + this.props.stateCd+' mountingIsland = '+this.props.mountingIsland +'company code = '+this.props.companyCd)
//		  console.log(` channel count = `+this.props.channelCount)
		  let mountingIsland = this.props.mountingIsland;
		  var messageContentRequest = $.ajax({
				 headers: {
				      'Accept': 'application/json',
				      'Content-Type': 'application/json'
				  },
				  url: '/aiui/landing/getMessagesForStateChannel',
				  type: 'POST',
				  asynch:false,
				  data: JSON.stringify({
					  mountingIsland:  this.props.mountingIsland
				  }),
				  beforeSend: function(status, xhr){
						blockUser();
					},
				  contentType: 'application/json; charset=utf-8',
				  dataType: 'json',
				  timeout: 30000,	        
				  cache: false
			});
			
		  messageContentRequest.done(function(data,status,jqXHR){
			if(data!=null){
			  $('#'+mountingIsland).dataTable().fnDestroy();
			  $('#'+mountingIsland+' > tbody').empty();
			  
			  for (let i = 0; i < data.length; i++) {
  					let tr = $('<tr/>');
  					tr.append("<td> <p style=\"float: left; width: 600px; padding: 2px 0px; margin-top: 14px;\">" +
  					"<a href=\"#\" id=\"messageTitle_"+data[i].id+"\" class=\"messageLink\">"+data[i].title+"</a></p> </td>");
  					tr.append("<td><p style=\"float: right; padding: 2px 0px;width: 120px; color: #0099cc !important; margin-top: 14px;\">"+
  					"<span id=\"messageDate_"+i+"\"style=\"float: right;\">"
  					+$.datepicker.formatDate('mm/dd/yy', new Date(data[i].effDate))+
  					"</span></p>"+
  					"<div id=\"messageDetail_"+data[i].id+"\" class=\"hidden\">"+data[i].detail+"</div></td></tr>");
  					$('#'+mountingIsland).append(tr);
					}
				
			$("#"+mountingIsland).dataTable({
		    			"sPaginationType": "full_numbers",
		    			"pageLength": 6,
		    			"searching": false,
		    			"bLengthChange": false,
		    			"bInfo": false,
		    			"sDom": '<"top"flp>rt<"bottom"i><"clear">',
		    			"bJQueryUI": false,
		    			"ordering": false               
		    		});		        	
		    		//bind on click 
			 $(document).on("click", ".messageLink", function(){
			//$(".messageLink").on("click",function (){	
		    			showMessageModal(this);
		    		});
				}
				
		    }.bind(this));
					
		  	messageContentRequest.fail(function(jqXHR,status,exception){
			   console.log(" messageContentRequest data fetch request failed");
			});
			
		  messageContentRequest.always(function(){
				$.unblockUI();
			});
		  }
      this.setState({
      inTransition: true,
      shouldOpenOnNextCycle: true,
    });
  }

  continueOpenCollapsible() {
      this.setState({
      height: this.refs.inner.offsetHeight,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      isClosed: false,
      hasBeenOpened: true,
      inTransition: true,
      shouldOpenOnNextCycle: false,
    });
  }

  handleTriggerClick(event) {

      event.preventDefault();

    if (this.props.triggerDisabled) {
      return
    }
      //TD#75351-Clicking on another state in content should close the previous open state.
      if (this.state.isClosed === true) {
	    this.props.handleTriggerClick(this.props.accordionPosition);
		this.continueOpenCollapsible();
        this.props.onOpening();
      } else {
        this.closeCollapsible();
        this.props.onClosing();
      }
  }

  renderNonClickableTriggerElement() {
    if (this.props.triggerSibling && typeof this.props.triggerSibling === 'string') {
      return (
        <span className={`${this.props.classParentString}__trigger-sibling`}>{this.props.triggerSibling}</span>
      );
    } else if(this.props.triggerSibling) {
      return <this.props.triggerSibling />
    }

    return null;
  }

  handleTransitionEnd() {
    
    if (!this.state.isClosed) {
      this.setState({ height: 'auto', inTransition: false });
      this.props.onOpen();
    } else {
      this.setState({ inTransition: false });
      this.props.onClose();
    }
  }

 
  render() {
  var dropdownStyle = {
      height: this.state.height,
      WebkitTransition: this.state.transition,
      msTransition: this.state.transition,
      transition: this.state.transition,
      overflow: this.state.overflow,
    }

  var applyColor = {  
  	  color: "#007ac9"
  }
  
  var innerContentDiv = {
  	paddingLeft: "25px"
}
  
  	var openClass = this.state.isClosed ? 'is-closed' : 'is-open';
    var disabledClass = this.props.triggerDisabled ? 'is-disabled' : '';

    //If user wants different text when tray is open
    var trigger = (this.state.isClosed === false) && (this.props.triggerWhenOpen !== undefined)
                  ? this.props.triggerWhenOpen
                  : this.props.trigger;

    // Don't render children until the first opening of the Collapsible if lazy rendering is enabled
    var children = (this.state.isClosed && !this.state.inTransition) ? null : this.props.children;

      // Construct CSS classes strings
    const triggerClassString = `${this.props.classParentString}__trigger ${openClass} ${disabledClass} ${
      this.state.isClosed ? this.props.triggerClassName : this.props.triggerOpenedClassName
    }`;
   
    //console.log('triggerClass = '+triggerClassString)
    //console.log('trigger when open = '+this.props.triggerWhenOpen)
    if(openClass == 'is-open'){
    	applyColor = {
    			color:"grey"
    	}
    }
    
    const parentClassString = `${this.props.classParentString} ${
      this.state.isClosed ? this.props.className : this.props.openedClassName
    }`;
    const outerClassString = `${this.props.classParentString}__contentOuter ${this.props.contentOuterClassName}`;
    const innerClassString = `${this.props.classParentString}__contentInner ${this.props.contentInnerClassName}`;

    return(
      <div className={parentClassString.trim()}>
        <span 
          className={triggerClassString.trim()}
        	style = {applyColor}
          onClick={this.handleTriggerClick}>
          {trigger}
        </span>

        {this.renderNonClickableTriggerElement()}

        <div 
          className={outerClassString.trim()} 
          ref="outer" 
          style={dropdownStyle}
          onTransitionEnd={this.handleTransitionEnd}
        >
          <div
            className={innerClassString.trim()} style = {innerContentDiv} 
            ref="inner"
          >
         {children}
          </div>
        </div>
      </div>
    );
  }
}

Collapsible.propTypes = {
  stateCd : PropTypes.string,
  companyCd : PropTypes.string,
  mountingIsland : PropTypes.string,
  department : PropTypes.string,
  //primaryPageUrl : PropTypes.string,
  transitionTime: PropTypes.number,
  easing: PropTypes.string,
  open: PropTypes.bool,
  classParentString: PropTypes.string,
  openedClassName: PropTypes.string,
  triggerClassName: PropTypes.string,
  triggerOpenedClassName: PropTypes.string,
  contentOuterClassName: PropTypes.string,
  contentInnerClassName: PropTypes.string,
  accordionPosition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleTriggerClick: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onOpening: PropTypes.func,
  onClosing: PropTypes.func,
  trigger: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  triggerWhenOpen:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  triggerDisabled: PropTypes.bool,
  lazyRender: PropTypes.bool,
  overflowWhenOpen: PropTypes.oneOf([
    'hidden',
    'visible',
    'auto',
    'scroll',
    'inherit',
    'initial',
    'unset',
  ]),
  triggerSibling: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
}

Collapsible.defaultProps = {
  transitionTime: 400,
  easing: 'linear',
  open: false,
  classParentString: 'Collapsible',
  triggerDisabled: false,
  lazyRender: false,
  overflowWhenOpen: 'hidden',
  openedClassName: '',
  triggerClassName: '',
  triggerOpenedClassName: '',
  contentOuterClassName: '',
  contentInnerClassName: '',
  className: '',
  triggerSibling: null,
  onOpen: () => {},
  onClose: () => {},
  onOpening: () => {},
  onClosing: () => {},
  stateCd : 'Ignore',
  companyCd : 'Ignore',
  mountingIsland : 'Ignore',
  department : 'Ignore',
  openingStateCd : 'Ignore',
  openingCompanyCd : 'Ignore',
  openingMountingIsland : 'Ignore',
  openingDepartment : 'Ignore',
};

function showMessageModal(message) {
	
	var title = $(message).html();

	$('#msgHeader').html(title);
		var index = message.id.substring(message.id.lastIndexOf("_") + 1);
	var detail = $('#messageDetail_' + index);
	
	var msgDetail = $('#msgDetail');
	msgDetail.html(detail.html());
	$("a", msgDetail).click(function () {
		return openLink($(this));
	});
	$('#messageDialog').modal('show');
	
}

function openLink(link) {
	link.target = "_blank";
    window.open(link.prop('href'));
    return false;	
}


export default Collapsible;