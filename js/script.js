
$(document).ready(function(){
	/*initialize the localStorage counter to 0*/
	init();
	
	$(document).on('click','#toAbout',function(){
		goToCard(4);
	});
	
	/*navigation to search section*/
	$(document).on('click','.toSearch',function(){
		goToCard(0);
	});
	
	/*navigation to starred section*/
	$(document).on('click','.toStarred',function(){
		goToCard(2);
		getData('starred');
	});
	
	/*navigation to history section*/
	$(document).on('click','.toHistory',function(){
		goToCard(3);
		getData('history');
	});
	
	/*clear history listener*/
	$(document).on('click','#clear',function(){
		if(confirm('clear History?'))
			clearHistory();
	});
	
	/*search button listener*/
	$(document).on('click','#submit',function(){
		
		/*get inputs values*/
		branch=$('input[name=branch]').val();
		repo=$('input[name=repo]').val();
		user=$('input[name=user]').val();
		
		/*if no branch selected, master branch is gotten*/
		if( branch== '')
			branch='master';
			
		/*if no values inserted->alert, else send a request with that datas*/
		if(user == '' || repo == ''){
			alert('Please insert values');
		}else{
			sendRequest(user,repo,branch);
		}
	});
	
	
	$(document).on('click','#gitfeed',function(){
		sendRequest('nag-motherfuckers','gitRSS','master');
	});
	
	/*history list listener, auto redirect on click*/
	$(document).on('click','.found_his',function(){
		/*id is setted to the counter value of each element*/
		showNumber = parseInt($(this).attr('id'));
		selected = JSON.parse(localStorage.getItem(showNumber+""));
		user=selected['user'];
		repo=selected['repo'];
		branch=selected['branch'];
		sendRequest(selected['user'],selected['repo'],selected['branch']);
	});
	
	/*starred list listener*/
	$(document).on('click','.found_star',function(){
		console.log($(this).attr('id'));
		showNumber = parseInt($(this).attr('id'));
		selected = JSON.parse(localStorage.getItem(showNumber+""));
		user=selected['user'];
		repo=selected['repo'];
		branch=selected['branch'];
		sendRequest(selected['user'],selected['repo'],selected['branch']);
	});
	
	/*put a result in bookmark list (alias Starred)*/
	$(document).on('click','#star_this',function(){
		faveData={
			'user':user,
			'repo':repo,
			'branch':branch,
			'section':'starred'
		};
		alreadySaved=false;
	
		count=parseInt(localStorage.getItem('counter'));
		for(i=1; i<=count;i++) {
			if(JSON.parse(localStorage.getItem(i+"")) !== null){
				oggetto = JSON.parse(localStorage.getItem(i+""));
				console.log(oggetto);
				console.log(faveData);
				if(oggetto['user'] == faveData['user'] && oggetto['repo'] == faveData['repo'] && oggetto['branch'] == faveData['branch'] && oggetto['section'] == faveData['section']){
					alreadySaved=true;
					break;
				}
			}
		}
		if(!alreadySaved){
			save(faveData);
			alert('added to your boormarks');
		}else{
			alert('already in your bookmarks');
		}
	});

	document.querySelector("#foo")
	.onclick = function () {
		console.log("clicked!");
		var link = this.getAttribute("title");
		console.log(link);
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: link
			}
		});
	};

	$(document).on('click','#nicokant',function(){
		console.log("clicked");
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "http://twitter.com/nicokant"
			}
		});
	});

	document.querySelector("#aro94")
	.onclick = function () {
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "http://twitter.com/aro94"
			}
		});
	};

	document.querySelector("#giuscri")
	.onclick = function () {
		new MozActivity({
			name: "view",
			data: {
				type: "url",
				url: "http://twitter.com/giuscri"
			}
		});
	};
});

/*send the xmlHTTPRequest*/
function sendRequest(user,repo,branch){
	request=new XMLHttpRequest({mozSystem:true});

	/*clear the contents of #repo*/
	$('#repo').empty();
	$('#repo').append('<h1>'+repo+'</h1>');
	
	/*paste the URL to get*/
	url= 'http://github.com/'+user+'/'+repo+'/commits/'+branch+'.atom';
	request.open('GET', url, true);
	
	/*set the timeout to detect connection issues*/
	request.timeout = 5750;
	request.addEventListener('timeout', function() {
		alert('No connection..');
	});
	
	/*send the request*/
	request.send();
	
	/*when request change status*/
	request.onreadystatechange=function(){
		/*if it's ready but hasn't find any page*/
		if(request.status == 404 && request.readyState == 4){
			alert('No data found');
			$('input[name=branch]').val("");
			$('input[name=repo]').val("");
			$('input[name=user]').val("");
			return;
		}
		
		/*if it's ready and has found the URL*/
		if(request.status===200 && request.readyState==4){
		
			/*xml parsing the answer*/
			response=request.responseText;
			responseDoc=$.parseXML(response);
			$response=$(responseDoc);
		
			/*scraping the answer to find useful infos, then clear current list*/
			titolo= $response.find('entry title');
			author= $response.find('name');
			update=$response.find('entry updated');
			$('#reslist').empty();
			
			/*iterate all the values*/
			for(i=0;i<=titolo.length; i++){
				if(update[i] != undefined){
					/*date matched with regex to modify their position*/
					date=(update[i].textContent).match(/(\d+)\-(\d+)\-(\d+)\w(\d+:\d+):/);
					year=date[1];
					month=date[2];
					day=date[3];
					hour=date[4];
					linkst=$response.find('entry link')[i].getAttribute("href");
					
					/*show results*/
					$('#reslist').append('<header class="listheaderBlue borderBlue">'+day+'-'+month+' '+hour+' by '+author[i].textContent+'</header><a href="#" id="foo" title="'+linkst+'"><p class="commit">'+titolo[i].textContent+'</p></a>');
				}else{
					break;
				}
			}
			goToCard(1);
			
			/*add this datas to storage*/
			searchData={
				'user':user,
				'repo':repo,
				'branch':branch,
				'section':'history'
			};
			save(searchData);
		}
	};
}

/*deal the cards' transitions*/
function goToCard(cardNum){
	document.querySelector('x-deck').showCard(cardNum);
	
	/*reset inputs and clear lists*/
	$('input[name=branch]').val("");
	$('input[name=repo]').val("");
	$('input[name=user]').val("");
	$('#list_his').empty();
	$('#star_list').empty();	
	
}