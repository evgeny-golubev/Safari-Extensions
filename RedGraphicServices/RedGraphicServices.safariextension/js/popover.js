var rgsdefault = false;

if (typeof safari === 'undefined') {
	rgsdefault = true;
	var safari = {
			extension: {
				popovers: [],
				secureSettings: {
					basecamp_id: 1935861,
					harvest_subdomain: 'redgraphic',
					highrise_subdomain: 'redgraphic'
				}
			}
	};
}

var rgs = {
	options: {
		default: false,
		basecamp: {
			title: 'Basecamp',
			id: null,
			base: null,
			links: [
				{
					title: 'Everything',
					link: '/everything'
				},
				{
					title: 'Me',
					link: '/people/me'
				}
			]
		},
		harvest: {
			title: 'Harvest',
			id: null,
			base: null,
			links: [
				{
					title: 'Timesheet',
					link: '/time'
				}
			]
		},
		highrise: {
			title: 'Highrise',
			id: null,
			base: null,
			links: [
				{
					title: 'Contacts',
					link: '/parties'
				},
				{
					title: 'Tasks',
					link: '/tasks'
				},
				{
					title: 'Cases',
					link: '/kases'
				},
				{
					title: 'Deals',
					link: '/deals'
				}
			]
		}
	},
			
	popover_hide: function()
	{
		var popovers = safari.extension.popovers,
			len = popovers.length;
			
		for (var i = len; i--;)
		{
			popovers[i].hide();
		}
	},
	
	popover_resize: function()
	{
		var popovers = safari.extension.popovers,
			len = popovers.length;
			
		for (var i = len; i--;)
		{
			popovers[i].width = 215; 
			popovers[i].height = $('body').height()-10;
		}
	},
	
	process_service: function(service){
		var self = this;
		var html = '<ul class="service-list service-'+service+'">'+
			'<li class="sname" onclick="rgs.popover_hide()">'+
			'<a href="'+rgs.options[service].base+'">'+
			'<div class="right">'+rgs.options[service].id+'</div>'+
			'<div class="left">'+rgs.options[service].title+'</div>'+
			'<div class="clear"></div>'+
			'</a></li>';
				
		$.each(rgs.options[service].links, function(index, value){
			html += self.generate_link(service, value.link, value.title);
		});	
		
		html += '</ul>';
		
		$('body').append(html);
	},
	
	generate_link: function(service, url, title){
		return '<li onclick="rgs.popover_hide()">'+
			'<a href="'+rgs.options[service].base+url+'">'+title+
			'<div class="clear"></div>'+
			'</a></li>';
	},
	
	build: function()
	{	
		console.log(this.options);
		if(this.options.harvest.id != undefined || this.options.highrise.id != undefined || this.options.basecamp.id != undefined){
			if(this.options.basecamp.id != undefined){
				this.process_service('basecamp');
			}
			if(this.options.harvest.id != undefined){
				this.process_service('harvest');
			}
			if(this.options.highrise.id != undefined){
				this.process_service('highrise');
			}
		}else{
			$('body').html('Please, fill settings.');
			rgs.reload();
		}
								
		this.popover_resize();
	},

	reload: function()
	{
		delay = setTimeout(function(){
			rgs.build();
		}, 6000);
	},
	
	init: function(options)
	{
		$.extend(true, this.options, options);
		this.options.basecamp.base = 'https://basecamp.com/'+this.options.basecamp.id;
		this.options.harvest.base = 'https://'+this.options.harvest.id+'.harvestapp.com';
		this.options.highrise.base = 'https://'+this.options.highrise.id+'.highrisehq.com';
		this.build();
	}
};
	
$(document).ready(function(){
	rgs.init({
		default: rgsdefault,
		basecamp: {
			id: safari.extension.secureSettings.basecamp_id
		},
		harvest: {
			id: safari.extension.secureSettings.harvest_subdomain
		},
		highrise: {
			id: safari.extension.secureSettings.highrise_subdomain
		}
	});
});