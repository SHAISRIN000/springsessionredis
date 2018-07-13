import React from 'react';
import ReactDOM from 'react-dom';
import Accordion from './Accordion';
var createReactClass = require('create-react-class');

var App = 	createReactClass({
	
	getInitialState: function() {
		let dept = $('#selectedDept').val();
		var userData = [{
			"stateCd": "CT",
			"stateDesc": "Connecticut",
			"department": dept,
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
			"department": dept,
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
			"department": dept,
			"options": [{
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "MW",
				"mountingNode": "NHIA"
			}]
		}, {
			"stateCd": "NJ",
			"stateDesc": "New Jersey",
			"department": dept,
			"options": [{
				"channelCd": "Captive",
				"panelDesc": "Captive",
				"panelId": "HP",
				"companyCd": "HP",
				"mountingNode": "NJHP"

			}, {
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "IA",
				"mountingNode": "NJIA"
			}]
		}, 
		 {
			"stateCd": "NY",
			"stateDesc": "New York",
			"department": dept,
			"options": [{
				"channelCd": "Captive",
				"panelDesc": "Captive",
				"panelId": "HP",
				"companyCd": "HP",
				"mountingNode": "NYHP"

			}, {
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "IA",
				"mountingNode": "NYIA"
			}]
		},
		{
			"stateCd": "PA",
			"stateDesc": "Pennsylvania",
			"department": dept,
			"options": [{
				"channelCd": "Captive",
				"panelDesc": "Captive",
				"panelId": "HP",
				"companyCd": "HP",
				"mountingNode": "PAHP"
			}, {
				"channelCd": "Teachers",
				"panelDesc": "Independent Agent",
				"panelId": "IA",
				"companyCd": "IA",
				"mountingNode": "PAIA"
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
				"companyCd":userData[i]['options'].length >1?userData[i]['options'][1]['companyCd']:userData[i]['options'][0]['companyCd'],
				"mountingNode":userData[i]['stateCd']+'IA'
			}]
			userAccess.push(tempUserData);
		}else if($('#'+userData[i]['stateCd']+'IAAccessId').val() != 'Yes'  && $('#'+userData[i]['stateCd']+'HPAccessId').val() == 'Yes'){
				tempUserData["options"] = [{
					"channelCd":"Captive",
					"panelDesc":"Captive",
					"panelId" : "HP",
					"companyCd": userData[i]['options'][0]['companyCd'],
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
           }

          $('#landingBreadCrumbs').removeClass('hidden');
          $('#mainLinkRef').html(department).removeClass('hidden');     
          
          return(<div key={stateCd} data-trigger={stateDesc} ref="bingo" data-state-cd={stateCd} data-company-cd={dataCompanyCd} data-department={department} data-mounting-island={dataMountingIsland}>
            </div>)
          
},
  
componentDidUpdate: function(prevProps, prevState) {
   
    
},
    
render: function() {
    var abc = this.buildSections(this.getInitialState().useData);
    return(
        <Accordion>{abc}</Accordion>
    );
  }
});

ReactDOM.render(
  <App/>,
  document.getElementById('App')
);


