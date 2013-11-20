var popover_37signals = {

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
			popovers[i].width = 210;
			popovers[i].height = $('body').height()-15;
		}
	},

	popover_services: function(){
		var self = this;

		$('body').append(
			'<ul class="service-list">'+
				'<li class="sname" onclick="popover_37signals.popover_hide()">'+
					'<a href="https://launchpad.37signals.com">' +
						'<div class="left">37signals Launchpad</div>'+
						'<div class="clear"></div>'+
					'</a>'+
				'</li>'
		);

		$.get('https://launchpad.37signals.com', function(data) {
			var accounts = $(data).find('.accounts .account');

			if(accounts.length){
				accounts.each(function(index) {
					$('.service-list').append(
						self.generate_link(
							$(this).find('a:first').attr('href'),
							$(this).find('a:first div.name div:first').text(),
							$(this).parents('.product').attr('id')
						)
					);
				});
			}

			$('body').append('</ul>');

			self.popover_resize();
		}, 'html');
	},

	generate_link: function(url, title, type){
		return '<li onclick="popover_37signals.popover_hide()">'+
					'<a href="https://launchpad.37signals.com'+url+'">'+
						'<div class="left">'+title+'</div>'+
						'<div class="right">'+type+'</div>'+
						'<div class="clear"></div>'+
					'</a>'+
				'</li>';
	},

	build: function()
	{
		this.popover_services();
	},

	reload: function()
	{
		delay = setTimeout(function(){
			popover_37signals.build();
		}, 60000);
	},

	init: function()
	{
		this.build();
	}
};

$(document).ready(function(){
	popover_37signals.init();
});
