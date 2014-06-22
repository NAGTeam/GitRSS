alarmEvent = new Event('alarmTrigger');

function createAlarm(){
	now=new Date();
	console.log(now.getHours());
	//now.setHours(now.getHours()+1);
	now.setMinutes(now.getMinutes()+1);
	console.log(now.getHours());
	
	data='done';
	
	request=navigator.mozAlarms.add(now,'honorTimezone',data);
	request.onsuccess=function(){
		console.log('create');
	}
	
	alarmRequest= navigator.mozAlarms.getAll();
	alarmRequest.onsuccess = function(){
		newAlarmId = this.result[(this.result.length)-1].id;
		console.log('create alarm '+newAlarmId);
	}
}

navigator.mozSetMessageHandler("alarm", function (alarm){
    manageNotification(alarm);
});

function manageNotification(alarm){
    $(document).trigger('alarmTrigger');
    
    count=parseInt(localStorage.getItem('counter'));
	for(i=1; i<=count;i++) {
		if(JSON.parse(localStorage.getItem(i+"")) !== null){
			oggetto = JSON.parse(localStorage.getItem(i+""));
			if(oggetto['section'] == 'starred'){
               checkUpdate(oggetto);
            }
		}        
      }
}

function checkUpdate(oggetto){
    request=new XMLHttpRequest({mozSystem:true});
    url= 'http://github.com/'+oggetto["user"]+'/'+oggetto["repo"]+'/commits/'+oggetto["branch"]+'.atom';
	request.open('GET', url, true);
	
	/*set the timeout to detect connection issues*/
	request.timeout = 5750;
	request.addEventListener('timeout', function() {
		return;
	});
	
	/*send the request*/
	request.send();
    
    /*when request change status*/
	request.onreadystatechange=function(){
        if(request.status===200 && request.readyState==4){  
            /*xml parsing the answer*/
            response=request.responseText;
            responseDoc=$.parseXML(response);
            $response=$(responseDoc);
            
            update=$response.find('entry updated');
            latestUpdate= new Date(update[0].textContent);
            if(latestUpdate>oggetto['latestUpdate']){
                   console.log('here');
                   new Notification('new notif');
                   updateNotified(alarm.data);
            }
        }
    };
}

//detect this