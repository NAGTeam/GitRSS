
$(document).ready(function(){
	console.log('start');
	init();
	
	$(document).on('click','.toSearch',function(){
		goToCard(0);
	});
	
	$(document).on('click','.toStarred',function(){
		goToCard(2);
		getData('starred');
	});
	
	$(document).on('click','.toHistory',function(){
		goToCard(3);
		getData('history');
	});

	$(document).on('click','#submit',function(){
		console.log('click');
		//$('#reslist').empty();
		branch=$('input[name=branch]').val();
		repo=$('input[name=repo]').val();
		user=$('input[name=user]').val();
		sendRequest(user,repo,branch);
	});
	
	$(document).on('click','.found_his',function(){
		console.log($(this).attr('id'));
		showNumber = parseInt($(this).attr('id'));
		selected = JSON.parse(localStorage.getItem(showNumber+""));
		user=selected['user'];
		repo=selected['repo'];
		branch=selected['branch'];
		sendRequest(selected['user'],selected['repo'],selected['branch']);
	});
	
	$(document).on('click','.found_star',function(){
		console.log($(this).attr('id'));
		showNumber = parseInt($(this).attr('id'));
		selected = JSON.parse(localStorage.getItem(showNumber+""));
		user=selected['user'];
		repo=selected['repo'];
		branch=selected['branch'];
		sendRequest(selected['user'],selected['repo'],selected['branch']);
	});
	
	$(document).on('click','#star_this',function(){
		faveData={
			'user':user,
			'repo':repo,
			'branch':branch,
			'section':'starred'
		};
		save(faveData);
		alert('aggiunto ai preferiti');
	});
});
	
function sendRequest(user,repo,branch){
	request=new XMLHttpRequest({mozSystem:true});
	console.log(repo);
	$('#repo').empty();
	$('#repo').append('<h1>'+repo+'</h1>');
	url= 'http://github.com/'+user+'/'+repo+'/commits/'+branch+'.atom';
	request.open('GET', url);
	request.send();
	request.onreadystatechange=function(){
		if(request.status===200 && request.readyState==4){
			console.log(request.responseText);
				
			response=request.responseText;
			responseDoc=$.parseXML(response);
			$response=$(responseDoc);
			
			titolo= $response.find('entry title');
			console.log(titolo[0].textContent);
			author= $response.find('name');
			console.log(author);
			update=$response.find('entry updated');
			$('#reslist').empty();
			
				
			for(i=0;i<=titolo.length; i++){
				if(update[i] != undefined){
					date=(update[i].textContent).match(/(\d+)\-(\d+)\-(\d+)\w(\d+:\d+):/);
					year=date[1];
					month=date[2];
					day=date[3];
					hour=date[4];
					console.log(date);
					$('#reslist').append('<header>'+day+'-'+month+' '+hour+' by '+author[i].textContent+'</header><p>'+titolo[i].textContent+'</p>');
				}else{
					break;
				}
			}
			goToCard(1);
		}
	};
	
	searchData={
		'user':user,
		'repo':repo,
		'branch':branch,
		'section':'history'
	};
	save(searchData);
}

function goToCard(cardNum){
	document.querySelector('x-deck').showCard(cardNum);
	$('input[name=branch]').val("");
	$('input[name=repo]').val("");
	$('input[name=user]').val("");
	$('#list_his').empty();
	$('#star_list').empty();	
	
}

