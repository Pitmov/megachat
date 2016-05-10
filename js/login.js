/**
 * Created by Teplov on 09.05.2016.
 */
const connectionString = 'ws://localhost:8000';
let Notifier = require('../js/notifier');
class Login {
    constructor(nameId, nicknameId) {
            this.name = document.getElementById(nameId);
            this.nickname = document.getElementById(nicknameId);
    }

    checkLoginData() {
        if (!this.name.value.trim() || !this.nickname.value.trim()) {
            Notifier.show('Все поля должны быть заполнены!', 'alarm');
            return false;
        } else if (!this.nickname.value.trim().match(/^\w+$/)) {
            Notifier.show('Никнейм может содержать только цифры и латинские буквы', 'alarm');
            return false;
        }
        return true;
    }

    login(noCheck) {
        let _this = this;
        if ((noCheck && localStorage['user']) || (!noCheck && this.checkLoginData())) {
            let connection = new WebSocket(connectionString),
                name = localStorage['user'] ? localStorage['user'].split(',')[0] : _this.name.value.trim(),
                nickname = localStorage['user'] ? localStorage['user'].split(',')[1] : _this.nickname.value.trim();
            connection.onopen = function () {
                connection.send(JSON.stringify({
                    op: 'reg',
                    data: {
                        name: name,
                        login: nickname
                    }
                }));
            };

            connection.onclose = function (event) {
                let connectionEvent = new CustomEvent("connectionClosed", {
                    detail: 'connectionClosed'
                });
                document.dispatchEvent(connectionEvent);
                console.log('Код: ' + event.code + ' причина: ' + event.reason);
            };

            connection.onmessage = function (event) {
                try {
                    let jsonData = JSON.parse(event.data);
                    if (jsonData.op === 'token' && jsonData.token) {
                        let connectionEvent = new CustomEvent("registrationSuccessful", {
                            detail: {
                                connection: connection, data: jsonData, regData: {
                                    name: name,
                                    nickname: nickname
                                }
                            }
                        });
                        localStorage["user"] = name + ',' + nickname;
                        document.dispatchEvent(connectionEvent);
                    } else if (jsonData.op === 'error' && jsonData.sourceOp === 'reg') {
                        localStorage['user'] = '';
                        Notifier.show(jsonData.error.message, 'alarm');
                    }
                } catch (e) {
                    console.log(e);
                    let connectionEvent = new CustomEvent("connectionClosed", {
                        detail: 'connectionClosed'
                    });
                    document.dispatchEvent(connectionEvent);
                }
            };

            connection.onerror = function (error) {
                let connectionEvent = new CustomEvent("connectionClosed", {
                    detail: 'connectionClosed'
                });
                document.dispatchEvent(connectionEvent);
                console.log("Ошибка " + error.message);
            };

        }
    }
}

module.exports = Login;