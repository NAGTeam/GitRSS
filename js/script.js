$(document).ready(function(){
	console.log('start');
	$(document).on('click','button',function(){
		console.log('click');
		data=getData();
		//$('#reslist').empty();
		request(data);
	});
});


function getData(){
	user=$('input[name=user]').val();
	repo=$('input[name=repo]').val();
	branch=$('input[name=branch]').val();
	
	data={
		user : user,
		repo : repo,
		branch : branch
	};
	
	console.log(data);
	return data;
}
	
	
function request(data){
	request=new XMLHttpRequest({mozSystem:true});
	url= 'http://github.com/'+data.user+'/'+data.repo+'/commits/'+data.branch+'.atom';
	request.open('GET', url);
	request.addEventListener('load', function(){
		if(request.status===200){
			console.log(request.responseText);
				
			response=request.responseText;
			responseDoc=$.parseXML(response);
			$response=$(responseDoc);
			
			titolo= $response.find('entry title');
			console.log(titolo[0].textContent);
			author= $response.find('name');
			console.log(author);
			update=$response.find('entry updated');
				
			for(i=0;i<=titolo.length; i++){
				date=(update[i].textContent).match(/(\d+)\-(\d+)\-(\d+)\w(\d+:\d+):/);
				year=date[1];
				month=date[2];
				day=date[3];
				hour=date[4];
				console.log(date);
				$('#reslist').append('<header>'+day+'-'+month+' '+hour+' by '+author[i].textContent+'</header><p>'+titolo[i].textContent+'</p>');
			}
		}
	});
	request.send();
	$('.input').val('');
}
