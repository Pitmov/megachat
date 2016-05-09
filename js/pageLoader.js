/**
 * Created by Teplov on 09.05.2016.
 */
let loginHtml = require('../templates/loginForm.html'),
    chatAreaHtml = require('../templates/chatArea.html'),
    events = require('events'),
    mustache = require('mustache'),
    helpers = require('helpers');
class PageLoader {
    constructor(containerId) {
        this.containerId = containerId;
        this.loginEvents = null;
    }

    setPage(param, pageOptions) {
        let _this = this;

        if (this.loginEvents) {
            this.loginEvents.removeEvents();
        }

        _this.loginEvents = new events(pageOptions);

        if (param === 'login') {
            document.getElementById(this.containerId).innerHTML = loginHtml;
            _this.loginEvents.setEvents('login');
        } else {
            console.log(pageOptions.initialData.messages);
            let chatHtml = mustache.render(chatAreaHtml, {
                name: pageOptions.regData.name,
                nickname: pageOptions.regData.nickname,
                users: pageOptions.initialData.users.filter((el) => {
                    return el.login !== pageOptions.regData.nickname
                }),
                messages: pageOptions.initialData.messages.map((el) => {
                    if (el.user.login === pageOptions.regData.nickname) {
                        el.whose = 'my';
                    } else {
                        el.whose = 'not-my';
                    }
                    el.time = helpers.convertDate(el.time);
                    return el;
                })
            });

            document.getElementById(this.containerId).innerHTML = chatHtml;

            document.getElementById(pageOptions.chatContainerId).scrollTop=1000000000;
            _this.loginEvents.setEvents('chat');
        }
    }
}

module.exports = PageLoader;