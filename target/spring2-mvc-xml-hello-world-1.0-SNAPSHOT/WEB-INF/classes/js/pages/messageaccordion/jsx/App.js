import React from 'react';
import ReactDOM from 'react-dom';
import Accordion from './Accordion';
var createReactClass = require('create-react-class');

var App = 	createReactClass({
	getInitialState: function() {
		var userData = [{
			"stateCd": "CT",
			"stateDesc": "Connecticut",
			"department": "Product Lines",
			"options": [{
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "PR-PRPG-BK-PG",
				"mountingNode": "CTIA"
			}]
		}, {
			"stateCd": "MA",
			"stateDesc": "Massachusetts",
			"department": "Product Lines",
			"options": [{
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "PR-PRPG-BK-PG",
				"mountingNode": "MAIA"
			}]
		}, {
			"stateCd": "NH",
			"stateDesc": "New Hampshire",
			"department": "Product Lines",
			"options": [{
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "PR-PRPG-BK-PG",
				"mountingNode": "NHIA"
			}]
		}, {
			"stateCd": "NJ",
			"stateDesc": "New Jersey",
			"department": "Product Lines",
			"options": [{
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "IA",
				"mountingNode": "NJIA"
			}, {
				"channelCd": "Captive",
				"panelDesc": "Captive",
				"panelId": "HP",
				"companyCd": "HP",
				"mountingNode": "NJHP"

			}]
		},
		 {
			"stateCd": "NY",
			"stateDesc": "New York",
			"department": "Product Lines",
			"options": [{
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "IA",
				"mountingNode": "NYIA"
			}, {
				"channelCd": "Captive",
				"panelDesc": "Captive",
				"panelId": "HP",
				"companyCd": "HP",
				"mountingNode": "NYHP"

			}]
		},
		{
			"stateCd": "PA",
			"stateDesc": "Pennsylvania",
			"department": "Product Lines",
			"options": [{
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "IA",
				"mountingNode": "PAIA"
			}, {
				"channelCd": "Captive",
				"panelDesc": "Captive",
				"panelId": "HP",
				"companyCd": "HP",
				"mountingNode": "PAHP"
			}]
		 
		}];

		var userAccess = [];
		/*jQuery(document).ready(function() {	
		 
		   $('#mcSubHeading').html("Contents");
		   var businessLine = $('#selectedDept').val();
		   var userStates = $('#statesFromSession').val();
		   var userChanel = $('#channelsFromSession').val();
		   
		});*/

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
		};		
		
        return { useData: userAccess };
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
		  
		  $('#landingBreadCrumbs').removeClass('hidden');
		  $('#mainLinkRef').html('View Messages').removeClass('hidden');     
		  
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
		  
		 
},
  
componentDidUpdate: function(prevProps, prevState) { },
    
render: function() {
    var abc = this.buildSections(this.getInitialState().useData);
    return(
        <Accordion>{abc}</Accordion>
    );
  }
});

//Message Accordion
ReactDOM.render(
  <App/>,
  document.getElementById('messageApp')
);
