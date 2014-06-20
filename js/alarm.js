function createAlarm(){
	now=new Date();
	console.log(now.getHours());
	now.setHours(now.getHours()+1);
	console.log(now.getHours());
	
	data='done';
	
	request=navigator.mozAlarms.add(now,'ignoreTimezone',data);
	request.onsuccess=function(){
		console.log('create');
	}
	
	alarmRequest= navigator.mozAlarms.getAll();
	alarmRequest.onsuccess = function(){
		newAlarmId = this.result[(this.result.length)-1].id;
		console.log('create alarm '+newAlarmId);
	}
	
	
}

