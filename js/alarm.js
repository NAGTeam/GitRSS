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
    new Notification(alarm.data);
    $(document).trigger('alarmTrigger');
    updateNotified(alarm.data);
});
