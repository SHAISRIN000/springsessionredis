var userAccess = []
jQuery(document).ready(function() {	
	$('#mcSubHeading').html("Messages");
	var businessLine = $('#selectedDept').val();
	var userStates = $('#statesFromSession').val();
	var userChanel = $('#channelsFromSession').val();
   
});


//Checking Access and builds the objects 
	for(var i = 0; i < userData.length; i++){
		var tempUserData = []
		
		tempUserData["stateCd"]=userData[i]["stateCd"]
			tempUserData["stateDesc"] = userData[i]["stateDesc"]
				tempUserData["department"]= userData[i]["department"]
		    
		    
	if($('#'+userData[i]['stateCd']+'IAAccessId').val() == 'Yes'  && $('#'+userData[i]['stateCd']+'HPAccessId').val() != 'Yes'){
		tempUserData["options"] = [{
	        "channelCd":"Teachers",
	        "panelDesc":"Independent Agent",
	        "panelId" : "IA",
	        "companyCd":userData[i]['options'][0]['companyCd'],
	        "mountingNode":userData[i]['stateCd']+'IA'
	    }]
		userAccess.push(tempUserData);
	}else if($('#'+userData[i]['stateCd']+'IAAccessId').val() != 'Yes'  && $('#'+userData[i]['stateCd']+'HPAccessId').val() == 'Yes'){
			tempUserData["options"] = [{
				 "channelCd":"Captive",
			      "panelDesc":"Captive",
			      "panelId" : "HP",
			      "companyCd":userData[i]['options'].length >1?userData[i]['options'][1]['companyCd']:userData[i]['options'][0]['companyCd'],
		        "mountingNode":userData[i]['stateCd']+'HP'
		    }]
			userAccess.push(tempUserData);
		}else if($('#'+userData[i]['stateCd']+'IAAccessId').val() == 'Yes'  && $('#'+userData[i]['stateCd']+'HPAccessId').val() == 'Yes'){
			tempUserData["options"] = userData[i]["options"] 
			userAccess.push(tempUserData);
		}
	}
//	console.log(userAccess)

var App = React.createClass({
	getInitialState: function() {
        return { useData: this.props.data };
    },
    
    buildSections :function (userData){
        var sections = userData.map(this.buildSection);
        return sections;
       
    },
  
    buildSection:  function (userAccess, index){
		  var stateCd = userAccess.stateCd;
		  var stateDesc = userAccess.stateDesc;
		  var department = userAccess.department;
		  var dataMountingIsland ='';
		  var dataCompanyCd = '';
		  
		  var channelsAccordion = [];
		  
		  //When a single channel is selected nested accordion is not required
		  if(userAccess.options.length > 1){
			  let chanelCnt = 2
			  for(var j=0;j<userAccess.options.length;j++){
			       var mountingBode = userAccess.options[j].mountingNode;
			       var companyCd = userAccess.options[j].companyCd;
			       if(dataMountingIsland.length>0){
			        dataMountingIsland = dataMountingIsland+"-"+userAccess.options[j].mountingNode;
			   }else{
			       dataMountingIsland = mountingBode;
			   }
			   if(dataCompanyCd.length>0){
			    dataCompanyCd = dataCompanyCd+"-"+userAccess.options[j].companyCd;
			   }else{
			       dataCompanyCd = companyCd;
			   }
			  
			   if(mountingBode.indexOf("IA") !=-1){
			   let idVal = stateCd+"IAMessageTable"
			   channelsAccordion.push(<div key={mountingBode} data-trigger='Independent Agent' data-channel-count={chanelCnt} data-state-cd={stateCd} data-company-cd={dataCompanyCd} data-department={department} data-mounting-island={idVal}>
			   <div className="stateMessageSubBody"><table id={idVal} className="display"><thead><tr><th></th><th></th></tr></thead><tbody></tbody></table></div>
				   </div>)
			   }
			   if(mountingBode.indexOf("HP") !=-1){
			   let idVal = stateCd+"HPMessageTable"
			   channelsAccordion.push(<div key={mountingBode} data-trigger='Captive' data-channel-count={chanelCnt} data-state-cd={stateCd} data-company-cd={dataCompanyCd} data-department={department} data-mounting-island={idVal}>
			   <div className="stateMessageSubBody"><table id={idVal} className="display"><thead><tr><th></th><th></th></tr></thead><tbody></tbody></table></div>
			    	   </div>)
			       }
			
			   }
			  return(<div key={stateCd} data-trigger={stateDesc} ref="bingo" data-state-cd={stateCd} data-company-cd={dataCompanyCd} data-department={department} data-mounting-island={dataMountingIsland}>
			  <Accordion>{channelsAccordion}</Accordion>  
			  </div>)
		  }
		  else{
			  let chanelCnt = 1
			  for(var j=0;j<userAccess.options.length;j++){
			       var mountingBode = userAccess.options[j].mountingNode;
			       var companyCd = userAccess.options[j].companyCd;
			       if(dataMountingIsland.length>0){
			        dataMountingIsland = dataMountingIsland+"-"+userAccess.options[j].mountingNode;
			   }else{
			       dataMountingIsland = mountingBode;
			   }
			   if(dataCompanyCd.length>0){
			    dataCompanyCd = dataCompanyCd+"-"+userAccess.options[j].companyCd;
			   }else{
			       dataCompanyCd = companyCd;
			   }
			  
			   var idVal = stateCd
			   if(mountingBode.indexOf("IA") !=-1){
			   idVal = idVal+"IAMessageTable"
			  
			   channelsAccordion.push(<div key={mountingBode} data-state-cd={stateCd} data-company-cd={dataCompanyCd} data-department={department} data-mounting-island={idVal}>
			   <div className="stateMessageSubBody"><table id={idVal} className="display"><thead><tr><th></th><th></th></tr></thead><tbody></tbody></table></div>
				   </div>)
			   }
			   if(mountingBode.indexOf("HP") !=-1){
				idVal = idVal+"HPMessageTable"
			   channelsAccordion.push(<div key={mountingBode} data-state-cd={stateCd} data-company-cd={dataCompanyCd} data-department={department} data-mounting-island={idVal}>
			   <div className="stateMessageSubBody"><table id={idVal} className="display"><thead><tr><th></th><th></th></tr></thead><tbody></tbody></table></div>
			    	   </div>)
			       }
			
			   }
			  return(<div key={stateCd} data-trigger={stateDesc} data-channel-count={chanelCnt} ref="bingo" data-state-cd={stateCd} data-company-cd={dataCompanyCd} data-department={department} data-mounting-island={idVal}>
			  	{channelsAccordion}  
			  </div>)
		  }
		  
		  $('#landingBreadCrumbs').removeClass('hidden');
		  $('#mainLinkRef').html('View Messages').removeClass('hidden');     
},
  
componentDidUpdate: function(prevProps, prevState) { },
    
render: function() {
    var abc = this.buildSections(this.getInitialState().useData);
    return(
        <Accordion>{abc}</Accordion>
    );
  }
});


//Collapsible component start
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
    	  if(this.props.trigger === 'Independent Agent' || this.props.trigger === 'Captive' || (1 == this.props.channelCount &&(this.props.trigger === 'Connecticut' || this.props.trigger === 'New Jersey'
        	  || this.props.trigger === 'Pennsylvania' || this.props.trigger === 'Massachussets' || this.props.trigger === 'New Hampshire'))){ 
//    		  console.log(' State = ' + this.props.stateCd+' mountingIsland = '+this.props.mountingIsland +'company code = '+this.props.companyCd)
//    		  console.log(` channel count = `+this.props.channelCount)
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
    		    			"aaSorting": []               
    		    		});		        	
    		    		//bind on click 
    			$(".messageLink").on("click",function (){	
    			//$(".messageLink").live("click",function (){
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
      	
    	  this.openCollapsible();
      } else {
        this.closeCollapsible();
      }
    }
  }

  closeCollapsible() {
      this.setState({
      shouldSwitchAutoOnNextCycle: true,
      height: this.refs.inner.offsetHeight,
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
    if (this.props.handleTriggerClick) {
      this.props.handleTriggerClick(this.props.accordionPosition);
    } else {
      if (this.state.isClosed === true) {
        this.openCollapsible();
        this.props.onOpening();
      } else {
        this.closeCollapsible();
        this.props.onClosing();
      }
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

//Accordion component start
var Accordion = React.createClass({
  //Set validation for prop types
  propTypes: {
    transitionTime: React.PropTypes.number,
    easing: React.PropTypes.string,
    startPosition: React.PropTypes.number,
    classParentString: React.PropTypes.string,
    children: React.PropTypes.arrayOf(React.PropTypes.shape({
      props: React.PropTypes.shape({
        'data-trigger': React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.element
        ]).isRequired,
        'data-triggerWhenOpen': React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.element
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



//Message Accordion
ReactDOM.render(
  <App data={userAccess}/>,
  document.getElementById('messageApp')
);

