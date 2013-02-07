function H4BPopup(){
	$(document).ready(function(){
		var container = $('#container');
		
		var harvest_subdomain = safari.extension.secureSettings.harvest_subdomain;
		var basecamp_id = safari.extension.secureSettings.basecamp_id;
		
		var initPopup = function(){
			if(harvest_subdomain != '' && basecamp_id != ''){
				container.append('<div class="services"></div>');
				container.find('.services').append('<p><a href="https://'+harvest_subdomain+'.harvestapp.com/time"><img src="images/Harvest.png" alt="Harvest App" /></a></p>');
				container.find('.services').append('<p><a href="https://basecamp.com/'+basecamp_id+'"><img src="images/Basecamp.png" alt="Basecamp App" /></a></p>');
				
			}else{
				container.html('Please fill settings.');
			}
		}
		
		initPopup();
	});
}

H4BPopup();