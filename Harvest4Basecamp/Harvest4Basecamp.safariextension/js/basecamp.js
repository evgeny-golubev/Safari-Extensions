$(document).ready(function(){
  var addButton, addButtons, config, findAccountId, findDescription, findIdsForItem, findItemId, findProjectId, findProjectName, insertScript, isConfigLoaded, isDataSufficient, isItemComplete, itemSelector, listenForPlatformReady, loadConfig, namespacedString, nsEvent, nsId, projectNameSelector, sendMessage;

  projectNameSelector = 'title:first';

  itemSelector = '.todo .content';

  isConfigLoaded = false;

  config = "window._harvestPlatformConfig = {    'applicationName': 'Basecamp',    'permalink': 'https://basecamp.com/%ACCOUNT_ID%/projects/%PROJECT_ID%/todos/%ITEM_ID%',    'debug': false  }";

  namespacedString = function(name) {
    return "harvest-" + name;
  };

  nsId = function(name) {
    return "#" + (namespacedString(name));
  };

  nsEvent = function(name) {
    return "" + (namespacedString('event')) + ":" + name;
  };

  sendMessage = function(options) {
    var div, event;
    if (options.element) {
      options.data['element'] = options.element[0];
    }
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(nsEvent(options.type), true, true, options.data);
    div = $("" + (nsId('messaging'))).get(0);
    if (div) {
      return div.dispatchEvent(event);
    }
  };

  insertScript = function(callback) {
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

  loadConfig = function() {
    var url = "//platform.harvestapp.com/javascripts/generated/platform.js";
    var callback = $.getScript(url, function() {
      return listenForPlatformReady();
    });
    return insertScript(callback);
  };

  findAccountId = function(item) {
    var href, link, pattern;
    pattern = /^\/(\d+)\/projects\/\S+\/todos\/\d+\S+$/;
    link = $(item).find('a');
    href = link.attr("href");
    if (href) {
      return href.match(pattern)[1];
    }
  };

  findProjectId = function(item) {
    var href, link, pattern;
    pattern = /^\/\d+\/projects\/(\d+)\S+\/todos\/\d+\S+$/;
    item = $(item);
    link = item.find('a');
    href = link.attr('href');
    if (href) {
      return href.match(pattern)[1];
    }
  };

  findItemId = function(item) {
    var href, link, pattern;
    pattern = /^\/\d+\/projects\/\d+\S+\/todos\/(\d+)\S+$/;
    item = $(item);
    link = item.find('a');
    href = link.attr('href');
    if (href) {
      return href.match(pattern)[1];
    }
  };

  findProjectName = function() {
    return $(projectNameSelector).text();
  };

  findDescription = function(item) {
    return item.find('a').text();
  };

  findIdsForItem = function(item) {
    var data;
    if (!(item instanceof jQuery)) {
      item = $(item);
    }
    return data = {
      account: {
        id: findAccountId(item)
      },
      project: {
        id: findProjectId(item)
      },
      item: {
        id: findItemId(item),
        name: findDescription(item)
      }
    };
  };

  addButtons = function() {
    var items;
    items = $(itemSelector);
    return items.each(function() {
      var ids;
      if ($(this).find('.harvest-timer').length === 0) {
        ids = findIdsForItem(this);
        ids['project']['name'] = findProjectName();
        if (!isItemComplete(this) && isDataSufficient(ids)) {
          return addButton(this, ids);
        }
      }
    });
  };

  isItemComplete = function(item) {
    if (!(item instanceof jQuery)) {
      item = $(item);
    }
    return item.closest(".complete").length === 1;
  };

  isDataSufficient = function(data) {
    var _ref, _ref1;
    if (!(data != null)) {
      return false;
    }
    return (((_ref = data.project) != null ? _ref.id : void 0) != null) && (((_ref1 = data.item) != null ? _ref1.id : void 0) != null);
  };

  listenForPlatformReady = function() {
    var body;
    body = $('body');
    return body.on(nsEvent('ready'), function() {
      return addButtons();
    });
  };

  loadConfig();

  setInterval(function() {
    var href, pattern;
    pattern = /^https:\/\/basecamp.com\/\d+\/.*$/;
    href = window.location.href;
    if (href.match(pattern) !== null) {
      if (!isConfigLoaded) {
        loadConfig();
      }
      addButtons();
      //return chrome.extension.sendRequest({
      //  'action': 'showPageAction'
      //});
    }
  }, 250);

  addButton = function(element, data) {
    data['element'] = element;
    return sendMessage({
      'type': 'timers:request',
      'data': 'data',
      data: data
    });
  };
});