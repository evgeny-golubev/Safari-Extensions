var popover_37signals = {

    body: null,
    timeout: null,
    launchpad: 'https://launchpad.37signals.com',

    popover_hide: function () {
        var popovers = safari.extension.popovers,
            len = popovers.length;

        for (var i = len; i--;) {
            popovers[i].hide();
        }
    },

    popover_resize: function () {
        var popovers = safari.extension.popovers,
            len = popovers.length;

        for (var i = len; i--;) {
            popovers[i].width = 210;
            popovers[i].height = $('body').height() - 15;
        }
    },

    popover_services: function () {
        var self = this;

        if (this.body.find('.service-list').length) {
            this.body.find('.service-list').remove();
        }

        $.get(this.launchpad + '/basecamp', function (data) {
            var list = '<ul class="service-list">' +
                '<li class="sname" onclick="popover_37signals.popover_hide()">' +
                '<a href="' + self.launchpad + '">' +
                '<div class="left">37signals Launchpad</div>' +
                '<div class="clear"></div>' +
                '</a>' +
                '</li>';

            var accounts = $(data).find('.accounts .account');

            if (accounts.length) {
                accounts.each(function () {
                    var title = $(this).find('a:first div.name div:first').text();
                    var href = $(this).find('a:first').attr('href');
                    var bc = $(this).find('.new_label').text();

                    list = list + self.generate_link(
                            href,
                            title,
                            bc
                        );
                });
            } else {
                list = '<li onclick="popover_37signals.popover_hide()">' +
                    '<a href="' + self.launchpad + '">' +
                    '<div class="left">Please, login to continue...</div>' +
                    '<div class="clear"></div>' +
                    '</a>' +
                    '</li>';
            }

            self.body.append(list + '</ul>');

            self.popover_resize();
        }, 'html').always(function () {
            self.reload();
        });
    },

    generate_link: function (url, title, type) {
        return '<li onclick="popover_37signals.popover_hide()">' +
            '<a href="' + this.launchpad + url + '">' +
            '<div class="left">' + title + '</div>' +
            '<div class="right">' + type + '</div>' +
            '<div class="clear"></div>' +
            '</a>' +
            '</li>';
    },

    build: function () {
        this.popover_services();
    },

    reload: function () {
        this.timeout = setTimeout(function () {
            popover_37signals.build();
        }, 60000);
    },

    init: function () {
        this.body = $('body');
        this.build();
    }
};

$(document).ready(function () {
    popover_37signals.init();
});
