var is_debug = false;

if (typeof safari === 'undefined') {
	is_debug = true;
	var safari = {
			extension: {
				popovers: [],
				settings: {
					delay: 15,
					basecamp_id: 1935861,
					/*basecamp_login: '',
					basecamp_password: '',*/
					harvest_subdomain: 'redgraphic',
					highrise_subdomain: 'redgraphic'
				}
			}
	};
}

var rgs = {
	options: {
		defaults: {
			debug: false,
			delay: 15
		},
		basecamp: {
			title: 'Basecamp',
			id: null,
			base: null,
			/*api: {
				path: '/api/v1',
				login: null,
				password: null
			},*/
			links: [
				/*{
					title: 'Projects',
					link: '/',
					api: {
						id: 'projects',
						path: '/projects.json',
						callback: function(data){
							console.log(data);
						}
					}
				},*/
				{
					title: 'Everything',
					link: '/everything',
				},
				{
					title: 'Me',
					link: '/people/me',
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
					link: '/time',
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
					link: '/parties',
				},
				{
					title: 'Tasks',
					link: '/tasks',
				},
				{
					title: 'Cases',
					link: '/kases',
				},
				{
					title: 'Deals',
					link: '/deals',
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
			'<a href="https://'+rgs.options[service].base+'">'+
			'<div class="right">'+rgs.options[service].id+'</div>'+
			'<div class="left">'+rgs.options[service].title+'</div>'+
			'<div class="clear"></div>'+
			'</a></li>';
				
		$.each(rgs.options[service].links, function(index, value){
			/*if(value.api != undefined && rgs.options[service].api.login != null){
				html += self.generate_link_api(service, value.link, value.title, value.api);	
			}else{*/
				html += self.generate_link(service, value.link, value.title);	
			/*}*/
		});	
		
		html += '</ul>';
		
		$('body').append(html);
	},
	
	generate_link_api: function(service, url, title, api){
		$.ajax({
		    type: "GET",
		    url: 'https://'+rgs.options[service].base + rgs.options[service].api.path + api.path,
		    username: rgs.options[service].api.login,
		    password: rgs.options[service].api.password,
		    dataType: 'json',
		    async: false,
		    headers: {
		    	'User-Agent': 'RedGraphicServices (https://github.com/m0nah/Safari-Extensions/tree/master/RedGraphicServices)'
		    },
		    success: function(json) {
		       console.dir(json);
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		})
		return '<li onclick="rgs.popover_hide()" class="service-'+service+'-'+api.id+'">'+
			'<a href="https://'+rgs.options[service].base+url+'">'+title+
			'<div class="clear"></div>'+
			'</a></li>';
	},
	
	generate_link: function(service, url, title){
		return '<li onclick="rgs.popover_hide()">'+
			'<a href="https://'+rgs.options[service].base+url+'">'+title+
			'<div class="clear"></div>'+
			'</a></li>';
	},
	
	build: function()
	{	
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
		}, this.options.defaults.delay * 60000);
	},
	
	init: function(options)
	{
		$.extend(true, this.options, options);
		this.options.basecamp.base = 'basecamp.com/'+this.options.basecamp.id;
		this.options.harvest.base = this.options.harvest.id+'.harvestapp.com';
		this.options.highrise.base = this.options.highrise.id+'.highrisehq.com';
		this.build();
	}
};
	
$(document).ready(function(){
	rgs.init({
		defaults: {
			debug: is_debug,
			delay: safari.extension.settings.delay
		},
		basecamp: {
			id: safari.extension.settings.basecamp_id,
			/*api: {
				login: safari.extension.settings.basecamp_login,
				password: safari.extension.settings.basecamp_password
			}*/
		},
		harvest: {
			id: safari.extension.settings.harvest_subdomain
		},
		highrise: {
			id: safari.extension.settings.highrise_subdomain
		}
	});
});