window.url=function(){function a(a){return!isNaN(parseFloat(a))&&isFinite(a)}return function(b,c){var d=c||window.location.toString();if(!b)return d;b=b.toString(),"//"===d.substring(0,2)?d="http:"+d:1===d.split("://").length&&(d="http://"+d),c=d.split("/");var e={auth:""},f=c[2].split("@");1===f.length?f=f[0].split(":"):(e.auth=f[0],f=f[1].split(":")),e.protocol=c[0],e.hostname=f[0],e.port=f[1]||"80",e.pathname="/"+c.slice(3,c.length).join("/").split("?")[0].split("#")[0];var g=e.pathname;1===g.split(".").length&&"/"!==g[g.length-1]&&(g+="/");var h=e.hostname,i=h.split("."),j=g.split("/");if("hostname"===b)return h;if("domain"===b)return i.slice(-2).join(".");if("sub"===b)return i.slice(0,i.length-2).join(".");if("port"===b)return e.port||"80";if("protocol"===b)return e.protocol.split(":")[0];if("auth"===b)return e.auth;if("user"===b)return e.auth.split(":")[0];if("pass"===b)return e.auth.split(":")[1]||"";if("path"===b)return g;if("."===b.charAt(0)){if(b=b.substring(1),a(b))return b=parseInt(b,10),i[0>b?i.length+b:b-1]||""}else{if(a(b))return b=parseInt(b,10),j[0>b?j.length+b:b]||"";if("file"===b)return j.slice(-1)[0];if("filename"===b)return j.slice(-1)[0].split(".")[0];if("fileext"===b)return j.slice(-1)[0].split(".")[1]||"";if("?"===b.charAt(0)||"#"===b.charAt(0)){var k=d,l=null;if("?"===b.charAt(0)?k=(k.split("?")[1]||"").split("#")[0]:"#"===b.charAt(0)&&(k=k.split("#")[1]||""),!b.charAt(1))return k;b=b.substring(1),k=k.split("&");for(var m=0,n=k.length;n>m;m++)if(l=k[m].split("="),l[0]===b)return l[1];return null}}return""}}(),jQuery&&jQuery.extend({url:function(a,b){return window.url(a,b)}});

function BasecampFixes() {
	$(document).ready(function(){
		var addDownloadAllButtons = function() {
			$('ul.attachments').each(function() {
				if (!$(this).next().hasClass('download-all-files')) {
					$(this).after('<p class="download-all-files"><a class="decorated" href="#">Download all of these files at once</a> &darr;</p>');
				}
			});

			$('div.image_grid_view').each(function() {
				if (!$(this).next().hasClass('download-all-images')) {
					$(this).after('<p class="download-all-images"><a class="decorated" href="#">Download all of these images at once</a> &darr;</p>');
				}
			});

			$('p.download-all-files a').click(function(){
				var downloads = [];

				$(this).parent().prev('ul.attachments').find('li > a').each(function() {
					var path = url('path', $(this).attr('href'));
					path = path.split('/');
					path.pop();
					path = path.join('/')+'/download';
					downloads.push(path);
				});

				downloadIFrame(downloads);

				return false;
			});
			$('p.download-all-images a').click(function(){
				var downloads = [];

				$(this).parent().prev('.image_grid_view').find('tr.images .thumbnail>a').each(function() {
					var path = $(this).attr('href')+'/download';
					downloads.push(path);
				});

				downloadIFrame(downloads);

				return false;
			});
		};

		var downloadIFrame = function(downloads) {
			for(var i=0; i<downloads.length; i++) {
				var iframe = $('<iframe style="visibility: collapse;"></iframe>');
				$('body').append(iframe);
				var content = iframe[0].contentDocument;
				var form = '<form action="' + downloads[i] + '" method="GET"></form>';
				content.write(form);
				$('form', content).submit();
			}
		}

		setInterval(function() {
			var href, pattern;
			pattern = /^https:\/\/basecamp.com\/.*$/;
			href = window.location.href;
			if (href.match(pattern) !== null) {
				addDownloadAllButtons();
			}
		}, 250);
	});
}

BasecampFixes();
