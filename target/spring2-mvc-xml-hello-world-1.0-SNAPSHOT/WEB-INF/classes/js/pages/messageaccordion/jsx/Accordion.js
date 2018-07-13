import React from 'react';
import PropTypes from 'prop-types';
import Collapsible from './Collapsible';

var createReactClass = require('create-react-class');


//Accordion component start
var Accordion = createReactClass({
  //Set validation for prop types
  propTypes: {
    transitionTime: PropTypes.number,
    easing: PropTypes.string,
    startPosition: PropTypes.number,
    classParentString: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape({
      props: PropTypes.shape({
        'data-trigger': PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element
        ]).isRequired,
        'data-triggerWhenOpen': PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element
        ]),        
//        'data-triggerDisabled': React.PropTypes.bool,
      })
    }))
  },

  getInitialState: function() {

    //Allow the start position to be set by props
    var openPosition = this.props.startPosition | -1;

    return {
      openPosition: openPosition
    }
  },

  handleTriggerClick: function(position) {
   this.setState({
      openPosition: position
    });    
  },

  render: function() {
      var nodes = this.props.children.map((node, index) => {
      var triggerWhenOpen = (node.props['data-trigger-when-open']) ? node.props['data-trigger-when-open'] : node.props['data-trigger'];
     // var triggerDisabled = (node.props['data-trigger-disabled']) || false;
      var stateCd = (node.props['data-state-cd']);
      var companyCd = (node.props['data-company-cd']);
      var mountingIsland = (node.props['data-mounting-island']);
      var department = (node.props['data-department']);
        
      return (<Collapsible
                key={"Collapsible"+index}
                handleTriggerClick={this.handleTriggerClick}
                open={(this.state.openPosition === index)}
                trigger={node.props['data-trigger']}
                triggerWhenOpen={triggerWhenOpen}
               // triggerDisabled={triggerDisabled}
                transitionTime={this.props.transitionTime}
                easing={this.props.easing}
                classParentString={this.props.classParentString}
                accordionPosition={index} 
                stateCd={node.props['data-state-cd']} 
                companyCd = {node.props['data-company-cd']}
                mountingIsland = {node.props['data-mounting-island']}
                department = {node.props['data-department']}
      			channelCount = {node.props['data-channel-count']}>{node}</Collapsible>);
    });
     return (<div>{nodes}</div>)
  	}
});


export default Accordion;