import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PrimaryPanels from './PrimaryPanels';
var createReactClass = require('create-react-class');

//Collapsible component start
var Collapsible = class Collapsible extends React.Component {

  constructor(props) {
    super(props);

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
        this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  }

  closeCollapsible() {
      this.setState({
      shouldSwitchAutoOnNextCycle: true,
      //height: this.refs.inner.offsetHeight,
      height: 0,
      transition: `height ${this.props.transitionTime}ms ${this.props.easing}`,
      inTransition: true,
    });
  }

  openCollapsible() {
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
            className={innerClassString.trim()}
            ref="inner"
          >
        <PrimaryPanels department={this.props.department} stateCd={this.props.stateCd} mountingIsland={this.props.mountingIsland}
        	panelClosed={this.state.isClosed} companyCd={this.props.companyCd}></PrimaryPanels>
          </div>
        </div>
      </div>
    );
  }
};
//});

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
};

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

export default Collapsible;