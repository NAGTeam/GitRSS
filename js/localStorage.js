/*LOCAL STORAGE*/

/*if counter key doesn't exist, create and initialize.*/
function init(){
		
    if (isNaN(parseInt(localStorage.getItem('counter')))) {
        localStorage.setItem('counter', '0');
    }
}

/*save dataJSON, that contains user repo and branch, in the local storage*/
function save(dataJSON){
	console.log('saving '+ dataJSON);
	JString=JSON.stringify(dataJSON);
	count=parseInt(localStorage.getItem('counter'));
	localStorage.setItem('counter',(++count)+"");
	localStorage.setItem(count+"", JString);
	
}

/*get all the datas saved in the memory and show them. section is the space that you have to fill*/ 
function getData(section){
	console.log('getting');
	count=parseInt(localStorage.getItem('counter'));
	for(i=1; i<=count;i++) {
		if(JSON.parse(localStorage.getItem(i+"")) !== null){
			oggetto = JSON.parse(localStorage.getItem(i+""));
			/*if history is selected, prepend only history items*/
			if(section == 'history'){
				if(oggetto['section'] == 'history') 
					$('#list_his').prepend('<li id='+i+' class="found_his"><a href="#"><span class="title">'+oggetto["user"]+'</span> ' +oggetto["repo"]+'</a></li>');
			}
			/*loads only starred elements in the same way of section history*/
			if(section == 'starred'){
				if(oggetto['section'] == 'starred')
				$('#star_list').prepend('<li id='+i+' class="found_star"><a href="#"><span class="title">'+oggetto["user"]+'</span> ' +oggetto["repo"]+'</a></li>');
			}
		}
	}
}

/*starred and history items are stored in the same way and in the same place.*/ 
function clearHistory(){
	count=parseInt(localStorage.getItem('counter'));
	/*get all the objects stored, then delete only history's item*/
	for(i=1; i<=count;i++) {
		if(JSON.parse(localStorage.getItem(i+"")) !== null){
			oggetto = JSON.parse(localStorage.getItem(i+""));
			if(oggetto['section'] == 'history'){
				localStorage.removeItem(i+'');
			}
		}
	}
	/*refresh history page*/
	goToCard(3);
	getData('history');
}