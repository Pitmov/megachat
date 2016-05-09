/**
 * Created by Teplov on 09.05.2016.
 */
let mustache = require('mustache');
class Notifier {
    constructor() {
    }

    show(message, type) {
        let notifierHtml = require("../templates/notifier.html"),
            _this = this;
        if (type === 'alarm') {
            var notifier = mustache.render(notifierHtml, {
                classNotifier: "dangerNotifier",
                message: message
            });
        } else {
            var notifier = mustache.render(notifierHtml, {
                classNotifier: "successNotifier",
                message: message
            });
        }

        let wrapper = document.createElement('div');
        wrapper.innerHTML = notifier;
        notifier = wrapper.firstChild;
        wrapper = null;
        document.body.appendChild(notifier);

        notifier.querySelectorAll('.remove-notifier')[0].onclick = function () {
            _this.close(this);
            notifier = null;
        };

        setTimeout(function () {
            if (notifier) {
                notifier.parentNode.removeChild(notifier);
            }
        }, 3000);
    }

    close(element) {
        let parentNode = element.parentNode;
        parentNode.parentNode.removeChild(parentNode);
    }
}

module.exports = new Notifier();