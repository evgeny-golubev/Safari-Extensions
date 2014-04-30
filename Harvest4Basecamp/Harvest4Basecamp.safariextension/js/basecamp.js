
function H4BMain(){

	$(document).ready(function(){
        var projectNameSelector = 'title:first';

        var itemSelector = '.todo .content';
        var timersSelector = '.harvest-timer:not(.styled)';

        var isConfigLoaded = false;

        var config = "window._harvestPlatformConfig = {'applicationName': 'Basecamp', 'permalink': 'https://basecamp.com/%ACCOUNT_ID%/projects/%PROJECT_ID%/todos/%ITEM_ID%', 'skipJquery': true}";

        var namespacedString = function(name) {
            return "harvest-" + name;
        };

        var nsId = function(name) {
            return "#" + (namespacedString(name));
        };

        var nsEvent = function(name) {
            return "" + (namespacedString('event')) + ":" + name;
        };

        var insertScript = function(callback) {
            var entry, script;
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.innerHTML = config;
            entry = document.getElementsByTagName('script')[0];
            entry.parentNode.insertBefore(script, entry);
            if (script.addEventListener) {
                script.addEventListener('load', callback, false);
            } else {
                script.attachEvent('onreadystatechange', function() {
                    if (/complete|loaded/.test(script.readyState)) {
                        return callback();
                    }
                });
            }
            return isConfigLoaded = true;
        };

        var loadConfig = function() {
            var url = "//platform.harvestapp.com/assets/platform.js";
            var callback = $.getScript(url);
            return insertScript(callback);
        };

        var findAccountId = function(item) {
            var href, link, pattern;
            pattern = /^\/(\d+)\/projects\/\S+\/todos\/\d+\S+$/;
            link = $(item).find('a');
            href = link.attr("href");
            if (href) {
                return href.match(pattern)[1];
            }
        };

        var findProjectId = function(item) {
            var href, link, pattern;
            pattern = /^\/\d+\/projects\/(\d+)\S+\/todos\/\d+\S+$/;
            item = $(item);
            link = item.find('a');
            href = link.attr('href');
            if (href) {
                return href.match(pattern)[1];
            }
        };

        var findItemId = function(item) {
            var href, link, pattern;
            pattern = /^\/\d+\/projects\/\d+\S+\/todos\/(\d+)\S+$/;
            item = $(item);
            link = item.find('a');
            href = link.attr('href');
            if (href) {
                return href.match(pattern)[1];
            }
        };

        var findProjectName = function() {
            return $(projectNameSelector).text();
        };

        var findDescription = function(item) {
            return item.find('a').text();
        };

        var findIdsForItem = function(item) {
            var data;
            if (!(item instanceof jQuery)) {
                item = $(item);
            }
            return data = {
                account: {
                    id: findAccountId(item)
                },
                project: {
                    id: findProjectId(item),
                    name: findProjectName()
                },
                item: {
                    id: findItemId(item),
                    name: findDescription(item)
                }
            };
        };

        var addButtons = function() {
        	var newTimers = false;

            $(itemSelector).each(function() {
                if (!isButtonAdded(this)) {
                    var data = findIdsForItem(this);
                    if (!isItemComplete(this) && isDataSufficient(data)) {
                    	newTimers = true;
                    	addButton(this, data);
                    }
                }
            });

            if(newTimers)
            {
			    div = $("" + (nsId('messaging'))).get(0);
			    if (div) {
			      return $(div).trigger({type: nsEvent('timers:add')});
			    }
            }
        };

        var addButton = function(item, data) {
            if (!(item instanceof jQuery)) {
                item = $(item);
            }
            var timer = $('<div class="harvest-timer"></div>')
                        .attr('data-account', JSON.stringify(data.account))
                        .attr('data-project', JSON.stringify(data.project))
                        .attr('data-item', JSON.stringify(data.item));
            var element = $(item).before(timer);
        };

        var isItemComplete = function(item) {
            if (!(item instanceof jQuery)) {
                item = $(item);
            }
            return item.closest(".complete").length === 1;
        };

        var isButtonAdded = function(item) {
            if (!(item instanceof jQuery)) {
                item = $(item);
            }
            return item.prev().hasClass('harvest-timer');
        };

        var isDataSufficient = function(data) {
            var _ref, _ref1;
            if (!(data != null)) {
                return false;
            }
            return (((_ref = data.project) != null ? _ref.id : void 0) != null) && (((_ref1 = data.item) != null ? _ref1.id : void 0) != null);
        };

        loadConfig();

        setInterval(function() {
            var href, pattern;
            pattern = /^https:\/\/basecamp.com\/\d+\/.*$/;
            href = window.location.href;
            if (href.match(pattern) !== null) {
                if (!isConfigLoaded) {
                    loadConfig();
                } else {
                    addButtons();
                }
            }
        }, 250);
    });

    JSON.stringify = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };
}

H4BMain();
