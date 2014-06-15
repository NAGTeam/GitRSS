//LOCAL STORAGE 

//if counter key doesn't exist, create and initialize.
function init(){
		
    if (isNaN(parseInt(localStorage.getItem('counter')))) {
        localStorage.setItem('counter', '0');
    }
	count=parseInt(localStorage.getItem('counter'));
	console.log(count);
		for(i=1; i<=count;i++) {
			if(JSON.parse(localStorage.getItem(i+"")) !== null){
				oggetto = JSON.parse(localStorage.getItem(i+""));
			}
		}
}

function save(dataJSON){
	console.log('saving '+ dataJSON);
	JString=JSON.stringify(dataJSON);
	count=parseInt(localStorage.getItem('counter'));
	localStorage.setItem('counter',(++count)+"");
	localStorage.setItem(count+"", JString);
	
}

function getData(section){
	console.log('getting');
	count=parseInt(localStorage.getItem('counter'));
	for(i=1; i<=count;i++) {
		if(JSON.parse(localStorage.getItem(i+"")) !== null){
			oggetto = JSON.parse(localStorage.getItem(i+""));
			if(section == 'history'){
				if(oggetto['section'] == 'history') 
					$('#list_his').prepend('<li id='+i+' class="found_his"><a href="#"><span>'+oggetto["user"]+'</span> ' +oggetto["repo"]+'</a></li>');
			}
			if(section == 'starred'){
				if(oggetto['section'] == 'starred')
				$('#star_list').prepend('<li id='+i+' class="found_star"><a href="#"><span>'+oggetto["user"]+'</span> ' +oggetto["repo"]+'</a></li>');
			}
		}
	}
}
