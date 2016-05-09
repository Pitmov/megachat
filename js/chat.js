/**
 * Created by Teplov on 09.05.2016.
 */
let userOnlineRow = require('../templates/userOnlineRow.html'),
    newMessageRow = require('../templates/message.html'),
    mustache = require('mustache'),
    helpers = require('helpers');
class Chat {
    constructor(chatContainerId, onlineUsersId, textFieldId, userLogin, token) {
        this.chatContainerId = chatContainerId;
        this.onlineUsersId = onlineUsersId;
        this.textFieldId = textFieldId;
        this.userLogin = userLogin;
        this.token = token;
    }

    addUserToOnlineList(name, nickname) {
        var userRow = mustache.render(userOnlineRow, {name: name, login: nickname});
        document.getElementById(this.onlineUsersId).insertAdjacentHTML('beforeend', userRow);
    }

    removeUserFromOnlineList(nickname) {
        document.getElementById(this.onlineUsersId).removeChild(document.getElementById('user_' + nickname));
    }

    sendMessage(connection) {
        let token = this.token,
            message = document.getElementById(this.textFieldId).value.trim();
        if (message) {
            connection.send(JSON.stringify({
                op: 'message',
                token: token,
                data: {
                    body: message
                }
            }));
        }
        document.getElementById(this.textFieldId).value = '';
    }

    addMessageToBoard(messageObject) {
        let userLogin = this.userLogin;
        if (messageObject.user.login === userLogin) {
            messageObject.whose = 'my';
        } else {
            messageObject.whose = 'not-my';
        }
        console.log(messageObject);
        messageObject.time = helpers.convertDate(messageObject.time);
        let messageHtml = mustache.render(newMessageRow, messageObject);
        document.getElementById(this.chatContainerId).insertAdjacentHTML('beforeend', messageHtml);
        document.getElementById(this.chatContainerId).scrollTop = 1000000000;
    }
}

module.exports = Chat;