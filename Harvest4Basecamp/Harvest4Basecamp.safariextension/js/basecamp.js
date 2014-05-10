(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var BasecampProfile;
    BasecampProfile = (function() {
      function BasecampProfile() {
        this.addTimer = __bind(this.addTimer, this);
        this.addTimers = __bind(this.addTimers, this);
        this.projectNameSelector = "h1";
        this.itemSelector = ".todo .content";
        this.platformLoaded = false;
        this.interval = 250;
        this.loadHarvestPlatform();
        window.setInterval(this.addTimers, this.interval);
      }

      BasecampProfile.prototype.loadHarvestPlatform = function() {
        var configScript, ph, platformConfig, platformScript,
          _this = this;
        platformConfig = {
          applicationName: "Basecamp",
          permalink: "https://basecamp.com/%ACCOUNT_ID%/projects/%PROJECT_ID%/todos/%ITEM_ID%",
          environment: "production"
        };
        configScript = document.createElement("script");
        configScript.innerHTML = "window._harvestPlatformConfig = " + (JSON.stringify(platformConfig)) + ";";
        platformScript = document.createElement("script");
        platformScript.src = "//platform.harvestapp.com/assets/platform.js";
        platformScript.async = true;
        document.body.insertBefore(configScript, document.body.firstChild);
        document.body.insertBefore(platformScript, document.body.firstChild);
        return document.body.addEventListener("harvest-event:ready", function() {
          _this.platformLoaded = true;
          return _this.addTimers();
        });
      };

      BasecampProfile.prototype.addTimers = function() {
        var item, items, _i, _len, _results;
        if (!this.platformLoaded) {
          return;
        }
        items = document.querySelectorAll(this.itemSelector);
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          item = items[_i];
          if (!item.querySelector(".harvest-timer")) {
            _results.push(this.addTimer(item));
          }
        }
        return _results;
      };

      BasecampProfile.prototype.addTimer = function(item) {
        var data;
        data = this.getDataForTimer(item);
        if (this.isTodoCompleted(item) || this.notEnoughInfo(data)) {
          return;
        }
        this.buildTimer(item, data);
        return this.notifyPlatformOfNewTimers();
      };

      BasecampProfile.prototype.getDataForTimer = function(item) {
        var itemName, link, linkParts, projectName;
        itemName = (item.querySelector("a[title]") || item.querySelector("a")).innerText;
        projectName = document.querySelector(this.projectNameSelector).innerText;
        link = item.querySelector("a").getAttribute("href") || "";
        linkParts = link.match(/^\/(\d+)\/projects\/(\d+)(?:\S+)?\/todos\/(\d+)/);
        return {
          account: {
            id: linkParts[1]
          },
          project: {
            id: linkParts[2],
            name: projectName
          },
          item: {
            id: linkParts[3],
            name: itemName
          }
        };
      };

      BasecampProfile.prototype.isTodoCompleted = function(item) {
        if (item.webkitMatchesSelector(".complete")) {
          return true;
        } else if (item.parentNode && item.parentNode !== document) {
          return this.isTodoCompleted(item.parentNode);
        }
      };

      BasecampProfile.prototype.notEnoughInfo = function(data) {
        var _ref, _ref1;
        return !(((data != null ? (_ref = data.project) != null ? _ref.id : void 0 : void 0) != null) && ((data != null ? (_ref1 = data.item) != null ? _ref1.id : void 0 : void 0) != null));
      };

      BasecampProfile.prototype.buildTimer = function(item, data) {
        var timer;
        timer = document.createElement("div");
        timer.className = "harvest-timer";
        timer.style.marginRight = "4px";
        timer.setAttribute("id", "harvest-basecamp-timer-" + data.item.id);
        timer.setAttribute("data-account", JSON.stringify(data.account));
        timer.setAttribute("data-project", JSON.stringify(data.project));
        timer.setAttribute("data-item", JSON.stringify(data.item));
        return item.insertBefore(timer, item.children[0]);
      };

      BasecampProfile.prototype.notifyPlatformOfNewTimers = function() {
        var evt;
        evt = new CustomEvent("harvest-event:timers:chrome:add");
        return document.querySelector("#harvest-messaging").dispatchEvent(evt);
      };

      return BasecampProfile;
    })();

    return new BasecampProfile();
  })();

}).call(this);
