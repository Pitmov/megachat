/**
 * Created by Teplov on 09.05.2016.
 */
let Login = require('login');
let Chat = require('chat');
let PageLoader = require('pageLoader');
class Events {
    constructor(options) {
        this.options = options;
        this.methods = [];
    }

    setEvents(typeEvents) {
        this.removeEvents();
        let options = this.options,
            _this = this;
        if (typeEvents === 'login') {
            let login = new Login(options.nameId, options.nickNameId),
                loginButtonMethod = function (e) {
                    if (e.target.getAttribute("id") && e.target.getAttribute("id") === options.loginButtonId) {
                        login.login();
                    }
                };
            this.methods.push({type: 'click', value: loginButtonMethod});
            document.addEventListener('click', loginButtonMethod);
            login.login(true);
        } else if (typeEvents === 'chat') {
            let connection = options.connection,
                usersArray = options.initialData.users,
                token = options.initialData.token,
                userLogin = options.regData.nickname,
                chat = new Chat(options.chatContainerId, options.onlineUsersId, options.textFieldId, userLogin, token);
            //recieve messages
            connection.onmessage = function (event) {
                try {
                    let jsonData = JSON.parse(event.data);
                    if (jsonData.op === 'user-enter') {
                        if (!usersArray.some((el) => {
                                return jsonData.user.login === el.login;
                            })) {
                            usersArray.push(jsonData.user);
                            chat.addUserToOnlineList(jsonData.user.name, jsonData.user.login);
                        }
                    } else if (jsonData.op === 'user-out') {
                        usersArray.forEach((el, i) => {
                            if (el.login === jsonData.user.login) {
                                usersArray.splice(i, 1);
                                chat.removeUserFromOnlineList(jsonData.user.login);
                            }
                        });
                    } else if (jsonData.op === 'message') {
                            chat.addMessageToBoard(jsonData);
                    } else if (jsonData.op === 'user-change-photo') {
                        null;
                    }
                } catch (e) {
                    console.error(e);
                }
            };

            //send messages events
            let sendMessageAction = function (e) {
                if (e.target.getAttribute("id") && e.target.getAttribute("id") === options.sendButtonId) {
                    chat.sendMessage(connection);
                }
            }

            this.methods.push({type: 'click', value: sendMessageAction});
            document.addEventListener('click', sendMessageAction);

        }
    }

    removeEvents() {
        this.methods.forEach((el) => {
            document.removeEventListener(el.type, el.value);
        });
    }
}

module.exports = Events;